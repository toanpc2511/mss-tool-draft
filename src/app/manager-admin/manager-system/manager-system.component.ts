
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupSystemEditUserComponent } from '../popup-system-edit-user/popupp-system-edit-user.component';
import { PopupSystemAddUserComponent } from '../popup-system-add-user/popup-system-add-user.component';
import { PopupSystemAddRoleComponent } from '../popup-system-add-role/popup-system-add-role.component';
import { PopupSystemEditRoleComponent } from '../popup-system-edit-role/popup-system-edit-role.component';
import { PopupSystemAddTitleComponent } from '../popup-system-add-title/popup-system-add-title.component';
import { PopupSystemEditTitleComponent } from '../popup-system-edit-title/popup-system-edit-title.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { SearchUser, SystemUsers } from 'src/app/_models/systemUsers';
import { UserService } from 'src/app/_services/user.service';
import { TitleService } from 'src/app/_services/title.service';
import { Title, TitlePage } from 'src/app/_models/title';
import { BranchModels } from 'src/app/_models/branch';
import { RoleService } from 'src/app/_services/role.service';
import { Role } from 'src/app/_models/role';
import { FunctionService } from '../../_services/function.service';
import { MainFunction } from '../../_models/mainFunction';
import { ActionService } from '../../_services/action.service';
import { Action, ActionRequest } from '../../_models/action';
import { PaginationService } from '../../services/pagination.service';
import { Pager, Pagination } from '../../_models/pager';
import { PopupGroupTitleRoleComponent } from '../popup-group-title-role/popup-group-title-role.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { PopupDetailUserComponent } from '../popup-detail-user/popup-detail-user.component';
import { PermissionName } from 'src/app/_utils/_returnPermissionName';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';
import {AuthenticationService} from '../../_services/authentication.service';
import {PermissionConst} from '../../_utils/PermissionConst';
import {FormControl} from '@angular/forms';
import {PopupSystemAddFunctionComponent} from '../popup-system-add-function/popup-system-add-function.component';
import {PopupSystemAddActionComponent} from '../popup-system-add-action/popup-system-add-action.component';
declare var $: any;
@Component({
  selector: 'app-manager-system',
  templateUrl: './manager-system.component.html',
  styleUrls: ['./manager-system.component.scss'],
})

