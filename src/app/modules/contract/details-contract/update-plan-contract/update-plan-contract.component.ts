import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ContractService} from "../../contract.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {convertDateToServer, convertMoney, renameUniqueFileName} from "../../../../shared/helpers/functions";
import {EFileType, FileService, IFile} from "../../../../shared/services/file.service";
import {finalize, takeUntil} from "rxjs/operators";
import {HttpEventType} from "@angular/common/http";
import {DestroyService} from "../../../../shared/services/destroy.service";
import * as moment from 'moment';
import { IError } from 'src/app/shared/models/error.model';
import {ConfirmDialogComponent} from "../../../exchange-point-management/modals/confirm-dialog/confirm-dialog.component";
import {DataResponse} from "../../../../shared/models/data-response.model";
import {IImage} from "../../../employee/employee.service";
import {BaseComponent} from "../../../../shared/components/base/base.component";

@Component({
  selector: 'app-update-plan-contract',
  templateUrl: './update-plan-contract.component.html',
  styleUrls: ['./update-plan-contract.component.scss'],
  providers: [DestroyService]
})
export class UpdatePlanContractComponent extends BaseComponent implements OnInit {

  updateForm: FormGroup;
  dataContract;
  @Input() data;
  attachmentImg: IImage;

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    private fb: FormBuilder,
    private contractService: ContractService,
    private router: Router,
    private toastr: ToastrService,
    private fileService: FileService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.updateForm = this.fb.group({
      amountOwed: [this.data?.amountOwed],
      contractId: [this.data?.id],
      date: [moment().format('DD/MM/YYYY')],
      money: [null, [Validators.required, this.validateMoney(this.data.amountOwed)]],
      note: [null],
      file: [null, [Validators.required]],
    })
  }

  validateMoney(amountOwed: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (convertMoney(control.value) > amountOwed) {
        return { invalidMoney: true }
      }
      return null;
    }
  }

  onClose(): void {
    this.modal.close();
  }

  onSubmit(): void {
    this.updateForm.markAllAsTouched();

    if (this.updateForm.invalid) {
      return;
    }

    const money: string = this.updateForm.get('money').value;

    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      backdrop: 'static'
    });

    modalRef.componentInstance.data = {
      message: `<p>Số tiền thanh toán là : ${money}</p><p>Bạn có chắc chăn muốn lưu thông tin thanh toán</p>`,
    }

    modalRef.result.then((result) => {
      const data = { ...this.updateForm.getRawValue(), money: convertMoney(this.updateForm.get('money').value), date: convertDateToServer(this.updateForm.get('date').value) };
      if (result) {
        this.contractService
          .createPaymentPlanContract(data)
          .pipe(
            finalize(() => {
              this.onReset();
              this.cdr.detectChanges();
            })
          )
          .subscribe((res: DataResponse<boolean>): void => {
            if (res.data) {
              this.modal.close(true);
            }
          }, (err: IError): void => {
            this.checkError(err);
          });
      }
    });
  }

  onReset(): void {
    this.updateForm.reset();
    this.updateForm.get('date').patchValue(moment().format('DD/MM/YYYY'));
  }

  addImage($event) {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);

    if (files[0].size > 15360000) {
      this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 15MB');
      this.updateForm.controls['file'].patchValue('');
      return;
    }

    const typeFile = files[0].type.split('/')[0];
    if (typeFile !== 'image') {
      this.updateForm.controls['file'].setErrors({file: true});
      this.attachmentImg = null;
      return;
    }

    this.updateForm.controls['file'].setErrors({file: false});

    this.uploadImageFile(files[0]);

    inputElement.value = null;
  }

  uploadImageFile(file: File) {
    const formData = new FormData();
    formData.append('files', file);
    this.fileService
      .uploadFile(formData, EFileType.IMAGE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event?.data) {
          this.attachmentImg = event.data[0];
          this.updateForm.get('file').patchValue([event.data[0].id] , {emitModelToViewChange: false});
        }
        this.cdr.detectChanges();
      });
  }

  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4301') {
      this.toastr.error(' Số tiền thanh toán không được để trống');
    }
    if (err.code === 'SUN-OIL-4302') {
      this.toastr.error('File đính kèm không được để trống');
    }
    if (err.code === 'SUN-OIL-4303') {
      this.toastr.error('Số tiền không được nhỏ hơn 0 và lớn hơn 9999999999999');
    }
  }


}
