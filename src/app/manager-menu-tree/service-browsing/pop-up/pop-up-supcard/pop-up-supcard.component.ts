import { Location } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card } from 'src/app/_models/card/Card';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { CardService } from 'src/app/_services/card/card.service';
import { SubCardService } from 'src/app/_services/card/sub-card.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ListAccount } from 'src/app/_models/card/Account';
import { Process } from 'src/app/_models/process/Process';
import { CifCondition } from 'src/app/_models/cif';
import { ProcessService } from 'src/app/_services/process.service';
import { CommonCard } from 'src/app/_models/card/CommonCard';
import { MissionService } from 'src/app/services/mission.service';
@Component({
  selector: 'app-pop-up-supcard',
  templateUrl: './pop-up-supcard.component.html',
  styleUrls: ['./pop-up-supcard.component.scss']
})
export class PopUpSupcardComponent implements OnInit {
  @Input() id = '';
  card: Card[];
  card2: Card[];
  g: CommonCard[];
  accountId: string;
  cardTypeCode: string;
  account1: ListAccount[];
  processId: string;
  process: Process = new Process();
  cardId: string;
  contractNumber: string;
  contractNumberMain: string;
  deliveryTypeCode: string;
  deliveryChanelCode: string;
  roleLogin: any;
  name: string;
  constructor(
    private dialog: MatDialog,
    private _LOCATION: Location,
    private mainCardService: CardService,
    private cardService: SubCardService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private cifService: ProcessService,
    private missionService: MissionService,
  ) { }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.detail();
  }

  getStatusName(g): string {
    if (g === 'M') {
      return 'Nam';
    } else if (g === 'F') {
      return 'Nữ';
    } else if (g === 'P') {
      return 'Ẩn';
    } else if (g === 'O') {
      return 'Khác';
    }
  }
  // thông tin thẻ phụ
  detail(): void {
    this.cardService.detailSupCard(this.id).subscribe(
      data => {
        if (data.item) {
          this.card = data.item;
          this.cardId = data.item.cardId;
          this.detailMain(this.cardId);
          // console.log('Thông tin thẻ phụ', this.card);
        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }
  // thông tin thẻ chính
  detailMain(id): void {
    this.mainCardService.detailCard(id).subscribe(
      data => {
        if (data.item) {
          this.card2 = data.item;
          this.processId = data.item.processId;
          this.contractNumberMain = data.item.contractNumber;
          // console.log('thông tin thẻ chính', this.card2);
          this.getProcessInformation(this.processId);
        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }
  getProcessInformation(processId): void {
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        this.name = data.item.customer.person.fullName;
        // let name2 = this.toNoSign(name).toUpperCase()
        // console.log('process', this.process.item);
      }
    }, error => {
    }, () => { }
    );
  }
}
