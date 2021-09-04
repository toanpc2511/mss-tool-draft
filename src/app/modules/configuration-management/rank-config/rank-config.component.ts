import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ConfigurationManagementService, IRank } from '../configuration-management.service';

@Component({
  selector: 'app-rank-config',
  templateUrl: './rank-config.component.html',
  styleUrls: ['./rank-config.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class RankConfigComponent implements OnInit {
  permissionForm: FormGroup;
  moduleAccordion: NgbAccordion;
  groupAccordions: Array<NgbAccordion>;

  rankForm: FormGroup;
  data: Array<IRank> = [];
  newData;

  @ViewChild('moduleAccordion', { static: false }) set module(element: NgbAccordion) {
    this.moduleAccordion = element;
  }

  constructor(
    private fb: FormBuilder,
    private configManagement: ConfigurationManagementService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getListRank();
  }

  getListRank() {
    this.configManagement.getListRank()
      .subscribe((res) => {
        this.data = res.data;
        sessionStorage.tt = res.data;
        this.cdr.detectChanges();
      });
  }

  onSubmit() {
    this.getListRank();
  }

  isOpenModule(moduleId) {
    return this.moduleAccordion && this.moduleAccordion.activeIds.includes(moduleId);
  }

  isOpenGroup(groupId) {
    return (
      this.groupAccordions?.length > 0 &&
      this.groupAccordions.some((ga) => ga.activeIds.includes(groupId))
    );
  }
}
