import { ModalBannerComponent } from './modal-banner/modal-banner.component';
import { DATA_CATEGORY } from './../../shared/contants/contants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IPaginatorState,
  PaginatorState
} from './../../_metronic/shared/crud-table/models/paginator.model';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-banner-management',
  templateUrl: './banner-management.component.html',
  styleUrls: ['./banner-management.component.scss']
})
export class BannerManagementComponent implements OnInit {
  categorys: any[] = DATA_CATEGORY;
  now = moment();
  isLoading: boolean;
  paginatorState = new PaginatorState();

  searchForm: FormGroup;
  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.initPaginator();
    this.initSearchForm();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      code: [''],
      name: [''],
      type: ['']
    });
  }

  initPaginator() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 15;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
  }

  ngOnInit(): void {
    this.onSearch();
  }

  create() {
    this.edit(undefined);
  }

  edit(data: any) {
    const modalRef = this.modalService.open(ModalBannerComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  delete(id: string) {}

  onSearch() {
    this.paginatorState.total = 206;
    console.log(this.searchForm.value);
  }

  onReset(): void {
    this.initSearchForm();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }
}
