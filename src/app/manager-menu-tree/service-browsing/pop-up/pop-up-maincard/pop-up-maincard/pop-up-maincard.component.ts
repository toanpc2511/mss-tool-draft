import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Branch } from 'src/app/_models/branch';
import { AccountLinkListOp } from 'src/app/_models/card/accountLinkListOutputDTOUVoCaChcNngDanhSchTiKhonLinKtCaThChnhCaTiKhonLinKtCaTh';
import { AccountLinkList } from 'src/app/_models/card/AcountLinkList';
import { Card } from 'src/app/_models/card/Card';
import { CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh } from 'src/app/_models/card/cardDetailOutputDTOUVoCaChcNngChiTitCaThChnh';
import { CardService } from 'src/app/_services/card/card.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';

@Component({
  selector: 'app-pop-up-maincard',
  templateUrl: './pop-up-maincard.component.html',
  styleUrls: ['./pop-up-maincard.component.css']
})
export class PopUpMaincardComponent implements OnInit {
  @Input() id = '';
  card: CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh[];
  acc: AccountLinkList[];
  accountList: AccountLinkListOp;
  accCountName: string;
  accountId: string;
  processId: string;
  branch: Branch[];
  card1: Card = new Card();
  deliveryTypeCode: string;
  deliveryChanelCode: string;
  constructor(
    private cardService: CardService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit(): void {
    this.detail();
  }

  detail(): void {
    this.cardService.detailCard(this.id).subscribe(
      data => {
        if (data.item) {
          this.card = data.item;
        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }

  // [routerLink]="['/smart-form/manager/card-infor', {processId: this.processId, id: item.dwItemId}]"
}
