/*
 * Copyright (C) 2021 LienVietBank
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { convertToLatinLowerCase } from '../../constants/utils';

@Component({
  selector: 'app-lpb-select',
  templateUrl: './lpb-select.component.html',
  styleUrls: ['./lpb-select.component.scss'],
})
export class LpbSelectComponent implements OnInit, OnChanges {
  @ViewChild('app-select') appSelect: ElementRef;
  @ViewChild('txtSearch', { static: true }) txtSearch: ElementRef;

  /** isShowListItem: Có hiển thị danh sách lựa chọn hay không?
   * = true: Hiển thị danh sách option
   * = false: close danh sách
   */
  @Input() isShowListItem = false;

  /** allowSearch: Có cho phép tìm kiếm trên danh sách lựa chọn hay không? Mặc định là cho phép
   * = true: Cho phép
   * = false: Không cho phép
   */
  @Input() allowSearch = true; // Cho phép tìm kiếm trong danh sách option. Mặc định hiển thị chức năng tìm kiếm

  /** lstOptions: Danh sách option truyền vào
   * Định dạng: [{'key': type, 'value': type}]
   */
  @Input() lstOptions: any[] = []; // Danh sách option theo object {code: '_code', name: 'code_01'} - ROOT

  @Input() selectedItem: any;

  /** txtPlaceholder: Giá trị text placeholder
   * Mặc định là 'Chọn giá trị' nếu không truyền gì
   */
  @Input() txtPlaceholder = 'Chọn giá trị'; // Giá trị placeholder khi chưa có lựa chọn

  @Output() selectedChangeOption = new EventEmitter();
  @Output() blurSelect = new EventEmitter();

  lstOptionsView: any[] = [];
  strSeletedOption = '';
  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {
    this.lstOptionsView = this.getCopyListOption();
    this.getSelectedText();
    this.convertDataListView();
  }

  // tslint:disable-next-line:typedef
  ngOnChanges(changes: SimpleChanges) {
    if (changes.lstOptions) {
      this.lstOptionsView = this.getCopyListOption();
      this.getSelectedText();
      this.convertDataListView();
    }
    if (changes.selectedItem) {
      this.getSelectedText();
      this.convertDataListView();
    }
  }

  // Khi người dùng click ra ngoài component => đóng danh sách lựa chọn (áp dụng nhiều cho case chọn multiple)
  @HostListener('document:click', ['$event'])
  documentClicked(event: any): void {
    if (this.isShowListItem && !this.eRef.nativeElement.contains(event.target)) {
      this.isShowListItem = false;
      this.txtSearch.nativeElement.value = '';
      this.onTxtSearchChanged();
      this.blurSelect.emit();
    }
  }

  onTxtSearchChanged(): void {
    let keyword = this.txtSearch.nativeElement.value;
    if (keyword && keyword !== '') {
      keyword = convertToLatinLowerCase(keyword.toLocaleLowerCase());
      this.lstOptionsView = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstOptions.length; i++) {
        const el = this.lstOptions[i];
        // tslint:disable-next-line:prefer-const
        let str = convertToLatinLowerCase(el.name.toLocaleLowerCase());
        if (str.includes(keyword)) {
          this.lstOptionsView.push(el);
        }
      }
    } else {
      this.lstOptionsView = this.getCopyListOption();
    }
    this.convertDataListView();
  }

  convertDataListView(): void {
    if (this.lstOptionsView.length > 0) {
      this.lstOptionsView.forEach(el => {
        if (this.selectedItem && this.selectedItem.code === el.code) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      });
    }
  }

  clickOption(optionSeleted): void {
    this.strSeletedOption = '';
    this.selectedItem = optionSeleted;
    this.convertDataListView();
    this.isShowListItem = false;
    this.getSelectedText();
    this.selectedChangeOption.emit(this.selectedItem);
    this.blurSelect.emit();
  }

  getSelectedText(): void {
    // tslint:disable-next-line:prefer-for-of
    if (this.selectedItem) {
      if (!this.selectedItem.name) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.lstOptionsView.length; i++) {
          if (this.selectedItem.code === this.lstOptionsView[i].code) {
            this.selectedItem.name = this.lstOptionsView[i].name;
          }
        }
      }
      this.strSeletedOption = this.selectedItem.name;
    }
  }

  getCopyListOption(): any[] {
    // tslint:disable-next-line:prefer-const
    let ret = [];
    this.lstOptions.forEach(val => ret.push(Object.assign({}, val)));
    return ret;
  }
}
