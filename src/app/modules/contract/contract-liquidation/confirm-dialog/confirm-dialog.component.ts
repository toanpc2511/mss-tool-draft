import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ContractService} from "../../contract.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { DataResponse } from 'src/app/shared/models/data-response.model';

export interface IDataTransfer {
  type: string;
  contractId: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  rejectForm: FormGroup;
  @Input() data: IDataTransfer;
  @ViewChild('rejectInput') rejectInput: ElementRef<HTMLInputElement>;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private contractService: ContractService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
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
    this.rejectForm.markAllAsTouched();
    if (this.rejectForm.invalid) {
      return;
    }

    const data = {
      reason: this.rejectForm.controls['rejectReason'].value
    };

    this.contractService.rejectLiquidationContract(this.data.contractId, data)
      .subscribe((res: DataResponse<boolean>) => {
        if (res.data) {
          this.modal.close();
          this.router.navigate(['/hop-dong/danh-sach']);
        }
      }
    );
  }

  acceptContract() {
    this.contractService.acceptLiquidationContract(this.data.contractId).subscribe((res: DataResponse<boolean>) => {
        if (res.data) {
          this.modal.close();
          this.router.navigate(['/hop-dong/danh-sach']);
        }
      });
  }
}
