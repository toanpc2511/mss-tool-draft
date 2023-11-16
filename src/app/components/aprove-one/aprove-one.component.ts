import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PopUpSendServiceComponent } from 'src/app/manager-menu-tree/sendForApproval/pop-up/pop-up-send-service/pop-up-send-service.component';
import { MissionService } from 'src/app/services/mission.service';
import { CifCondition } from 'src/app/_models/cif';
import { ProcessItem } from 'src/app/_models/process/ProcessItem';
import { RegistrableService } from 'src/app/_models/registrable-service';
import { ResponseStatus } from 'src/app/_models/response';
import { ApprovalCifService } from 'src/app/_services/approval-cif.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { ProcessService } from 'src/app/_services/process.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';

@Component({
  selector: 'app-aprove-one',
  templateUrl: './aprove-one.component.html',
  styleUrls: ['./aprove-one.component.css']
})
export class AproveOneComponent implements OnInit {
  @Input() id = '';
  @Input() processId = '';
  @Input() customerCode = '';
  processItem = new ProcessItem();
  response: ResponseStatus;
  userId: string;
  serviceLst: RegistrableService[];
  rs: any = [];
  @Output() getStatusCode = new EventEmitter<any>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private cifService: ProcessService,
    private approvalCifService: ApprovalCifService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  sendApprovableOne(id: string, note?: string) {
    // tslint:disable-next-line:prefer-const
    let typeCode = (this.customerCode !== null ? 'UPDATE_CIF' : 'OPEN_CIF');
    return this.approvalCifService.sendApproveOne({ id, typeCode, note }).subscribe(
      data => {
        this.rs = data;
        if (!this.rs.responseStatus.success) {
          this.notificationService.showError('Gửi duyệt dịch vụ thất bại', '');
        } else {
          this.notificationService.showSuccess('Gửi duyệt dịch vụ thành công', '');
        }
        this.getProcessInformation(this.processId);
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }


  sendApproveOne(): void {
    const dialogRef = this.dialog.open(PopUpSendServiceComponent, DialogConfig.configDialogConfirm({ number: 26 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendApprovableOne(this.id, rs.note);
      }
    });
  }

  getProcessInformation(processId: string): void {
    if (processId) {
      this.missionService.setProcessId(processId);
      this.processId = processId;
      const condition = new CifCondition();
      condition.id = processId;
      this.cifService.detailProcess(processId).subscribe(data => {
        this.processItem = data.item;
        // console.log('abcs', this.processItem);
        if (data.item.statusCode !== null) {
          // lấy trạng thái để check chơ duyệt hay không
          this.getStatusCode.emit(data.item.statusCode);
        }
        if (!this.processItem) {
          this.errorHandler.showError('Không lấy được thông tin hồ sơ');
        }
      },
        error => {
          this.errorHandler.showError(error);
        }
      );
    }
  }

}
