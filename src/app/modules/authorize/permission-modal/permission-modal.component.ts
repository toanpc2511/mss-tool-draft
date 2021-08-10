import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { PermissionService } from '../permission.service';

@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
  styleUrls: ['./permission-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class PermissionModalComponent implements OnInit {
  @Input() roleId: number;
  perrmissions: Array<any> = [];
  permissionForm: FormGroup;
  isUpdate = false;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.roleId) {
      this.isUpdate = true;
    }
  }

  buildForm(): void {
    this.permissionForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }

  onSubmit(): void {
    this.permissionForm.markAllAsTouched();
    if (this.permissionForm.invalid) {
      return;
    }
    if (!this.isUpdate) {
      this.permissionService
        .createRole(this.permissionForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => this.closeModal(res),
          (err: IError) => this.checkError(err)
        );
    } else {
      this.permissionService
        .updateUser(this.roleId, this.permissionForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => this.closeModal(res),
          (err: IError) => this.checkError(err)
        );
    }
  }

  closeModal(res: DataResponse<any>) {
    if (res.data) {
      this.modal.close(true);
    }
  }

  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4179') {
      this.permissionForm.get('name').setErrors({ existed: true });
    }
  }

  onClose(): void {
    this.modal.close();
  }
}
