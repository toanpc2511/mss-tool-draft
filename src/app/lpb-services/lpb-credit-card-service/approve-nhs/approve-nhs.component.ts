import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {HIDE_SHOW_TABLE} from '../shared/constants/credit-card-table';
import {compareDate} from '../../../shared/constants/utils';
import * as moment from 'moment/moment';
import {ActionModel} from '../../../shared/models/ActionModel';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditCardService} from '../shared/services/credit-card-issue.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {MatDialog} from '@angular/material/dialog';
import {IError} from '../../../system-configuration/shared/models/error.model';
import {UserDetails} from '../shared/models/credit-card';
import {DetailsComponent} from '../details/details.component';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ultis} from '../../../shared/utilites/function';
import {Pagination} from '../../../_models/pager';
declare var $: any;

@Component({
  selector: 'app-approve-nhs',
  templateUrl: './approve-nhs.component.html',
  styleUrls: ['./approve-nhs.component.scss']
})
export class ApproveNhsComponent implements OnInit {
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  allComplete = false;
  tickTB = HIDE_SHOW_TABLE;
  defaultColumn = true;
  allTick = false;
  tabAction: number;
  formSearch: FormGroup;
  validRecords: UserDetails[] = [];
  invalidRecords: UserDetails[] = [];
  isModify = false;
  note = '';
  listToSend = {ids: [], modifyNote: null};
  userInfo: any;
  pagination1: Pagination = new Pagination();
  pageIndex1 = 1;
  pageSize1 = 10;
  pagination2: Pagination = new Pagination();
  pageIndex2 = 1;
  pageSize2 = 10;
  actions: ActionModel[] = [
    {
      actionIcon: 'send',
      actionName: 'Duyệt',
      hiddenType: 'disable',
      actionClick: () => this.approve(),
    },
    {
      actionIcon: 'add',
      actionName: 'Y/C Bổ sung',
      hiddenType: 'disable',
      actionClick: () => this.openModal(),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private creditCardService: CreditCardService,
    private notify: CustomNotificationService,
    private dialog: MatDialog
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.formSearch = this.fb.group(
      {
        productCode: [''],
        branchCode: [''],
        customerCode: [''],
        issueValue: [''],
        limitAmount: ['']
      }
    );
  }

  ngOnInit(): void {
    $('.parentName').html('Thẻ tín dụng');
    $('.childName').html('Duyệt đăng ký phát hành thẻ tín dụng');
    this.firstLook();
    this.setDefaultDate();
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  setDefaultDate(): void {
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateFrom.setValue(ultis.dateToString(curDate));
      this.dpDateTo.setValue(ultis.dateToString(curDate));
    });
  }

  getFromDate(): any {
    this.dpDateFrom.getValue();
    this.dpDateFrom.focus();
  }

  getToDate(): any {
    this.dpDateTo.getValue();
    this.dpDateTo.focus();
  }

  dateToChanged(): any {
    this.validateToDate();
    this.validateFromDate();
  }

  dateFromChanged(): any {
    this.validateFromDate();
    this.validateToDate();
  }

