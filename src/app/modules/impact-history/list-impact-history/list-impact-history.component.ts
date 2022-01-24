import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ILogGroups, ILogGroupsItem, ImpactHistoryService } from '../impact-history.service';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-impact-history',
  templateUrl: './list-impact-history.component.html',
  styleUrls: ['./list-impact-history.component.scss']
})
export class ListImpactHistoryComponent implements OnInit {
  moduleAccordion: NgbAccordion;
  groupAccordions: Array<NgbAccordion>;
  @ViewChild('moduleAccordion', { static: false }) set module(element: NgbAccordion) {
    this.moduleAccordion = element;
  }
  dataSource: ILogGroups[] = [];

  constructor(
    private router: Router,
    private impactHistoryService: ImpactHistoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    ) {}

  ngOnInit(): void {
    this.getLogGroups();
  }

  getLogGroups() {
    this.impactHistoryService.getLogGroups()
      .subscribe((res) => {
        if (res) {
          this.dataSource = res.data;
          this.cdr.detectChanges();
        }
      },(err: IError) => {
        this.checkError(err);
      })
  }

  detailImpact(item: ILogGroupsItem) {
    this.router.navigate([`/lich-su-tac-dong/chi-tiet/${item.code}`]);
  }

  checkError(error: IError) {
    this.toastr.error(error.code)
  }

  isOpenModule(moduleId) {
    return this.moduleAccordion && this.moduleAccordion.activeIds.includes(moduleId);
  }

}
