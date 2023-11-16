import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import {Pager} from "../_models/pager";

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // let totalPages = Math.ceil(totalItems/pageSize);
    // let startPage, endPage: number;
    // if (totalPages <= 10) {
    //   startPage = 1;
    //   endPage = totalPages;
    // } else {
    //   if (currentPage <= 6) {
    //     startPage = 1;
    //     endPage = 10;
    //   } else if (currentPage + 4 >= totalPages) {
    //     startPage = totalPages - 9;
    //     endPage = totalPages;
    //   } else {
    //     startPage = currentPage - 5;
    //     endPage = currentPage + 4;
    //   }
    // }
    // let startIndex = (currentPage - 1) * pageSize;
    // let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // let pages = _.range(startPage, endPage + 1);
    // return new Pager(totalItems, currentPage, pageSize, totalPages, startPage, endPage, startIndex, endIndex, pages)
  }
}
