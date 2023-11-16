import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CreditCardService} from '../shared/services/credit-card-issue.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {IError} from '../../../system-configuration/shared/models/error.model';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  noteForm: FormGroup;
  recordTosend = {items: []};
  idToSend = {ids: [], modifyNote: null};
  note: string = null;
  isModify = false;
  reason = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DetailsComponent>,
    private creditCardService: CreditCardService,
    private notify: CustomNotificationService,
    private fb: FormBuilder
  ) {
    this.noteForm = this.fb.group(
      {
        note: ''
      }
    );
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('100%', '100%');
    this.dialogRef.disableClose = true;
    console.clear();
  }

  back(): void {
    this.dialogRef.close( {events: 'Back'});
  }
  sendAprove(): void {
    this.note = this.noteForm.get('note').value.trim();
    this.data[0][0].note = this.note;
    this.recordTosend.items = this.data[0];
    this.creditCardService.sendApprove(this.recordTosend).subscribe(res => {
      if (res) {
        this.notify.success('Thông báo', 'Gửi duyệt thành công');
        this.dialogRef.close({events: 'Approved'});
      }
    }, (error: IError) => this.checkError(error));
  }

  checkError(error: IError): void {
    // ?
    if (error?.message) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  approveLv1(): void {
    this.idToSend.ids[0] = this.data[0][0].id;
    delete this.idToSend.modifyNote;
    this.creditCardService.approveLv1(this.idToSend).subscribe(res => {
      if (res) {
        this.notify.success('Thông báo', 'Gửi duyệt thành công');
        this.dialogRef.close({events: 'Approved'});
      }
    }, (error: IError) => this.checkError(error));
  }

  approveLv2(): void {
    this.idToSend.ids[0] = this.data[0][0].id;
    delete this.idToSend.modifyNote;
    this.creditCardService.approveLv2(this.idToSend).subscribe(res => {
      if (res) {
        this.notify.success('Thông báo', 'Duyệt thành công');
        this.dialogRef.close({events: 'Approved'});
      }
    }, (error: IError) => this.checkError(error));
  }

  openModifyDialog(): void {
    this.isModify = true;
  }
  modify(): void {
    this.idToSend.ids[0] = this.data[0][0].id;
    this.idToSend.modifyNote = this.reason.trim();
    this.creditCardService.sendModify(this.idToSend).subscribe(res => {
      if (res) {
        this.notify.success('Thông báo', 'Đã gửi yêu cầu bổ sung');
        this.dialogRef.close({events: 'Approved'});
      }
    }, (error: IError) => this.checkError(error));
  }

}
