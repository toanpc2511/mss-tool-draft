import { Component, OnInit, ViewChild } from '@angular/core';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';

@Component({
  selector: 'app-list-pending',
  templateUrl: './list-pending.component.html',
  styleUrls: [
    '../../shared/styles/common.scss',
    './list-pending.component.scss',
  ],
})
export class ListPendingComponent implements OnInit {
  filterDefault = '';
  columns = [
    {
      headerName: 'Mã đơn vị',
      headerProperty: 'unitCode',
      headerIndex: 1,
      className: 'w-150-px text-center justify-content-center',
    },
    {
      headerName: 'Số CIF',
      headerProperty: 'cifNo',
      headerIndex: 2,
      className: 'w-150-px',
    },
    {
      headerName: 'Số tài khoản',
      headerProperty: 'accountNo',
      headerIndex: 3,
      className: 'w-150-px',
    },
    {
      headerName: 'Số serial',
      headerProperty: 'serialNo',
      headerIndex: 4,
      className: 'w-150-px text-center justify-content-center',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'status',
      headerIndex: 5,
      className: 'w-150-px text-center justify-content-center',
    },
    {
      headerName: 'Loại tài khoản',
      headerProperty: 'accountClass',
      headerIndex: 6,
      className: 'w-150-px text-center justify-content-center',
    },
  ];

  data = [];

  checkedRows: any[] = [];

  @ViewChild('datatable') datatable: LpbDatatableComponent;
  constructor() {}

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb(['Danh sách sổ pending', '']);

    const createRandomArray = () => {
      let length = Math.floor(Math.random() * 100) + 1;

      const shuffleArray = (array) => {
        let n = array.length;
        for (let i = n - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      return shuffleArray(
        new Array(100).fill(undefined).map((e, i) => i + 1)
      ).slice(0, length);
    };

    setTimeout(() => {
      function createArray(size) {
        let result = [];
        let statuses = ['Active', 'Inactive', 'Fail'];
        let accountClasses = ['Premium', 'Standard'];
        for (let i = 1; i <= size; i++) {
          let obj = {
            cifNo: Math.floor(
              Math.random() * (9999999999999 - 1000000000000 + 1) +
                1000000000000
            ),
            unitCode: 'A' + i.toString().padStart(2, '0'),
            accountNo: Math.floor(
              Math.random() * (9999999999999 - 1000000000000 + 1) +
                1000000000000
            ),
            serialNo: i.toString().padStart(4, '0'),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            accountClass:
              accountClasses[Math.floor(Math.random() * accountClasses.length)],
          };
          result.push(obj);
        }
        return result;
      }

      this.data = createArray(100);

      const storeData = [...this.data];

      setInterval(() => {
        const randoms = createRandomArray();
        this.data = [
          ...storeData.filter((e, i) => {
            return randoms.some((r) => r === i);
          }),
        ];
        this.datatable.clearSection();
      }, 1000);
    }, 1000);
  }

  chkAll(e): void {
    this.checkedRows = [...e];
  }
  chkClickChange({
    row,
    operatorType,
  }: {
    row: any;
    operatorType: 'sub' | 'plus';
  }): void {
    this.checkedRows = this.checkedRows.filter((r) => r !== row);
    if (operatorType === 'plus') {
      this.checkedRows = [...this.checkedRows, row];
    }
  }

  onPushPending() {
    console.log('this.checkedRows', this.checkedRows);
  }
}
