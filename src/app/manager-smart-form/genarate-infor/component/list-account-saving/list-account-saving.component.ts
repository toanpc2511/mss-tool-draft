import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountModel } from 'src/app/_models/account';
// import { CardService } from 'src/app/_services/card/card.service';

@Component({
  selector: 'app-list-account-saving',
  templateUrl: './list-account-saving.component.html',
  styleUrls: ['./list-account-saving.component.css']
})
export class ListAccountSavingComponent implements OnInit {
  processId: string;
  account: AccountModel[];
  constructor(
    private route: ActivatedRoute,
    // private cardService: CardService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    // this.getAccountLinkedList();
  }
  // getAccountLinkedList(): void {
  //   this.cardService.getAccountList(this.processId).subscribe(
  //     data => {
  //       if (data.items) {
  //         this.account = data.items;
  //        }
  //     }
  //   );
  // }
}
