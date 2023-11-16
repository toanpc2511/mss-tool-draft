import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountModel } from 'src/app/_models/account';
import { Card } from 'src/app/_models/card/Card';
// import { CardService } from 'src/app/_services/card/card.service';

@Component({
  selector: 'app-list-card-type',
  templateUrl: './list-card-type.component.html',
  styleUrls: ['./list-card-type.component.css']
})
export class ListCardTypeComponent implements OnInit {
  processId: string;
  card: Card[];
  constructor(
    private route: ActivatedRoute,
    // private cardService: CardService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    // this.getCardList();
  }
  // getCardList(): void {
  //   this.cardService.getListCard({ processId: this.processId }).subscribe(data => {
  //     if (data.items) {
  //       this.card = data.items;
  //       console.log(data.items);
  //     }
  //   });
  // }
}
