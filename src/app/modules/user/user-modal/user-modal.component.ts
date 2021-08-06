import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { NgSelectConfig } from 'src/app/shared/components/ng-select/public-api';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { IRole, UserService } from '../user.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class UserModalComponent implements OnInit {
  @Input() accountId: number;
  listStatus = LIST_STATUS;
  roles: Array<IRole> = [];
  userFormCreate: FormGroup;
  userFormUpdate: FormGroup;
  isUpdate = false;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private ngSelectConfig: NgSelectConfig,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {
    this.ngSelectConfig.notFoundText = '...';
    this.ngSelectConfig.placeholder = 'Chọn nhóm quyền';
  }

  ngOnInit(): void {
    if (this.accountId) {
      this.buildFormUpdate();
      this.isUpdate = true;
      this.userService
        .getUserById(this.accountId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.userFormUpdate.patchValue(res.data);
        });
    } else {
      this.buildFormCreate();
    }

    this.userService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.roles = res.data;
        this.cdr.detectChanges();
      });
  }

  buildFormCreate(): void {
    this.userFormCreate = this.fb.group({
      code: ['SNV', [Validators.required, TValidators.patternNotWhiteSpace(/^(SNV[A-Za-z0-9]*)$/)]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      roleIds: [null],
      status: [this.listStatus.ACTIVE]
    });
  }

  buildFormUpdate(): void {
    this.userFormUpdate = this.fb.group({
      code: ['SNV', [Validators.required, TValidators.patternNotWhiteSpace(/^(SNV[A-Za-z0-9]*)$/)]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      roleIds: [null],
      status: [null]
    });
  }

  onSubmit(): void {
    if (!this.isUpdate) {
      this.userFormCreate.markAllAsTouched();
      if (this.userFormCreate.invalid) {
        return;
      }
      this.userService
        .createUser(this.userFormCreate.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.data) {
              this.modal.close(true);
            }
          },
          (err: IError) => this.checkError(err)
        );
    } else {
      this.userFormUpdate.markAllAsTouched();
      if (this.userFormUpdate.invalid) {
        return;
      }
      this.userService
        .updateUser(this.accountId, this.userFormUpdate.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.data) {
              this.modal.close(true);
            }
          },
          (err: IError) => this.checkError(err)
        );
    }
  }
  checkError(err: IError) {
    if (!this.isUpdate) {
      if (err.code === 'SUN-OIL-4179') {
        this.userFormCreate.get('username').setErrors({ existed: true });
      }
      if (err.code === 'SUN-OIL-4183') {
        this.userFormCreate.get('code').setErrors({ existed: true });
      }
    } else {
      if (err.code === 'SUN-OIL-4179') {
        this.userFormUpdate.get('username').setErrors({ existed: true });
      }
      if (err.code === 'SUN-OIL-4183') {
        this.userFormUpdate.get('code').setErrors({ existed: true });
      }
    }
  }

  onClose(): void {
    this.modal.close();
  }
}
