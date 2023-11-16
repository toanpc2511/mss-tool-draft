import { Component, OnInit } from '@angular/core';
import { PopupManagerFileComponent } from '../../popup/popup-manager-file.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Pagination } from '../../../_models/pager';
import { Process } from '../../../_models/process';
import { ProcessService } from '../../../_services/process.service';
import { CifCondition } from '../../../_models/cif';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { GlobalConstant } from '../../../_utils/GlobalConstant';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { docStatus } from 'src/app/shared/models/documents';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
declare var $: any;

@Component({
  selector: 'app-manager-file-processed.component',
  templateUrl: './manager-file-processed.component.html',
  styleUrls: ['./manager-file-processed.component.scss']
})
export class ManagerFileProcessedComponent implements OnInit {

  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  readonly docStatus = docStatus;
  processList: Process[];
  activePage = 1;
  pageSize = 10;
  processId = '';
  customers = [];
  valueSearch = '';
  items = [];
  errMsgSearchCustomer = '';
  filterSelected = this.CUSTOMER_TYPE.CMND;
  condition: CifCondition = new CifCondition();
  objTypeCustomer: { cif?: any; uidValue?: any; phone?: any; uidName?: any; };
  pagination: Pagination = new Pagination();
  userLogin: string;
  valueSearchValid: boolean;
  msgEmpty = '';
  isListCustomer = false;
  userInfo: any = {};
  readonly typeParamSearch = {  // select loại tìm kiếm customer
    cif: 'CIF', // mã cif
    cmnd: 'CHUNG MINH NHAN DAN', // chứng minh nhân dân
    cccd: 'CAN CUOC CONG DAN', // căn cước công dân
    gks: 'GIAY KHAI SINH', // giấy khai sinh
    hc: 'HO CHIEU', // hộ chiếu
    sdt: 'PHONE' // số điện thoại
  };
  pendingProcessList = [];
  typeCustomer = 'CHUNG MINH NHAN DAN';
  isCreateCIF = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private helpService: HelpsService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) { }


  ngOnInit(): void {
    this.initData();
    this.isCreateCIF = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.OPEN_CIF);
  }

  initData(): void {
    $('.parentName').html('Quản lý hồ sơ');
    $('.childName').html('Danh sách hồ sơ đang xử lý');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.condition.branchCode = this.userInfo?.branchCode;
    this.condition.inputBy = this.userInfo?.userId;
    this.userLogin = this.userInfo?.userId;
    this.getProcessList(this.condition);
    this.userLogin = JSON.parse(localStorage.getItem('userInfo')).userId;
  }
  /**
   * lựa chọn khách hàng khi tìm kiếm
   */
  selectCustomer(item: any): void {
    if (this.items.length !== 0 && this.pendingProcessList.length === 0) {
      const objCustomerInfor: any = {};
      objCustomerInfor.cif = item.CUSTOMER_NO;
      this.getProcessId(objCustomerInfor);
    }
    if (this.pendingProcessList.length !== 0) {
      if (item.statusCode === this.docStatus.SUCCESS) {
        const objCustomerInfor: any = {};
        objCustomerInfor.cif = item.customerCode;
        this.getProcessId(objCustomerInfor);
      } else {
        this.router.navigate(['./smart-form/manager/fileProcessed', item.id]);
      }
    }
  }

  closePopup(): void {
    this.isListCustomer = false;
  }
  /**
   * lấy danh sách giao dịch viên
   */
  getListGDV(condition): void {
    if (!condition) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/listGdv',
        data: condition,
        progress: false,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.processList = res.items;
            if (this.processList && this.processList !== null && this.processList.length > 0) {
              this.processList = res.items.filter(e => (e.inputBy === this.userLogin));
              this.pagination = new Pagination(res.count, this.activePage, this.pageSize);
            } else {
              this.processList = null;
            }
          }
        }
      }
    );
  }

  getProcessList(condition: CifCondition): void {
    condition.statusCode = [this.docStatus.WAIT, this.docStatus.EDIT, this.docStatus.MODIFY];
    this.getListGDV(condition);
  }
  /**
   * thay đổi tham số đầu vào
   */
  typeCustomerChange(evt): void {
    this.objTypeCustomer = {};
    this.objTypeCustomer.cif = null;
    this.objTypeCustomer.uidValue = null;
    this.objTypeCustomer.phone = null;
    this.objTypeCustomer.uidName = null;
    switch (evt) {
      case this.typeParamSearch.cif:
        this.objTypeCustomer.cif = this.valueSearch;
        break;
      case this.typeParamSearch.cmnd:
        this.objTypeCustomer.uidValue = this.valueSearch;
        this.objTypeCustomer.uidName = this.typeParamSearch.cmnd;
        break;
      case this.typeParamSearch.cccd:
        this.objTypeCustomer.uidValue = this.valueSearch;
        this.objTypeCustomer.uidName = this.typeParamSearch.cccd;
        break;
      case this.typeParamSearch.gks:
        this.objTypeCustomer.uidValue = this.valueSearch;
        this.objTypeCustomer.uidName = this.typeParamSearch.gks;
        break;
      case this.typeParamSearch.hc:
        this.objTypeCustomer.uidValue = this.valueSearch;
        this.objTypeCustomer.uidName = this.typeParamSearch.hc;
        break;
      case this.typeParamSearch.sdt:
        this.objTypeCustomer.phone = this.valueSearch;
        break;
      default:
        break;
    }
  }

  /**
   * lấy danh sách khách hàng
   */
  getListCustomer(callBack?: any): void {
    if (!this.objTypeCustomer) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerSearch/searchCustomerProcess',
        data: this.objTypeCustomer,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.items = res.items;
            setTimeout(() => {
              this.pendingProcessList = res.pendingProcessList;
              if (this.items.length === 0 && this.pendingProcessList.length === 0) {
                this.msgEmpty = 'Không có dữ liệu';
              } else {
                if (this.pendingProcessList.length !== 0) {
                  this.customers = this.pendingProcessList;
                  // tslint:disable-next-line:max-line-length
                  if (this.typeCustomer !== this.typeParamSearch.cif && this.typeCustomer !== this.typeParamSearch.sdt && this.customers[0].perDocTypeCode !== this.typeCustomer) {
                    this.customers = [];
                    this.msgEmpty = 'Không có dữ liệu';
                  }
                }
                if (this.items.length !== 0 && this.pendingProcessList.length === 0) {
                  this.customers = this.items;
                  // tslint:disable-next-line:max-line-length
                  if (this.typeCustomer !== this.typeParamSearch.cif && this.typeCustomer !== this.typeParamSearch.sdt && this.customers[0].UID_NAME !== this.typeCustomer) {
                    this.customers = [];
                    this.msgEmpty = 'Không có dữ liệu';
                  }
                }
              }
            }, 5);
          }
        }
      }
    );
  }
  /**
   * lấy processId
   */
  getProcessId(objCustomer): void {
    if (!objCustomer) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerESB/getCustomerProcess',
        data: objCustomer,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.processId = res.processId;
            this.router.navigate(['./smart-form/manager/fileProcessed', this.processId]);
          } else {
            this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          }
        }
      }
    );
  }
  /**
   * tìm kiếm thông tin khác hàng
   */
  searchCustomer(): void {
    this.customers = [];
    this.msgEmpty = '';
    this.isListCustomer = true;
    if (this.validSearchCustomer(this.valueSearch)) {
      this.typeCustomerChange(this.typeCustomer);
      this.getListCustomer();
    } else {
      this.onValueSearchChange();
    }
  }

  routerRegisterCif(): void {
    this.router.navigate(['./smart-form/registerService']);
  }
  /**
   * bắt lỗi giá trị nhập
   */
  validSearchCustomer(event: string): boolean {
    if (event === '') {
      this.errMsgSearchCustomer = 'Vui lòng nhập giá trị tìm kiếm';
      return false;
    } else {
      this.errMsgSearchCustomer = '';
    }
    return true;
  }

  openCifDialog(): void {
    const dialogRef = this.dialog.open(PopupManagerFileComponent, DialogConfig.configSearchInfoCustom());
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.router.navigate(['./smart-form/registerService']);
      }
    });
  }

  detail(processId: string): any {
    this.router.navigate(['./smart-form/manager/view', { '{processId}': processId }]);
  }

  changePageSize(size: string): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    if (this.pageSize < 0) {
      return;
    }
    this.activePage = 1;
    this.condition.page = this.activePage;
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

  // 1 CMND/ Ho Chieu; 2: Ma Cif
  onFilterChange(selection: string): void {
    if (selection === '1') {
      this.condition.code = this.valueSearch;
    } else if (selection === '2') {
      this.condition.code = this.valueSearch;
    }
  }

  onValueSearchChange(): boolean {
    this.validSearchCustomer(this.valueSearch);
    return this.valueSearchValid = this.valueSearch ? !(this.valueSearch.length > 0) : true;
  }
}
