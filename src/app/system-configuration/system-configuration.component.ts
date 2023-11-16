import { HelpsService } from './../shared/services/helps.service';
import { DocumentService } from './../_services/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './../_services/authentication.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionConst } from '../_utils/PermissionConst';
declare var $: any;

@Component({
  selector: 'app-system-configuration',
  templateUrl: './system-configuration.component.html',
  styleUrls: ['./system-configuration.component.scss']
})
export class SystemConfigurationComponent implements OnInit {
  PermissionConst = PermissionConst;
  title: string = 'a';
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
  isShowMenuDSHS = false;
  isShowMenuDSHSDXL = false;
  isShowMenuTHE = false;
  isShowMenuTaoDS = false;
  isShowMenuDuyetDS = false;

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
    $('.parentName').html('Cấu hình hệ thống');
    // $('.childName').html('Cấu hình dịch vụ');
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.branchCode = userInfo?.branchCode;
    let flag = JSON.parse(sessionStorage.getItem("flag"));
    this.name = userInfo?.userName;
    this.roleLogin = JSON.parse(localStorage.getItem("role"));
    this.functionLogin = JSON.parse(localStorage.getItem("function"));
    this.actionLogin = JSON.parse(localStorage.getItem("action"));
    let index = JSON.parse(localStorage.getItem("index"));
    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
    if ((index === undefined || index === null) && flag === null) {
      // this.checkPermission()
    } else {
      // let permissionMenu = this.functionLogin
      // let permissions = this.actionLogin
      // let permissionMenuList = $('.menuParent')
      // permissionMenuList.each(function (index) {
      //   let p = $(this).children().attr('menu-data')
      //   if (!permissionMenu.includes(p)) {
      //     $(this).hide()
      //   }
      // })
      // let element = $('.checkPermission')
      // element.each(function (index) {
      //   let p = $(this).attr('permission-data')
      //   if (!permissions.includes(p)) {
      //     $(this).hide()
      //   }
      // })
    }
    this.subLoadingCallApi = this.helpService.progressEvent.subscribe((isShowProgress) => {
      this.isShowLoadingCallApi = isShowProgress;
      this._changeDetectionRef.detectChanges();
    });
    this.checkShowMenuBar();
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
      let blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "06_Yeu cau tro giup KHCN.pdf";
      link.click();
    });
  }

  clickExportPendingCards() {
    window.location.href = "/export-cards";
  }

}
