import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../_metronic/partials/layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ContractService, IContract, ISortData } from '../../contract/contract.service';
import { IError } from '../../../shared/models/error.model';
import { PaginatorState } from '../../../_metronic/shared/crud-table';
import { Router } from '@angular/router';

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
  dataSource: Array<IContract> = [];
  sortData: ISortData;
  paginatorState = new PaginatorState();
  totalRemain: number;

  constructor(
    private subheader: SubheaderService,
    private fb: FormBuilder,
    private contractService:  ContractService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private router: Router,
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
    this.getStationToken();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 1;
    this.sortData = null;
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  getStationToken() {
    this.contractService
      .getListContract(
        this.paginatorState.page,
        this.paginatorState.pageSize,
        '',
        this.sortData
      )
      .subscribe(
        (res) => {
          if (res.data) {
            res.data.map((x) => {
              this.dataTest.push(x);
            });

            this.paginatorState.recalculatePaginator(res.meta.total);

            this.totalRemain = res.meta.total - this.dataTest.length;
            this.cdr.detectChanges();
          }
        },
        (err: IError) => {
          this.checkError(err);
        }
      );
  }

  checkError(e: IError) {

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

  onSearch() {
    console.log(this.searchForm.value);
  }

  showMore() {
    this.paginatorState.page++;
    this.getStationToken();
  }

  onBack() {
    this.router.navigate(['/lich-su-tac-dong/danh-sach']);
  }

}
