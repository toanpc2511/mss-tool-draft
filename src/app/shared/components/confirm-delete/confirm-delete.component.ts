import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IConfirmModalData } from '../../models/confirm-delete.interface';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {
  @Input() data: IConfirmModalData;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
}
