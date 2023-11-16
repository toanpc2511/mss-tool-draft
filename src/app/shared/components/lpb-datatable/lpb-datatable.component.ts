import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {environment} from 'src/environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {Pagination} from '../../../_models/pager';
import {SelectionModel} from '@angular/cdk/collections';
import {DatePipe, DecimalPipe} from '@angular/common';
import {HandleErrorService} from '../../../lpb-services/lpb-water-service/shared/services/handleError.service';
import {LpbDatatableConfig} from '../../models/LpbDatatableConfig';
import {LpbDatatableColumn} from '../../models/LpbDatatableColumn';
import {PaymentPeroidType, PaymentType} from '../../enums/PaymentType';
import {CustomNotificationService} from '../../services/custom-notification.service';
import {Router} from '@angular/router';
import {HIDE_SHOW_TABLE} from '../../../lpb-services/lpb-credit-card-service/shared/constants/credit-card-table';

@Component({
  selector: 'app-lpb-datatable',
  templateUrl: './lpb-datatable.component.html',
  styleUrls: ['./lpb-datatable.component.scss'],
})
export class LpbDatatableComponent implements OnInit, AfterViewInit, OnChanges {
  protected readonly HIDE_SHOW_TABLE = HIDE_SHOW_TABLE;
  displayAll = true;

  constructor(
    private http: HttpService,
    private matdialog: MatDialog,
    private datepipe: DatePipe,
    private numberPipe: DecimalPipe,
    private handleErrorService: HandleErrorService,
    private toastr: CustomNotificationService,
    private router: Router,
  ) {
  }

  searchFilter = '';
  actions: {
    icon: string;
    actionName: string;
    actionCode: string;
    routerLink: string;
    tabOrder: any;
  }[] = [];
  pagination: Pagination = new Pagination();
  isLoading = true;
  pageIndex = 1;
  pageSize = 10;
  isDisplayEdit = false;
  isDisplayDelete = false;
  isDisplayCancel = false;
  isDisplayReverse = false;
  isDisplayToggle = false;
  isDisplayApprove = false;
  isDisplayDownload = false;
  isDisplayPrint = false;
  isSelectAll = false;
  startRowOfPage = 1;
  endRowOfPage = 1;
  isChanged = false;
  @Input() disableCkAll = false;
  @Input() templateOther: TemplateRef<any>;
  @Input() apiServiceURL: string;
  @Input() dataSource = [];
  @Input() columns: LpbDatatableColumn[];
  @Input() clearSelected = false;
  @Input() checkboxConfig: {
    clearSelected: boolean
  };
  @Input() config?: LpbDatatableConfig = {
    filterDefault: '',
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: false,
    hasAddtionButton: true,
    hasPaging: true,
    hasRowClick: false,
    hiddenActionColumn: true,
    disableCheck: false,
    buttonOther: []
  };
  @Output() editAction = new EventEmitter<any>();
  @Input() tableName?: string;
  @Output() deleteAction = new EventEmitter<any>();
  @Output() cancelAction = new EventEmitter<any>();
  @Output() reverseAction = new EventEmitter<any>();
  @Output() viewAction = new EventEmitter<any>();
  @Output() approveAction = new EventEmitter<any>();
  @Output() downloadAction = new EventEmitter<any>();
  @Output() printAction = new EventEmitter<any>();

  @Output() changeStatusAction = new EventEmitter<any>();
  @Output() changeAction = new EventEmitter<any>();
  @Output() addAction = new EventEmitter<any>();
  @Output() chkClickChange = new EventEmitter<any>();
  @Output() chkAll = new EventEmitter<any>();
  @Output() getRowSelected: EventEmitter<any> = new EventEmitter();
  @Output() getRawData: EventEmitter<any> = new EventEmitter();
  @Output() onTableButtonClick: EventEmitter<any> = new EventEmitter();

  @Input() selection = new SelectionModel<any>(true, []);
  @Input() searchConditions: {
    property: string;
    operator: string;
    value: string;
  }[] = [];

  // @Input() isDisabledDelete?: (row: any) => string = (row) => false;
  @ViewChild('lpbDataTable') lpbDataTable: ElementRef;
  @Input() isDisabledUpdate?: (row: any) => boolean = (row) => false;
  @Input() isDisabledDelete?: (row: any) => boolean = (row) => false;
  @Input() isDisabledCancel?: (row: any) => boolean = (row) => false;
  @Input() isDisabledReverse?: (row: any) => boolean = (row) => false;

