import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Pagination} from '../../../_models/pager';
import {FormBuilder} from '@angular/forms';
import {SystemPartnerService} from '../system-partner.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {NotificationService} from '../../../_toast/notification_service';
import {MatTabChangeEvent} from '@angular/material/tabs';

declare var $: any;

@Component({
  selector: 'app-connect-ebs',
  templateUrl: './connect-ebs.component.html',
  styleUrls: ['./connect-ebs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConnectEbsComponent implements OnInit {
  branchActive: number;
  branchInActive: number;
  value = 50;
  isShowLoading = false;
  currentPag = 0;
  pagination0: Pagination = new Pagination();
  pagination1: Pagination = new Pagination();
  listsON: any;
  listsOFF: any;
  activePage0 = 1;
  pageSize0 = 10;
  activePage1 = 1;
  pageSize1 = 10;

  constructor(private fb: FormBuilder,
              private systemService: SystemPartnerService,
              private cdr: ChangeDetectorRef,
              private notificationService: NotificationService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.label();
    this.allListON();
  }

  label(): void {
    $('.parentName').html('Kết Nối');
    $('.childName').html('Kết Nối EBS');
  }

  connectConfirm(info): any {
    const popupContent = info.ebsStatus === 'ON' ? 'ngắt kết nối cho' : 'mở kết nối cho';
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Xác nhận yêu cầu',
        message: 'Bạn có muốn ' + popupContent + ' chi nhánh này không.'
      }
    });
    if (info.ebsStatus === 'ON') {
      info.ebsStatus = 'OFF';
      confirmDialog.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.isShowLoading = true;
          this.systemService.connectStatus(info).subscribe(res => {
            this.isShowLoading = false;
            if (res && res.responseStatus.success) {
              this.notificationService.showSuccess('Ngắt kết nối EBS thành công', 'Thông báo');
              this.allListON();
            }
          }, error => {
            const msgToast = info.ebsStatus === 'ON' ? 'Mở kết nối EBS thất bại' : 'Ngắt kết nối EBS thất bại';
            this.notificationService.showError(msgToast, 'Thông báo');
            this.isShowLoading = false;
          });
        } else {
          this.allListON();
        }
      });
    } else if (info.ebsStatus === 'OFF') {
      info.ebsStatus = 'ON';
      confirmDialog.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.isShowLoading = true;
          this.systemService.connectStatus(info).subscribe(res => {
            this.isShowLoading = false;
            if (res && res.responseStatus.success) {
              this.notificationService.showSuccess('Mở kết nối EBS thành công', 'Thông báo');
              this.allListOFF();
            }
          }, error => {
            const msgToast = info.ebsStatus === 'ON' ? 'Mở kết nối EBS thất bại' : 'Ngắt kết nối EBS thất bại';
            this.notificationService.showError(msgToast, 'Thông báo');
            this.isShowLoading = false;
          });
        } else {
          this.allListOFF();
        }
      });
    }
  }

  disconnectAll(): any {
    const body = {
      branchCode: '',
      ebsStatus: 'OFF'
    };
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Xác nhận yêu cầu',
        message: 'Bạn chắc chắn ngắt kết nối tất cả chi nhánh?'
      }
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.isShowLoading = true;
        this.systemService.connectStatus(body).subscribe(res => {
          this.isShowLoading = false;
          if (res && res.responseStatus.success) {
            if (this.currentPag === 0) {
              this.allListON();
            } else {
              this.allListOFF();
            }
            this.notificationService.showSuccess('Ngắt kết nối EBS thành công', 'Thông báo');
          }
        }, error => {
          this.isShowLoading = false;
        });
      }
    });
  }

  connectAll(): any {
    const body = {
      branchCode: '',
      ebsStatus: 'ON'
    };
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Xác nhận yêu cầu',
        message: 'Bạn chắc chắn kết nối tất cả chi nhánh?'
      }
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.isShowLoading = true;
        this.systemService.connectStatus(body).subscribe(res => {
          this.isShowLoading = false;
          if (res && res.responseStatus.success) {
            if (this.currentPag === 0) {
              this.allListON();
            } else {
              this.allListOFF();
            }
            this.notificationService.showSuccess('Mở kết nối EBS thành công', 'Thông báo');
          }
        });
      }
    });
  }

  tabChanged(ev?: MatTabChangeEvent): void {
    this.currentPag = ev.index;
    if (ev.index === 0) {
      this.allListON();
    } else {
      this.allListOFF();
    }
  }

  allListON(): void {
    const body = {
      page: this.activePage0,
      size: this.pageSize0,
      branchCode: '',
      ebsStatus: 'ON'
    };
    this.isShowLoading = true;
    this.systemService.listBranches(body).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success && res.items) {
        this.branchActive = res.count.countOn;
        this.branchInActive = res.count.countOff;
        this.listsON = res.items;
        this.pagination0 = new Pagination(res.count.countOn, this.activePage0, this.pageSize0);
      } else {
        this.listsON = [];
      }
      this.cdr.detectChanges();
    }, error => {
      this.isShowLoading = false;
    });
  }

  allListOFF(): void {
    const body = {
      page: this.activePage1,
      size: this.pageSize1,
      branchCode: '',
      ebsStatus: 'OFF'
    };
    this.isShowLoading = true;
    this.systemService.listBranches(body).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success && res.items) {
        this.branchActive = res.count.countOn;
        this.branchInActive = res.count.countOff;
        this.listsOFF = res.items;
        this.pagination1 = new Pagination(res.count.countOff, this.activePage1, this.pageSize1);
      } else {
        this.listsOFF = [];
      }
      this.cdr.detectChanges();
    }, error => {
      this.isShowLoading = false;
    });
  }

  setPage0(pageNumber: any): void {
    if (pageNumber < 1 || pageNumber > this.pagination0.pager.totalPages) {
      return;
    } else {
      this.activePage0 = pageNumber;
      this.allListON();
    }
  }

  changePageSize0(pageSize: number): void {
    if (this.pageSize0 < 0) {
      return;
    }
    this.activePage0 = 1;
    this.pageSize0 = pageSize;
    this.allListON();
  }

  setPage1(pageNumber: any): void {
    if (pageNumber < 1 || pageNumber > this.pagination1.pager.totalPages) {
      return;
    } else {
      this.activePage1 = pageNumber;
      this.allListOFF();
    }
  }

  changePageSize1(pageSize: number): void {
    if (this.pageSize1 < 0) {
      return;
    }
    this.activePage1 = 1;
    this.pageSize1 = pageSize;
    this.allListOFF();
  }

}
