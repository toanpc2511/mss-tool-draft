import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { MissionService } from 'src/app/services/mission.service';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { EbankingService } from '../../shared/ebanking.services';

@Component({
  selector: 'app-ebanking-list',
  templateUrl: './ebanking-list.component.html',
  styleUrls: ['./ebanking-list.component.scss']
})
export class EbankingListComponent implements OnInit {
  @Output() viewEbankingDetail = new EventEmitter();
  @Output() editEbanking = new EventEmitter();
  @Output() changeStep = new EventEmitter();
  @Output() cancelEbank = new EventEmitter();
  @Input() customerName;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private missionService: MissionService,
    private ebankingService: EbankingService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) { }
  processId: string;
  ebankLst: any[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.getListEbank();
    // console.log(this.customerName);
  }

  clickViewDetail(item): void {
    this.viewEbankingDetail.emit(item);
  }
  getListEbank(): void {
    this.ebankLst = [];
    this.ebankingService.listAll({ processId: this.processId }).subscribe(
      data => {
        if (data && data.items) {
          this.ebankLst = data.items;
          // console.log(data.items);
        }
      }, err => {
        this.notificationService.showError('Errors Sever', err);
      }
    );
  }

  edit(item: any): void {
    this.editEbanking.emit(item);
  }
  cancel(item: any): void {
    this.cancelEbank.emit(item);
  }
  delete(item): void {
    const dialogConfig = {
      number: 25
    };
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDiaEbankDelete(dialogConfig));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        // let id = {}
        // id['id'] = item.id
        this.ebankingService.delete(item).subscribe(res => {
          if (res.responseStatus.success) {
            this.notificationService.showSuccess('Xóa dịch vụ thành công', '');
            this.ebankLst = this.ebankLst.filter(el => el.id !== item);
          } else {
            this.notificationService.showError('Xóa dịch vụ thất bại', '');
          }
        }, err => {
          this.notificationService.showError('Errors Sever', err);
        });
      }

    }
    );
  }
}
