import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  columns = [
    {
      headerName: 'Số GD',
      headerProperty: 'id',
      headerIndex: 0,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 6,
      width: '200px',
      type: 'date',
      className: 'w-200-px'
    },
    {
      headerName: 'Mã khách hàng',
      headerProperty: 'customerId',
      headerIndex: 1,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Tên khách hàng',
      headerProperty: 'customerName',
      headerIndex: 2,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Số tiền',
      headerProperty: 'totalAmount',
      headerIndex: 3,
      width: '200px',
      type: 'currency',
      className: 'w-200-px'
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'tranDesc',
      headerIndex: 4,
      className: 'w-200-px'
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 5,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 6,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 7,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 8,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 9,
      width: '200px',
      className: 'w-200-px'
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 10,
      width: '200px',
      className: 'w-200-px'
    }
  ];
  config = {
    filterDefault: '',
    defaultSort: 'createdDate:ASC,supplierCode:ASC,customerName:ASC',
    hasSelection: true,
    hasNoIndex: true,
  };
  selectConfig = {
    isNewApi : false
  };
  searchForm = this.fb.group({
    customerId: [''],
    supplier: [''],
    branch: [''],
  });

  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // this.child.search([]);
    this.searchForm.get('supplier').valueChanges.subscribe(x => {
      console.log('supplier value changed')
      console.log(x);
    });
  }

  search(): any {
    const searchCondition = [
      {
        property: 'customerId',
        operator: 'eq',
        value: this.searchForm.get('customerId').value
      },
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.searchForm.get('supplier')?.value?.supplierCode
      }
    ];
    this.child.search(searchCondition);
  }

  onView(value): any {
    console.log('onView', value);
  }
  onEdit(value): any {
    console.log('onEdit', value);
  }
  onDelete(value): any {
    console.log('onDelete', value);
  }
  onAdd(): any {
    console.log('onAdd');
  }

  valueChange($event){
    console.log($event);
  }
}
