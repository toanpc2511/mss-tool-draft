import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {WaterService} from '../../shared/services/water.service';
import {takeUntil} from 'rxjs/operators';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BILL_OFFLINE_COLUMNS} from '../../shared/constants/water.constant';
import {DatePipe} from '@angular/common';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {IError} from '../../../../shared/models/error.model';
import {isKSV} from '../../../../shared/utilites/role-check';
import {FileService} from '../../../../shared/services/file.service';

@Component({
  selector: 'app-water-offline-detail',
  templateUrl: './water-offline-detail.component.html',
  styleUrls: ['./water-offline-detail.component.scss'],
  providers: [DestroyService]
})
export class WaterOfflineDetailComponent implements OnInit {
  id: string;
  actions: ActionModel[] = [];
  offlineForm: FormGroup;
  config = {
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true,
  };
  columns = BILL_OFFLINE_COLUMNS;
  billOfflineResponses: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private destroy$: DestroyService,
    private waterService: WaterService,
    private router: Router,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private notify: CustomNotificationService,
    private cdr: ChangeDetectorRef,
    private fileService: FileService
  ) {
    this.initForm();
  }

  initForm(): void {
    this.offlineForm = this.fb.group({
      supplier: [{value: '', disabled: true}],
      createdDate: [{value: '', disabled: true}],
      createdBy: [{value: '', disabled: true}],
      content: [{value: '', disabled: true}],
      status: [{value: '', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params.id) {
          this.id = params.id;
          this.getDetail();
        } else {
          this.router.navigate(['/water-service/data-offline']);
        }
      });
  }

  downloadFile(): void {
    const url = 'water-service/import/offline/export';
    const data = {importFileResponses: this.billOfflineResponses};
    this.fileService.downloadFile(url, data);
  }

  getDetail(): void {
    this.waterService.getDetailOffline(this.id)
      .subscribe((response) => {
        if (response.data) {
          this.offlineForm.patchValue({
            supplier: response.data.supplierName,
            createdDate: this.datepipe.transform(response.data.createdDate, 'dd/MM/yyyy'),
            createdBy: response.data.createdBy,
            content: response.data.description,
            status: response.data.statusName
          });
          this.billOfflineResponses = response.data?.billOfflineResponses || [];
          this.handleAction(response.data.statusCode);
          this.cdr.detectChanges();
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  handleAction(status: string): void {
    if (isKSV() && status === 'IN_PROCESS') {
      this.actions = [
        {
          actionName: 'Duyệt giao dịch',
          actionIcon: 'check',
          actionClick: () => this.onApprove()
        },
        {
          actionName: 'Từ chối duyệt',
          actionIcon: 'cancel',
          actionClick: () => this.onReject()
        }
      ];
    } else {
      this.actions = [];
    }
  }

  onApprove(): void {
    this.waterService.approveOffline({id: this.id})
      .subscribe((res) => {
        if (res.meta.code === 'uni01-00-200') {
          this.notify.success('Thông báo', 'Duyệt giao dịch thành công!');
          this.getDetail();
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  onReject(): void {
    this.waterService.rejectOffline({id: this.id})
      .subscribe((res) => {
        if (res.meta.code === 'uni01-00-200') {
          this.notify.success('Thông báo', 'Từ chối duyệt thành công!');
          this.getDetail();
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }
}
