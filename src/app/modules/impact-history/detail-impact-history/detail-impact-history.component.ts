import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../_metronic/partials/layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ContractService, IContract, ISortData } from '../../contract/contract.service';
import { IError } from '../../../shared/models/error.model';
import { PaginatorState } from '../../../_metronic/shared/crud-table';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilterTransaction } from '../../inventory-management/inventory-management.service';
import { convertDateToServer } from '../../../shared/helpers/functions';
import { ILogDetail, ImpactHistoryService } from '../impact-history.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-detail-impact-history',
  templateUrl: './detail-impact-history.component.html',
  styleUrls: ['./detail-impact-history.component.scss'],
  providers: [FormBuilder]
})
export class DetailImpactHistoryComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;

  today: string;
  firstDayOfMonth: string;
  dataTest;
  dataSource: ILogDetail[] = [];
  sortData: ISortData;
  paginatorState = new PaginatorState();
  totalRemain: number;
  codeLog: string;

  constructor(
    private subheader: SubheaderService,
    private fb: FormBuilder,
    private contractService:  ContractService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private impactHistoryService: ImpactHistoryService
    ) {
    this.firstDayOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.today = moment().format('DD/MM/YYYY');
    this.dataSource = []
    this.dataTest = []
    this.totalRemain = 0;
  }

  ngOnInit(): void {
    this.buildFormSearch();
    this.initDate();
    this.init();
    this.activeRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((queryParams) => {
        this.codeLog = queryParams.code;
      })
    this.onSearch(true);
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 5;
    this.sortData = null;
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  setBreadcumb() {
    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý lịch sử tác động',
          linkText: 'Quản lý lịch sử tác động',
          linkPath: '/lich-su-tac-dong'
        },
        {
          title: 'Chi tiết lịch sử tác động',
          linkText: 'Chi tiết lịch sử tác động',
          linkPath: null
        }
      ]);
    }, 1);
  }

  buildFormSearch() {
    this.searchForm = this.fb.group({
      startAt: [],
      endAt: []
    })
  }

  initDate() {
    this.searchForm.get('startAt').patchValue(this.firstDayOfMonth);
    this.searchForm.get('endAt').patchValue(this.today);
  }

  onReset() {
    this.ngOnInit();
  }

  getFilterData() {
    const filterFormData = this.searchForm.value;
    return {
      ...filterFormData,
      startAt: convertDateToServer(filterFormData.startAt),
      endAt: convertDateToServer(filterFormData.endAt)
    };
  }

  onSearch(resetData: boolean) {
    resetData ? this.paginatorState.page = 1 : this.paginatorState.page
    const filterData: IFilterTransaction = this.getFilterData();
    this.impactHistoryService.getLogDetail(this.paginatorState.page, this.paginatorState.pageSize, filterData, this.codeLog)
      .subscribe((res) => {
        resetData ? this.dataSource = [] : this.dataSource;

        res?.data?.map(x => this.dataSource.push(x));
        this.paginatorState.recalculatePaginator(res.meta.total);

        this.totalRemain = res.meta.total - this.dataSource.length;
        this.cdr.detectChanges();
      }, (error: IError) => {this.checkError(error)})
  }

  showMore() {
    this.paginatorState.page++;
    this.onSearch(false);
  }

  onBack() {
    this.router.navigate(['/lich-su-tac-dong/danh-sach']);
  }

  checkError(error: IError) {
    console.log(error.code);
  }
}
