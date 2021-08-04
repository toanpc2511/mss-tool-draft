import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { IUser, UserService } from '../user.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class UserModalComponent implements OnInit {
  @Input() accountId: number;
  listStatus = LIST_STATUS;
  userForm: FormGroup;
  isUpdate = false;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.accountId) {
      this.isUpdate = true;
      this.userService
        .getUserById(this.accountId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.userForm.patchValue(res.data);
        });
    }
  }

  onClose(): void {
    this.modal.close();
  }

  buildForm(data?: IUser): void {
    this.userForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  onSubmit(): void {}
  checkError(err: IError) {
    if (err.code === '') {
    }
  }
}
