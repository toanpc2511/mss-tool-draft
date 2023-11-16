import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitter } from 'protractor';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { EbankingService } from '../../shared/ebanking.services';

@Component({
  selector: 'app-ebanking-detail',
  templateUrl: './ebanking-detail.component.html',
  styleUrls: ['./ebanking-detail.component.scss']
})
export class EbankingDetailComponent implements OnInit {
  @Input() objEbankingSelected;
  constructor(
    private ebankingService: EbankingService,
    private notificationService: NotificationService,
    private dialog: MatDialog) { }

  ngOnInit(
  ): void {
  }
}
