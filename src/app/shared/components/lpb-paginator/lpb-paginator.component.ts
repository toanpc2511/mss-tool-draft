import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lpb-paginator',
  templateUrl: './lpb-paginator.component.html',
  styleUrls: ['./lpb-paginator.component.scss']
})
export class LpbPaginatorComponent implements OnInit, OnChanges {

  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() startRowOfPage = 1;
  @Input() endRowOfPage = 11;
  @Input() pageSizes = [10, 20, 50];
  @Input() maxPages = 10;

  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() startRowOfPageChange = new EventEmitter<number>();
  @Output() endRowOfPageChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<any>();

  totalPages = 10;
  curPage = 1;
  displayPages = [1];
  curSetPape = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageSizes) {
      setTimeout(() => {
        this.pageSize = this.pageSizes[0];
        this.pageSizeChange.emit(this.pageSize);
      })
    }
    if (changes.totalRecords) {
      setTimeout(() => {
        this.calcuPage();
      })
    }
  }

  calcuPage() {
    this.totalPages = Math.floor((this.totalRecords - 1) / this.pageSize) + 1;
    this.displayPages = [];
    let len = Math.min(this.maxPages, this.totalPages);
    for (let index = 0; index < len; index++) {
      this.displayPages.push(index + 1)
    }
    this.curPage = 1;
    this.calcuRowOfPage();
  }

  setPages(page: number, usedArrow: boolean) {
    if (page === 0 || page > this.totalPages) {
      return
    }
    if (page === this.curPage) {
      return;
    }
    this.curPage = page;
    //
    if (usedArrow) {
      let pages = Math.floor((this.curPage - 1) / this.maxPages);
      if (this.curSetPape !== pages) {
        this.curSetPape = pages;
        //console.log(pages)
        this.displayPages = [];
        let len = Math.min((pages + 1) * this.maxPages, this.totalPages)
        for (let index = pages * this.maxPages; index < len; index++) {
          this.displayPages.push(index + 1);
        }
      }
    }
    //
    this.calcuRowOfPage();
    this.pageChange.emit({ curPage: this.curPage, pageSize: this.pageSize });
  }

  calcuRowOfPage() {
    this.startRowOfPage = (this.curPage - 1) * this.pageSize + 1;
    this.endRowOfPage = Math.min(this.startRowOfPage + this.pageSize - 1, this.totalRecords);
    this.startRowOfPageChange.emit(this.startRowOfPage);
    this.endRowOfPageChange.emit(this.endRowOfPage);
  }

  changePageSize() {
    this.pageSize = +this.pageSize;
    this.pageSizeChange.emit(this.pageSize);
    this.calcuPage();
    this.pageChange.emit({ curPage: this.curPage, pageSize: this.pageSize });
  }

}
