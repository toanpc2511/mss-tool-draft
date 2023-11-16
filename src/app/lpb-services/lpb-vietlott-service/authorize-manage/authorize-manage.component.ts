import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LIST_AGENT_TYPE} from '../shared/constants/vietlott.constant';
import {IError} from '../../../system-configuration/shared/models/error.model';
import {IAgent} from '../shared/models/vietlott.interface';
import {VietlottService} from '../shared/services/vietlott.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';
import {AUTHORIZE_MANAGE} from '../shared/constants/url.vietlott.service';
import {takeUntil} from 'rxjs/operators';
import {DestroyService} from '../../../shared/services/destroy.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-authorize-manage',
  templateUrl: './authorize-manage.component.html',
  styleUrls: ['./authorize-manage.component.scss'],
  providers: [DestroyService]
})
export class AuthorizeManageComponent implements OnInit {
  forms: FormGroup;
  isManage: boolean;
  listType = LIST_AGENT_TYPE;
  posId: string;
  agent: IAgent;
  branchCode: string;
  urlBranch = '';
  btApprove: boolean;
  userInfo: any;
  listDVKD: any [] = [];

  constructor(
    private fb: FormBuilder,
    private vietlottService: VietlottService,
    private notifyService: CustomNotificationService,
    private destroy$: DestroyService,
    private matDialog: MatDialog,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.isManage = false;
    this.btApprove = false;
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    BreadCrumbHelper.setBreadCrumb([
      'Gắn/xóa quyền quản lý',
    ]);
  }

  initFormGroup(): void {
    this.forms = this.fb.group({
      agentCode: ['', [Validators.required]],
      agentType: ['V2VL'],
      listDVKD: ['', [Validators.required]],
    });
    this.isManage = false;
  }


  listDVKDChange(): void {
    this.branchCode = this.forms.get('listDVKD').value.code;
  }

  agentCodeChange(): void {
    this.isManage = false;
    this.agent = null;
    this.branchCode = null;
    this.forms.get('listDVKD').patchValue(null);
    this.urlBranch = '';
    this.listDVKD = [];
  }

  search(): void {
    // Truy van thong tin gan quyen
    this.getDetailAuthorize();
  }

  // Truy van thong tin dai ly sang VA
  searchDetailAgent(): void {
    this.forms.controls.agentCode.markAllAsTouched();
    if (!this.forms.get('agentCode').value) {
      return;
    }
    this.posId = `${this.forms.get('agentType').value}${this.forms.get('agentCode').value}`;
    const params = {vPaymentAcc: this.posId};
    // lay thong tin dai ly moi nhat
    this.vietlottService.getDetailAgent(params)
      .subscribe((res) => {
        if (res.data) {
          this.agent = ({
            ...res.data
          });
          this.isManage = true;
          this.btApprove = false;
          this.urlBranch = AUTHORIZE_MANAGE;
          this.branchCode = null;
        }
      }, (error: IError) => {
        this.notifyService.error('Thất bại', 'Không tìm thấy thông tin đại lý');
      });
  }

// lay thong tin phan quyen quan ly trong DB UNIFORM
  getDetailAuthorize(): void {
    const param = `posId=${this.forms.get('agentCode').value}`;
    this.vietlottService.getDetailAuthorize(param)
      .subscribe((res) => {
        if (res.data.available === 'true') {
          this.agent = ({
            ...res.data
          });
          this.forms.get('listDVKD').patchValue(res.data.name);
          this.branchCode = res.data.code;
          this.listDVKD = [{code: res.data.code, name: res.data.name}];
          // Check branch
          this.isManage = (res.data.code === this.userInfo.branchCode || this.userInfo.branchCode === '100');
          // check trang thai gan quyen
          this.btApprove = res.data.recordStat === 'O';
        } else {
          // this.notifyService.error('Thông báo', 'Không tồn tại thông tin phân quyền quản lý');
          // Chua phan quyen, goi sang VA de truy van thong tin
          this.searchDetailAgent();
        }
      }, (error: IError) => this.notifyService.handleErrors(error));
  }

  checkRuleAuthorize(code: any, recordStat: any): void {
    // Check branch
    this.isManage = (code === this.userInfo.branchCode || this.userInfo.branchCode === '100');
    // check trang thai gan quyen
    this.btApprove = recordStat === 'O';
  }

  approveAuthorize(): void {
    const branch = this.forms.get('listDVKD').value;
    console.log('branch--', branch);
    const params = {
      posId: this.forms.get('agentCode').value,
      accName: this.agent.accName,
      accAddress: this.agent.accAddress,
      accPhoneNumber: this.agent.accPhoneNumber,
      accountCore: this.agent.accountCore,
      code: branch.code,
      name: branch.name,
      recordStat: 'O'
    };
    console.log('param--', params);
    this.vietlottService.approveAuthorize(params).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        if (res.data.message === 'Fail') {
          this.notifyService.error('Thông báo', `Gán quyền quản lý thất bại`);
        } else {
          this.notifyService.success('Thông báo', `Gán quyền quản lý thành công`);
          this.btApprove = true;
        }
        this.search();
      }
    }, (error: IError) => this.notifyService.error('Lỗi', error.message));
  }

  deleteAuthorize(): void {
    if (!this.forms.get('agentCode').value) {
      return;
    }
    const body = {posId: this.forms.get('agentCode').value};
    this.vietlottService.deleteAuthorize(body).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        if (res.data.message === 'Fail') {
          this.notifyService.error('Thông báo', `Xóa quyền quản lý thất bại`);
        } else {
          this.notifyService.success('Thông báo', `Xóa quyền quản lý thành công`);
          this.btApprove = false;
        }
        this.search();
      }
    }, (error: IError) => this.notifyService.error('Lỗi', error.message));
  }

  pathValueForm(data: IAgent): void {
    this.forms.patchValue({});
  }
}
