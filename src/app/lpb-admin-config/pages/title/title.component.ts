import { Component, OnInit } from '@angular/core';
import {PopupSystemAddTitleComponent} from '../../../manager-admin/popup-system-add-title/popup-system-add-title.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {MatDialog} from '@angular/material/dialog';
import {Title, TitlePage} from '../../../_models/title';
import {Pagination} from '../../../_models/pager';
import {TitleService} from '../../../_services/title.service';
import {getStatusCode} from '../../shared/functions/GetStatusCode';
import {Role} from '../../../_models/role';
import {PopupSystemEditTitleComponent} from '../../../manager-admin/popup-system-edit-title/popup-system-edit-title.component';
import {PopupGroupTitleRoleComponent} from '../../../manager-admin/popup-group-title-role/popup-group-title-role.component';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  activePage = 1;
  pageSize = 10;
  pager: Pagination = new Pagination();
  lstTitles: Title[] = [];
  TOTAL_COUNT: any;
  getStatusCode = getStatusCode;
  lstRoles: Role[] = [];

  isAdmin = false;
  constructor(private dialog: MatDialog,
              private titleService: TitleService) { }

  ngOnInit(): void {
    this.isAdmin = JSON.parse(localStorage.getItem('userRole')).code === 'UNIFORM.BANK.QUANTRI';
    this.getLstTitle();
  }

  addTitle(): void {
    const dialogRef = this.dialog.open(PopupSystemAddTitleComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstTitle();
      }
    });
  }

  getLstTitle(): void {
    const obj = new TitlePage();
    obj.page = this.activePage;
    obj.size = this.pageSize;

    this.titleService.getlstTitle(obj).subscribe(rs => {

      // setTimeout(() => {
      this.lstTitles = rs.items;
      if (this.lstTitles !== null && this.lstTitles.length > 0) {
        this.TOTAL_COUNT = rs.count;
        this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
      } else {
        this.lstTitles = null;
      }

      // }, 2000);
    }, err => {
      setTimeout(() => {
        this.lstTitles = null;

      }, 2000);
    });
  }

  getLstRoleMapTitle(roles: any): any[] {
    const ar = roles !== null ? roles : [];
    const returnName = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.lstRoles.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < ar.length; j++) {
        if (this.lstRoles[i].id === ar[j]) {
          returnName.push(this.lstRoles[i].name);
        }
      }
    }
    return returnName;
  }

  editTitle(item: any): void {
    const data = {};
    // tslint:disable-next-line:no-string-literal
    data['id'] = item;
    // tslint:disable-next-line:no-string-literal
    data['lstRoles'] = this.lstRoles;
    const dialogRef = this.dialog.open(PopupSystemEditTitleComponent, DialogConfig.configDialog(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstTitle();
      }
    });
  }

  setActionPage(page, index: any): void {
    this.activePage = page;
    this.getLstTitle();

  }
  changePageSize(size: string, index: any): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    // tslint:disable-next-line:radix
    const pageSize = parseInt(size);
    this.activePage = 1;
    this.getLstTitle();

  }

  addRoleInTitle(): void {
    const dialogRef = this.dialog.open(PopupGroupTitleRoleComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getLstTitle();
      }
    });
  }
}
