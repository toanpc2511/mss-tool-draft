import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-detail-warring',
  templateUrl: './popup-detail-warring.component.html',
  styleUrls: ['./popup-detail-warring.component.scss']
})
export class PopupDetailWarringComponent implements OnInit {

  @Input() show = false;
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
