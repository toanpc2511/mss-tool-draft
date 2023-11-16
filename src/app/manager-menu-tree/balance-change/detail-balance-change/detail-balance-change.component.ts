import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { AccountModel } from 'src/app/_models/account';

@Component({
  selector: 'app-detail-balance-change',
  templateUrl: './detail-balance-change.component.html',
  styleUrls: ['./detail-balance-change.component.scss']
})
export class DetailBalanceChangeComponent implements OnInit {
  @Input() Obj;
  lstAccount: AccountModel[] = [];


  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    ) {
  }

  processId: string;
  roleLogin: any;
  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    // this.processId = this.route.snapshot.paramMap.get('processId')
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.missionService.setProcessId(this.processId);

  }

}