  validateFromDate(): void{
    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    }
    else if (!this.dpDateFrom.haveValue()) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    }
    else {
      this.dpDateFrom.setErrorMsg('');
    }
  }

  validateToDate(): void {
    if (this.dpDateTo.haveValue() && !this.dpDateTo.isValid) {
      this.dpDateTo.setErrorMsg('Đến ngày không hợp lệ');
    }
    else if (!this.dpDateTo.haveValue()) {
      return this.dpDateTo.setErrorMsg('Đến ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    }
    else {
      this.dpDateTo.setErrorMsg('');
    }
  }

  limitDate(): void {
    const dateFrom = moment(this.dpDateFrom.getValue(), 'DD.MM.YYYY');
    const dateTo = moment(this.dpDateTo.getValue(), 'DD.MM.YYYY');
    const distance = dateTo.diff(dateFrom, 'months');
    if (distance >= 3) {
      this.dpDateFrom.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
      this.dpDateTo.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
    }
  }

  updateAllComplete(): void {
    this.allComplete = this.tickTB != null && this.tickTB.every(t => t.ticked);
  }

  someComplete(): boolean {
    if (this.tickTB == null) {
      return false;
    }
    return this.tickTB.filter(t => t.ticked).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean): void {
    this.allComplete = completed;
    this.defaultColumn = completed;
    if (this.tickTB == null) {
      return;
    }
    this.tickTB.forEach(t => (t.ticked = completed));
  }

  // hiển thị cột ban đầu
  firstLook(): void {
    this.tickTB.forEach(t => {
      if (t.default) {
        t.ticked = true;
      }
    });
  }

  viewDefault(completed: boolean): void {
    // this.allComplete = true;
    // reset lại nếu như checkbox đã đc tick & tick về mặc định
    this.tickTB.forEach(e => (e.ticked = false));
    this.tickTB.forEach(e => {
      if (e.default === true) {
        e.ticked = completed;
        this.allComplete = false;
      }
    });
  }
  // ----------------------------------------------
  updateAllTick(): void {
    this.allTick = this.validRecords != null && this.validRecords.every(e => e.completed);
    this.enableSendBtn();
  }
  someTick(): boolean {
    if (this.validRecords == null) {
      return false;
    }
    return this.validRecords.filter(e => e.completed).length > 0 && !this.allTick;
  }

  setTickAll(completed: boolean, event?: MatCheckboxChange): void {
    this.allTick = completed;
    if (this.validRecords == null) {
      return;
    }
    this.listToSend.ids = [];
    // this.validRecords.forEach(e => (e.completed = completed));
    this.validRecords.forEach(e => {
      e.completed = completed;
      if (event.checked) {
        this.listToSend.ids.push(e.id);
      } else {
        this.listToSend.ids = [];
      }
    });
    this.enableSendBtn();
  }

  handleChange(event: MatCheckboxChange, id: any): any {
    if (event.checked) {
      this.listToSend.ids.push(id);
    } else {
      const index = this.listToSend.ids.indexOf(id);
      if (index > -1) {
        this.listToSend.ids.splice(index, 1);
      }
    }
  }
  openModal(): void {
    this.isModify = true;
  }

  approve(): void {
    delete this.listToSend.modifyNote;
    this.creditCardService.approveLv2(this.listToSend).subscribe(res => {
      if (res) {
        this.notify.success('Thông báo', 'Đã gửi yêu cầu bổ sung');
        this.search();
      }
    }, (error: IError) => this.checkError(error));
  }

  hiddenFooter(event): void {
    this.tabAction = event;
  }

  search(): void {
    this.formSearch.markAllAsTouched();
    this.validateFromDate();
    this.validateToDate();
    if (this.formSearch.invalid) {
      return;
    }
    const frmValue = this.formSearch.getRawValue();
    const request = {
      branchCode: frmValue.branchCode,
      customerCode: frmValue.customerCode,
      issueValue: frmValue.issueValue,
      productCode: frmValue.productCode,
      fromDate: moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00',
      toDate: moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59',
      limitAmount: frmValue.limitAmount,
      screenTypeSearch: 'NHS',
    };
    for (const [key, value] of Object.entries(request)) {
      if (value === '' || value === null) {
        delete request[key];
      }
    }

    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.validRecords = [];
      this.invalidRecords = [];

      this.creditCardService.findAllRecords(request).subscribe(res => {
        if (res) {
          for ( const item of res.data) {
            if ( item.statusLos === '1') {
              this.validRecords.push(item);
            } else {
              this.invalidRecords.push(item);
            }
          }
          this.itemsTab1(this.validRecords);
          this.itemsTab2(this.invalidRecords);
        }
      }, (error: IError) => this.checkError(error));
    }
  }
  modifyRequest(): void {
    this.listToSend.modifyNote = this.note.trim();
    this.creditCardService.sendModify(this.listToSend).subscribe(res => {
      if (res) {
        this.isModify = false;
        this.notify.success('Thông báo', 'Đã gửi yêu cầu bổ sung');
        this.search();
      }
    }, (error: IError) => this.checkError(error));

  }

  checkError(error: IError): void {
    if (error.message) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  seeDetails(item?: any, isValid?: boolean): void {
    const recordDetails = this.dialog.open(DetailsComponent,
      {
        data: [[item], isValid, 'NHS']
      });
    recordDetails.afterClosed().subscribe((res) => {
      if (res.events === 'Approved') {
        this.search();
      }
    });
  }
  enableSendBtn(): void{
    if ( this.validRecords.filter(e => e.completed).length > 0) {
      this.actions[0].hiddenType = 'none';
      this.actions[1].hiddenType = 'none';
    } else {
      this.actions[0].hiddenType = 'disable';
      this.actions[1].hiddenType = 'disable';
    }
  }

  exportToExcel(nameTable: string): void {
    switch (nameTable) {
      case 'table-valid': {
        if (this.validRecords.length > 0) {
          this.convertToExcel(nameTable);
        }else {
          this.notify.warning('Thông báo', 'Không có bản ghi có dữ liệu');
        }
        break;
      }
      case 'table-invalid': {
        if (this.invalidRecords.length > 0) {
          this.convertToExcel(nameTable);
        } else {
          this.notify.warning('Thông báo', 'Không có bản ghi có dữ liệu');
        }
        break;
      }
    }
  }

  convertToExcel(idTable: string): void {
      const table = document.getElementById(idTable);
      const rows = table.getElementsByTagName('tr');
      const data = [];

      // Lấy dữ liệu từ bảng
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cells = rows[i].getElementsByTagName('td');
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < cells.length; j++) {
          row.push(cells[j].textContent);
        }
        data.push(row);
      }

      // Tạo chuỗi XML
      let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xmlContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
      xmlContent += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
      xmlContent += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
      xmlContent += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
      xmlContent += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n'; // thay thế https://www.w3.org/TR/html40/
      xmlContent += ' <Worksheet ss:Name="Sheet1">\n';
      xmlContent += '  <Table>\n';

      // => lấy nội dung hàng hàng tiêu đề
      xmlContent += '   <Row>\n';
      const headers = rows[0].getElementsByTagName('th');
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < headers.length; k++) {
        xmlContent += `    <Cell><Data ss:Type="String">${headers[k].textContent}</Data></Cell>\n`;
      }
      xmlContent += '   </Row>\n';

      // Thêm dữ liệu từ bảng
      for (let i = 1; i < rows.length; i++) {
        xmlContent += '   <Row>\n';
        const cells = rows[i].getElementsByTagName('td');
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < cells.length; j++) {
          xmlContent += `    <Cell><Data ss:Type="String">${cells[j].textContent}</Data></Cell>\n`;
        }
        xmlContent += '   </Row>\n';
      }

      xmlContent += '  </Table>\n';
      xmlContent += ' </Worksheet>\n';
      xmlContent += '</Workbook>\n';

      // Tạo và tải file Excel
      function downloadExcelFile(content: string, filename: string): any {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

      downloadExcelFile(xmlContent, 'data.xls');
      this.notify.success('Thông báo', 'Tải xuống thành công');
  }

  /**
   * TAB HỢP LỆ
   */
  changePageSize1(pageSize: number): void {
    if (this.pageSize1 < 0) {
      return;
    }
    this.pageIndex1 = 1;
    this.pageSize1 = pageSize;
    this.search();
  }
  setPage1(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination1.pager.totalPages) {
      return;
    }
    this.pageIndex1 = pageIndex;
    this.search();
  }
  itemsTab1(data: UserDetails[]): void{
    this.pagination1 = new Pagination(data.length, this.pageIndex1, this.pageSize1);
    const pager = this.pagination1.getPager(data.length, this.pageIndex1, this.pageSize1);

    if (this.pageIndex1 >= 2) {
      this.validRecords = data.slice(pager.startIndex, pager.startIndex + Number(this.pageSize1));
    } else {
      this.validRecords = data.slice(pager.startIndex, pager.endIndex + 1);
    }
    this.pageIndex1 = 1;
  }

  /**
   * TAB KHÔNG HỢP LỆ
   */
  changePageSize2(pageSize: number): void {
    if (this.pageSize2 < 0) {
      return;
    }
    this.pageIndex2 = 1;
    this.pageSize2 = pageSize;
    this.search();
  }
  setPage2(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination2.pager.totalPages) {
      return;
    }
    this.pageIndex2 = pageIndex;
    this.search();
  }
  itemsTab2(data: UserDetails[]): void{
    this.pagination2 = new Pagination(data.length, this.pageIndex2, this.pageSize2);
    const pager = this.pagination2.getPager(data.length, this.pageIndex2, this.pageSize2);

    if (this.pageIndex2 >= 2) {
      this.invalidRecords = data.slice(pager.startIndex, pager.startIndex + Number(this.pageSize2));
    } else {
      this.invalidRecords = data.slice(pager.startIndex, pager.endIndex + 1);
    }
    this.pageIndex2 = 1;
  }
}
