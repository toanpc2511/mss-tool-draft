import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../../product/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-promotion-config-modal',
  templateUrl: './promotion-config-modal.component.html',
  styleUrls: ['./promotion-config-modal.component.scss']
})
export class PromotionConfigModalComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;

  constructor(
    public modal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
  }

  onClose() {
    this.modal.close();
  }

}

export interface IDataTransfer {
  title: string;
  promoConfig?: any;
}
