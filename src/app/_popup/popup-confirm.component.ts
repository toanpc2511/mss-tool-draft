import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TextMessage} from '../_utils/_textMessage';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss']
})
export class PopupConfirmComponent implements OnInit {
  title: any;
  content: any;
  hidden = false;
  textMessage: TextMessage = new TextMessage();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<PopupConfirmComponent>) {
  }

  ngOnInit(): void {
    this.title = 'Xác nhận';
    if (this.data.data.number === 1) {
      this.hidden = true;
      this.content = this.textMessage.confirmSaveInformation;
    } else if (this.data.data.number === 2) {
      this.content = this.textMessage.confirmDeleteEmployee + this.data.data.employeeId;
    } else if (this.data.data.number === 3) {
      this.content = this.textMessage.confirmLockEmployee + this.data.data.employeeId;
    } else if (this.data.data.number === 4) {
      this.content = this.textMessage.confirmUnlockEmployee + this.data.data.employeeId;
    } else if (this.data.data.number === 5) {
      this.content = this.textMessage.confirmDeleteTitle + this.data.data.code;
    } else if (this.data.data.number === 6) {
      this.content = this.textMessage.confirmDeleteRole + this.data.data.code;
    } else if (this.data.data.number === 7) {
      this.content = this.textMessage.confirmDeleteFileCode + this.data.data.code;
    } else if (this.data.data.number === 8) {
      this.content = this.textMessage.confirmService;
    } else if (this.data.data.number === 9) {
      this.content = this.textMessage.confirmCloseFile;
    } else if (this.data.data.number === 10) {
      this.content = this.textMessage.confirmAllService;
    } else if (this.data.data.number === 11) {
      this.content = this.textMessage.confirMmanipulation;
    } else if (this.data.data.number === 12) {
      this.content = this.textMessage.confirmFile;
    } else if (this.data.data.number === 13) {
      this.content = this.textMessage.confirmDeleteFile;
    } else if (this.data.data.number === 14) {
      this.content = this.textMessage.confirmDeleteAccount + this.data.data.code;
    } else if (this.data.data.number === 15) {
      this.content = this.textMessage.confirmDeletePermision;
    } else if (this.data.data.number === 16) {
      this.content = this.textMessage.confirmDeleteCoowner;
    } else if (this.data.data.number === 17) {
      this.content = this.textMessage.confirmStopMmanipulation;
    } else if (this.data.data.number === 18) {
      this.content = this.textMessage.confirmDeleteLegalRepresentative;
    } else if (this.data.data.number === 19) {
      this.content = this.textMessage.confirm;
    } else if (this.data.data.number === 20) {
      this.content = this.textMessage.confirmDeleteMainCard;
    } else if (this.data.data.number === 21) {
      this.content = this.textMessage.confirmDeleteSupCard;
    } else if (this.data.data.number === 22) {
      this.content = this.textMessage.rejectProcess;
    }else if (this.data.data.number === 24) {
      this.content = this.textMessage.confirmDeleteEbank;
    } else if (this.data.data.number === 23) {
      this.content = this.textMessage.confirmDeleteFileCode;
    }else if (this.data.data.number === 25) {
      this.content = this.textMessage.confirmDeadTroyEbank;
    }else if (this.data.data.number === 26) {
      this.content = this.textMessage.confirmSendApproveOne;
    }else if (this.data.data.number === 27) {
      this.content = this.textMessage.confirmSendRejectOne;
    }else if (this.data.data.number === 28) {
      this.content = this.textMessage.confirmSendModifyOne;
    }

  }

  closeDialog(index: any): void {
    this.dialogRef.close(index);
  }
}
