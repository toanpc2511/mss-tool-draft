import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
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
  page = 1;
  size = 15;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUsers();

    // Filter
    this.searchFormControl.valueChanges
      .pipe(
        switchMap(() => {
          return this.userService.getUsers(
            this.page,
            this.size,
            this.searchFormControl.value,
            this.sortData
          );
        }),
        tap((res) => {
          this.dataSource = res.data;
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  // Get list product type
  getUsers() {
    this.userService
      .getUsers(this.page, this.size, this.searchFormControl.value, this.sortData)
      .subscribe((res) => {
        this.dataSource = res.data;
        this.cdr.detectChanges();
      });
  }

  sort(column: string) {
    if (this.sortData && this.sortData.fieldSort === column) {
      if (this.sortData.directionSort === 'asc') {
        this.sortData = { fieldSort: column, directionSort: 'desc' };
      } else {
        this.sortData = null;
      }
    } else {
      this.sortData = { fieldSort: column, directionSort: 'asc' };
    }
  }

  deleteUser(user: IUser): void {
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

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4124') {
      this.toastr.error('Nhóm sản phẩm không thể chỉnh sửa');
    }
  }
}
