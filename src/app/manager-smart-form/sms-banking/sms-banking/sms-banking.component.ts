import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { CifCondition } from 'src/app/_models/cif';
import { Process } from 'src/app/_models/process/Process';
import { AccountService } from 'src/app/_services/account.service';
import { ProcessService } from 'src/app/_services/process.service';
import { SmsService } from 'src/app/_services/sms/sms.service';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-sms-banking',
  templateUrl: './sms-banking.component.html',
  styleUrls: ['./sms-banking.component.css']
})
export class SmsBankingComponent implements OnInit {
  processId:string =''  
  smsAccount:[]
  constructor(
    private _LOCATION: Location,
    private router: Router,
    private route: ActivatedRoute, private smsService:SmsService,
    private missionService: MissionService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap =>{
        this.processId = paramMap.get('processId')
      })
      this.getSmsAccount()
      this.missionService.setProcessId(this.processId)
  }
  getSmsAccount(){
    this.smsService.getSmsAccount().subscribe(data =>{
      if(data.items){
        this.smsAccount= data.items
        console.log(this.smsAccount);     
      }
     })
  }
  addNew() {
    this.router.navigate(['smart-form/manager/add-sms-banking',{processId:this.processId}]);
  }
  backPage() {
    this._LOCATION.back()
  }
}
