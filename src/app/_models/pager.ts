import {PaginationService} from '../services/pagination.service';
import * as _ from 'underscore';

export class Pager {
  totalItems: any;
  currentPage: any;
  pageSize: any;
  totalPages: any;
  startPage: any;
  endPage: any;
  startIndex: any;
  endIndex: any;
  pages: any;

  constructor(totalItems: any = null,
              currentPage: any = null,
              pageSize: any = null,
              totalPages: any = null,
              startPage: any = null,
              endPage: any = null,
              startIndex: any = null,
              endIndex: any = null,
              pages: any = null) {
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
    this.startPage = startPage;
    this.endPage = endPage;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.pages = pages;
  }

  getStatus(): string {
    return `Từ ${this.startIndex + 1} - ${this.endIndex + 1} trên tổng ${this.totalItems} bản ghi`;
  }
}

export class Pagination {
  itemCount: number;
  activePage = 1;
  pageSize: number;
  pager: Pager;
  constructor(itemCount: number = 0, activePage: number = 1, pageSize: number = 10) {
    const paging = new PaginationService();
    this.itemCount = itemCount;
    this.activePage = activePage;
    this.pageSize = pageSize;
    this.pager = this.getPager(itemCount, activePage, pageSize);
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10): Pager {
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number;
    let endPage: number;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    const pages = _.range(startPage, endPage + 1);
    return new Pager(totalItems, currentPage, pageSize, totalPages, startPage, endPage, startIndex, endIndex, pages);
  }
}
