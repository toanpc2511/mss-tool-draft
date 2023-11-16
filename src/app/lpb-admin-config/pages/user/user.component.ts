import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';
import {DepositForm} from '../../../lpb-services/lpb-deposit-service/shared/models/deposit';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupSystemEditUserComponent} from '../../../manager-admin/popup-system-edit-user/popupp-system-edit-user.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {Role} from '../../../_models/role';
import {MatDialog} from '@angular/material/dialog';
import {Pager, Pagination} from '../../../_models/pager';
import {SearchUser} from '../../../_models/systemUsers';
import {UserService} from '../../../_services/user.service';
import {Title} from '../../../_models/title';
import {TitleService} from '../../../_services/title.service';
import {FormControl} from '@angular/forms';
import {BranchModels} from '../../../_models/branch';
import {finalize} from 'rxjs/operators';
import {RoleService} from '../../../_services/role.service';
import {NotificationService} from '../../../_toast/notification_service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  lstUsers = [];
  iconEditUer = true;
  lstRoles: Role[] = [];
  lstAllRoles: Role[] = [];
  displayProgressSpinnerInBlock: boolean;
  activePage = 1;
  pageSize = 10;
  userPager: Pagination = new Pagination();
  objSearchUser: SearchUser = new SearchUser();
  lstAllTitle: Title[] = [];
  lstBranch: BranchModels[] = [];
  titleId = new FormControl();
  roleId = new FormControl();
  branchId = new FormControl();
  role = '';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private userService: UserService,
              private titleService: TitleService,
              private notificationService: NotificationService,
              private roleService: RoleService,
  ) {
  }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('userRole')).code;
    this.iconEditUer = this.role === 'UNIFORM.BANK.QUANTRI';
    this.getLstUsers();
    this.titleService.getAllTitle().subscribe(rs => {
      this.lstAllTitle = rs.items;
    });
    this.titleService.getLstAllBranch().subscribe(rs => {
      this.lstBranch = rs.items;
    }, err => {
    });
    this.roleService.getLstAllRoles().subscribe(rs => {
      this.lstRoles = rs.items;
      if (this.lstRoles !== null && this.lstRoles.length > 0) {
        this.lstAllRoles = this.lstRoles;
      }
    }, err => {
    });
    this.branchId.valueChanges.subscribe(result => {
      // console.log('branchId', result);
      this.objSearchUser.branchId = result !== 0 ? result : '';
    });
    this.titleId.valueChanges.subscribe(result => {
      // console.log('titleId', result);
      this.objSearchUser.titleId = result !== 0 ? result : '';
    });
    this.roleId.valueChanges.subscribe(result => {
      // console.log('titleId', result);
      this.objSearchUser.roleId = result !== 0 ? result : '';
    });
  }

  edit(item: DepositForm): void {
    // this.router.navigate(['../detail'], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: {
    //     transId: item.id,
    //   },
    //   state: {
    //     isEdit: true,
    //   },
    // });
  }


  searchUser(): any {
    this.lstUsers = [];
    if (this.objSearchUser.employeeId !== undefined) {
      this.objSearchUser.employeeId = this.objSearchUser.employeeId.toString().trim();
    }
    if (this.objSearchUser.fullName !== undefined) {
      this.objSearchUser.fullName = this.objSearchUser.fullName.toString().trim();
    }
    if (this.objSearchUser.username !== undefined) {
      this.objSearchUser.username = this.objSearchUser.username.toString().trim();
    }
    if (this.objSearchUser.userCore !== undefined) {
      this.objSearchUser.userCore = this.objSearchUser.userCore.toString().trim();
    }
 
    this.getLstUsers(1, this.userPager.pageSize);
  }

  detailUserById(row: any): any {

  }

  getStatusCodeUser(statusCode: string): 'Hoạt động' | 'Khóa' | 'Đóng' | '' {
    if (statusCode === 'A') {
      return 'Hoạt động';
    } else if (statusCode === 'L') {
      return 'Khóa';
    } else if (statusCode === 'C') {
      return 'Đóng';
    } else {
      return '';
    }
  }

  detailUser(item: any): void {
    // tslint:disable-next-line:no-string-literal
    item['lstRoles'] = this.lstRoles;
    item['lstAllTitle'] = this.lstAllTitle;
    item['lstBranch'] = this.lstBranch;
    const dialogRef = this.dialog.open(PopupSystemEditUserComponent, DialogConfig.configAddOrDetailUser(item));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.getLstUsers();
        }
      }
    );
  }

  getLstUsers(activePage = 1, pageSize = 10): void {
    this.displayProgressSpinnerInBlock = true;
    this.activePage = activePage;
    this.pageSize = pageSize;
    this.objSearchUser.page = this.activePage;
    this.objSearchUser.size = this.pageSize;
    this.userService.getAllUsersByCondition(this.objSearchUser).subscribe(rs => {
      // setTimeout(() => {
      this.lstUsers = rs.items;
      if (this.lstUsers !== null && this.lstUsers.length > 0) {
        this.userPager = new Pagination(rs.count, this.activePage, this.pageSize);
      } else {
        this.lstUsers = null;
        this.userPager.pager = new Pager();
      }
      this.displayProgressSpinnerInBlock = false;
      // }, 2000);
    }, err => {
      setTimeout(() => {
        this.lstUsers = null;
        this.userPager.pager = new Pager();
        this.displayProgressSpinnerInBlock = false;
      }, 2000);
    });
  }

  changePageSize(size: string, index: any): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    // tslint:disable-next-line:radix
    const pageSize = parseInt(size);
    this.activePage = 1;
    this.userPager.activePage = pageSize;
    this.getLstUsers(1, pageSize);

  }

  setActionPage(page, index: any): void {
    this.activePage = page;

    if (page < 1 || page > this.userPager.pager.totalPages) {
      return;
    }
    this.getLstUsers(page, this.userPager.pageSize);

  }

  syncData(type): void {
    this.userService.syncUserToRedis(type).subscribe(rs => {
      this.notificationService.showSuccess('Đồng bộ thành công', 'Thông báo');
    }, err => {
      setTimeout(() => {
        this.notificationService.showError('Đồng bộ thất bại', 'Thông báo');
      }, 2000);
    });

  }

}
