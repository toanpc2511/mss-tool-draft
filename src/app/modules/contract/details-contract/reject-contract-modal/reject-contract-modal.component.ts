import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService, IContract } from '../../contract.service';
import { IError } from '../../../../shared/models/error.model';
import { Router } from '@angular/router';

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
    ) { }

  ngOnInit(): void {
    this.buildForm();
    this.dataContract = this.data.contract;
    this.getProd();
  }

  buildForm(): void {
    this.rejectForm = this.fb.group({
      rejectReason: ['', [Validators.required]]
    })
  }

  onClose(): void {
    this.modal.close();
  }

  async acceptContract(type: string) {
    const params = {
      status: type
    }
    const body = {
      rejectReason: this.rejectForm.controls['rejectReason'].value || ''
    }
    console.log(params);
    this.contractService.acceptContract(this.dataContract.id, body, params).subscribe(
      (res) => {
        if (res.data) {
          this.modal.close();
          this.router.navigate(['/hop-dong/danh-sach']);
        }
      },
      (err: IError) => {
        this.checkError(err);
      }
    );
  }

  getProd() {
    for (let i = 0; i < this.data.contract.product.length; i++) {
      this.prod =
        this.data.contract.product[i].productResponse.name + ' - '
        + this.data.contract.product[i].productResponse.amount  + ' '
        + this.data.contract.product[i].productResponse.unit;

      this.listProduct.push(this.prod)
    }
  }

  checkError(err: IError) {}
}

export interface IDataTransfer {
  title: string;
  contract?: IContract;
  type:  string;
}
