import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-ebanking',
  templateUrl: './list-ebanking.component.html',
  styleUrls: ['./list-ebanking.component.css']
})
export class ListEbankingComponent implements OnInit {
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
