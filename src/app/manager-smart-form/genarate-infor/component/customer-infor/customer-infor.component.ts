import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { CifCondition } from 'src/app/_models/cif';
import { Process } from 'src/app/_models/process/Process';

import { ProcessService } from 'src/app/_services/process.service';

@Component({
  selector: 'app-customer-infor',
  templateUrl: './customer-infor.component.html',
  styleUrls: ['./customer-infor.component.css']
})
export class CustomerInforComponent implements OnInit {
  processId: string;
  process: Process = new Process();
  constructor(
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private missionService: MissionService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.missionService.setProcessId(this.processId);
    this.getProcessInformation();
  }
  getProcessInformation(): void {
    const condition = new CifCondition();
    this.cifService.detailProcess(this.processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        // console.log(data.item);

      }
    }, error => {
    }, () => { }
    );
  }
}
