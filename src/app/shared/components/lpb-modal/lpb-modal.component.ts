import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-lpb-modal',
  templateUrl: './lpb-modal.component.html',
  styleUrls: ['./lpb-modal.component.scss']
})
export class LpbModalComponent implements OnInit {

  @Input() show = false;
  @Input() headerText = '';
  @Input() isNotAllowOutSideValid: any;
  @Input() widthContent = 80; // Chiều rộng modal
  @Input() heightContent = 75;  // Chiều cao modal
  @Input() unit = '%';  // Đơn vị px hoặc %
  @Input() marginTop = '100px';
  /**
   * modalType: Loại modal dùng cho việc search hay nhập thông tin
   * Nếu modalType = 'SEARCH' => z-index để 100
   * Nếu modalType = 'INFO' => z-index để 10
   */
  @Input() modalType = 'SEARCH';
  @Output() showChange = new EventEmitter<boolean>();
  @Output() hideModal = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    // console.log(this.show);
  }

  hide(): void {
    this.show = false;
    // this.showChange.emit(false);
    this.hideModal.emit();
  }

}
