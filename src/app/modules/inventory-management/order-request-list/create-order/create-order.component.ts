import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  IGasFuel,
  IInfoOrderRequest,
  InventoryManagementService, IStationActiveByToken
} from '../../inventory-management.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { IInfoProduct, IProduct, ProductService } from 'src/app/modules/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { IError } from '../../../../shared/models/error.model';
import {
	convertDateToServer,
	convertMoney
} from '../../../../shared/helpers/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { BaseComponent } from '../../../../shared/components/base/base.component';

@Component({
	selector: 'app-create-order',
	templateUrl: './create-order.component.html',
	styleUrls: ['./create-order.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class CreateOrderComponent extends BaseComponent implements OnInit, AfterViewInit {
  stationByToken: IStationActiveByToken[] = [];
	requestForm: FormGroup;
	productForm: FormGroup;
	productFormArray: FormArray;
	products: Array<Array<any>> = [];
	productFuels: IProduct[] = [];
	listGasField: IGasFuel[] = [];
	stationId: number;
	orderDataUpdate: IInfoOrderRequest;
	orderRequestId: number;
	isInitDataUpdateSubject = new Subject();

	currentDate = moment();
	minDate: NgbDateStruct = {
		day: this.currentDate.date(),
		month: this.currentDate.month() + 1,
		year: this.currentDate.year()
	};

	constructor(
		private inventoryManagementService: InventoryManagementService,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
		private productService: ProductService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
		private router: Router
	) {
    super();
  }

  setBreadcumb() {
    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý kho',
          linkText: 'Quản lý kho',
          linkPath: 'kho'
        },
        {
          title: 'Yêu cầu đặt hàng',
          linkText: 'Yêu cầu đặt hàng',
          linkPath: 'kho/yeu-cau-dat-hang'
        },
        {
          title: 'Tạo yêu cầu đạt hàng',
          linkText: 'Tạo yêu cầu đặt hàng',
          linkPath: null
        }
      ]);
    }, 1);
  }

	ngOnInit(): void {
		this.getStationToken();
		this.getListProductFuels();
		this.buildForm();
		this.buildProductForm();
	}

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

	buildForm() {
		this.requestForm = this.fb.group({
			stationId: ['', Validators.required],
			fullAddress: [{ value: '', disabled: true }],
			expectedDate: ['', Validators.required]
		});
	}

	buildProductForm() {
		this.productForm = this.fb.group({
			products: this.fb.array([
				this.fb.group({
					id: ['', Validators.required],
					gasFieldId: ['', Validators.required],
					unit: [''],
					amountRecommended: ['', [Validators.required, Validators.min(1)]]
				})
			])
		});

		this.productFormArray = this.productForm.get('products') as FormArray;
		this.cdr.detectChanges();
	}

	handleStationChange() {
		this.requestForm.get('stationId').valueChanges.subscribe(() => {
			this.stationId = this.requestForm.get('stationId').value;
			this.buildProductForm();

			const itemStation = this.stationByToken.find((x) => {
				return x.id === Number(this.stationId);
			});

			this.requestForm.get('fullAddress').patchValue(itemStation.fullAddress);
		});
	}

  getStationToken() {
    this.inventoryManagementService
      .getStationByToken('ACTIVE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationByToken = res.data;
        this.cdr.detectChanges();
      });
  }

	getListProductFuels() {
		this.productService
			.getListOilProduct()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productFuels = res.data;
				this.cdr.detectChanges();
			});
	}

	productChanged($event, i: number) {
		const value = ($event.target as HTMLSelectElement).value;
		this.patchInfoProduct(value, i);
	}

	patchInfoProduct(productId: string | number, i: number) {
		const allProduct = this.productFormArray.value as Array<any>;
		const checkExisted = allProduct.some(
			(p, index) => p.id && i !== index && Number(p.id) === Number(productId)
		);

		if (checkExisted) {
			this.toastr.error('Sản phẩm này đã được thêm');
			this.productFormArray.at(i).get('id').patchValue('');
			return;
		}
		if (!productId) {
			this.productFormArray.at(i).get('unit').patchValue(0);
		}

		if (!this.stationId) {
			this.productFormArray.at(i).get('id').patchValue('');
			this.toastr.error('Bạn chưa chọn trạm');
			return;
		}

		this.inventoryManagementService.getListGasFuel(productId, this.stationId).subscribe((res) => {
			this.products[i] = res.data;
			this.cdr.detectChanges();
		});

		this.productService.getInfoProductOther(Number(productId)).subscribe((res) => {
			const productInfo: IInfoProduct = res.data;
			this.productFormArray.at(i).get('unit').patchValue(productInfo.unit);
			this.cdr.detectChanges();
		});
	}

	addItem() {
		this.productFormArray.push(
			this.fb.group({
				gasFieldId: ['', Validators.required],
				id: ['', Validators.required],
				unit: [''],
				amountRecommended: ['', [Validators.required, Validators.min(1)]]
			})
		);
	}

  deleteItem(index: number): void {
    this.productFormArray.removeAt(index);
    this.products = [...this.products].filter((_, i) => i !== index);
  }

	onSubmit() {
		this.requestForm.markAllAsTouched();
		this.productForm.markAllAsTouched();
		if (this.requestForm.invalid || this.productForm.invalid) {
			return;
		}

		const productData = this.productForm.value.products.map((p) => ({
			...p,
			amountRecommended: convertMoney(p.amountRecommended.toString()),
			id: Number(p.id),
			gasFieldId: Number(p.gasFieldId)
		}));

		const dataReq = {
			stationId: Number(this.stationId),
			fullAddress: this.requestForm.get('fullAddress').value,
			expectedDate: convertDateToServer(this.requestForm.get('expectedDate').value),
			productInfoRequests: productData
		};

    this.inventoryManagementService.createOrderRequest(dataReq)
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/kho/yeu-cau-dat-hang']);
          this.toastr.success('Gửi yêu cầu đặt hàng thành công')
        }
      }, (err: IError) => {
        this.checkError(err);
      })
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4801') {
      this.toastr.error('Nhập lượng đề xuất nhỏ hơn 1,000,000,000');
    }
  }

	onBack() {
		this.router.navigate(['/kho/yeu-cau-dat-hang']);
	}
}
