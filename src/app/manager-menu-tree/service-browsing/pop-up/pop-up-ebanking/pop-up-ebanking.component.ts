import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EbankingService } from 'src/app/manager-menu-tree/ebanking/shared/ebanking.services';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-pop-up-ebanking',
  templateUrl: './pop-up-ebanking.component.html',
  styleUrls: ['./pop-up-ebanking.component.scss']
})
export class PopUpEbankingComponent implements OnInit {

  @Input() id;
  processId: string;
  objEbankingSelected: any;
  constructor(
    private route: ActivatedRoute,
    private ebankingService: EbankingService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getDetailEbank();
  }

  getDetailEbank(): void{
  this.ebankingService.detail(this.id).subscribe(data => {
  if (data.item){
     this.objEbankingSelected = data.item;
  }
  });
  }
}
