import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ModalActionsService} from '../../services/modal-actions.service';


@Component({
  selector: 'app-popup-manager-file.component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private modalService: ModalActionsService
  ) {
    // console.log(modalData);
  }

  // tslint:disable-next-line:typedef
    ngOnInit() {}

  // When the user clicks the action button, the modal calls the service\
  // responsible for executing the action for this modal (depending on\
  // the name passed to `modalData`). After that, it closes the modal
  // tslint:disable-next-line:typedef
  actionFunction() {
    this.modalService.modalAction(this.modalData);
    this.closeModal();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  // tslint:disable-next-line:typedef
  closeModal() {
    this.dialogRef.close();
  }
}
