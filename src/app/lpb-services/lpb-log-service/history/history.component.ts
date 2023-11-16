import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {FormBuilder} from '@angular/forms';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild(LpbDatatableComponent) lpbDatatable: LpbDatatableComponent;
  userInfo: any;
  userRole: any;
  isHoiSo = false;
  apiUrlUserListAll = '/process/userView/userListAll';
  apiUrlBranchListAll = '/process/userView/branchListAll';

  formSearch = this.fb.group({
    branchCode: [''],
    createdBy: ['']
  });


  columns = [
    {
      headerName: 'Mã giao dịch',
      headerProperty: 'transNo',
      headerIndex: 1,
      className: 'w-100-px'
    },
    {
      headerName: 'Mã dịch vụ',
      headerProperty: 'serviceCode',
      headerIndex: 2,
      className: 'w-50-px'
    },

    {
      headerName: 'Tên dịch vụ',
      headerProperty: 'serviceName',
      headerIndex: 3,
      className: 'w-50-px'
    },
    {
      headerName: 'Loại dịch vụ',
      headerProperty: 'serviceTypeName',
      headerIndex: 4,
      className: 'w-50-px'
    },
    {
      headerName: 'Tên khách hàng',
      headerProperty: 'customerName',
      headerIndex: 5,
      className: 'w-100-px'
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'description',
      headerIndex: 6,
      className: 'w-200-px'
    },
    {
      headerName: 'Mã CN',
      headerProperty: 'branchCode',
      headerIndex: 7,
      className: 'w-50-px'
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 8,
      className: 'w-50-px'
    }
  ];
  createBysState: {
    data: any;
    setData: any;
  };
  // setBgColor: (row: any) => string =
  config: LpbDatatableConfig = {
    filterDefault: '',
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasAddtionButton: true,
    rowBgColor: (row) => {
      let bgColor = '';
      if (row.status === 'CANCEL') {
        bgColor = 'bg-grey';
      } else if (row.status === 'APPROVE') {
        bgColor = 'bg-success';
      }
      // console.log(row);
      return bgColor;
    }
  };

  constructor(private router: Router,
              private fb: FormBuilder) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole'));


    if (this.userInfo?.branchCode === '001') {
      this.isHoiSo = true;
    }
  }

  ngOnInit(): void {
    // this.config.rowBgColor = this.setBgColor;
    console.log(this.userInfo);

    this.formSearch.get('branchCode').valueChanges.subscribe(value => {
      this.apiUrlUserListAll = '/process/userView/userListAll?branchCode=' + value;
      this.formSearch.get('createdBy').patchValue('');
    });
    this.formSearch.get('branchCode').patchValue(this.userInfo.branchCode);
    if (!this.isHoiSo) {
      this.formSearch.get('branchCode').disable();
    }
    if (this.userRole.code === 'UNIFORM.BANK.GDV' && !this.isHoiSo) {
      this.formSearch.get('createdBy').patchValue(this.userInfo.userName);
      this.formSearch.get('createdBy').disable();

    }
  }

  viewTransaction(row): any {
    let queryParams = {};
    if ('WATER_SERVICE' === row.serviceCode) {
      queryParams = {
        id: row.id
      };
    } else if ('DEPOSIT_SERVICE' === row.serviceCode) {
      queryParams = {
        transId: row.id
      };
    }
    const url = this.router.serializeUrl(
      this.router.createUrlTree([row.routerLink], {queryParams})
    );
    // console.log(url);
    window.open(url, '_blank');
    // this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["id"] } });
  }

  branchCodeClear(): void {
  }

  // filterSendBy({data, setData}): void {
  //   const user = data?.filter((e) => {
  //     if (e.roleIds?.length && e.roleIds.includes('1')) {
  //       return true;
  //     }
  //   });
  //   this.createBysState = {
  //     data: data?.filter((e) => e.roleIds?.length && e.roleIds.includes('1')),
  //     setData,
  //   };
  //   setData(user);
  // }

  searchTransaction(): void {
    console.log(this.formSearch.value);
    this.lpbDatatable.search([{
      property: 'branchCode',
      operator: 'eq',
      value: this.formSearch.get('branchCode').value
    }]);
  }
}