  @Input() outputHandleClick = false;
  @Output() selectionChange = new EventEmitter<any>();
  @Output() clickCheckAll = new EventEmitter<any>();
  @Output() clickCheckRow = new EventEmitter<any>();
  @Output() checkAllChange = new EventEmitter<any>();
  @Output() checkRowChange = new EventEmitter<any>();
  @Input() disableCkRow = false;
  // ngAfterViewInit(): void {
  //
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchConditions) {
      this.search(this.searchConditions);
      this.isChanged = true;
    }
    this.getRowSelected.emit(this.selection.selected);
    if (changes.clearSelected && this.clearSelected) {
      this.selection.clear();
      // changes.clearSelected.
    }
    if (changes.checkboxConfig) {
      if (changes.checkboxConfig.currentValue.clearSelected) {
        this.selection.clear();
      }
      console.log(changes.checkboxConfig);
    }
    if (changes.config && this.config.paymentConfig) {
      // console.log(changes.config);
      // this.dataSource.forEach((row) => this.selection.deselect(row));
      this.dataSource.map((row) => {
        this.selection.deselect(row);
        row.disabled = false;
        return row;
      });
      this.disableCkAll = false;
      this.fetchData(this.config.filterDefault);
    }
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    if (!this.isChanged) {
      this.fetchData(this.config.filterDefault);
    }

    this.columns.sort((obj1, obj2) => {
      if (obj1.headerIndex > obj2.headerIndex) {
        return 1;
      }

      if (obj1.headerIndex < obj2.headerIndex) {
        return -1;
      }

      return 0;
    });
    this.isDisplayApprove = this.approveAction.observers.length > 0;
    this.isDisplayDownload = this.downloadAction.observers.length > 0;
    const apiUrlWithoutParam = this.apiServiceURL
      ? this.apiServiceURL?.split('?')[0]
      : '';
    const actions = JSON.parse(localStorage.getItem('action')).filter((act) => {
      return act.url?.includes(apiUrlWithoutParam);
    });

    actions.forEach((act) => {
      if (act.url === apiUrlWithoutParam && act.method === 'PUT') {
        this.isDisplayEdit = true;
      }
      if (act.url === apiUrlWithoutParam && act.method === 'DELETE') {
        this.isDisplayDelete = true;
      }
      if (act.url === apiUrlWithoutParam + '/status') {
        this.isDisplayToggle = true;
      }
      if (act.url === apiUrlWithoutParam + '/cancel' && act.imagePath === 'ACTION_IN_ROW_CANCEL') {
        this.isDisplayCancel = true;
      }
      if (act.url === apiUrlWithoutParam + '/reverse' && act.imagePath === 'ACTION_IN_ROW_REVERSE') {
        this.isDisplayReverse = true;
      }
      if (act.url === apiUrlWithoutParam + '/print' && act.imagePath === 'ACTION_IN_ROW_PRINT') {
        this.isDisplayPrint = true;
      }
      if (act.feUrl && act.imagePath === 'BUTTON') {
        this.actions.push({
          icon: act.imagePath,
          actionName: act.name,
          routerLink: act.feUrl,
          tabOrder: act.tabOrder,
          actionCode: act.code
        });
      }
    });
    this.actions = this.actions.sort((obj1, obj2) => {
      if (obj1.tabOrder > obj2.tabOrder) {
        return 1;
      }

      if (obj1.tabOrder < obj2.tabOrder) {
        return -1;
      }

      return 0;
    });
  }

  search(
    searchConditions: {
      property: string;
      operator: string;
      value: string;
    }[]
  ): any {
    // let searchString = '';
    // searchConditions.forEach(item => {
    //   if (item.value) {
    //     searchString += item.property + '|' + item.operator + '|' + item.value + '&';
    //   }
    // });
    this.pageIndex = 1;
    if (searchConditions?.length && searchConditions.length > 0) {
      // console.log('search', searchConditions)
      // this.searchFilter = searchString;
      // const filter = searchString.substr(0, searchString.length - 1);
      // this.fetchData(filter);

      searchConditions = searchConditions.map((item) => ({
        ...item,
        value: item.value ? encodeURIComponent(item.value) : '',
      }));
      this.searchFilter = this.handleValueFilter(searchConditions);
      this.fetchData(this.handleValueFilter(searchConditions));
    } else {
      this.searchFilter = '';
      this.fetchData(this.config.filterDefault);
    }

    // this.params.filter += '';
  }

  handleValueFilter(conditions): string {
    const arr = [];
    const arrKeyOl = [];
    let valueKeyOl = '';
    const arrKeyOeq = [];
    let valueKeyOeq = '';
    let keyIn = '';
    const valueKeyIn = [];
    let keyNin = '';
    const valueKeyNin = [];
    // console.log(conditions);
    conditions.forEach((item) => {
      if (item.value) {
        switch (item.operator) {
          case 'ol':
            arrKeyOl.push(item.property);
            valueKeyOl = item.value;
            break;
          case 'oeq':
            arrKeyOeq.push(item.property);
            valueKeyOeq = item.value;
            break;
          // case 'in':
          //   keyIn = item.property;
          //   valueKeyIn.push(item.value);
          //   arr.push(`${keyIn}|in|${item.value}`);
          //   break;
          case 'nin':
            keyNin = item.property;
            valueKeyNin.push(item.value);
            break;
          default:
            arr.push(`${item.property}|${item.operator}|${item.value}`);
            break;
        }
      }
    });
    if (arrKeyOl.length > 0) {
      arr.push(`${arrKeyOl.join(',')}|ol|${valueKeyOl}`);
    }
    if (arrKeyOeq.length > 0) {
      arr.push(`${arrKeyOeq.join(',')}|oeq|${valueKeyOeq}`);
    }
    // if (keyIn && valueKeyIn.length > 0) {
    //   arr.push(`${keyIn}|in|${valueKeyIn.join(',')}`);
    // }
    if (keyNin && valueKeyNin.length > 0) {
      arr.push(`${keyNin}|nin|${valueKeyNin.join(',')}`);
    }
    // console.log(arr);
    return arr.join('&');
  }

  fetchData(filter): any {
    if (this.apiServiceURL) {
      const table =
        this.lpbDataTable?.nativeElement.querySelector('.table-hover');
      if (this.lpbDataTable) {
        const height = table.offsetHeight;
        table.style.height = height + 'px';
        this.lpbDataTable.nativeElement.style.minHeight = height + 'px';
      }

      this.dataSource = [];
      this.isLoading = true;
      const params = {
        page: `${this.pageIndex - 1}`,
        size: `${this.pageSize}`,
        filter,
        sort: !this.config.defaultSort ? '' : this.config.defaultSort,
      };
      this.http
        .get<any>(`${environment.apiUrl + this.apiServiceURL}`, {params})
        .toPromise()
        .then((res) => {
          this.dataSource = res.data;
          this.getRawData.emit(res);
          // replace old selected items with new ones
          const itemsToAdd = this.dataSource.filter((item) => {
            const foundItem = this.selection.selected.find((selectedItem) => {
              return selectedItem.id === item.id;
            });
            if (!foundItem) {
              return;
            }
            // removes item from selection
            this.selection.deselect(foundItem);
            this.selection.select(item);
            return item;
          });

          this.pagination = new Pagination(
            res.meta.total,
            this.pageIndex,
            this.pageSize
          );
        })
        .catch((err) => {
          this.toastr.handleErrors(err);
        })
        .finally(() => {
          this.isLoading = false;
          if (table) {
            table.style.height = '';
            const height = table.offsetHeight;
            this.lpbDataTable.nativeElement.style.minHeight = height + 'px';
          }
        });
    } else {
      this.isLoading = false;
      if (this.config.paymentConfig) {
        this.dataSource = this.dataSource.sort((row1, row2) => {
          const year1 = row1[this.config.paymentConfig.sortBy].split('/');
          const year2 = row2[this.config.paymentConfig.sortBy].split('/');
          const date1 = new Date(year1[0], year1[1], 1).getTime();
          const date2 = new Date(year2[0], year2[1], 1).getTime();
          // console.log(row1, row2, year1, year2);
          if (
            this.config.paymentConfig.paymentPeroidType === PaymentPeroidType.FAR_TO_NEAR
          ) {
            return date1 - date2;
          } else if (
            this.config.paymentConfig.paymentPeroidType === PaymentPeroidType.NEAR_TO_FAR
          ) {
            return date2 - date1;
          } else {
            return date1 - date2;
          }
        });
        switch (this.config.paymentConfig.paymentType) {
          case PaymentType.ALL:
            console.log('PaymentType.ALL');
            this.dataSource.map((row) => {
              this.selection.select(row);
              row.disabled = true;
              return row;
            });
            this.disableCkAll = true;
            this.chkAll.emit(this.selection.selected);
            break;
          case PaymentType.PART:
            console.log('PaymentType.PART');
            this.dataSource.map((row, index) => {
              if (this.config.paymentConfig.paymentPeroidType !== PaymentPeroidType.ANY) {
                if (index === 0) {
                  this.selection.select(row);
                }
                row.disabled = true;
                this.disableCkAll = true;
              }
              return row;
            });
            this.chkAll.emit(this.selection.selected);
            break;
          case PaymentType.ALL_OR_PART:
            console.log('PaymentType.ALL_OR_PART');
            // this.dataSource.map((row, index) => {
            //   if (index !== 0) {
            //     row.disabled = true;
            //   }
            //   return row;
            // });
            this.chkAll.emit(this.selection.selected);
            break;
          case PaymentType.SAME_TYPE:
            console.log('Result: 10');
            break;
          default:
            break;
        }

        // if(this.config.paymentConfig.paymentType === PaymentType.ALL) {
        //
        // }
        // console.log(this.dataSource);
      }
    }
  }

  edit($event, row): any {
    $event.stopPropagation();
    this.editAction.emit(row);
  }

  delete($event, row): any {
    $event.stopPropagation();
    this.deleteAction.emit(row);
  }

  cancel($event, row): any {
    $event.stopPropagation();
    this.cancelAction.emit(row);
  }

  reverse($event, row): any {
    $event.stopPropagation();
    this.reverseAction.emit(row);
  }

  view($event, row): any {
    $event.stopPropagation();
    this.viewAction.emit(row);
  }

  approve($event, row): any {
    $event.stopPropagation();
    this.approveAction.emit(row);
  }

  download($event, row): any {
    $event.stopPropagation();
    this.downloadAction.emit(row);
  }

  print($event, row): any {
    $event.stopPropagation();
    this.printAction.emit(row);
  }

  add(): any {
    this.addAction.emit();
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.fetchData(
      this.searchFilter ? this.searchFilter : this.config.filterDefault
    );
  }

  async setPage(pageIndex: number): Promise<any> {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    this.fetchData(
      this.searchFilter ? this.searchFilter : this.config.filterDefault
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  totalSelectedInPage(): number {
    const selectedInPage = this.dataSource.filter((item) => {
      const foundItem = this.selection.selected.find((selectedItem) => {
        return selectedItem.id === item.id;
      });
      if (!foundItem) {
        return;
      }

      return item;
    });
    return selectedInPage.length;
  }

  someComplete(): boolean {
    if (this.dataSource.length <= 0) {
      return false;
    }
    let isExist = false;
    this.dataSource.forEach((item) => {
      if (this.selection.selected.some(t => t.id === item.id)) {
        return isExist = true;
      } else {
        return false;
      }
    });
    const isSelectAll = this.selection.selected.length === this.dataSource.length;
    return isExist && !isSelectAll;
  }

  clearSelectedInPage(): void {
    const selectedInPage = this.dataSource.filter((item) => {
      const foundItem = this.selection.selected.find((selectedItem) => {
        return selectedItem.id === item.id;
      });
      if (!foundItem) {
        return;
      }
      this.selection.deselect(item);
      return item;
    });
  }

  isAllSelected(): any {
    // const numSelected = this.selection.selected.length;
    const numSelected = this.totalSelectedInPage();
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle($event): any {
    this.isAllSelected()
      ? // this.selection.clear() :
      this.clearSelectedInPage()
      : this.dataSource.forEach((row) => {
        this.selection.select(row);
        if ($event?.checked) {
          this.selection.select(row);
        } else {
          this.selection.deselect(row);
        }

        if (this.config?.isDisableRow && this.config?.isDisableRow(row)) {
          this.selection.deselect(row);
        }
      });

    if (this.config.paymentConfig?.paymentType === PaymentType.ALL_OR_PART) {
      this.dataSource.map((item) => {
        if (this.isAllSelected()) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
        return item;
      });
    }
    this.chkAll.emit(this.selection.selected);
  }

  log(): any {
  }

  changeStatus(row): void {
    this.changeAction.emit(row);
  }

  ngAfterViewInit(): void {
  }

  formatData(data, type): string {
    // return '';
    if ('date' === type) {
      return this.datepipe.transform(data, 'dd/MM/yyyy');
    } else if ('currency' === type) {
      return this.numberPipe.transform(data, '1.0-10');
    } else if ('datetime' === type) {
      return this.datepipe.transform(data, 'dd/MM/yyyy HH:mm:ss');
    } else {
      return data;
    }
  }

  // Get all selected row
  getSectionSelect(): any {
    return this.selection.selected;
  }

  // Clear all section
  clearSection(): void {
    this.selection.clear();
    this.selection.deselect();
  }

  handleClick($event, row, rowIndex): any {
    let invalid = false;
    const paymentConfig = this.config.paymentConfig;
    const currentItemSelected = this.selection.isSelected(row);
    const rowSelected = this.selection.selected;
    if (paymentConfig) {
      if ((paymentConfig.paymentType === PaymentType.PART || paymentConfig.paymentType === PaymentType.ALL_OR_PART)
        && paymentConfig.paymentPeroidType === PaymentPeroidType.ANY
      ) {

        console.log(currentItemSelected);
        if (!currentItemSelected) {
          if (rowSelected.length === 1) {
            invalid = true;
            $event.preventDefault();
          }
          this.disableCkAll = true;
        } else {
          if (paymentConfig.paymentType === PaymentType.ALL_OR_PART) {
            this.disableCkAll = false;
          }
        }
        // this.dataSource.map((item) => {
        //   if (this.isSelectAll) {
        //     item.disabled = true;
        //   } else {
        //     item.disabled = false;
        //   }
        //   return item;
        // });


      } else if ((paymentConfig.paymentType === PaymentType.PART || paymentConfig.paymentType === PaymentType.ALL_OR_PART)
        && paymentConfig.paymentPeroidType === PaymentPeroidType.MULTIPE) {
        console.log(currentItemSelected, rowIndex);
        if (rowIndex > 0) {
          console.log('currentItemSelected', currentItemSelected);
          if (!currentItemSelected) {

            const preItemSelected = this.selection.isSelected(
              this.dataSource[rowIndex - 1]
            );
            if (!preItemSelected) {
              invalid = true;
              $event.preventDefault();
            }
          } else {
            const nextItemSelected = this.selection.isSelected(
              this.dataSource[rowIndex + 1]
            );
            if (nextItemSelected) {
              invalid = true;
              $event.preventDefault();
            }
          }
        } else if (rowIndex === 0) {
          const nextItemSelected = this.selection.isSelected(
            this.dataSource[rowIndex + 1]
          );
          if (nextItemSelected) {
            invalid = true;
            $event.preventDefault();
          }
        }

      } else if ((paymentConfig.paymentType === PaymentType.PART || paymentConfig.paymentType === PaymentType.ALL_OR_PART)
        && (paymentConfig.paymentPeroidType === PaymentPeroidType.NEAR_TO_FAR || paymentConfig.paymentPeroidType === PaymentPeroidType.FAR_TO_NEAR)) {
        console.log('test');
        if (rowIndex > 0) {
          invalid = true;
          $event.preventDefault();
        }
        // if (!currentItemSelected) {
        //   const preItemSelected = this.selection.isSelected(
        //     this.dataSource[rowIndex - 1]
        //   );
        //   if (!preItemSelected) {
        //     invalid = true;
        //     $event.preventDefault();
        //   }
        // } else {
        //   const nextItemSelected = this.selection.isSelected(
        //     this.dataSource[rowIndex + 1]
        //   );
        //   if (nextItemSelected) {
        //     invalid = true;
        //     $event.preventDefault();
        //   }
        // }
      } else if (paymentConfig.paymentType === PaymentType.SAME_TYPE) {
        if (rowSelected.length > 0) {
          if (rowSelected[0][paymentConfig.type] !== row[paymentConfig.type]) {
            invalid = true;
            $event.preventDefault();
          }
        }
      }

      $event.stopPropagation();
    } else {
      if (currentItemSelected) {
        const nextItemSelected = this.selection.isSelected(
          this.dataSource[rowIndex + 1]
        );
        if (nextItemSelected) {
          invalid = true;
          $event.preventDefault();
        }
      } else {
        $event.stopPropagation();
      }
    }
    if (invalid) {
      let message = 'Bản ghi bạn chọn không đúng quy tắc thanh toán. Vui lòng chọn lại! ';
      if (paymentConfig.paymentType === PaymentType.SAME_TYPE) {
        message = 'Phải chọn hóa đơn cùng loại !';
      }
      if (paymentConfig.paymentPeroidType === PaymentPeroidType.ANY) {
        message = 'Bạn chỉ được chọn 1 kỳ !';
      }

      // this.handleErrorService.openMessageError(message);
      this.toastr.warning('Cảnh báo', message);
    }
    // this.getRowSelected.emit(this.selection.selected);
  }

  handleChange(row, rowIndex): void {
    let operatorType = 'plus';
    if (this.selection.isSelected(row)) {
      operatorType = 'sub';
    }
    this.chkClickChange.emit({row, operatorType});
    this.selection.toggle(row);
    this.getRowSelected.emit(this.selection.selected);
  }

  handleChange2(row, rowIndex): void {
    this.selection.toggle(row);
    this.getRowSelected.emit(this.selection.selected);
  }

  handleClassTick(row, column): string {
    const classCt = column.customStyleTick.valueProperty.find((p) => p.value === row[column.customStyleTick.property])?.class;
    return classCt;
  }

  onAdditionButtonClick(routerLink, actionCode): void {
    const rowSelected = this.selection.selected;
    if (routerLink) {
      if (routerLink.includes('{:id}')) {
        // console.log(routerLink);
        // this.router.navigate([routerLink.replace('{:id}', 'tettretretre')]);
        if (rowSelected.length === 1) {
          this.router.navigate([routerLink.replace('{:id}', rowSelected[0].id)]);
        } else {
          // this.router.navigate([routerLink, {id: rowSelected[0].id}]);
          this.toastr.warning('Cảnh báo', 'Bạn phải chọn duy nhất 1 bản ghi');
        }
      } else {
        this.router.navigate([routerLink]);
      }
    } else {
      this.onTableButtonClick.emit(actionCode);
    }

  }

  onClickCheckRow(event: any, row: any): void {
    if (this.disableCkRow) {
      return;
    }
    this.clickCheckRow.emit({origin: event, row});
  }

  onClickCheckAll(event: any): void {
    if (this.disableCkAll) {
      return;
    }
    this.clickCheckAll.emit(event);
  }

  onCheckRowChange(checked: any, row: any): void {
    if (checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
    this.selectionChange.emit(this.selection);
    this.checkRowChange.emit({checked, row});
  }

  onCheckAllChange(checked: any): void {
    if (checked) {
      this.selection.select(...this.dataSource);
    } else {
      this.selection.deselect(...this.dataSource);
    }
    this.selectionChange.emit(this.selection);
    this.checkAllChange.emit(checked);
  }

  isSelected(row: any): any {
    return this.selection.isSelected(row);
  }

  isSelectedAll(): any {
    const data = this.dataSource.filter((row) => {
      return this.selection.isSelected(row);
    });
    return this.dataSource.length === data.length;
  }

  isIndeterminate(): any {
    const data = this.dataSource.filter((row) => {
      return this.selection.isSelected(row);
    });
    return data.length > 0 && data.length < this.dataSource.length;
  }

  displayChange(column: any): void {
    column.hidden = !column.hidden;
  }

  someCompleteDisplay(): boolean {
    if (this.columns == null) {
      return false;
    }
    return this.columns.filter(t => t.hidden).length > 0 && this.displayAll;
  }

  setAllDisplay(completed: boolean): void {
    this.displayAll = completed;
    if (this.columns == null) {
      return;
    }
    this.columns.forEach(t => (t.hidden = !completed));
  }

  disableButtonOther(btn: any, row: any): boolean {
    if (typeof btn.isDisable !== 'function') {
      return false;
    }
    return btn.isDisable(row);
  }

}
