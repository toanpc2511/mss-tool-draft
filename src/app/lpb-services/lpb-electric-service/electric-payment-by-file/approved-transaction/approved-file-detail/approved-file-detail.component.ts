import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { ApprovedFileStepOneComponent } from '../approved-file-step-one/approved-file-step-one.component';
import { ApprovedFileStepTwoComponent } from '../approved-file-step-two/approved-file-step-two.component';
import { ApprovedFileStepThreeComponent } from '../approved-file-step-three/approved-file-step-three.component';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ElectricService } from '../../../shared/services/electric.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMessageService } from 'src/app/shared/services/form-message.service';
import { FileService } from 'src/app/shared/services/file.service';
import { IBatchTransaction } from '../../../shared/models/electric.interface';

declare const $: any;

@Component({
  selector: 'app-approved-file-detail',
  templateUrl: './approved-file-detail.component.html',
  styleUrls: ['./approved-file-detail.component.scss'],
  providers: [DestroyService, MatStepper]
})
export class ApprovedFileDetailComponent implements OnInit {

  id = "";
  batchNo = "";
  isCompleted = false;
  stepOneCompleted = false;
  stepTwoCompleted = false;
  stepThreeCompleted = false;
  actions: ActionModel[] = this.getActions(0);
  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild(ApprovedFileStepOneComponent, { static: true }) stepOne: ApprovedFileStepOneComponent;
  @ViewChild(ApprovedFileStepTwoComponent, { static: true }) stepTwo: ApprovedFileStepTwoComponent;
  @ViewChild(ApprovedFileStepThreeComponent, { static: true }) stepThree: ApprovedFileStepThreeComponent;

  dataRoot: IBatchTransaction;
  dataRootStep1: IBatchTransaction;
  dataRootStep2: IBatchTransaction;
  dataRootStep3: IBatchTransaction;
  dataRootStep4: IBatchTransaction;
  totalAmountChangeDebtSuccess = 0;

  preAction = {
    actionName: "Bước trước",
    actionIcon: '',
    actionClick: () => this.stepper.previous()
  }

  nextAction = {
    actionName: "Tiếp tục",
    actionIcon: '',
    actionClick: () => this.stepper.next()
  }


