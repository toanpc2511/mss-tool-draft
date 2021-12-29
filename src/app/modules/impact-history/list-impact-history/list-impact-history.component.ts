import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILogGroups, ImpactHistoryService } from '../impact-history.service';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-impact-history',
  templateUrl: './list-impact-history.component.html',
  styleUrls: ['./list-impact-history.component.scss']
})
export class ListImpactHistoryComponent implements OnInit {
  dataSource: ILogGroups[] = [];

  constructor(
    private router: Router,
    private impactHistoryService: ImpactHistoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    ) {
    this.dataSource = [];
  }

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

  detailImpact(item: ILogGroups) {
    this.router.navigate([`/lich-su-tac-dong/chi-tiet/${item.code}`]);
  }

  checkError(error: IError) {
    this.toastr.error(error.code)
  }

}
