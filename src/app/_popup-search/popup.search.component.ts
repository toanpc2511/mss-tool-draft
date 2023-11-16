import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../_models/customer/Customer';
import { DatePipe } from '@angular/common';
import { Process } from '../_models/process';
import { Pagination } from '../_models/pager';
import { ProcessService } from '../_services/process.service';
import { Router } from '@angular/router';
import { MissionService } from '../services/mission.service';
import { Subscription } from 'rxjs';
import { SpinnerOverlayService } from '../_services/spinner-overlay.service';
import { finalize } from 'rxjs/operators';
import { GlobalConstant } from '../_utils/GlobalConstant';
import { CoOwnerAccountService } from '../_services/co-owner-account.service';

@Component({
  selector: 'app-popup-search',
  templateUrl: './popup.search.component.html',
  styleUrls: ['./popup.search.component.scss']
})
export class PopupSearchComponent implements OnInit {
  showCLose: boolean;
  customers: Customer[] = [];
  isSearchCif = false;
  isSearchCoOwner = false;
  accountId = false;
  processId = false;
  isKSV: boolean;
  isGDV: boolean;
  displayProgressSpinnerInBlock: boolean;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  roleLogin: any = [];
  errorMessage = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PopupSearchComponent>,
    private datepipe: DatePipe,
    private cifService: ProcessService,
    private router: Router,
    private readonly spinnerOverlayService: SpinnerOverlayService,
    private coOwnerAccountService: CoOwnerAccountService,
  ) {
  }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    const spinnerSubscription: Subscription = this.spinnerOverlayService.spinner$.subscribe();
    let customerCode = this.data.data.data.customerCode;
    let customerType = this.data.data.data.type;
    let cif = '';
    let phone = '';
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
      // console.log(i);
    }
    if (customerType === GlobalConstant.CUSTOMER_TYPE.CIF) {
      cif = customerCode;
      customerCode = '';
      customerType = '';
    } else if (customerType === GlobalConstant.CUSTOMER_TYPE.PHONE) {
      phone = customerCode;
      cif = '';
      customerCode = '';
      customerType = '';
    }
    this.showCLose = this.data.data != null;
    this.isSearchCif = this.data.data.data.isSearchCif;
    this.isSearchCoOwner = this.data.data.data.isSearchCoOwner;
    // this.coOwnerId = this.data.data.data.coOwnerId;
    this.processId = this.data.data.data.processId;
    this.accountId = this.data.data.data.accountId;
    this.cifService.findCif(customerCode, customerType, cif, phone).pipe(finalize(() => spinnerSubscription.unsubscribe())).subscribe(
      data => {
        // console.log('userInfo', data);
        // this.customers = data;
        if (data.pendingProcessList?.length > 0) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          // console.log('userInfo.userName', userInfo.userName);
          // console.log('data.pendingProcessList[0].inputByUserName', data.pendingProcessList[0].inputByUserName);
          if (userInfo.userName === data.pendingProcessList[0].inputByUserName) {
            // console.log('userInfo', localStorage.getItem('userInfo'));
            this.cifService.detailProcess(data.pendingProcessList[0].id).subscribe(res => {
              // console.log('datatest', res.item);
              this.customers.push({
                id: '1',
                customerCode: res.item.customerCode,
                decisionNo: res.item.decisionNo,
                processId: res.item.id,
                fullName: res.item.customer.person.fullName,
                perDocTypeCode: res.item.customer.person.perDocNoList[0].perDocTypeCode,
                // taxCode: res.item.customer.persone.taxCode,
                identifyNumber: res.item.customer.person.perDocNoList[0].perDocNo,
                identifyDate: res.item.customer.person.perDocNoList[0].issueDate,
                identifyAddress: res.item.customer.person.perDocNoList[0].issuePlace,
                dateOfBirth: res.item.customer.person.dateOfBirth,
                branch: userInfo.branchName,
                gender: res.item.customer.person.genderName,
                nationality: 'VN',
                phoneNumber: res.item.customer.person.mobileNo
              });
              // if (data.item) {
              //   this.process.item = data.item;
              //   if (data.item.customer.person.fatcaCode != null) {
              //     this.showContentFATCA = true;
              //   }
              //   if (data.item.customer.person.nationality2Name != null) {
              //     this.shownationality2Name = true;
              //   }
              //   if (data.item.customer.person.nationality3Name != null) {
              //     this.shownationality3Name = true;
              //   }
              //   if (data.item.customer.person.nationality4Name != null) {
              //     this.shownationality4Name = true;
              //   }
              // }
              // console.log('this.process.item', this.process.item);

            }, error => {
              // this.errorHandler.showError(error);
            }, () => {
              // this.dialogRef.close();
            });
            // this.router.navigate(['./smart-form/manager/fileProcessed', ]);
            // this.dialogRef.close();
          } else {
            if (this.isSearchCif) {
              this.errorMessage = 'Hồ sơ này đang được giao dịch viên khác xử lý';
            } else {
              this.cifService.detailProcess(data.pendingProcessList[0].id).subscribe(res => {
                // console.log('datatest', res.item);
                this.customers.push({
                  id: '1',
                  customerCode: res.item.customerCode,
                  decisionNo: res.item.decisionNo,
                  processId: res.item.id,
                  fullName: res.item.customer.person.fullName,
                  perDocTypeCode: res.item.customer.person.perDocNoList[0].perDocTypeCode,
                  // taxCode: res.item.customer.persone.taxCode,
                  identifyNumber: res.item.customer.person.perDocNoList[0].perDocNo,
                  identifyDate: res.item.customer.person.perDocNoList[0].issueDate,
                  identifyAddress: res.item.customer.person.perDocNoList[0].issuePlace,
                  dateOfBirth: res.item.customer.person.dateOfBirth,
                  branch: userInfo.branchName,
                  gender: res.item.customer.person.genderName,
                  nationality: 'VN',
                  phoneNumber: res.item.customer.person.mobileNo
                });
                // if (data.item) {
                //   this.process.item = data.item;
                //   if (data.item.customer.person.fatcaCode != null) {
                //     this.showContentFATCA = true;
                //   }
                //   if (data.item.customer.person.nationality2Name != null) {
                //     this.shownationality2Name = true;
                //   }
                //   if (data.item.customer.person.nationality3Name != null) {
                //     this.shownationality3Name = true;
                //   }
                //   if (data.item.customer.person.nationality4Name != null) {
                //     this.shownationality4Name = true;
                //   }
                // }
                // console.log('this.process.item', this.process.item);

              }, error => {
                // this.errorHandler.showError(error);
              }, () => {
                // this.dialogRef.close();
              });
            }
          }
        } else {
          if (data.items?.length > 0) {
            // console.log(data.items);
            data.items.forEach((item) => {
              // console.log(item);
              this.customers.push({
                id: '1',
                customerCode: item.CUSTOMER_NO,
                decisionNo: item.DECISION_NO,
                processId: item.PROCESS_ID,
                fullName: item.FULL_NAME,
                perDocTypeCode: item.UID_NAME,
                identifyNumber: item.UID_VALUE,
                // taxCode: item.TAXCODE,
                identifyDate: item.NGAY_CAP,
                dateOfBirth: item.DATEOFBIRTH,
                identifyAddress: item.NOI_CAP,
                branch: item.BRANCH_NAME,
                gender: item.GENDER,
                nationality: item.NATION,
                phoneNumber: item.TEL_NO
              }
              );
            });
          }
        }
      });
  }

  closeDialog(index: any): void {
    this.dialogRef.close(index);
  }

  createNew(index: any): void {
    this.dialogRef.close(index);
  }

  getCustomer(customer: Customer): void {
    if (this.isSearchCif) {
      // console.log('customer', customer);
      if (customer.customerCode) {
        this.cifService.getProcessId(customer.customerCode).subscribe(
          data => {
            // this.customers = data;
            // console.log(data);
            this.dialogRef.close();
            this.router.navigate(['./smart-form/manager/fileProcessed', data.processId]);
          }
        );
      } else {
        this.dialogRef.close();
        this.router.navigate(['./smart-form/manager/fileProcessed', customer.processId]);
      }
    } else if (this.isSearchCoOwner) {
      this.coOwnerAccountService.detailCoOwner(customer.processId).subscribe(
        data => {
          // this.customers = data;
          // console.log(data);
          // console.log('processId', this.processId);
          // console.log('accountId', this.accountId);
          if (data.customer.id) {
            this.router.navigate(['./smart-form/manager/co-owner/view', {
              processId: this.processId,
              id: this.accountId,
              coOwnerId: data.id,
              customerId: data.id
            }]);
          } else {
            this.router.navigate(['./smart-form/manager/co-owner/create', {
              processId: this.processId,
              id: this.accountId
            }]);
          }
          this.dialogRef.close();
        }
      );
    } else {
      this.dialogRef.close(customer);
    }

  }
}
