import { IError } from 'src/app/system-configuration/shared/models/error.model';
import { CustomNotificationService } from '../../../../shared/services/custom-notification.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { PaymentInfoComponent } from '../../shared/components/payment-info/payment-info.component';
import { ITranDetail, ITransaction } from '../../shared/models/tuition.interface';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { TuitionService } from '../../shared/services/tuition.service';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import { COLUMNS_ACCOUNTING, COLUMNS_BILLS, COLUMNS_TRANDETAIL } from '../../shared/constants/tuition.constant';
import {isGDV, isHoiSo, isKSV} from 'src/app/shared/utilites/role-check';
import { FileService } from 'src/app/shared/services/file.service';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { Console } from 'console';
import { FormMessageComponent } from '../../shared/components/form-message/form-message.component';
declare var $: any;

type HiddenButton = {
  actionCode: string;
  hiddenType: 'disable' | 'none';
};

@Component({
  selector: 'app-tuition-view-transaction',
  templateUrl: './tuition-view-transaction.component.html',
  styleUrls: ['./tuition-view-transaction.component.scss'],
  providers: [DestroyService]
})
export class TuitionViewTransactionComponent implements OnInit, OnDestroy {
  @Input() idTrans?: string;
  rootData: ITransaction;
  isLoading = false;
  id: string = '';
  value = 50;
  mode = 'indeterminate';
  color = 'primary';
  type = "";
  //
  dataSource: any[] = [];
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true
  };

  columns = COLUMNS_TRANDETAIL;

  dataSource2: any[] = [];
  columns2 = COLUMNS_ACCOUNTING;
  title = '';
  //
  @ViewChild("paymentInfo") paymentInfo: PaymentInfoComponent;

  role: 'KSV' | 'GDV' = 'GDV';
  hiddenButtons: HiddenButton[] = [];

  actions: ActionModel[] = [];
  //
  constructor(public matdialog: MatDialog, private handleErrorService: HandleErrorService,
    private tuitionService: TuitionService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private destroy$: DestroyService, private notifiService: CustomNotificationService, private fileService: FileService
  ) { 

    this.role = isKSV() ? 'KSV' : 'GDV';
  }

  ngOnInit() {

    this.setInit();
    $('.parentName').html('Nộp học phí');
    $('.childName').html('Thanh toán tại quầy / Xem chi tiết giao dịch');
  
  }

  ngOnChanges(): void {
    if (this.idTrans) {
      this.tuitionService.getTransactionByID(this.idTrans).subscribe((res) => {
        if (res.data) {
          this.rootData = res.data;
          this.handleData();
        }
      })
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("tuitionDataRowid");
  }

  ngAfterViewInit() {
    console.log('after init');
    let id = this.route.snapshot.queryParamMap.get("id");   
    
    if (!id) {
      id = sessionStorage.getItem("tuitionDataRowid");      
    }
    this.tuitionService.getTransactionByID(id).subscribe(
      (res) => {
        if (res && res.data && !res.meta.message) {
            this.setHiddenButton(this.rootData['tranPostResponses'][0].accountingStatusCode);
        }
      },
      (error) => {
      }
    );

  }
 


   setInit() {

    let id = this.route.snapshot.queryParamMap.get("id");
    let status = this.route.snapshot.queryParamMap.get("status");    
    
    console.log('status');
    console.log(id);

    if(status === 'IN_PROCESS')
    {
           let hdButtonCheck : HiddenButton = {
                  'actionCode': 'TUITION_SERVICE_FOOTER_ACTION_EDIT',
                  'hiddenType': 'disable'
           }
           this.hiddenButtons.push(hdButtonCheck);        

    }
    else
    {
      console.log('status');
      console.log(status);
          let hdButtonCheck : HiddenButton = {
            'actionCode': 'TUITION_SERVICE_FOOTER_ACTION_REJECT',
            'hiddenType': 'disable'
          }
         this.hiddenButtons.push(hdButtonCheck);        

          hdButtonCheck = {
          'actionCode': 'TUITION_SERVICE_FOOTER_ACTION_APPROVE',
          'hiddenType': 'disable'
        }
        this.hiddenButtons.push(hdButtonCheck);   

        if(status !== 'TIMEOUT')
        {
          hdButtonCheck = {
            'actionCode': 'TUITION_SERVICE_FOOTER_ACTION_EDIT',
            'hiddenType': 'disable'
          }
          this.hiddenButtons.push(hdButtonCheck);
        }
    }


    if (!id) {
      id = sessionStorage.getItem("tuitionDataRowid");      
    }
    
    this.isLoading = true;
    this.id = id;
     this.tuitionService.getTransactionByID(id).pipe().subscribe( res => {
      this.rootData = res["data"]; 
      this.handleData();   
    });
    this.isLoading = false;
  }

  setHiddenButton(status : string) {
    console.log('hidden');
      console.log(status);
      // console.log(this.rootData['tranPostResponses'][0].accountingStatusCode);
      
      //   if(this.rootData['tranPostResponses'][0].accountingStatusCode === 'TIMEOUT')
      //   {
      //    console.log('ok');
      //     let hdButtonCheck : HiddenButton = {
      //            'actionCode': FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT,
      //            'hiddenType': 'disable'
      //     }
      //     this.hiddenButtons.push(hdButtonCheck);
      //   }
      this.hiddenButtons.forEach((item) => {
        if(item.actionCode === FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT)    
        {
          item.hiddenType = 'none';
        }   
  })
     
       
  }

  handleData() {
    this.handleActions(this.rootData);

    
    let dataSource = this.rootData["tranDetailResponses"];
    let dataSource2 = this.rootData["tranPostResponses"];

    this.dataSource = dataSource.map(x => {
      return { ...x, transNo: this.rootData.transNo}
    })

    this.dataSource2 = dataSource2.map(x => {
      return { ...x, className: '', transNo: this.rootData.transNo, accountingStatusName: this.rootData.statusName + ':'+ x.accountingStatusName  }
    })

    setTimeout(() => {
      this.paymentInfo.setValueForm(this.rootData, "view");
    });
  }

   handleActions(transaction: ITransaction ) {
     this.title = 'Chi tiết giao dịch';
     this.setHiddenButton(transaction['tranPostResponses'][0].accountingStatusCode);
     if (isGDV() || !this.id) {
       this.actions = [
         // {
         //   actionName: "In phiếu thu tiền",
         //   actionIcon: "print",
         //   actionClick: () => this.printReceiptVoucher()
         // },
         {
           actionName: "In phiếu hạch toán",
           actionIcon: "print",
           actionClick: () => this.printAccountingNote()
         },
       ]
       if (this.rootData.paymentType === "CP03" || this.rootData.paymentType === "CP04") {
         this.actions.push({
           actionName: "In giấy báo nợ",
           actionIcon: "print",
           actionClick: () => this.onPrintGBN()
         })
       }
       return;
     }
     console.log('check duyet');
     console.log(isKSV());
     console.log(transaction.statusCode);
     console.log(transaction.accountingStatusCode);

     if (isKSV() && transaction.statusCode === 'IN_PROCESS' && transaction.accountingStatusCode === 'IN_PROCESS' && this.id) {
       console.log('add duyet');
       this.actions = [
         {
           actionName: "Duyệt giao dịch",
           actionIcon: "check",
           hiddenType: isHoiSo() ? 'disable' : 'none',
           actionClick: () => this.onConfirmApprove()
         },
         {
           actionName: "Từ chối duyệt",
           actionIcon: "cancel",
           hiddenType: isHoiSo() ? 'disable' : 'none',
           actionClick: () => this.onConfirmRejectApprove()
         },
       ]
     } else if (transaction.statusCode === 'APPROVE' && transaction.accountingStatusCode === 'TIMEOUT' && this.id) {
       this.title = 'Kiểm tra giao dịch nghi ngờ';
       this.actions = [
         {
           actionName: "Kiểm tra trạng thái",
           actionIcon: "help",
           actionClick: () => this.onCheckStatusTrans()
         },
       ]
     } else {
       this.actions = []
     }
   }

   onPrintPHT() {
    this.printAccountingNote();
  }

  onPrintGBN() {
    if (this.rootData.paymentType === "CP03" || this.rootData.paymentType === "CP04") {
    this.printDebitNote();
    }
    else{
      this.notifiService.warning('Warning', 'Không in giấy báo nợ với loại thanh toán '+this.rootData.paymentType);
    }
  }

  printReceiptVoucher() {
    let id = this.rootData.id;
    this.fileService.downloadFileMethodGet(`tuition-service/report/bill/${id}`);
  }

  printDebitNote() {
    let id = this.rootData.id;
    this.fileService.downloadFileMethodGet(`tuition-service/report/debt/${id}`);
  }

  printAccountingNote() {
    let id = this.rootData.id;
    this.fileService.downloadFileMethodGet(`tuition-service/report/tranPost/${id}`);
  }

  otherTransaction() {
    this.router.navigate(["/tuition-service/create"]);
  }

  onConfirmApprove() {
    console.log('confirm  duyet');

    if(this.rootData['htStatusCode'] !== 'IN_PROCESS')
    {
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: { title: 'Xác nhận', message: `Xác nhận duyệt hóa đơn. Bạn có muốn tiếp tục?`, },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const req = {
          confirmRequests: [
            {
              transactionId: this.rootData.id,
              lastModifiedDate: this.rootData.lastModifiedDate,
            },
          ],
        };
        this.tuitionService
          .approveTransactions(req)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                const statusTrans = res.data.approves[0];
                if (statusTrans.htStatus !== 'SUCCESS') {
                  this.notifiService.error('Lỗi', statusTrans.message);
                } else {
                  //this.notifiService.success('Thông báo', 'Duyệt giao dịch thành công');
                  this.openMessageApproveSuccess();
                }
                this.setInit()
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  openMessageApproveSuccess() {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'ok',
        text: 'Duyệt giao dịch thành công !',
        title: 'Thành công'       
      },
      position: { top: '0px', right: '0px' },
    });

     dialog.afterClosed().subscribe((res) => { 
       if (res) {       
         this.router.navigate(['/tuition-service/approve-pay-tuition']);
       }
     });
  }

  onConfirmRejectApprove() {
    console.log('reject');
    if(this.rootData['htStatusCode'] !== 'IN_PROCESS')
    {
      return;
    }
    if (this.isLoading) return;
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận từ chối duyệt hóa đơn. Bạn có muốn tiếp tục?`,
        isReject: true,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const req = {
          rejectTransList: [
            {
              transactionId: this.rootData.id,
              lastModifiedDate: this.rootData.lastModifiedDate,
            },
          ],
          reason: confirm
        };
        this.tuitionService
          .rejectTransactions(req)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                const statusTrans = res.data.rejectTransList[0];

                if (!statusTrans.reject) {
                  this.notifiService.error('Lỗi', statusTrans.message);
                } else {
                  // this.notifiService.success(
                  //   'Thông báo',
                  //   'Từ chối duyệt giao dịch thành công'
                  // );
                  this.openMessageRejectSuccess();
                }
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  openMessageRejectSuccess() {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'ok',
        text: 'Từ chối duyệt giao dịch thành công !',
        title: 'Thành công'       
      },
      position: { top: '0px', right: '0px' },
    });

     dialog.afterClosed().subscribe((res) => { 
       if (res) {       
         this.router.navigate(['/tuition-service/approve-pay-tuition']);
       }
     });
  }

  checkGDTimeOut() {
    if(this.rootData['htStatusCode'] !== 'TIMEOUT')
    {
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: { title: 'Xác nhận', message: `Xác nhận kiểm tra giao dịch nghi ngờ. Bạn có muốn tiếp tục?`, },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const req = {          
              transactionId: this.rootData.id             
        };
         this.tuitionService
           .checkTransactions(req)
           .pipe(
             finalize(() => (this.isLoading = false)),
             takeUntil(this.destroy$)
           )
           .subscribe(
             (res) => {
               if (res.data) {              
          
                   if(res.data.coreRefNo !== 'FALSE')
                   {
                      this.notifiService.success('Thông báo', 'Giao dịch hạch toán thành công');
                      this.setInit();
                   }
                   else                   
                   {
                     this.setInit();
                     this.reTryGD();
                   }                 
                                 
               }
             },
             (error: IError) => this.checkError(error)
           );
      } else {
        this.isLoading = false;
      }
    });
  }

  reTryGD() {
    console.log('confirm  reTryGD');

    if(!this.rootData.retryNum && this.rootData.retryNum > 0)
    {
      this.notifiService.success('Thông báo', 'Giao dịch hạch toán thất bại.');
    }

    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: { title: 'Xác nhận', message: `Giao dịch hạch toán thất bại. Bạn có muốn thực hiện retry giao dịch không?`, },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const req = {          
              transactionId: this.rootData.id             
        };
         this.tuitionService
           .retyTransactions(req)
           .pipe(
             finalize(() => (this.isLoading = false)),
             takeUntil(this.destroy$)
           )
           .subscribe(
             (res) => {
               if (res.data) {               
                
                   if(res.data.coreRefNo !== 'FALSE')
                   {
                      //this.notifiService.success('Thông báo', 'Giao dịch hạch toán thành công');
                      this.setInit();
                      this.openMessageRetrySuccess();
                   }
                   else                   
                   {
                    this.notifiService.warning('Thông báo', 'Retry giao dịch không thành công, lỗi: '+res.data.errorDesc);
                    this.setInit();
                   }                 
                                 
               }
             },
             (error: IError) => this.checkError(error)
           );
      } else {
        // this.isLoading = false;
      }
    });
  }

  openMessageRetrySuccess() {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'ok',
        text: 'Giao dịch hạch toán thành công !',
        title: 'Thành công'       
      },
      position: { top: '0px', right: '0px' },
    });

     dialog.afterClosed().subscribe((res) => { 
       if (res) {       
         this.router.navigate(['/tuition-service/approve-pay-tuition']);
       }
     });
  }

  onCheckStatusTrans(): void {
    const body = {
      id: this.rootData.id,
    };
    this.tuitionService
      .checkStatusTran(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (res) => {
          if (res.data) {
            this.notifiService.warning('Thông báo', res.data.message)
            this.setInit();
          }
        },
        (error: IError) => this.checkError(error)
      );
  }

  checkError(error: IError) {
    if (error.code) {
      this.notifiService.error('Lỗi', error.message)
    } else {
      this.notifiService.error('Lỗi', 'Lỗi hệ thống, vui lòng thử lại sau!')
    }

  }

  // onApprove() {
  //   onConfirmApprove() {

  // } 
}
