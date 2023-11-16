import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {ActionModel} from '../../../shared/models/ActionModel';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import {DOC_TYPES_VI} from '../../../lpb-services/lpb-deposit-service/shared/constants/deposit-common';
import {Role} from '../../../_models/role';
import {RoleService} from '../../../_services/role.service';
import {UserInfo} from '../../../_models/user';
import {UserService} from '../../../_services/user.service';
import {NotificationService} from '../../../_toast/notification_service';

@Component({
  selector: 'app-mapping-user-role',
  templateUrl: './mapping-user-role.component.html',
  styleUrls: ['./mapping-user-role.component.scss']
})
export class MappingUserRoleComponent implements OnInit {
  protected readonly FormHelpers = FormHelpers;
  actions: ActionModel[] = [
    {
      actionName: 'Lưu',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];
  roles: Role[] = [];
  userList: UserInfo[] = [];
  form = this.fb.group({
    users: this.fb.array([])
  });

  constructor(private fb: FormBuilder,
              private roleService: RoleService,
              private userService: UserService,
              private notificationService: NotificationService
              ) {
  }

  get users(): FormArray {
    return this.form.controls.users as FormArray;
  }

  ngOnInit(): void {

    this.addRow();
    this.getAllUser();
    this.getLstAllRole();
  }

  addRow(): void {
    const user = this.fb.group({
      userId: ['', Validators.required],
      roleId: ['beginner', Validators.required]
    });
    this.users.push(user);
  }

  deleteRow(rowIndex: number): void {
    this.users.removeAt(rowIndex);
  }

  onSave(): void {
    console.log(this.form.value.users);
    if (this.form.invalid) {
      return;
    }


    this.userService.mappingUserToRole(this.form.value).subscribe(
      (res) => {
        // this.customNotificationService.handleResponse(res);
        if (res.responseStatus.success) {
          this.notificationService.showSuccess('Thông báo', 'Thành công');
        }
      },
      (error) => {
        this.notificationService.showError('Thông báo', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', message);
        this.form.disable();
        this.actions.shift();
      }
    );
  }

  getLstAllRole(): void {
    this.roleService.getLstAllRoles().subscribe(rs => {
      this.roles = rs.items.sort((obj1, obj2) => {
        if (obj1.name > obj2.name) {
          return 1;
        }

        if (obj1.name < obj2.name) {
          return -1;
        }

        return 0;
      });
      if (this.roles !== null && this.roles.length > 0) {
        // this.lstAllRoles = this.lstRoles;
      }
    }, err => {
    });
  }
  getAllUser(): void {
    this.userService.getAllUser().subscribe(rs => {
      this.userList = rs.items.sort((obj1, obj2) => {
        if (obj1.userName > obj2.userName) {
          return 1;
        }

        if (obj1.userName < obj2.userName) {
          return -1;
        }

        return 0;
      });
      if (this.roles !== null && this.roles.length > 0) {
        // this.lstAllRoles = this.lstRoles;
      }
    }, err => {
    });
  }
}
