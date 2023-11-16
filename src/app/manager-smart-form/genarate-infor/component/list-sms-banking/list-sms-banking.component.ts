import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-sms-banking',
  templateUrl: './list-sms-banking.component.html',
  styleUrls: ['./list-sms-banking.component.css']
})
export class ListSmsBankingComponent implements OnInit {
processId: string;
  constructor(
        private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
  });
}

}
