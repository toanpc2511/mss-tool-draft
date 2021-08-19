import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import {
	catchError,
	concatMap,
	debounceTime,
	finalize,
	switchMap,
	takeUntil,
	tap,
	throttleTime
} from 'rxjs/operators';
import { convertDateToServer, renameUniqueFileName } from 'src/app/shared/helpers/functions';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { TValidators } from 'src/app/shared/validators';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IError } from '../../../shared/models/error.model';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IProduct, IProductType, ProductService } from '../../product/product.service';
import {
	ContractService,
	EContractStatus,
	EContractType,
	ECreatorType,
	IAddress,
	IContractPlanInput,
	IContractPrepayInput,
	ICustomerInfo,
	IFile,
	IProductInfo,
	IProperties
} from '../contract.service';

@Component({
	selector: 'app-create-contract',
	templateUrl: './create-contract.component.html',
	styleUrls: ['./create-contract.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class CreateContractComponent implements OnInit, AfterViewInit {
	eContractStatus = EContractStatus;
	infoForm: FormGroup;
	contractForm: FormGroup;
	productForm: FormGroup;
	productFormArray: FormArray;
	stationAddress: Array<IAddress> = [];
	addressSelected: IAddress;

	productTypes: Array<IProductType> = [];
	products: Array<Array<IProduct>> = [];

	transportMethods: Array<IProperties>;
	contractTypes: Array<IProperties>;
	contractType: EContractType = EContractType.PREPAID_CONTRACT;
	paymentMethods: Array<IProperties>;

	eContractType = EContractType;
	currentDate = new Date();

	contractSubscription = new Subscription();

	files: Array<File> = [];
	filesUploaded: Array<IFile> = [];
	filesUploadProgress: Array<number> = [];

	minDate: NgbDateStruct = {
		day: this.currentDate.getDate(),
		month: this.currentDate.getMonth() + 1,
		year: this.currentDate.getFullYear()
	};
	payPlanDateCount = 1;
	isUpdate = false;

	constructor(
		private contractService: ContractService,
		private productService: ProductService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
		private modalService: NgbModal,
		private router: Router,
		private subheader: SubheaderService,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.init();

		this.productService
			.getListProductType()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypes = res.data;
				this.cdr.detectChanges();
			});
	}

	ngAfterViewInit(): void {
		let subBreadcump = {
			title: 'Thêm mới hợp đồng',
			linkText: 'Thêm mới hợp đồng',
			linkPath: '/hop-dong/danh-sach/them-moi'
		};
		if (this.isUpdate) {
			subBreadcump = {
				title: 'Sửa nhóm quyền',
				linkText: 'Sửa nhóm quyền',
				linkPath: '/hop-dong/danh-sach/sua-hop-dong'
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

	switchType(type: EContractType) {
		this.contractSubscription.unsubscribe();
		this.contractSubscription = new Subscription();

		if (type === EContractType.PREPAID_CONTRACT) {
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
			name: [null],
			enterpriseName: [null],
			dateOfBirth: [null],
			idCard: [null],
			email: [null],
			address: [null]
		});

		this.infoForm
			.get('phone')
			.valueChanges.pipe(
				debounceTime(200),
				concatMap((phoneNumber: string) => {
					if (phoneNumber) {
						return this.contractService.getInfoUser(phoneNumber).pipe(
							catchError((err: IError) => {
								this.checkError(err);
								return of(null);
							})
						);
					}
					this.resetInfoForm();
					return of(null as DataResponse<any>);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe((res) => {
				if (res?.data) {
					this.infoForm.patchValue(res.data);
					this.cdr.detectChanges();
				} else {
					this.resetInfoForm();
				}
			});
	}

	buildContractForm(type: EContractType) {
		switch (type) {
			case EContractType.PREPAID_CONTRACT:
				this.contractForm = this.fb.group({
					contractTypeCode: [this.eContractType.PREPAID_CONTRACT, Validators.required],
					name: [null, Validators.required],
					effectEndDate: [null, TValidators.afterCurrentDate],
					transportMethodCode: [null, Validators.required],
					payMethodCode: [null, Validators.required],
					addressContract: [0, Validators.required],
					fullAddress: [null]
				});
				break;
			case EContractType.PLAN_CONTRACT:
				this.contractForm = this.fb.group({
					contractTypeCode: [this.eContractType.PLAN_CONTRACT, Validators.required],
					name: [null, Validators.required],
					effectEndDate: [null, TValidators.afterCurrentDate],
					transportMethodCode: [null, Validators.required],
					payMethodCode: [null, Validators.required],
					limit: [null, [Validators.required, Validators.min(1)]],
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
					categoryProductId: [null, Validators.required],
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

	productTypeChanged($event: Event, i: number) {
		const value = ($event.target as HTMLSelectElement).value;
		this.productService
			.getListProduct(Number(value))
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.products[i] = res.data;
			});
	}

	productChanged($event, i) {
		const allProduct = this.productFormArray.value as Array<IProductInfo>;
		const value = ($event.target as HTMLSelectElement).value;
		const checkExisted = allProduct.some(
			(p, index) => p.productId && i !== index && Number(p.productId) === Number(value)
		);

		if (checkExisted) {
			this.toastr.error('Sản phẩm này đã được thêm');
			this.productFormArray.at(i).get('productId').patchValue(null);
			return;
		}
		if (!value) {
			this.productFormArray.at(i).get('price').patchValue(0);
			this.productFormArray.at(i).get('discount').patchValue(0);
			this.productFormArray.at(i).get('unit').patchValue(0);
			this.updateTotalProduct(i);
		}
		this.productService
			.getProductInfo(Number(value), this.addressSelected?.areaType || 'AREA_1')
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productFormArray.at(i).get('price').patchValue(res.data.price);
				this.productFormArray.at(i).get('discount').patchValue(res.data.price);
				this.productFormArray.at(i).get('unit').patchValue(res.data.unit);
				this.updateTotalProduct(i);
			});
	}

	updateTotalProduct(i: number) {
		const price = this.productFormArray.at(i).get('price').value;
		const value = this.productFormArray.at(i).get('amount').value;
		this.productFormArray
			.at(i)
			.get('totalMoney')
			.patchValue(value * price);
		this.cdr.detectChanges();
	}

	getTotal(): number {
		let total = 0;
		for (const product of this.productFormArray.controls) {
			total += product.get('totalMoney').value as number;
		}
		return total;
	}

	resetInfoForm() {
		this.infoForm.get('id').reset();
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
				categoryProductId: [null, Validators.required],
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
		if (err.code === 'SUN-OIL-4811') {
			// this.toastr.error('Số điện thoại không thuộc Việt Nam hoặc sai định dạng');
			this.infoForm.get('phone').setErrors({ invalid: true });
		}
		if (err.code === 'SUN-OIL-4821') {
			// this.toastr.error('Không tìm thấy thông tin tài xế với số điện thoại này');
			this.infoForm.get('phone').setErrors({ notExisted: true });
		}
		if (err.code === 'SUN-OIL-4205') {
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
		if (files.length > 0 && files.length <= 10 - (this.files.length + this.filesUploaded.length)) {
			let filePush: Array<File> = [];

			for (const file of files) {
				if (file.size <= 5000000) {
					const newFile = renameUniqueFileName(file, `${file.name}`);
					filePush = [...filePush, newFile];
				} else {
					this.toastr.error('File tải lên có dung lượng lớn hơn 2Mb');
					filePush = [];
					break;
				}
			}
			this.files = [...this.files].concat(filePush);
			this.filesUploaded = this.files.map((file) => ({ name: file.name, url: file.name }));
			for (let i = 0; i < filePush.length; i++) {
				// this.uploadFile(i, filePush[i]);
			}
		} else {
			this.toastr.error('Không được tải lên quá 5 file');
		}
		inputElement.value = null;
	}

	uploadFile(index: number, file: File) {
		this.filesUploadProgress[index] = 0;
		const formData = new FormData();
		formData.append('files', file);
		this.contractService
			.uploadFile(formData)
			.pipe(takeUntil(this.destroy$))
			.subscribe((event: any) => {
				if (event.type === HttpEventType.UploadProgress) {
					this.filesUploadProgress[index] = Math.round((100 * event.loaded) / event.total);
				} else if (event instanceof HttpResponse) {
					console.log(event);
				}
				this.cdr.detectChanges();
			});
	}

	removeFile(type: 'ALL' | 'ONE', url?: string) {
		if (type === 'ALL') {
			this.filesUploaded = [];
		} else {
			this.filesUploaded = [...this.filesUploaded].filter(
				(f, index) => this.filesUploaded.findIndex((f) => f.url === url) !== index
			);
		}
	}

	save(status: EContractStatus) {
		this.infoForm.markAllAsTouched();
		this.contractForm.markAllAsTouched();
		if (this.infoForm.invalid) {
			return;
		}
		if (this.contractForm.invalid) {
			return;
		}
		const infoData: ICustomerInfo = this.infoForm.value;
		const contractData = this.contractForm.value;
		console.log(this.infoForm, this.contractForm, this.productForm);

		if (this.contractType === EContractType.PREPAID_CONTRACT) {
			this.productForm.markAllAsTouched();
			if (this.productForm.invalid) {
				return;
			}

			const productData: Array<IProductInfo> = (
				this.productForm.value.products as Array<IProductInfo>
			).map((p) => ({ ...p, amount: Number(p.amount) }));

			console.log(infoData);

			const prepayContractData: IContractPrepayInput = {
				creatorType: ECreatorType.EMPLOYEE,
				profileId: infoData.id,
				contractTypeCode: contractData.contractTypeCode,
				name: contractData.name,
				effectEndDate: convertDateToServer(contractData.effectEndDate),
				transportMethodCode: contractData.transportMethodCode,
				payMethodCode: contractData.payMethodCode,
				stationId: contractData.addressContract,
				fullAddress: contractData.fullAddress,
				productInfoRequests: productData,
				totalPayment: this.getTotal(),
				attachmentRequests: this.filesUploaded,
				statusType: status
			};

			this.contractService
				.createPrepayContract(prepayContractData)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					() => {
						this.router.navigate(['/hop-dong']);
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
		} else {
			const planContractData: IContractPlanInput = {
				creatorType: ECreatorType.EMPLOYEE,
				profileId: infoData.id,
				contractTypeCode: contractData.contractTypeCode,
				name: contractData.name,
				effectEndDate: contractData.effectEndDate,
				transportMethodCode: contractData.transportMethodCode,
				payMethodCode: contractData.payMethodCode,
				limit: contractData.limit,
				dateOfPayment: {
					paymentTimeOne: convertDateToServer(contractData.payPlanDate1),
					paymentTimeTwo: convertDateToServer(contractData.payPlanDate2),
					paymentTimeThree: convertDateToServer(contractData.payPlanDate3),
					paymentTimeFour: convertDateToServer(contractData.payPlanDate4),
					paymentTimeFive: convertDateToServer(contractData.payPlanDate5)
				},
				attachmentRequests: this.filesUploaded,
				statusType: status
			};
		}
	}
}
