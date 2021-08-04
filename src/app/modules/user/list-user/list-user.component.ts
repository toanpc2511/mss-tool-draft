import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { IPaginatorState, PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { ISortData, IUser, UserService } from '../user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [DestroyService]
})
export class ListUserComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  status = LIST_STATUS;
  dataSource: Array<IUser> = [];
  paginatorState = new PaginatorState();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 15;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
  }

  ngOnInit() {
    this.getUsers();

    // Filter
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(() => {
          return this.userService.getUsers(
            this.paginatorState.page,
            this.paginatorState.pageSize,
            this.searchFormControl.value,
            this.sortData
          );
        }),
        tap((res) => {
          this.dataSource = res.data;
          this.paginatorState.recalculatePaginator(res.meta.total);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  // Get list product type
  getUsers() {
    this.userService
      .getUsers(
        this.paginatorState.page,
        this.paginatorState.pageSize,
        this.searchFormControl.value,
        this.sortData
      )
      .subscribe((res) => {
        this.dataSource = res.data;
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      });
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
    this.getUsers();
  }

  deleteUser(user: IUser): void {
    console.log(user);
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá thông tin tài khoản ${
        user?.code ? user?.code + ' - ' : ''
      }${user?.name || ''} ?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        
        this.userService.deleteUser(user.accountId).subscribe(
          (res) => {
            if (res.data) {
              this.getUsers();
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
      }
    });
  }

  openUserModal(accountId: number) {
    const modalRef = this.modalService.open(UserModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });
    // Sử dụng api get user by id để lấy data fill vào form sửa
    if (accountId) {
      modalRef.componentInstance.accountId = accountId;
    }
    modalRef.result.then((result) => {
      console.log('closed modal');
      this.cdr.detectChanges();
    });
  }

  checkError(error: IError) {
    if (error.code === '') {
    }
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getUsers();
  }
}