  constructor(
    private cdr: ChangeDetectorRef,
    private electricService: ElectricService,
    private route: ActivatedRoute,
    private router: Router,
    private formMessageService: FormMessageService,
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {
    $('.parentName').html('Thanh toán hóa đơn Điện');
    $('.childName').html('Duyệt thanh toán theo file');
    this.setInit();
  }

  setInit() {
    this.id = this.route.snapshot.queryParamMap.get("id");
    this.electricService.getDetailTransactionByFile(this.id).toPromise().then(res => {
      this.dataRoot = res.data;
      this.handleStepApprove(this.dataRoot);
    })
  }

  handleStepApprove(data) {
    const batchStatus = data.batchStatus;
    const stepStatus = data.stepStatus;
    this.dataRootStep1 = data;
    let step = 0;
    switch (batchStatus) {
      case "APPROVE_TRANSFER":
        if (["FAIL"].includes(stepStatus)) {
          this.viewDetail();
          return;
        }
        if (["SUCCESS"].includes(stepStatus)) {
          this.dataRootStep2 = data;
          this.stepOneCompleted = true;
          this.nextStep();
          step = 1;
        }
        break;
      case "APPROVE_CHANGE_DEBT":
        this.dataRootStep2 = data;
        this.stepOneCompleted = true;
        this.nextStep();
        step = 1;
        if (["SUCCESS", "ERROR"].includes(stepStatus)) {
          this.dataRootStep3 = data;
          this.stepTwoCompleted = true;
          this.nextStep();
          step = 2;
        }
        break;
      case "APPROVE_ACCOUNTING":
        if (!["ERROR"].includes(stepStatus)) {
          this.viewDetail();
          return;
        }
        this.dataRootStep2 = this.dataRootStep3 = data;
        this.stepOneCompleted = true;
        this.stepTwoCompleted = true;
        this.nextStep();
        this.nextStep();
        step = 2;
        break;
      case "REJECT_APPROVE_TRANSFER":
      case "REJECT_APPROVE_CHANGE_DEBT":
        this.viewDetail();
        return;
        break;
      default:
        break;
    }
    this.handleActions(step);
  }

  getSelected($event): void {
    this.handleActions($event.selectedIndex);
  }

  handleActions(step: number): void {
    this.actions = this.getActions(step);
    this.cdr.detectChanges();
  }

  getActions(step) {
    const stepStatus = this.dataRoot?.stepStatus;
    const batchStatus = this.dataRoot?.batchStatus;
    switch (step) {
      case 0:
        if (this.stepOneCompleted) {
          return [this.nextAction];
        }
        if (["ERROR"].includes(stepStatus)) {
          return [{
            actionName: "Kiểm tra GD nghi ngờ",
            actionIcon: 'help_outline',
            actionClick: () => this.checkTransaction()
          }]
        }
        return [{
          actionName: "Từ chối duyệt",
          actionIcon: 'highlight_off',
          actionClick: () => this.rejectApprove()
        },
        {
          actionName: "Duyệt giao dịch",
          actionIcon: 'check_circle',
          actionClick: () => this.agreeApprove()
        }];
        break;
      case 1:
        if (this.stepTwoCompleted) {
          return [this.nextAction, this.preAction]
        }
        return [
          {
            actionName: "Từ chối duyệt",
            actionIcon: 'highlight_off',
            actionClick: () => this.rejectApproveStep2()
          },
          {
            actionName: "Duyệt giao dịch",
            actionIcon: 'check_circle',
            actionClick: () => this.agreeApproveStep2()
          },
          this.preAction
        ];
        break;
      case 2:
        if (this.stepThreeCompleted) {
          return [this.nextAction, this.preAction];
        }

        if (["APPROVE_CHANGE_DEBT"].includes(batchStatus)) {
          if (this.hasBillChangeDebtError(this.dataRoot)) {
            return [this.preAction];
          }
          return [
            {
              actionName: "Hạch toán",
              actionIcon: 'note_add',
              actionClick: () => this.createAccounting()
            },
            this.preAction
          ];
        }
        if (["APPROVE_ACCOUNTING"].includes(batchStatus)) {
          if ("ERROR".includes(this.dataRoot.accountingBatchResponses[0].status)) {
            return [
              {
                actionName: "Kiểm tra GD nghi ngờ",
                actionIcon: 'help_outline',
                actionClick: () => this.checkCreateAccounting()
              },
              this.preAction
            ];
          }
          return [this.preAction];
        }
        break;
      default:
        return [this.preAction];
        break;
    }
  }

  rejectApprove() {
    this.electricService.rejectApproveStep1(this.dataRoot.id).toPromise().then(res => {
      const message = "Từ chối duyệt nộp tiền vào tài khoản trung gian thành công !";
      this.formMessageService.openMessageSuccess(message);
      this.viewDetail();
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  agreeApprove() {
    this.electricService.agreeApproveStep1(this.dataRoot.id, this.dataRoot.batchNo, `${this.dataRoot.lastModifiedDate}`).toPromise().then(res => {
      if (res.data?.batchTransaction) {
        this.dataRoot = res.data.batchTransaction;
        this.dataRootStep1 = this.dataRoot;
      }
      if (res.data.status && !["SUCCESS"].includes(res.data.status)) {
        this.formMessageService.openMessageError(res.data.description);
        if (["ERROR"].includes(res.data.status)) {
          this.actions = [{
            actionName: "Kiểm tra GD nghi ngờ",
            actionIcon: 'help_outline',
            actionClick: () => this.checkTransaction()
          }]
        } else {
          this.actions = [];
        }
        return;
      }
      if (res.data.batchTransaction.stepStatus === "SUCCESS") {
        const message = "Đã duyệt nộp tiền vào tài khoản trung gian !";
        this.formMessageService.openMessageSuccess(message);
      }
      this.dataRootStep2 = this.dataRoot;
      this.stepOneCompleted = true;
      this.nextStep();
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  rejectApproveStep2() {
    this.electricService.rejectApproveStep2(this.dataRoot.id).toPromise().then(res => {
      this.formMessageService.openMessageSuccess("Từ chối duyệt gạch nợ theo file thành công !");
      this.viewDetail();
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  agreeApproveStep2() {
    this.electricService.agreeApproveStep2(this.dataRoot.id, this.dataRoot.batchNo, `${this.dataRoot.lastModifiedDate}`).toPromise().then(res => {
      this.dataRoot = res.data.batchTransaction;
      // Khi gạch nợ không thất bại thì BE trả về SUCCESS nó bao gồm cả gạch nợ kxđ
      if (this.dataRoot.stepStatus === "SUCCESS") {
        this.formMessageService.openMessageSuccess("Đã gạch nợ hóa đơn !");
      }
      if (this.dataRoot.stepStatus === "FAIL") {
        this.formMessageService.openMessageError("Duyệt gạch nợ thất bại !");
      }
      this.dataRootStep2 = this.dataRootStep3 = this.dataRoot;
      this.stepTwoCompleted = true;
      this.nextStep();
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  hasBillChangeDebtError(data) {
    let hasError = false;
    let hasSuccess = false;
    data.transactionResponses.forEach(transaction => {
      const rowError = transaction.billInfos.find(bill => ["ERROR"].includes(bill.changeDebtStatus));
      if (!hasSuccess) {
        const rowSuccess = transaction.billInfos.find(bill => ["SUCCESS"].includes(bill.changeDebtStatus));
        if (rowSuccess) {
          hasSuccess = true;
        }
      }
      if (rowError) {
        hasError = true;
        return;
      }
    })
    return (hasError || !hasSuccess) ? true : false;
  }

  createAccounting() {
    // Check có HĐ gạch nợ ERROR    
    if (this.hasBillChangeDebtError(this.dataRootStep3)) {
      this.formMessageService.openMessageError("Có hóa đơn gạch nợ ở trạng thái không xác định, cần gạch nợ bổ sung !");
      return;
    }
    if (this.totalAmountChangeDebtSuccess === 0) {
      this.formMessageService.openMessageError("Không có hóa đơn gạch nợ thành công !");
      return;
    }
    this.electricService.accoutingApprove(this.dataRoot.id, this.dataRoot.batchNo).toPromise().then(res => {
      if (res.data?.batchTransaction) {
        this.dataRoot = res.data.batchTransaction;
        this.dataRootStep3 = this.dataRoot;
      }
      if (res.data.status && !["SUCCESS"].includes(res.data.status)) {
        this.formMessageService.openMessageError(res.data.description);
        if (["ERROR"].includes(res.data.status)) {
          this.actions = [{
            actionName: "Kiểm tra GD nghi ngờ",
            actionIcon: 'help_outline',
            actionClick: () => this.checkCreateAccounting()
          }]
        } else {
          this.actions = [this.preAction];
        }
        return;
      }
      this.formMessageService.openMessageSuccess("Đã báo có điện lực !");
      this.dataRootStep4 = this.dataRoot;
      this.stepThreeCompleted = true;
      this.nextStep();
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  exportExcel(dataSource) {
    const params = { batchId: this.id };
    this.fileService.downloadFileMethodGet(
      "electric-service/report/tran-detail/export",
      params
    );
  }

  viewDetail() {
    this.router.navigate(["/electric-service/pay-at-file/detail"], { queryParams: { id: this.id } });
  }

  exportReport(data) {
    const params = { batchId: this.id };
    this.fileService.downloadFileMethodGet(
      "electric-service/report/tran-detail-success/export",
      params
    );
  }

  nextStep(): void {
    setTimeout(() => this.stepper.next());
  }

  checkTransaction() {
    const body = { id: this.dataRoot.id };
    this.electricService.checkAccountingTransfer(body).toPromise().then(res => {
      if (res.data.status && res.data.status === "FAIL") {
        this.formMessageService.openMessageError(res.data.description);
        this.viewDetail();
        return;
      }
      if (res.data.status && res.data.status === "ERROR") {
        this.formMessageService.openMessageError(res.data.description);
        return;
      }
      this.dataRoot = res.data.batchTransaction;
      if (this.dataRoot.stepStatus === "SUCCESS") {
        const message = "Kiểm tra nghi ngờ nộp tiền trung gian thành công !";
        this.formMessageService.openMessageSuccess(message);
      }
      this.dataRootStep1 = this.dataRootStep2 = this.dataRoot;
      this.stepOneCompleted = true;
      this.nextStep();
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  checkCreateAccounting() {
    const body = { id: this.dataRoot.id };
    this.electricService.checkCreateAccounting(body).toPromise().then(res => {
      if (res.data.status && res.data.status === "FAIL") {
        this.formMessageService.openMessageError(res.data.description);
        this.viewDetail();
        return;
      }
      if (res.data.status && res.data.status === "ERROR") {
        this.formMessageService.openMessageError(res.data.description);
        return;
      }
      this.dataRoot = res.data.batchTransaction;
      if (this.dataRoot.stepStatus === "SUCCESS") {
        const message = "Kiểm tra nghi ngờ báo có điện lực thành công !";
        this.formMessageService.openMessageSuccess(message);
      }
      this.dataRootStep3 = this.dataRootStep4 = this.dataRoot;
      this.stepThreeCompleted = true;
      this.nextStep();
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  dataRootChange(data) {
    this.dataRootStep2 = data;
  }
}
