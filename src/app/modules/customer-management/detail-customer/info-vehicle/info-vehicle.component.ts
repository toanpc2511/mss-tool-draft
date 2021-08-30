import { Component, OnInit } from '@angular/core';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';
import { FormControl } from '@angular/forms';
import { ISortData } from '../../customer-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-vehicle',
  templateUrl: './info-vehicle.component.html',
  styleUrls: ['./info-vehicle.component.scss']
})
export class InfoVehicleComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource = [];
  nameVehicle: string;
  image1: string;
  image2: string;

  constructor(
    private modalService: NgbModal
  ) {
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
    this.sortData = null;

    this.dataSource = [
      {
        id: 1000,
        name: 'Phạm Công Toán',
        typeVehicle: 'toanpc',
        licensePlates: '18H111844',
        images: [
          {
            name: 'ảnh 1',
            url: 'https://dbk.vn/uploads/ckfinder/images/1-content/anh-dep-1.jpg'
          },
          {
            name: 'ảnh 2',
            url: 'https://cdnmedia.thethaovanhoa.vn/2011/06/28/10/10/traitim.jpg'
          }
        ]
      },
      {
        id: 1000,
        name: 'Phạm Công Toán',
        typeVehicle: 'toanpc',
        licensePlates: '29H74444',
        images: [
          {
            name: 'ảnh 1',
            url: 'https://znews-photo.zadn.vn/w660/Uploaded/rugtzn/2014_03_27/jakeolsonphotography10.jpg'
          },
          {
            name: 'ảnh 2',
            url: 'http://baoquangbinh.vn/dataimages/201610/original/images599179_anh_1_1475573097.jpg'
          }
        ]
      },
      {
        id: 1000,
        name: 'Phạm Công Toán',
        typeVehicle: 'toanpc',
        licensePlates: '30K158854',
        images: [
          {
            name: 'ảnh 1',
            url: 'http://truongnp.com/wp-content/uploads/2016/12/qua-tang-cuoc-song-bo-anh-tre-tho-dep-nhu-cotich08.jpg'
          },
          {
            name: 'ảnh 2',
            url: 'https://1.bp.blogspot.com/-X9C3JmqQbgI/Vpuxkh9BLWI/AAAAAAAARxU/k1g1exv3wT8/s1600/Hinh-anh-tre-em-mien-nui-dep-hon-nhien-%25281%2529.jpg'
          }
        ]
      }
    ];
  }

  ngOnInit() {
    this.getListCustomer();
  }

  getListCustomer() {
    console.log('danh sách khach han');
  }

  viewImages(content, item: any) {
    this.modalService.open(content, { size: 'lg' });

    this.nameVehicle = item.licensePlates;
    this.image1 = item.images[0].url;
    this.image2 = item.images[1].url;
  }

  sort(column: string) {
    if (this.sortData && this.sortData.fieldSort === column) {
      if (this.sortData.directionSort === 'ASC') {
        this.sortData = { fieldSort: column, directionSort: 'DESC' };
      } else {
        this.sortData = null;
      }
    } else {
      this.sortData = { fieldSort: column, directionSort: 'ASC' };
    }
    this.getListCustomer();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getListCustomer();
  }
}
