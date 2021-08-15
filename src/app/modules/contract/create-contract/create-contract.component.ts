import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IError } from '../../../shared/models/error.model';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IProduct, IProductType, ProductService } from '../../product/product.service';
import { ContractService, EContractType, IAddress, IProperties } from '../contract.service';

@Component({
	selector: 'app-create-contract',
	templateUrl: './create-contract.component.html',
	styleUrls: ['./create-contract.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class CreateContractComponent implements OnInit {
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
	contractType: EContractType;
	paymentMethods: Array<IProperties>;

	eContractType = EContractType;

	constructor(
		private contractService: ContractService,
		private productService: ProductService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private toastr: ToastrService,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.init();

		this.contractForm
			.get('addressContract')
			.valueChanges.pipe(
				startWith(0),
				tap((addressId) => {
					const address = this.stationAddress.find((a) => a.id === Number(addressId));
					this.addressSelected = address;
					this.contractForm.get('fullAddress').patchValue(address?.fullAddress || null);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();

		this.contractForm
			.get('contractTypeCode')
			.valueChanges.pipe(startWith(EContractType.PREPAID_CONTRACT), takeUntil(this.destroy$))
			.subscribe((type: EContractType) => {
				this.contractType = type;
			});

		this.productService
			.getListProductType()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypes = res.data;
				this.cdr.detectChanges();
			});
	}

	init() {
		this.buildInfoForm();
		this.buildContractForm();
		this.buildProductForm();
		this.getAllStationAddress();
		this.getTransportMethods();
		this.getContractTypes();
		this.getPaymentMethods();
	}

	buildInfoForm(): void {
		this.infoForm = this.fb.group({
			phone: [null, [Validators.required]],
			name: [null],
			enterpriseName: [null],
			dateOfBirth: [null],
			idCard: [null],
			email: [null],
			address: [null]
		});
	}

	buildContractForm() {
		this.contractForm = this.fb.group({
			contractTypeCode: [this.eContractType.PREPAID_CONTRACT, Validators.required],
			name: [null, Validators.required],
			effectEndDate: [null],
			transportMethodCode: [null, Validators.required],
			payMethodCode: [null, Validators.required],
			addressContract: [0, Validators.required],
			fullAddress: [null]
		});
	}

	buildProductForm() {
		this.productForm = this.fb.group({
			products: this.fb.array([
				this.fb.group({
					categoryProductId: [null, Validators.required],
					productId: [null, Validators.required],
					unit: [null],
					amount: [null, Validators.required],
					price: [null],
					discount: [null, Validators.required],
					totalMoney: [null]
				})
			])
		});
		this.productFormArray = this.productForm.get('products') as FormArray;
	}

	productTypeChanged($event: Event, i: number) {
		const value = ($event.target as HTMLSelectElement).value;
		this.productService
			.getListProduct(Number(value))
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.products[i] = res.data;
				console.log(this.products);
			});
	}

	productChanged($event, i) {
		const value = ($event.target as HTMLSelectElement).value;
		this.productService
			.getProductInfo(Number(value), this.addressSelected?.areaType || 'AREA_1')
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productFormArray.at(i).get('price').patchValue(res.data.price);
				this.productFormArray.at(i).get('unit').patchValue(res.data.unit);
				this.updateTotalProduct(i);
			});
	}

	changeAmount($event, i) {
		const valueInput = ($event.target as HTMLSelectElement).value;
		this.productFormArray.at(i).get('amount').patchValue(valueInput.replace('-', ''));
		this.updateTotalProduct(i);
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

	getInfoUser(): void {
		const phoneNumber = this.infoForm.get('phone').value;
		if (phoneNumber) {
			this.contractService
				.getInfoUser(phoneNumber)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => {
						this.infoForm.patchValue(res.data);
						this.infoForm.get('phone').patchValue(phoneNumber);
						this.cdr.detectChanges();
					},
					(error: IError) => {
						this.infoForm.reset();
						this.infoForm.get('phone').patchValue(phoneNumber);
						this.checkError(error);
					}
				);
		}
	}

	// Lấy danh sách địa chỉ trạm xăng
	getAllStationAddress() {
		this.contractService.getAddress().subscribe((res) => {
			this.stationAddress = res.data;
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
				amount: [null, Validators.required],
				price: [null],
				discount: [null, Validators.required],
				totalMoney: [null]
			})
		);
	}

	checkError(err: IError) {
		if (err.code === 'SUN-OIL-4811') {
			this.toastr.error('Số điện thoại không thuộc Việt Nam hoặc sai định dạng');
		}
		if (err.code === 'SUN-OIL-4821') {
			this.toastr.error('Không tìm thấy thông tin tài xế với số điện thoại này');
		}
	}

	// formatMoney(n) {
	// 	if (n !== '' && n >= 0) {
	// 		return (Math.round(n * 100) / 100).toLocaleString().split('.').join(',');
	// 	}
	// }
}
