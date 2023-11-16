import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import {Pagination} from '../../../_models/pager';

@Component({
  selector: 'app-lpb-pagination',
  templateUrl: './lpb-pagination.component.html',
  styleUrls: ['./lpb-pagination.component.scss']
})
export class LpbPaginationComponent implements OnInit, OnChanges {
  @Input() pagination: Pagination = new Pagination();
  @Input() selected = 10;
  @Output() evtChangePageSize = new EventEmitter();
  @Output() evtSetPage = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.pagination) {
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
  }

  changePageSize(pageSizeValue: number): void {
    this.evtChangePageSize.emit(pageSizeValue);
  }

  setPage(pageValue: number): void {
    this.evtSetPage.emit(pageValue);
  }

}