export class ManagerSystemComponent implements OnInit {
  functionCode = null;
  PermissionConst = PermissionConst;
  lstAllTitle: Title[] = [];
  lstRoles: Role[] = [];
  lstAllRoles: Role[] = [];
  lstAllFunction: MainFunction[] = [];
  lstAllAction: Action[] = [];
  objRole: Role = new Role();
  objFun: any = {};
  actionIds = [];
  activePage = 1;
  pageSize = 10;
  pager: Pagination = new Pagination();
  TOTAL_COUNT: any;
  pagingStatus: string;
  disabled = false;
  arrayBoth = false;
  lstTabActionInFuntion = [];
  objSearchUser: SearchUser = new SearchUser();
  userPager: Pagination;
  lstUsers: SystemUsers[] = [];
  lstBranch: BranchModels[] = [];
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  lstTitles: Title[] = [];
  displayProgressSpinnerInBlock: boolean;
  newLstAction = [];
  addLstOldLstCheckAction = [];
  numberCheck = 0;
  lstAllRole: Role[] = [];
  role: Role = new Role();
  functions: MainFunction[] = [];
  actions: Action[] = [];
  permissions: any = [];
  actionCode: string;
  selectedIndex: any;
  lstIndex = [];
  iconEditUer = false;
  iconLockUser = false;
  iconDeleteUser = false;
  iconUnlockUser = false;
  iconEditTitle = false;
  iconDeleteTitle = false;
  iconUpdateRole = false;
  iconDeleteRole = false;
  branchId = new FormControl();
  titleId = new FormControl();
  feAction = [];
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private titleService: TitleService,
    private roleService: RoleService,
    private paginationService: PaginationService,
    private functionService: FunctionService,
    private actionService: ActionService,
    private notificationService: NotificationService,
    public authenticationService: AuthenticationService,
    private route: ActivatedRoute) { }
  ngOnInit(): void {
    $('.parentName').html('Quản trị hệ thống');
    // console.log(document.documentElement.scrollHeight)
    this.permissions = JSON.parse(localStorage.getItem('action'));
    let returnIndex: any = PermissionName.returnIndex();
    // this.lstIndex = JSON.parse(localStorage.getItem('lstIndex'))
    // this.selectedIndex = localStorage.getItem('index') !==undefined ? localStorage.getItem('index') : 0
    this.getLstAllTitle();
    this.getLstAllRole();
    this.getLstBranch();
    if (localStorage.getItem('index') !== undefined && localStorage.getItem('index') !== null) {
      this.selectedIndex = localStorage.getItem('index');
      returnIndex = localStorage.getItem('index');
    } else {
      this.selectedIndex = returnIndex;
    }
    const index = {};
    // tslint:disable-next-line:radix
    index['index'] = parseInt(returnIndex);
    this.onTabChanged(index);
    this.returnShowHidePermissionIcon();
    this.branchId.valueChanges.subscribe(result => {
      // console.log('branchId', result);
      this.objSearchUser.branchId = result !== 0 ? result : '';
    });
    this.titleId.valueChanges.subscribe(result => {
      // console.log('titleId', result);
      this.objSearchUser.titleId = result !== 0 ? result : '';
    });

  }
  returnShowHidePermissionIcon(): void {
    this.iconEditUer = true;
    this.iconLockUser = true;
    this.iconUnlockUser = true;
    this.iconDeleteUser = true;
    this.iconEditTitle = true;
    this.iconDeleteTitle = true;
    this.iconUpdateRole = true;
    this.iconDeleteRole = true;
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    // this.checkPermission();
  }

  // user
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


  selectBranch(item: any): void {
    // console.log('item', item);
    this.objSearchUser.branchId = item !== 0 ? item : '';
  }
  selectTitle(item: any): void {
    this.objSearchUser.titleId = item !== 0 ? item : '';
  }
  onEnter(): void {
    this.searchUser();
  }
  searchUser(): void {
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
  addUser(): void {
    const dialogRef = this.dialog.open(PopupSystemAddUserComponent, DialogConfig.configAddOrDetailUser(null));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstUsers();
      }
    }
    );
  }

  unlockUser(item: any): void {
    // tslint:disable-next-line:no-string-literal
    item['number'] = 4;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.userService.unlockUser(id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Mở khóa user thành công', '');
              this.getLstUsers();
            } else {
              this.notificationService.showError('Mở khóa user thất bại', '');
            }
          }
        }, err => {
        });
      }
    });

  }
  deleteUser(item: any): void {
    // tslint:disable-next-line:no-string-literal
    item['number'] = 2;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.userService.deleteUser(id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Xóa user thành công', '');
              this.getLstUsers();
            } else {
              this.notificationService.showError('Xóa user thất bại', '');
            }
          }
        }, err => {
        });
      }
    }
    );
  }
  lockUser(item: any): void {
    // tslint:disable-next-line:no-string-literal
    item['number'] = 3;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.userService.lockUser(id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Khóa user thành công', '');
              this.getLstUsers();
            } else {
              this.notificationService.showError('Khóa user thất bại', '');
            }
          }
        }, err => {
        });
      }
    });

  }
  detailUser(item: any): void {
    // tslint:disable-next-line:no-string-literal
    item['lstRoles'] = this.lstRoles;
    const dialogRef = this.dialog.open(PopupSystemEditUserComponent, DialogConfig.configAddOrDetailUser(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstUsers();
      }
    }
    );
  }
  detailUserById(item: any): void {
    const permissions = this.permissions;
    const p = $('.view-deatil').attr('permission-data');
    if (permissions.includes(p)) {
      const dialogRef = this.dialog.open(PopupDetailUserComponent, DialogConfig.configAddOrDetailUser(item));
      dialogRef.afterClosed().subscribe(rs => { });
    }
  }
  // ket thuc usser
  // phan quyen
  getLstTitle(): void {
    const obj = new TitlePage();
    obj.page = this.activePage;
    obj.size = this.pageSize;
    this.displayProgressSpinnerInBlock = true;
    this.titleService.getlstTitle(obj).subscribe(rs => {

      // setTimeout(() => {
      this.lstTitles = rs.items;
      if (this.lstTitles !== null && this.lstTitles.length > 0) {
        this.TOTAL_COUNT = rs.count;
        this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
      } else {
        this.lstTitles = null;
      }
      this.displayProgressSpinnerInBlock = false;
      // }, 2000);
    }, err => {
      setTimeout(() => {
        this.lstTitles = null;
        this.displayProgressSpinnerInBlock = false;
      }, 2000);
    });
  }
  addTitle(): void {
    const dialogRef = this.dialog.open(PopupSystemAddTitleComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstTitle();
      }
    });
  }
  addRoleInTitle(): void {
    const dialogRef = this.dialog.open(PopupGroupTitleRoleComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstTitle();
      }
    });
  }
  editTitle(item: any): void {
    const data = {};
    // tslint:disable-next-line:no-string-literal
    data['id'] = item;
    // tslint:disable-next-line:no-string-literal
    data['lstRoles'] = this.lstRoles;
    const dialogRef = this.dialog.open(PopupSystemEditTitleComponent, DialogConfig.configDialog(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstTitle();
      }
    });
  }
  deleteTitle(item: any): void {
    // tslint:disable-next-line:no-string-literal
    item['number'] = 5;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.titleService.deleteTitle(id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Chức danh xóa thành công', '');
              this.getLstTitle();
            } else {
              this.notificationService.showError('Chức danh xóa thất bại', '');
            }
          }
        }, err => {
        });
      }
    });
  }
  // ket thuc phan quyen
  // role
  getAllRole(): void {
    this.role.titleCode = '';
    this.displayProgressSpinnerInBlock = true;
    // tslint:disable-next-line:no-string-literal
    this.role['page'] = this.activePage;
    // tslint:disable-next-line:no-string-literal
    this.role['size'] = this.pageSize;
    this.roleService.getAllRoles(this.role).subscribe(rs => {
      // setTimeout(() => {
      this.lstAllRole = rs.items;
      if (this.lstAllRole !== null && this.lstAllRole.length > 0) {
        this.TOTAL_COUNT = rs.count;
        this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
      } else {
        this.lstAllRole = null;
      }
      this.displayProgressSpinnerInBlock = false;
    }, err => {
      setTimeout(() => {
        this.lstAllRole = null;
        this.displayProgressSpinnerInBlock = false;
      }, 2000);
    });

  }
  addRole(): void {
    const dialogRef = this.dialog.open(PopupSystemAddRoleComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
      this.getAllRole();
    }
    );
  }
  editRole(item: any): void {
    const dialogRef = this.dialog.open(PopupSystemEditRoleComponent, DialogConfig.configDialog(item));
    dialogRef.afterClosed().subscribe(rs => {
      this.getAllRole();
    }
    );
  }
  deleteRole(item: any): void {
    // tslint:disable-next-line:no-string-literal
    item['number'] = 6;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.roleService.deleteRole(id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Xóa quyền thành công', '');
              this.getAllRole();
            } else {
              this.notificationService.showError('Xóa quyền thất bại', '');
            }
          }
        }, err => {
        });
      }
    });
  }
  // ket thuc role
  // function
  getAllFunction(): void {
    const obj = {};
    // tslint:disable-next-line:no-string-literal
    obj['page'] = this.activePage;
    // tslint:disable-next-line:no-string-literal
    obj['size'] = this.pageSize;
    this.displayProgressSpinnerInBlock = true;
    this.functionService.getAllFunction(obj).subscribe((data) => {
      // tslint:disable-next-line:no-string-literal
      this.functions = data['items'];
      if (this.functions !== null && this.functions.length > 0) {
        this.TOTAL_COUNT = data.count;
        this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
      } else {
        this.functions = null;
      }
      this.displayProgressSpinnerInBlock = false;
    }, error => {
      setTimeout(() => {
        this.functions = null;
        this.displayProgressSpinnerInBlock = false;
      }, 2000);
    });
  }
  // ket thuc function
  // action
  // tslint:disable-next-line:typedef
  getAction() {
    const obj = new ActionRequest();
    obj.functionCode = this.actionCode === undefined ? '' : this.actionCode;
    obj.page = this.activePage;
    obj.size = this.pageSize;
    this.displayProgressSpinnerInBlock = true;
    return this.actionService.getByFunctionCode(obj).subscribe(
      (data) => {
        // setTimeout(() => {
        // tslint:disable-next-line:no-string-literal
        this.actions = data['items'];
        this.feAction = data['items'];
        this.actions.forEach(action => {

          const parentName = this.findParentName2(action.parentId);
          // action.name = parentName ? '[' + parentName + '] ' + action.name : action.name;
          action.parentName = parentName ? '[' + parentName + '] ' + action.name : action.name;
        });
        // this.lstAllAction = this.actions
        if (this.actions !== null && this.actions.length > 0) {
          this.TOTAL_COUNT = data.count;
          this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
        } else {
          this.actions = null;
        }
        this.displayProgressSpinnerInBlock = false;
        // }, 2000);
      }, error => {
        setTimeout(() => {
          this.actions = null;
          this.displayProgressSpinnerInBlock = false;
        }, 2000);
      }
    );
  }
  searchAction(functionName: string = ''): void {
    this.actionCode = functionName;
    this.activePage = 1;
    this.pageSize = 10;
    this.getAction();
  }
  // ket thuc action
  getLstBranch(): void {
    this.titleService.getLstAllBranch().subscribe(rs => {
      this.lstBranch = rs.items;
    }, err => {
    });
  }
  getLstAllTitle(): void {
    this.titleService.getAllTitle().subscribe(rs => {
      this.lstAllTitle = rs.items;
    });
  }
  getLstAllRole(): void {
    this.roleService.getLstAllRoles().subscribe(rs => {
      this.lstRoles = rs.items;
      if (this.lstRoles !== null && this.lstRoles.length > 0) {
        this.lstAllRoles = this.lstRoles;
      }
    }, err => { });
  }
  setActionPage(page, index: any): void {
    this.activePage = page;

    if (index === 0) {
      if (page < 1 || page > this.userPager.pager.totalPages) {
        return;
      }
      this.getLstUsers(page, this.userPager.pageSize);
    } else if (index === 1) {
      this.getLstTitle();
    } else if (index === 2) {
      this.getAllRole();
    } else if (index === 3) {
      this.getAllFunction();
    } else {
      this.getAction();
    }

  }
  changePageSize(size: string, index: any): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    // tslint:disable-next-line:radix
    const pageSize = parseInt(size);
    this.activePage = 1;
    if (index === 0) {
      this.userPager.activePage = pageSize;
      this.getLstUsers(1, pageSize);
    } else if (index === 1) {
      this.getLstTitle();
    } else if (index === 2) {
      this.getAllRole();
    } else if (index === 3) {
      this.getAllFunction();
    }
    else {
      this.getAction();
    }

  }
  // ket thuc hanh dong
  onTabChanged(index: any): void {
    this.activePage = 1;
    this.pageSize = 10;
    const tabIndex = index.index;
    this.lstUsers = [];
    this.lstTitles = [];
    this.actions = [];
    this.functions = [];
    this.lstAllRole = [];
    this.pager = new Pagination();
    this.userPager = new Pagination();
    // this.pager = new Pager()
    // this.checkPermission();
    this.viewLabel(tabIndex);
    // this.actionCode = ''
    if (tabIndex === 0) {
      this.getLstUsers();
    } else if (tabIndex === 1) {
      this.getLstTitle();
    } else if (tabIndex === 2) {
      this.getAllRole();
    } else if (tabIndex === 3) {
      this.getAllFunction();
    } else if (tabIndex === 4) {
      this.lstAllFunction = [];
      this.actionCode = '';
      this.getListAllFunction(0);
      this.getAction();
      this.getListAllAction(0);
    } else {
      this.displayProgressSpinnerInBlock = true;
      this.newLstAction = [];
      this.getListAllAction(0);
      this.getListAllFunction(0);
      this.getLstAllRole();
      setTimeout(() => {
        this.disabled = this.arrayBoth ? true : false;
        this.forcusFirtRow();
        this.forcusFunction();
        this.displayProgressSpinnerInBlock = false;
      }, 1000);
    }
  }
  viewLabel(i: any): void {
    if (i === 0) {
      $('.childName').html('Quản lý người dùng');
    } else if (i === 1) {
      $('.childName').html('Quản lý chức danh');
    } else if (i === 2) {
      $('.childName').html('Quản lý role');
    } else if (i === 3) {
      $('.childName').html('Quản lý function');
    } else if (i === 4) {
      $('.childName').html('Quản lý hành động');
    } else if (i === 5) {
      $('.childName').html('Map quyền');
    }
  }
  forcusFirtRow(): void {
    // this.arrayWhenCheckAction = []
    for (let i = 0; i < this.lstRoles.length; i++) {
      if (i === 0) {
        // tslint:disable-next-line:no-string-literal
        this.lstRoles[i]['onFocus'] = true;
        this.objRole = this.lstRoles[i];
        continue;
      } else {
        // tslint:disable-next-line:no-string-literal
        this.lstRoles[i]['onFocus'] = false;
      }
    }
  }
  saveDefineRole(): void {
    this.actionIds = [];
    const obj = {};
    const roles = {
      roles: []
    };
    let lstActionChecked = this.lstAllAction.filter(e => e.checked);
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.lstAllAction.length; index++) {
      const char = this.lstAllAction[index].roles !== null ? this.lstAllAction[index].roles : '';
      if (char.search(this.objRole.code) >= 0) {
        // tslint:disable-next-line:no-string-literal
        if (this.lstAllAction[index]['checked'] !== undefined) {
          // tslint:disable-next-line:no-string-literal
          if (this.lstAllAction[index]['checked']) {
            lstActionChecked.push(this.lstAllAction[index]);
          }
        } else {
          lstActionChecked.push(this.lstAllAction[index]);
        }
      }
    }
    lstActionChecked = lstActionChecked.filter((element, i) => i === lstActionChecked.indexOf(element));
    lstActionChecked.forEach(e => {
      this.actionIds.push(e.id);
    });
    // tslint:disable-next-line:no-string-literal
    obj['roleId'] = this.objRole.id;
    // tslint:disable-next-line:no-string-literal
    obj['actionIds'] = this.actionIds.length > 0 ? this.actionIds : [];
    roles.roles.push(obj);
    this.displayProgressSpinnerInBlock = true;
    this.roleService.mapAction(roles).subscribe(rs => {
      setTimeout(() => {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.codes[index].code === '200') {
            this.notificationService.showSuccess('Map quyền thành công', '');
            this.arrayBoth = false;
            this.disabled = false;
            // this.forcusFirtRow()
            this.getListAllFunction(5);
          } else {
            this.notificationService.showError('Map quyền thất bại', '');
          }
          this.displayProgressSpinnerInBlock = false;
        }
      }, 1000);

    }, error => {
      this.displayProgressSpinnerInBlock = false;
    });
  }
  // tab dinh nghia quyen
  getListAllFunction(index: any): void {
    this.functionService.getAll().subscribe(rs => {
      this.lstAllFunction = rs.items;
      this.lstAllFunction = this.lstAllFunction.sort((obj1, obj2) => {
        if (obj1.name > obj2.name) {
          return 1;
        }

        if (obj1.name < obj2.name) {
          return -1;
        }

        return 0;
      });

      this.getListAllAction(index);
    });
  }
  getListAllAction(index: any): void {
    this.actionService.getAllAction().subscribe(rs => {
      this.lstAllAction = rs.items;
      if (index === 5) {
        this.forcusFunction();
      }
    });
  }

  forcusFunction(): void {
    for (let index = 0; index < this.lstAllFunction.length; index++) {
      const char = this.lstAllFunction[index].roles !== null ? this.lstAllFunction[index].roles : '';
      if (char.search(this.objRole.code) >= 0) {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['checked'] = true;
      } else {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['checked'] = false;
      }
      if (index === 0) {
        this.objFun = this.lstAllFunction[index];
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['onFocus'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['color'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['returnColor'] = false;
        this.showAction(this.objRole, this.lstAllFunction[index]);
      } else {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['onFocus'] = false;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['color'] = false;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['returnColor'] = true;
      }
    }

  }

  showAction(objRole: any, objFuntion: any): void {

    this.newLstAction = [];
    // this.oldLstCheckAction = []
    this.addLstOldLstCheckAction = [];
    this.lstTabActionInFuntion = [];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.lstAllAction.length; index++) {

      const char = this.lstAllAction[index].roles !== null ? this.lstAllAction[index].roles : '';
      if (char.search(objRole.code) >= 0 && objFuntion.code === this.lstAllAction[index].functionCode) {
        // tslint:disable-next-line:no-string-literal
        this.lstAllAction[index]['checkedFunctionId'] = this.lstAllAction[index].functionId;
        if (this.lstAllAction[index].checked !== undefined) {
          // tslint:disable-next-line:no-string-literal
          this.lstAllAction[index]['checked'] = this.lstAllAction[index].checked ? true : false;
        } else {
          // tslint:disable-next-line:no-string-literal
          this.lstAllAction[index]['checked'] = true;
        }
        this.addLstOldLstCheckAction.push(this.lstAllAction[index]);
        this.numberCheck = this.addLstOldLstCheckAction.length;

      }
      if (this.lstAllAction[index].functionCode === objFuntion.code) {
        this.newLstAction.push(this.lstAllAction[index]);

      }

    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.newLstAction.length; i++) {
      const char = this.newLstAction[i].roles !== null ? this.newLstAction[i].roles : '';
      this.newLstAction[i].parentName = this.findParentName(this.newLstAction[i].parentId);
      if (char.search(objRole.code) >= 0) {
        // tslint:disable-next-line:no-string-literal
        this.newLstAction[i]['checked'] = this.newLstAction[i].checked ? true : false;
        this.lstTabActionInFuntion.push(this.newLstAction[i]);
      }
    }


  }
  viewDetail(item: any): void {
    this.objFun = {};
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.lstAllFunction.length; i++) {
      if (this.lstAllFunction[i].id === item.id) {
        this.objFun = item;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['onFocus'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['color'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['returnColor'] = false;
        continue;
      } else {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['onFocus'] = false;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['returnColor'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['color'] = false;
      }
    }
    this.showAction(this.objRole, item);
  }
  selectRoleInTab(item: any, index: any): void {
    this.objRole = item;
    this.addLstOldLstCheckAction = [];
    const data = {};
    // tslint:disable-next-line:no-string-literal
    data['number'] = 1;
    if (this.arrayBoth) {
      this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(data));
    }
    if (!this.arrayBoth) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstRoles.length; i++) {
        if (this.lstRoles[i].id === item.id) {
          // tslint:disable-next-line:no-string-literal
          this.lstRoles[i]['onFocus'] = true;
          continue;
        } else {
          // tslint:disable-next-line:no-string-literal
          this.lstRoles[i]['onFocus'] = false;
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstAllFunction.length; i++) {
        const char = this.lstAllFunction[i].roles !== null ? this.lstAllFunction[i].roles : '';
        if (char.search(item.code) >= 0) {
          // tslint:disable-next-line:no-string-literal
          this.lstAllFunction[i]['checked'] = true;
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstAllAction.length; i++) {
        this.lstAllAction[i].checked = undefined;
        // tslint:disable-next-line:no-string-literal
        this.lstAllAction[i]['checkedFunctionId'] = undefined;
      }
      this.forcusFunction();
    }
  }
  setLstAllFunctionIsTrue(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.lstAllFunction.length; index++) {
      if (this.lstAllFunction[index].id === this.objFun.id) {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['checked'] = true;
      }
    }
  }
  setCheckedFalseAction(item: any): void {
    this.newLstAction.forEach(r => {
      if (r.id === item.id) {
        r.checked = false;
        r.checkedFunctionId = this.objFun.id;
      }
    });
  }
  setLstAllFunctionIsFalse(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.lstAllFunction.length; index++) {
      if (this.lstAllFunction[index].id === this.objFun.id) {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['checked'] = false;
      }
    }
  }
  selectAction(item: any, e): void {
    if (e.target.checked) {
      // tslint:disable-next-line:no-shadowed-variable
      this.lstAllAction.forEach(e => {
        if (item.id === e.id) {
          e.checked = true;
        }

      });
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < this.lstAllFunction.length; index++) {
        if (item.functionId === this.lstAllFunction[index].id) {
          // tslint:disable-next-line:no-string-literal
          this.lstAllFunction[index]['checked'] = true;
        }
      }
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      this.lstAllAction.forEach(e => {
        if (e.id === item.id) {
          e.checked = false;
        }
      });
      if (this.lstTabActionInFuntion.length > 0) {
        // tslint:disable-next-line:no-shadowed-variable
        const arr = this.lstTabActionInFuntion.filter(e => e.checked);
        if (arr.length === 0) {
          // tslint:disable-next-line:no-shadowed-variable
          this.lstAllFunction.forEach(e => {
            if (item.functionId === e.id) {
              // tslint:disable-next-line:no-string-literal
              e['checked'] = false;
            }
          });
        }
      } else {
        // tslint:disable-next-line:no-shadowed-variable
        const lst = this.lstAllAction.filter(e => e.checked && e.functionId === item.functionId);
        if (lst.length === 0) {
          // tslint:disable-next-line:no-shadowed-variable
          this.lstAllFunction.forEach(e => {
            if (item.functionId === e.id) {
              // tslint:disable-next-line:no-string-literal
              e['checked'] = false;
            }
          });
        }
      }

    }
    this.openOrCloseButton(item, e);
    this.disabled = this.arrayBoth ? true : false;

  }

  openOrCloseButton(item, e): void {
    let ar = [];
    let arrCheck = [];
    if (this.lstTabActionInFuntion.length > 0) {
      // tslint:disable-next-line:no-shadowed-variable
      const arr = this.lstTabActionInFuntion.filter(e => !e.checked);
      // tslint:disable-next-line:no-shadowed-variable
      ar = this.lstAllAction.filter(e => e.checked);
      // tslint:disable-next-line:no-shadowed-variable
      arrCheck = this.lstTabActionInFuntion.filter(e => e.checked);
      if (arr.length > 0) {
        this.arrayBoth = true;
      } else {
        if (this.arrayBoth && ar.length === arrCheck.length) {
          this.arrayBoth = false;
        } else {
          this.arrayBoth = true;
        }
      }
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      ar = this.lstAllAction.filter(e => e.checked && e.functionId !== item.functionId);
      if (e.target.checked) {
        if (!this.arrayBoth && this.lstTabActionInFuntion.length === 0) {
          this.arrayBoth = true;
        }
        return;
      } else {
        // tslint:disable-next-line:no-shadowed-variable
        const lst = this.lstAllAction.filter(e => e.checked && e.functionId === item.functionId);
        if (ar.length === this.numberCheck && lst.length === 0) {
          this.arrayBoth = false;
        }
      }
    }
  }
  filterArray = (addLstOldLstCheckAction, newLstCheckAction) => {
    const filtered = addLstOldLstCheckAction.filter(el => {
      return newLstCheckAction.indexOf(el) === -1;
    });
    return filtered;
  }
  addCheckWhenTickAction(item: any, e): void {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.lstAllAction.length; index++) {
      if (e.target.checked && (item.id === this.lstAllAction[index].id)) {
        // tslint:disable-next-line:no-string-literal
        this.lstAllAction[index]['checked'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllAction[index]['checkedFunctionId'] = this.objFun.id;
        break;
      }
    }
  }
  // ket thuc
  getStatusCode(statusCode: string): 'Hoạt động' | 'Không hoạt động' | 'Đóng' | '' {
    if (statusCode === 'A') {
      return 'Hoạt động';
    } else if (statusCode === 'I') {
      return 'Không hoạt động';
    } else if (statusCode === 'C') {
      return 'Đóng';
    } else {
      return '';
    }
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
  getLstRoleMapTitle(roles: any): any[] {
    const ar = roles !== null ? roles : [];
    const returnName = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.lstRoles.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < ar.length; j++) {
        if (this.lstRoles[i].id === ar[j]) {
          returnName.push(this.lstRoles[i].name);
        }
      }
    }
    return returnName;
  }

  checkAll(): void {
    this.newLstAction.forEach(item => {
      item.checked = true;
      this.disabled = true;

    });
  }
  addFunction(): void {
    const dialogRef = this.dialog.open(PopupSystemAddFunctionComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.getAllFunction();
        }
      }
    );
  }

  editFunction(item: any): void {
    const data = {
      item
    };
    // tslint:disable-next-line:no-string-literal
    const dialogRef = this.dialog.open(PopupSystemAddFunctionComponent, DialogConfig.configDialog(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getAllFunction();
      }
    });
  }

  deleteFunction(item: any): void {
    item['number'] = 5;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {

          // tslint:disable-next-line:no-shadowed-variable
          this.functionService.delete(item.id).subscribe(rs => {
            // tslint:disable-next-line:prefer-for-of
            for (let index = 0; index < rs.responseStatus.codes.length; index++) {
              if (rs.responseStatus.codes[index].code === '200') {
                this.notificationService.showSuccess('Xóa  thành công', '');
                this.getAllFunction();
              } else {
                this.notificationService.showError('Xóa  thất bại', '');
              }
            }
          }, err => {
          });
        }
      }
    );
  }
  addAction(): void {
    const dialogRef = this.dialog.open(PopupSystemAddActionComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.getAction();
        }
      }
    );
  }

  editAction(item: any): void {
    const data = {
      item
    };
    // tslint:disable-next-line:no-string-literal
    const dialogRef = this.dialog.open(PopupSystemAddActionComponent, DialogConfig.configDialog(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getAction();
      }
    });
  }

  deleteAction(item: any): void {

    // tslint:disable-next-line:no-string-literal
    item['number'] = 5;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.actionService.delete(item.id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Chức danh xóa thành công', '');
              this.getAction();
            } else {
              this.notificationService.showError('Chức danh xóa thất bại', '');
            }
          }
        }, err => {
        });
      }
    });
  }

  findParentName(parentId): string {
    const frontendAction = this.newLstAction;
    let parentName = '';
    for (const key in frontendAction) {
      if (frontendAction[key].id === parentId) {
        if (!frontendAction[key].parentId) {
          parentName = frontendAction[key].name;
        } else {
          parentName = this.findParentName(frontendAction[key].parentId) + ' - ' + frontendAction[key].name  ;
        }
      }
      // this.streets.push({
      //   textItem: frontendAction[key].name,
      //   pathImage: frontendAction[key].imagePath,
      //   urlRouter: frontendAction[key].feUrl
      // });
    }
    return parentName;
  }

  findParentName2(parentId): string {
    // const frontendAction = JSON.parse(localStorage.getItem("action")).filter(action => action.feUrl);
    const frontendAction = this.lstAllAction.filter(action => action.feUrl);

    let parentName = '';
    for (const key in frontendAction) {

      if (frontendAction[key].id === parentId) {
        if (!frontendAction[key].parentId) {
          parentName = frontendAction[key].name;
        } else {
          parentName = this.findParentName2(frontendAction[key].parentId) + ' - ' + frontendAction[key].name ;
        }
      }
    }
    return parentName;
  }
}

