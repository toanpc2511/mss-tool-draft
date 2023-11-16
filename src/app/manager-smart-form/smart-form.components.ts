import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import { HelpsService } from '../shared/services/helps.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DocumentService } from '../_services/document.service';
import { PermissionConst } from '../_utils/PermissionConst';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {isRoot} from '../shared/utilites/role-check';
declare var $: any;
@Component({
  selector: 'smart-form',
  templateUrl: './smart-form.components.html',
  styleUrls: ['./smart-form.components.scss']
})
export class SmartFormComponent implements OnInit {
  isRoot = isRoot();
  PermissionConst = PermissionConst;
  title = 'a';
  time = new Date();
  timer: any;
  permissions: any = [];
  permissionMenu: any = [];
  name: any;
  index: any;
  parentName: string;
  childrenName: any;
  returnUrl: string;
  roleLogin: any = [];
  functionLogin: any = [];
  actionLogin: any = [];
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoadingCallApi = false;
  subLoadingCallApi: Subscription;
  branchCode = '';
  branchName = '';
  isShowMenuDSHS = false;
  isShowMenuDSHSDXL = false;
  isShowMenuTHE = false;
  isShowMenuTaoDS = false;
  isShowMenuDuyetDS = false;
  functionName = new FormControl('');
  streets = [
  ];
  userName = '';
  userRole:any;
  filteredStreets: Observable<any>;
  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    // tslint:disable-next-line:variable-name
    private _changeDetectionRef: ChangeDetectorRef,
    private helpService: HelpsService
  ) { }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
  ngOnInit(): void {
    $('.parentName').html('Quản lý Hồ sơ');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.branchCode = userInfo?.branchCode;
    this.branchName = userInfo?.branchName;
    const flag = JSON.parse(sessionStorage.getItem('flag'));
    this.name = userInfo?.fullName;
    this.userName = userInfo?.userName;
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.userRole = JSON.parse(localStorage.getItem('userRole'));
    this.functionLogin = JSON.parse(localStorage.getItem('function'));
    this.actionLogin = JSON.parse(localStorage.getItem('action'));
    const frontendAction = this.actionLogin.filter(action => action.feUrl);
    for (const key in frontendAction) {
      const parentName = this.findParentName(frontendAction[key].parentId);
      if (frontendAction[key].isMenu) {
        this.streets.push({
          textItem: parentName ? '[' + parentName + '] ' + frontendAction[key].name : frontendAction[key].name,
          pathImage: frontendAction[key].imagePath,
          urlRouter: frontendAction[key].feUrl
        });
      }

    }
    this.streets.sort((obj1, obj2) => {
      if (obj1.textItem > obj2.textItem) {
        return 1;
      }

      if (obj1.textItem < obj2.textItem) {
        return -1;
      }

      return 0;
    });
    const index = JSON.parse(localStorage.getItem('index'));
    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
    if ((index === undefined || index === null) && flag === null) {
      // this.checkPermission()
    } else {

    }
    this.subLoadingCallApi = this.helpService.progressEvent.subscribe((isShowProgress) => {
      this.isShowLoadingCallApi = isShowProgress;
      this._changeDetectionRef.detectChanges();
    });
    this.checkShowMenuBar();
    this.filteredStreets = this.functionName.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '').sort((a, b) => a.textItem - b.textItem)),
    );
  }
  private _filter(value: string): any {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(this.toLowerCaseNonAccentVietnamese(street.textItem)).includes(filterValue)).sort((a, b) => a.textItem - b.textItem);
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  checkShowMenuBar(): void {
    // this.isShowMenuQLHS = this.authenticationService.isAccessMenu('SYS_MANAGEMENT_USER');
    this.isShowMenuDSHS = this.authenticationService.isPermission(PermissionConst.HO_SO.DANH_SACH);
    this.isShowMenuDSHSDXL = this.authenticationService.isPermission(PermissionConst.HO_SO.DANH_SACH_DANG_XU_LY);
    this.isShowMenuTHE = this.authenticationService.isPermission(PermissionConst.KET_XUAT_THE.LIST);
    this.isShowMenuTaoDS = this.authenticationService.isPermission(PermissionConst.DOI_SOAT.DANH_SACH_CORE);
    this.isShowMenuDuyetDS = this.authenticationService.isPermission(PermissionConst.DOI_SOAT.DANH_SACH_CORE_PD);
  }

  // tslint:disable-next-line: typedef
  clickMenuAdmin(id: any) {
    localStorage.setItem('index', id);
    window.location.href = '/smart-form/admin';
  }

  logout() {
    this.authenticationService.logout();
  }
  viewHelp() {
    this.documentService.getFileReport().subscribe(data => {
      console.log(data);
      const blob = new Blob([data], { type: 'application/pdf' });
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = '06_Yeu cau tro giup KHCN.pdf';
      link.click();
    });
  }

  clickExportPendingCards() {
    window.location.href = '/export-cards';
  }

  navToProd(event: MatAutocompleteSelectedEvent): any {
    this.router.navigate([event.option.value]);
    this.functionName.setValue('');
  }
  toLowerCaseNonAccentVietnamese(str): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  findParentName(parentId): string {

    const frontendAction = this.actionLogin.filter(action => action.feUrl);
    let parentName = '';
    for (const key in frontendAction) {
      if (frontendAction[key].id === parentId) {
        if (!frontendAction[key].parentId) {
          parentName = frontendAction[key].name;
        } else {
          parentName = this.findParentName(frontendAction[key].parentId) + ' - ' + frontendAction[key].name;
        }
      }
      // this.streets.push({
      //   textItem: frontendAction[key].name,
      //   pathImage: frontendAction[key].imagePath,
      //   urlRouter: frontendAction[key].feUrl
      // });
    }
    return parentName;
  }
}
