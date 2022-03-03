import { AsyncPipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import {
	finalize,
	pluck,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs/operators';
import {
	convertDateToDisplay,
	convertDateToServer,
	convertMoney,
	ofNull,
	renameUniqueFileName
} from 'src/app/shared/helpers/functions';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { EFileType, FileService, IFile } from 'src/app/shared/services/file.service';
import { TValidators } from 'src/app/shared/validators';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IError } from '../../../shared/models/error.model';
import { DestroyService } from '../../../shared/services/destroy.service';
import { AuthService } from '../../auth/services/auth.service';
import { IProduct, ProductService } from '../../product/product.service';
import {
	ContractService,
	EContractStatus,
	EContractType,
	ECreatorType,
	IAddress,
	IContract,
	IContractPlanInput,
	IContractPrepayInput,
	ICustomerInfo,
	IProductInfo,
	IProperties
} from '../contract.service';

@Component({
	selector: 'app-create-contract',
	templateUrl: './create-contract.component.html',
	styleUrls: ['./create-contract.component.scss'],
	providers: [DestroyService, AsyncPipe]
})
export class CreateContractComponent implements OnInit, AfterViewInit {
	eContractStatus = EContractStatus;
	infoForm: FormGroup;
	contractForm: FormGroup;
	productForm: FormGroup;
	productFormArray: FormArray;
	stationAddress: Array<IAddress> = [];
	addressSelected: IAddress;
	products: Array<IProduct> = [];

	transportMethods: Array<IProperties>;
	contractTypes: Array<IProperties>;
	contractType: EContractType = EContractType.PREPAID_CONTRACT;
	paymentMethods: Array<IProperties>;

	eContractType = EContractType;
	currentDate = moment().add({ day: 1 });

	contractSubscription = new Subscription();

	filesUploaded: Array<IFile> = [];
	filesUploadProgress: Array<number> = [];

	minDate: NgbDateStruct = {
		day: this.currentDate.date(),
		month: this.currentDate.month() + 1,
		year: this.currentDate.year()
	};
	payPlanDateCount = 1;
	isUpdate = false;
	contractId: number;
	contractDataUpdate: IContract;
	isInitDataUpdateSubject = new Subject();
	isInitDataUpdate$ = this.isInitDataUpdateSubject.asObservable();

	constructor(
		private contractService: ContractService,
		private productService: ProductService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
		private modalService: NgbModal,
		private router: Router,
		private subheader: SubheaderService,
		private fileService: FileService,
		private activeRoute: ActivatedRoute,
		private authService: AuthService,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.init();
		const phoneNumber = this.authService.getCurrentUserValue().driverAuth.phone;

		this.contractService
			.getInfoUser(phoneNumber)
			.pipe(
				takeUntil(this.destroy$),
				tap((res) => {
					this.infoForm.get('phone').patchValue(phoneNumber);
					if (res?.data) {
						this.patchValueInfoForm(res?.data);
					}
				})
			)
			.subscribe();

		this.activeRoute.params
			.pipe(
				pluck('id'),
				take(1),
				switchMap((contractId: number) => {
					if (contractId) {
						this.isUpdate = true;
						this.minDate = null;
						this.contractId = contractId;
						this.setBreadcumb();
						return this.contractService.getContractById(contractId);
					}
					return ofNull();
				}),
				tap((res) => {
					if (res?.data) {
						this.loadDataUpdate(res.data);
					}
				}),
				finalize(() => this.isInitDataUpdateSubject.next(true)),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	loadDataUpdate(data: IContract) {
		this.contractDataUpdate = data;
		this.infoForm.get('dateOfBirth').patchValue(convertDateToDisplay(data.customer.dateOfBirth), {
			emitEvent: false,
			onlySelf: true
		});
		if (data.contractType.code === EContractType.PLAN_CONTRACT) {
			this.buildContractForm(EContractType.PLAN_CONTRACT);
			this.contractType = EContractType.PLAN_CONTRACT;
			this.patchValueContract(data);
			this.patchValuePlanContract(data);
		} else {
			this.patchValueContract(data);
			this.patchValuePrepayContract(data);
		}
		this.filesUploaded = data.attachment;
	}

	patchValueContract(data: IContract) {
		this.infoForm.get('phone').disable({ emitEvent: false, onlySelf: true });
		this.contractForm.get('contractTypeCode').disable({ emitEvent: false, onlySelf: true });
		this.contractForm.get('name').patchValue(data.name);
		this.contractForm.get('effectEndDate').patchValue(convertDateToDisplay(data.effectEndDate));
		this.contractForm.get('transportMethodCode').patchValue(data.transportMethod?.code || null);
		this.contractForm.get('payMethodCode').patchValue(data.payMethod.code);
	}

	patchValuePrepayContract(data: IContract) {
		this.contractForm
			.get('addressContract')
			.patchValue(data.station.id, { emitEvent: false, onlySelf: true });
		this.contractForm.get('fullAddress').patchValue(data.fullAddress);
		data.product.forEach((product, i) => {
			if (i >= 1) {
				this.addProduct();
			}
			this.productFormArray.at(i).get('productId').patchValue(product.productResponse.id);
			this.productFormArray.at(i).get('amount').patchValue(product.productResponse.amount);
			this.patchInfoProduct(product.productResponse.id, i);
		});
	}

	patchValuePlanContract(data: IContract) {
		this.payPlanDateCount = data.countPayment && data.countPayment > 0 ? data.countPayment : 1;
		this.contractForm.get('limit').patchValue(data.limitMoney);
		this.contractForm
			.get('payPlanDate1')
			.patchValue(convertDateToDisplay(data.dateOfPayment.paymentTimeOne));
		this.contractForm
			.get('payPlanDate2')
			.patchValue(convertDateToDisplay(data.dateOfPayment.paymentTimeTwo));
		this.contractForm
			.get('payPlanDate3')
			.patchValue(convertDateToDisplay(data.dateOfPayment.paymentTimeThree));
		this.contractForm
			.get('payPlanDate4')
			.patchValue(convertDateToDisplay(data.dateOfPayment.paymentTimeFour));
		this.contractForm
			.get('payPlanDate5')
			.patchValue(convertDateToDisplay(data.dateOfPayment.paymentTimeFive));
	}

	ngAfterViewInit(): void {
		this.setBreadcumb();
	}

	setBreadcumb() {
		let subBreadcump = {
			title: 'Thêm mới hợp đồng',
			linkText: 'Thêm mới hợp đồng',
			linkPath: '/hop-dong/danh-sach/them-moi'
		};
		if (this.isUpdate) {
			subBreadcump = {
				title: 'Sửa hợp đồng',
				linkText: 'Sửa hợp đồng',
				linkPath: null
			};
		}
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý hợp đồng',
					linkText: 'Quản lý hợp đồng',
					linkPath: '/hop-dong'
				},
				subBreadcump
			]);
		}, 1);
	}

	init() {
		this.buildInfoForm();
		this.buildContractForm(EContractType.PREPAID_CONTRACT);
		this.buildProductForm();
		this.getListProduct();
		this.getAllStationAddress();
		this.getTransportMethods();
		this.getContractTypes();
		this.getPaymentMethods();
	}

	confirmResetData(): Promise<boolean> {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn thay đổi? Điều này sẽ xóa các dữ liệu hợp đồng đã thêm`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;
		return new Promise<boolean>((resolve, reject) => {
			modalRef.result.then(
				(result) => {
					if (result) {
						resolve(true);
					} else {
						resolve(false);
					}
				},
				() => reject(false)
			);
		});
	}

	switchType(enterType: EContractType) {
		this.contractSubscription.unsubscribe();
		this.contractSubscription = new Subscription();

		if (enterType === EContractType.PREPAID_CONTRACT) {
			const addressSub = this.contractForm
				.get('addressContract')
				.valueChanges.pipe(
					tap((addressId) => {
						const addressIdOld = this.addressSelected.id;
						const address = this.stationAddress.find((a) => a.id === Number(addressId));
						this.confirmResetData().then(
							(result) => {
								if (result) {
									this.buildProductForm();
									this.addressSelected = address;
									this.contractForm.get('fullAddress').patchValue(address?.fullAddress || null);
								} else {
									this.contractForm
										.get('addressContract')
										.patchValue(addressIdOld, { emitEvent: false, onlySelf: true });
								}
							},
							() => {
								this.contractForm
									.get('addressContract')
									.patchValue(addressIdOld, { emitEvent: false, onlySelf: true });
							}
						);
					}),
					takeUntil(this.destroy$)
				)
				.subscribe();

			const contractTypeSub = this.contractForm
				.get('contractTypeCode')
				.valueChanges.pipe(takeUntil(this.destroy$))
				.subscribe((type: EContractType) => {
					this.checkContractTypeBeforeChange(type);
				});
			this.contractSubscription.add(addressSub);
			this.contractSubscription.add(contractTypeSub);
		} else {
			const contractTypeSub = this.contractForm
				.get('contractTypeCode')
				.valueChanges.pipe(takeUntil(this.destroy$))
				.subscribe((type: EContractType) => {
					this.checkContractTypeBeforeChange(type);
				});
			this.contractSubscription.add(contractTypeSub);
		}
	}

	checkContractTypeBeforeChange(type: EContractType) {
		const oldContractType = this.contractType;
		this.confirmResetData().then(
			(result) => {
				if (result) {
					this.contractType = type;
					this.buildContractForm(type);
					if (type === EContractType.PREPAID_CONTRACT) {
						this.buildProductForm();
					}
				} else {
					this.contractForm
						.get('contractTypeCode')
						.patchValue(oldContractType, { emitEvent: false, onlySelf: true });
				}
				this.cdr.detectChanges();
			},
			() => {
				this.contractForm
					.get('contractTypeCode')
					.patchValue(oldContractType, { emitEvent: false, onlySelf: true });
				this.cdr.detectChanges();
			}
		);
	}

	buildInfoForm(): void {
		this.infoForm = this.fb.group({
			phone: [null, [Validators.required]],
			id: [null],
			rankId: [null],
			name: [null],
			enterpriseName: [null],
			dateOfBirth: [null],
			idCard: [null],
			email: [null],
			address: [null]
		});

		// this.infoForm
		// 	.get('phone')
		// 	.valueChanges.pipe(
		// 		debounceTime(300),
		// 		concatMap((phoneNumber: string) => {
		// 			if (phoneNumber) {
		// 				return this.contractService.getInfoUser(phoneNumber).pipe(
		// 					catchError((err: IError) => {
		// 						this.checkError(err);
		// 						return of(err);
		// 					})
		// 				);
		// 			}
		// 			return of(null);
		// 		}),
		// 		takeUntil(this.destroy$)
		// 	)
		// 	.subscribe((res) => {
		// 		if (res?.data) {
		// 			this.patchValueInfoForm(res.data);
		// 		}
		// 	});
	}

	buildContractForm(type: EContractType) {
		switch (type) {
			case EContractType.PREPAID_CONTRACT:
				this.contractForm = this.fb.group({
					contractTypeCode: [this.eContractType.PREPAID_CONTRACT, Validators.required],
					name: [null, Validators.required],
					effectEndDate: [null],
					transportMethodCode: [null],
					payMethodCode: [null, Validators.required],
					addressContract: [0, Validators.required],
					fullAddress: [null]
				});
				break;
			case EContractType.PLAN_CONTRACT:
				this.contractForm = this.fb.group({
					contractTypeCode: [this.eContractType.PLAN_CONTRACT, Validators.required],
					name: [null, Validators.required],
					effectEndDate: [null],
					transportMethodCode: [null],
					payMethodCode: [null, Validators.required],
					limit: [null, [Validators.required, TValidators.min(1)]],
					payPlanDate1: [null],
					payPlanDate2: [null],
					payPlanDate3: [null],
					payPlanDate4: [null],
					payPlanDate5: [null]
				});
				break;
		}
		this.switchType(type);
	}

	buildProductForm() {
		this.productForm = this.fb.group({
			products: this.fb.array([
				this.fb.group({
					productId: [null, Validators.required],
					unit: [null],
					amount: [null, [Validators.required, Validators.min(1)]],
					price: [null],
					discount: [null, Validators.required],
					totalMoney: [null]
				})
			])
		});
		this.productFormArray = this.productForm.get('products') as FormArray;
		this.cdr.detectChanges();
	}

	getListProduct() {
		this.productService
			.getListOilProduct()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.products = res.data;
				this.cdr.detectChanges();
			});
	}

	productChanged($event, i: number) {
		const value = ($event.target as HTMLSelectElement).value;
		this.patchInfoProduct(value, i);
	}

	patchInfoProduct(productId: string | number, i: number) {
		const allProduct = this.productFormArray.value as Array<IProductInfo>;
		const checkExisted = allProduct.some(
			(p, index) => p.productId && i !== index && Number(p.productId) === Number(productId)
		);

		if (checkExisted) {
			this.toastr.error('Sản phẩm này đã được thêm');
			this.productFormArray.at(i).get('productId').patchValue(null);
			return;
		}
		if (!productId) {
			this.productFormArray.at(i).get('price').patchValue(0);
			this.productFormArray.at(i).get('discount').patchValue(0);
			this.productFormArray.at(i).get('unit').patchValue(0);
			this.updateTotalProduct(i);
		}
		this.productService
			.getProductInfo(
				Number(productId),
				this.infoForm.get('rankId').value,
				this.addressSelected?.areaType || 'AREA_1'
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productFormArray.at(i).get('price').patchValue(res.data.price);
				this.productFormArray.at(i).get('discount').patchValue(res.data.discount);
				this.productFormArray.at(i).get('unit').patchValue(res.data.unit);
				this.updateTotalProduct(i);
			});
	}

	updateTotalProduct(i: number) {
		const discount = this.productFormArray.at(i).get('discount').value;
		const amount = this.productFormArray.at(i).get('amount').value;
		this.productFormArray
			.at(i)
			.get('totalMoney')
			.patchValue(amount * discount);
		this.cdr.detectChanges();
	}

	getTotal(): number {
		let total = 0;
		for (const product of this.productFormArray.controls) {
			total += product.get('totalMoney').value as number;
		}
		return total;
	}

	patchValueInfoForm(infoData: any) {
		this.infoForm.get('id').patchValue(infoData.id);
		this.infoForm.get('rankId').patchValue(infoData.idRank);
		this.infoForm.get('name').patchValue(infoData.name);
		this.infoForm.get('enterpriseName').patchValue(infoData.enterpriseName);
		this.infoForm.get('dateOfBirth').patchValue(convertDateToDisplay(infoData.dateOfBirth));
		this.infoForm.get('idCard').patchValue(infoData.idCard);
		this.infoForm.get('email').patchValue(infoData.email);
		this.infoForm.get('address').patchValue(infoData.location);
		this.infoForm.get('phone').setErrors(null);
		this.cdr.detectChanges();
	}

	resetInfoForm() {
		this.infoForm.get('id').reset();
		this.infoForm.get('rankId').reset();
		this.infoForm.get('name').reset();
		this.infoForm.get('enterpriseName').reset();
		this.infoForm.get('dateOfBirth').reset();
		this.infoForm.get('idCard').reset();
		this.infoForm.get('email').reset();
		this.infoForm.get('address').reset();
		this.cdr.detectChanges();
	}

	// Lấy danh sách địa chỉ trạm xăng
	getAllStationAddress() {
		this.contractService.getAddress().subscribe((res) => {
			this.stationAddress = res.data;
			this.addressSelected = this.stationAddress[0];
		});
	}

	// Lấy ds loại hợp đồng
	getContractTypes(): void {
		this.contractService
			.getProperties('TYPE_CONTRACT')
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.contractTypes = res.data;
				this.cdr.detectChanges();
			});
	}

	// Lấy ds hệ thống giao nhận
	getTransportMethods(): void {
		this.contractService
			.getProperties('TRANSPORT_METHOD')
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.transportMethods = res.data;
				this.cdr.detectChanges();
			});
	}

	// Lấy ds HT thanh toán
	getPaymentMethods(): void {
		this.contractService
			.getProperties('PAYMENT_METHOD_CONTRACT')
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.paymentMethods = res.data;
				this.cdr.detectChanges();
			});
	}

	deleteNumberPhone(): void {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		modalRef.componentInstance.data = {
			title: 'Xác nhận',
			message: `Nếu thay đổi số điện thoại, dữ liệu khách hàng sẽ thay đổi theo. Bạn có chắc chắn muốn thay đổi không?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};

		modalRef.result.then((result) => {
			if (result) {
				this.clearFormInfoCustomer();
			}
		});
	}

	clearFormInfoCustomer(): void {
		this.infoForm.reset();
	}

	deleteProduct(index: number): void {
		this.productFormArray.removeAt(index);
	}

	addProduct() {
		this.productFormArray.push(
			this.fb.group({
				productId: [null, Validators.required],
				unit: [null],
				amount: [null, [Validators.required, Validators.min(1)]],
				price: [null],
				discount: [null, Validators.required],
				totalMoney: [null]
			})
		);
	}

	checkError(err: IError) {
		if (err?.code === 'SUN-OIL-4811') {
			this.infoForm.get('phone').setErrors({ invalid: true });
		}
		if (err?.code === 'SUN-OIL-4821') {
			this.infoForm.get('phone').setErrors({ notExisted: true });
		}
		if (err?.code === 'SUN-OIL-4205') {
			this.contractForm.get('name').setErrors({ existed: true });
		}
		this.cdr.detectChanges();
	}

	addPayPlanDate() {
		this.payPlanDateCount++;
	}

	addFiles($event: Event) {
		const inputElement = $event.target as HTMLInputElement;
		const files = Array.from(inputElement.files);
		if (files.length > 0 && files.length <= 10 - this.filesUploaded.length) {
			let filePush: Array<File> = [];

			for (const file of files) {
				if (file.size <= 5000000) {
					const newFile = renameUniqueFileName(file, `${file.name}`);
					filePush = [...filePush, newFile];
				} else {
					this.toastr.error('File tải lên có dung lượng lớn hơn 5Mb');
					filePush = [];
					break;
				}
			}
			this.filesUploaded = [...this.filesUploaded].concat(
				filePush.map((file) => ({ name: file.name }))
			);
			const startIndex = this.filesUploaded.length - filePush.length;
			for (let i = startIndex; i < filePush.length + startIndex; i++) {
				this.uploadFile(i, filePush[i - startIndex]);
			}
		} else {
			this.toastr.error('Không được tải lên quá 10 file');
		}
		inputElement.value = null;
	}

	uploadFile(index: number, file: File) {
		this.filesUploadProgress[index] = 0;
		const formData = new FormData();
		formData.append('files', file);
		this.fileService
			.uploadFile(formData, EFileType.OTHER)
			.pipe(takeUntil(this.destroy$))
			.subscribe((event: any) => {
				if (event?.type === HttpEventType.UploadProgress) {
					this.filesUploadProgress[index] = Math.round((100 * event.loaded) / event.total);
				}
				if (event?.data) {
					this.filesUploaded[index].id = event.data[0].id;
					this.filesUploaded[index].url = event.data[0].url;
				}
				this.cdr.detectChanges();
			});
	}

	removeFile(type: 'ALL' | 'ONE', id?: number) {
		if (type === 'ALL') {
			this.filesUploaded = [];
		} else {
			this.filesUploaded = [...this.filesUploaded].filter(
				(_, index) => this.filesUploaded.findIndex((f) => f.id === id) !== index
			);
		}
	}

	save(status: EContractStatus) {
		let hasError = false;
		this.infoForm.markAllAsTouched();
		this.contractForm.markAllAsTouched();
		if (this.infoForm.invalid) {
			hasError = true;
		}
		if (this.contractForm.invalid) {
			hasError = true;
		}

		const infoData: ICustomerInfo = this.infoForm.value;
		const contractData = this.contractForm.value;

		if (this.contractType === EContractType.PREPAID_CONTRACT) {
			this.productForm.markAllAsTouched();
			if (this.productForm.invalid) {
				hasError = true;
			}

			if (hasError) {
				return;
			}

			const productData: Array<IProductInfo> = (
				this.productForm.value.products as Array<IProductInfo>
			).map((p) => ({ ...p, amount: Number(p.amount) }));

			const prepayContractData: IContractPrepayInput = {
				creatorType: ECreatorType.ENTERPRISE,
				profileId: infoData.id,
				rankId: infoData.rankId,
				contractTypeCode: contractData.contractTypeCode,
				name: contractData.name,
				effectEndDate: convertDateToServer(contractData.effectEndDate),
				transportMethodCode: contractData.transportMethodCode,
				payMethodCode: contractData.payMethodCode,
				stationId: contractData.addressContract,
				fullAddress: contractData.fullAddress,
				productInfoRequests: productData,
				totalPayment: this.getTotal(),
				attachmentRequests: this.filesUploaded?.map((f) => f.id) || [],
				statusType: status
			};
			if (!this.isUpdate) {
				this.contractService
					.createPrepayContract(prepayContractData)
					.pipe(takeUntil(this.destroy$))
					.subscribe(
						(res) => {
							this.checkRes(res);
						},
						(err: IError) => {
							this.checkError(err);
						}
					);
			} else {
				this.contractService
					.updatePrepayContract(this.contractId, prepayContractData)
					.pipe(takeUntil(this.destroy$))
					.subscribe(
						(res) => {
							this.checkRes(res);
						},
						(err: IError) => {
							this.checkError(err);
						}
					);
			}
		} else {
			if (hasError) {
				return;
			}
			const planContractData: IContractPlanInput = {
				creatorType: ECreatorType.ENTERPRISE,
				rankId: infoData.rankId,
				profileId: infoData.id,
				contractTypeCode: contractData.contractTypeCode,
				name: contractData.name,
				effectEndDate: convertDateToServer(contractData.effectEndDate),
				transportMethodCode: contractData.transportMethodCode,
				payMethodCode: contractData.payMethodCode,
				limitMoney: convertMoney(contractData.limit),
				dateOfPayment: {
					paymentTimeOne: convertDateToServer(contractData.payPlanDate1),
					paymentTimeTwo: convertDateToServer(contractData.payPlanDate2),
					paymentTimeThree: convertDateToServer(contractData.payPlanDate3),
					paymentTimeFour: convertDateToServer(contractData.payPlanDate4),
					paymentTimeFive: convertDateToServer(contractData.payPlanDate5)
				},
				countPayment: this.payPlanDateCount,
				attachmentRequests: this.filesUploaded?.map((f) => f.id) || [],
				statusType: status
			};

			if (!this.isUpdate) {
				this.contractService
					.createPlanContract(planContractData)
					.pipe(takeUntil(this.destroy$))
					.subscribe(
						(res) => {
							this.checkRes(res);
						},
						(err: IError) => {
							this.checkError(err);
						}
					);
			} else {
				this.contractService
					.updatePlanContract(this.contractId, planContractData)
					.pipe(takeUntil(this.destroy$))
					.subscribe(
						(res) => {
							this.checkRes(res);
						},
						(err: IError) => {
							this.checkError(err);
						}
					);
			}
		}
	}

	checkRes(res: DataResponse<any>) {
		if (res.data) {
			this.router.navigate(['/hop-dong']);
		}
	}
}
