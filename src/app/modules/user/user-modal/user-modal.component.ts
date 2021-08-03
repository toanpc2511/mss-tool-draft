import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() data: IUser;
  listStatus = LIST_STATUS;
  productForm: FormGroup;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.onSubmit();
  }

  onClose(): void {
    this.modal.close();
  }

  buildForm(): void {}

  onSubmit(): void {}
  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4154') {
      this.productForm.get('code').setErrors({ codeExisted: true });
    }
    if (err.code === 'SUN-OIL-4153') {
      this.productForm.get('name').setErrors({ nameExisted: true });
    }
    if (err.code === 'SUN-OIL-4088') {
      this.productForm.get('name').setErrors({ nameExisted: true });
    }
    if (err.code === 'SUN-OIL-4089') {
      this.productForm.get('code').setErrors({ codeExisted: true });
    }
  }
}
