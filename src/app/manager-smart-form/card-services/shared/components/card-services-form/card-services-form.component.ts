import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MODAL_TYPES } from '../../constants/card-service-constants';

@Component({
  selector: 'app-card-services-form',
  templateUrl: './card-services-form.component.html',
  styleUrls: ['./card-services-form.component.scss'],
})
export class CardServicesFormComponent implements OnInit, OnChanges {


  @Input() formGroup: FormGroup;
  @Input() title = '';
  @Input() isShowLoading = false;
  @Input() formType: 'SEND_APPROVE' | 'APPROVE' | 'LOCK';
  @Input() isDetail = false;
  @Input() showPinCount = false;
  @Input() allowEditAction = false;

  @Output() eventBackStep = new EventEmitter();
  @Output() eventOpenModal = new EventEmitter();

  enabledSend = true;

  MODAL_TYPES = MODAL_TYPES;
  submitButtonText = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formType){
      switch (changes.formType.currentValue){
        case 'SEND_APPROVE': {
          this.submitButtonText = 'Gửi duyệt';
          break;
        }

        case 'LOCK': {
          this.submitButtonText = 'Khóa Thẻ';
          break;
        }

        case 'APPROVE': {
          this.submitButtonText = 'Duyệt';
          break;
        }

        default: {
          this.submitButtonText = '';
          this.disableSend();
        }
      }
    }
  }

  ngOnInit(): void {
    // console.log("formGroup: ", this.formGroup.getRawValue());
    // console.log("formType: ", this.formType)
  }

  enableSend(): void {
    this.enabledSend = true;
  }

  disableSend(): void {
    this.enabledSend = false;
  }

  backToSearch(event): void {
    this.eventBackStep.emit(event);
  }

  openModal(modalType): void {
    this.eventOpenModal.emit({ modalType });
  }
}
