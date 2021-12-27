import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDetailEmployeeAssessment } from '../models/detail-employee-assessment.interface';
import { EmployeeService, IFilter } from '../../employee.service';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { takeUntil, tap } from 'rxjs/operators';
import { FileService } from '../../../../shared/services/file.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { SubheaderService } from '../../../../_metronic/partials/layout';

@Component({
  selector: 'app-detail-employee-assessment',
  templateUrl: './detail-employee-assessment.component.html',
  styleUrls: ['./detail-employee-assessment.component.scss'],
  providers: [DestroyService]
})
export class DetailEmployeeAssessmentComponent implements OnInit, AfterViewInit {

  listDetailEmployeeAssessment: IDetailEmployeeAssessment[] = [];
  filter: IFilter;
  paginatorState = new PaginatorState();
  votes = [
    {
      start: 5,
      checked: false
    },
    {
      start: 4,
      checked: false
    },
    {
      start: 3,
      checked: false
    },
    {
      start: 2,
      checked: false
    },
    {
      start: 1,
      checked: false
    },
  ]

  constructor(private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private cdr: ChangeDetectorRef,
              private fileService: FileService,
              private destroy$: DestroyService,
              private subheader: SubheaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.filter = param;
      this.getListDetailEmployeeAssessment();
    });
  }

  ngAfterViewInit() {
    this.setBreadcumb();
  }

  pagingChange($event: IPaginatorState): void {
    this.paginatorState = $event as PaginatorState;
    this.getListDetailEmployeeAssessment();
  }

  getListDetailEmployeeAssessment(): void {
    const params = {
      page: this.paginatorState.page,
      size: this.paginatorState.pageSize,
      filter: this.filter
    }

    this.employeeService.getListDetailEmployeeAssessment(params)
      .subscribe((res: DataResponse<IDetailEmployeeAssessment[]>): void => {
        this.listDetailEmployeeAssessment = res.data;
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      })
  }

  filterByVote(vote): void {
    this.votes.filter(item => item.start !== vote.start).map(item => item.checked = false);
    this.filter = vote.checked
      ? ({ ...this.filter, vote: vote.start }) as IFilter
      : ({ ...this.filter, vote: '' }) as IFilter
    this.getListDetailEmployeeAssessment();
  }

  setBreadcumb(): void {
    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý nhân viên',
          linkText: 'Quản lý nhân vien',
          linkPath: 'nhan-vien'
        },
        {
          title: 'Đánh giá nhân viên',
          linkText: 'Đánh giá nhân viên',
          linkPath: 'nhan-vien/danh-gia'
        },
        {
          title: 'Chi tiết đánh giá nhân viên',
          linkText: 'Chi tiết đánh giá nhân viên',
          linkPath: null
        }
      ]);
    }, 1);
  }

}
