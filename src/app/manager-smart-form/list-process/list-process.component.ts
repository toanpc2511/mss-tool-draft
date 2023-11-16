import { Component, OnInit } from '@angular/core';
import { Process } from '../../_models/process';
import { ProcessService } from '../../_services/process.service';
import { CifCondition, CifCondition1, CustomerStatus } from '../../_models/cif';
import { PopupConfirmComponent } from '../../_popup/popup-confirm.component';
import { DialogConfig } from '../../_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { Pagination } from '../../_models/pager';
import { CategoryService } from '../../_services/category/category.service';
import { Category, RegisType } from '../../_models/category/category';
import { Router } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { SearchUser, SystemUsers1 } from '../../_models/systemUsers';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { ResponseStatus } from '../../_models/response';
declare var $: any;
@Component({
  selector: 'app-list-process',
  templateUrl: './list-process.component.html',
  styleUrls: ['./list-process.component.css']
})
export class ListProcessComponent implements OnInit {
  processList: Process[];
  // tslint:disable-next-line:no-inferrable-types
  activePage: number = 1;
  // tslint:disable-next-line:no-inferrable-types
  pageSize: number = 10;
  pagination: Pagination = new Pagination();
  condition: CifCondition1 = new CifCondition1();
  cifStatus: CustomerStatus[];
  integratedStatus: CustomerStatus[];
  integratedType: CustomerStatus[];
  processStatusList: Category[];
  customerType: Category[];
  branches: Category[];
  userList: SystemUsers1[]; // user tao
  userKsvList: SystemUsers1[]; // user duyet;
  submitted: boolean;
  roleLogin: any = [];
  isGDV: boolean;
  isKSV: boolean;
  userInfo: any;
  response: ResponseStatus;

  checkLogin: string;

  constructor(
    private cifService: ProcessService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private router: Router,
    private userService: UserService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    $('.parentName').html('Quản lý hồ sơ');
    $('.childName').html('Danh sách hồ sơ');
    this.roleChecker();
    this.getProcessList(this.condition);
    this.newCondition();
    this.getCategoryList();
  }
  roleChecker(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.checkLogin = localStorage.getItem('roleKSV');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
    this.condition.branchCode = this.userInfo.branchCode;
    if (this.isGDV) {
      this.condition.inputBy = this.userInfo.userId;
    }

    if (this.isKSV && this.checkLogin === '0') {
      this.condition.statusCode = null;
      this.condition.modifiedBy = this.userInfo.userId;
    }

    if (this.isKSV && this.checkLogin === '1') {
      this.condition.statusCode = 'W';
      localStorage.setItem('roleKSV', '0');
    }

  }
  newCondition(): void {
    this.condition.customerTypeCode = '';
  }
  getCategoryList(): void {
    this.categoryService.getProcessStatus().subscribe(data => this.processStatusList = data);
    this.categoryService.getCustomerType().subscribe(data => this.customerType = data);
    this.categoryService.getBranch().subscribe(data => this.branches = data);
    this.userService.getUserByBranch({branchCode: this.userInfo.branchCode}).subscribe(data => {
      if (data.items) {
        this.userList = data.items.filter(e => e.roles === 'Giao dịch viên');
        this.userList.sort((a, b) =>
          a.userName.localeCompare(b.userName)
        );
        this.userKsvList = data.items.filter(e => e.roles === 'Kiểm soát viên');
        this.userKsvList.sort((a, b) =>
          a.userName.localeCompare(b.userName)
        );
      }
    });
    // tslint:disable-next-line:no-string-literal
    this.categoryService.getCifStatus().subscribe(data => this.cifStatus = data['items']);
    // tslint:disable-next-line:no-string-literal
    this.categoryService.getIntegratedType().subscribe(data => this.integratedType = data['items']);
    // tslint:disable-next-line:no-string-literal
    this.categoryService.getIntegratedStatus().subscribe(data => this.integratedStatus = data['items']);
  }
  search(): void {
    this.submitted = true;
    if (this.condition.dateCreatedValidator().valid) {
      this.processList = [];
      this.getProcessList(this.condition);
    }
  }
  // tslint:disable-next-line:typedef
  conditionBuilder(condition: CifCondition) {
    return new CifCondition(
      condition.page,
      condition.size,
      condition.approveBy,
      condition.branchCode,
      condition.code,
      condition.createdDate ? condition.setFormatDate(condition.createdDate) : null,
      condition.inputDateMin ? condition.setFormatDate(condition.inputDateMin) : null,
      condition.inputDateMax ? condition.setFormatDate(condition.inputDateMax) : null,
      condition.customerCode,
      condition.customerTypeCode,
      condition.fullName,
      condition.id,
      condition.inputBy,
      condition.inputter,
      condition.isSlaFailed,
      condition.mobilePhone,
      condition.perDocNo,
      condition.statusCode,
      condition.regisType
    );
  }
  getProcessList(condition: CifCondition1): void {
    this.cifService.getCifListProcess(condition).subscribe(rs => {
      // setTimeout(() => {
      this.processList = rs.items;
      if (rs) {
        this.processList = rs.items;
        this.pagination = new Pagination(rs.count, this.activePage, this.pageSize);
      } else if (this.processList === null) {

      }
    }, error => {
      this.errorHandler.showError(error);
    });
  }
  changePageSize(size: string): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    if (this.pageSize < 0) { return; }
    this.activePage = 1;
    this.condition.page = 1;
    this.condition.size = this.pageSize;
    this.getProcessList(this.condition);
  }

  setPage(pageNumber: any): void {
    if (pageNumber < 1 || pageNumber > this.pagination.pager.totalPages) {
      return;
    } else {
      this.activePage = pageNumber;
      this.condition.page = pageNumber;
      this.getProcessList(this.condition);
    }
  }

  detail(processId: string): void {
    // tslint:disable-next-line:object-literal-shorthand
    this.router.navigate(['./smart-form/manager/view', { processId: processId }]);
  }

  delete(process: Process): void {
    // tslint:disable-next-line:no-string-literal
    process['number'] = 7;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(process));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.cifService.deleteProcess(process.id)
          .subscribe(
            data => this.errorHandler.messageHandler(data.responseStatus, 'Xóa hồ sơ thành công!')
            , error => {
              this.errorHandler.showError(error);
            }
          );
        this.getProcessList(this.condition);
      }
    }
    );
  }
  showDelete(process: Process): any {
    return process.statusId === 'E';
  }
  dateValidator(): any {
    return this.condition.dateCreatedValidator();
  }

}
