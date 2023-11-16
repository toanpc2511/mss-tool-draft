import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-warning-data-invalid',
  templateUrl: './warning-data-invalid.component.html',
  styleUrls: ['./warning-data-invalid.component.scss']
})
export class WarningDataInvalidComponent implements OnInit {
  @Input() objErrorCore: any;
  @Input() lstGuardianCore: any;

  lstGuardianErr = [];
  isExpandMis = true;
  isExpandUdf = true;
  isExpandGuardian = true;
  constructor() { }

  ngOnInit(): void {
    this.getGuardianError();
  }

  getGuardianError(): any {
    if (this.objErrorCore && this.objErrorCore.GUARDIAN && this.objErrorCore.GUARDIAN.length > 0) {
      const lstIdGuardian = [];
      this.objErrorCore.GUARDIAN.forEach(el => {
        if (lstIdGuardian.length === 0){
          lstIdGuardian.push({guardianId: el.refId});
        }
        if (lstIdGuardian.length > 0) {
          if (lstIdGuardian.filter(item => item.guardianId === el.refId).length === 0) {
            lstIdGuardian.push({guardianId: el.refId});
          }
        }
      });
      lstIdGuardian.forEach(el => {
        const guardianInfo = this.lstGuardianCore.filter(item => item.customer.guardianId === el.guardianId);
        const tmpCodes = [];
        this.objErrorCore.GUARDIAN.forEach(el1 => {
          if (el1.refId === el.guardianId) {
            tmpCodes.push(el1);
          }
        });
        this.lstGuardianErr.push({
          guardianId: el.guardianId,
          guardianName: guardianInfo.length > 0 ? guardianInfo[0].customer.person.fullName : '',
          codes: tmpCodes
        });
      });
    }
  }
}
