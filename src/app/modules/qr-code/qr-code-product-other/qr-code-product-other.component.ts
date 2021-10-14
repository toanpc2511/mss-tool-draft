import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../shared/services/destroy.service';

@Component({
  selector: 'app-qr-code-product-other',
  templateUrl: './qr-code-product-other.component.html',
  styleUrls: ['./qr-code-product-other.component.scss'],
  providers: [DestroyService]
})
export class QrCodeProductOtherComponent implements OnInit {
  dataRes;
  listStatus = LIST_STATUS;
  nameProduct: string;
  image: string;

  constructor(
    private modalService: NgbModal,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
  ) {
    this.dataRes = [
      {
        id: 1,
        productType: "Nhóm sản phẩm nhiên liệu",
        productName: "Xăng Ron 95",
        price: 15000,
        vat: 15,
        unit: "Lít",
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
        status: 'ACTIVE'
      },
      {
        id: 1,
        productType: "Nhóm sản phẩm nhiên liệu",
        productName: "Xăng Ron 95",
        price: 1500000000,
        vat: 15,
        unit: "Lít",
        qrCode: "https://chart.googleapis.com/chart?cht=qr&chl=ToanPC%20_%20VipPro&chs=250x250&choe=UTF-8&chld=L|2",
        status: 'INACTIVE'
      },
      {
        id: 2,
        productType: "Nhóm sản phẩm khác nhiên liệuNhóm sản phẩm khác nhiên liệu",
        productName: "Bánh gạo Bánh gạo Bánh gạo Bánh gạo Bánh gạo Bánh gạo ",
        price: 1602000000000,
        vat: 85,
        unit: "Gói Bánh gạo ",
        qrCode: "https://chart.googleapis.com/chart?cht=qr&chl=ToanPC%20_%20VipPro&chs=250x250&choe=UTF-8&chld=L|2",
        status: 'ACTIVE'
      },
      {
        id: 3,
        productType: "Nhóm sản phẩm nhiên liệu",
        productName: "Xăng A95 II",
        price: 15000,
        vat: 15,
        unit: "Lít",
        qrCode: "https://chart.googleapis.com/chart?cht=qr&chl=ToanPC%20_%20VipPro&chs=250x250&choe=UTF-8&chld=L|2",
        status: 'ACTIVE'
      }
    ];
  }

  ngOnInit(): void {
    console.log('a');
  }

  viewQrCode(content, item: any) {
    this.modalService.open(content, { size: 'md' });

    this.nameProduct = item.productName;
    this.image = item.qrCode;
  }
}
