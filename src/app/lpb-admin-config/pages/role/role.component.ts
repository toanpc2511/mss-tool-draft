import { Component, OnInit } from '@angular/core';
import {Role} from '../../../_models/role';
import {getStatusCode} from '../../shared/functions/GetStatusCode';
import {PopupSystemEditRoleComponent} from '../../../manager-admin/popup-system-edit-role/popup-system-edit-role.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {MatDialog} from '@angular/material/dialog';
import {Pagination} from '../../../_models/pager';
import {RoleService} from '../../../_services/role.service';
import {PopupSystemAddRoleComponent} from '../../../manager-admin/popup-system-add-role/popup-system-add-role.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  lstAllRole: Role[] = [];
  lstRoles: Role[] = [];
  getStatusCode = getStatusCode;
  role: Role = new Role();
  activePage = 1;
  pageSize = 10;
  TOTAL_COUNT: any;
  pager: Pagination = new Pagination();
  isAdmin = false;
  constructor(private dialog: MatDialog,
              private roleService: RoleService) { }

  ngOnInit(): void {
    this.isAdmin = JSON.parse(localStorage.getItem('userRole')).code === 'UNIFORM.BANK.QUANTRI';
    this.getAllRole();
  }

  editRole(item: any): void {
    const dialogRef = this.dialog.open(PopupSystemEditRoleComponent, DialogConfig.configDialog(item));
    dialogRef.afterClosed().subscribe(rs => {
        this.getAllRole();
      }
    );
  }

  getAllRole(): void {
    this.role.titleCode = '';

    // tslint:disable-next-line:no-string-literal
    this.role['page'] = this.activePage;
    // tslint:disable-next-line:no-string-literal
    this.role['size'] = this.pageSize;
    this.roleService.getAllRoles(this.role).subscribe(rs => {
      // setTimeout(() => {
      this.lstAllRole = rs.items;
      if (this.lstAllRole !== null && this.lstAllRole.length > 0) {
        this.TOTAL_COUNT = rs.count;
        this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
      } else {
        this.lstAllRole = null;
      }

    }, err => {
      setTimeout(() => {
        this.lstAllRole = null;
      }, 2000);
    });

  }

  setActionPage(page, index: any): void {
    this.activePage = page;

    this.getAllRole();

  }
  changePageSize(size: string, index: any): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    // tslint:disable-next-line:radix
    const pageSize = parseInt(size);
    this.activePage = 1;
    this.getAllRole();

  }

  addRole(): void {
    const dialogRef = this.dialog.open(PopupSystemAddRoleComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
        this.getAllRole();
      }
    );
  }


}
