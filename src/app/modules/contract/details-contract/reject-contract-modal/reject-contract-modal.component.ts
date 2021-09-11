import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService, IContract } from '../../contract.service';
import { IError } from '../../../../shared/models/error.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-reject-contract-modal',
	templateUrl: './reject-contract-modal.component.html',
	styleUrls: ['./reject-contract-modal.component.scss'],
	providers: [FormBuilder]
})
export class RejectContractModalComponent implements OnInit {
	rejectForm: FormGroup;
	dataContract;
	prod;
	listProduct = [];
	@Input() data: IDataTransfer;

	constructor(
		public modal: NgbActiveModal,
		private fb: FormBuilder,
		private contractService: ContractService,
		private router: Router,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.buildForm();
		this.dataContract = this.data.contract;
		this.getProd();
	}

	buildForm(): void {
		this.rejectForm = this.fb.group({
			rejectReason: ['', [Validators.required]]
		});
	}

	onClose(): void {
		this.modal.close();
	}

	rejectContract() {
		const body = {
			reason: this.rejectForm.controls['rejectReason'].value || ''
		};

		this.contractService.rejectContract(this.dataContract.id, body).subscribe(
			(res) => {
				this.rejectForm.markAllAsTouched();
				if (this.rejectForm.invalid) {
					return;
				}
				if (res.data) {
					this.modal.close();
          if (this.data.customerId) {
            this.router.navigate([`/khach-hang/danh-sach/chi-tiet/${this.data.customerId}`]);
          } else {
            this.router.navigate(['/hop-dong/danh-sach']);
          }
				}
			},
			(err: IError) => {
				this.checkError(err);
			}
		);
	}

	acceptContract() {
		this.contractService.acceptContract(this.dataContract.id).subscribe((res) => {
			if (res.data) {
				this.modal.close();
        if (this.data.customerId) {
          this.router.navigate([`/khach-hang/danh-sach/chi-tiet/${this.data.customerId}`]);
        } else {
          this.router.navigate(['/hop-dong/danh-sach']);
        }
			}
		},
      (err: IError) => {
        this.checkError(err);
      });
	}

	getProd() {
		let item;
		for (let i = 0; i < this.data.contract.product?.length; i++) {
			item = `${this.data.contract.product[i].productResponse.name} - ${this.data.contract.product[i].productResponse.amount} ${this.data.contract.product[i].productResponse.unit}`;

			this.listProduct.push(item);
			this.prod = this.listProduct.join(', ');
		}
	}

	checkError(err: IError) {
		if (err.code === 'SUN-OIL-4718') {
			this.toastr.error('Lý do từ chối hợp đồng không được bỏ trống');
		}
		if (err.code === 'SUN-OIL-4720') {
			this.toastr.error('Không có nhân viên nào tương ứng với tài khoản này');
		}
    if (err.code === 'SUN-OIL-4717') {
      this.toastr.error('Hợp đồng không không ở trạng thái chờ phê duyệt hoặc không tồn tại');
    }
	}
}

export interface IDataTransfer {
	title: string;
	contract?: IContract;
	type: string;
	customerId?: string;
}
