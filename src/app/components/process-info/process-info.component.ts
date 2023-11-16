import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProcessItem } from '../../_models/process/ProcessItem';
import { MissionService } from '../../services/mission.service';
import { ProcessService } from '../../_services/process.service';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-process-info',
  templateUrl: './process-info.component.html',
  styleUrls: ['./process-info.component.css']
})
export class ProcessInfoComponent implements OnInit {
  processItem = new ProcessItem();
  isShowLoadingCallApi = false;
  subLoadingCallApi: Subscription;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  constructor(
    private errorHandler: ErrorHandlerService,
    private helpService: HelpsService,
    // tslint:disable-next-line:variable-name
    private _changeDetectionRef: ChangeDetectorRef,
  ) {
  }

  @Input() processId = '';
  @Output() processDetail = new EventEmitter<object>();
  ngOnInit(): void {
    this.getDetailCif();
    this.subLoadingCallApi = this.helpService.progressEvent.subscribe((isShowProgress) => {
      this.isShowLoadingCallApi = isShowProgress;
      this._changeDetectionRef.detectChanges();
    });
  }

  /**
   * lấy chi tiết cif
   */
  getDetailCif(): void {
    if (!this.processId) { return; }
    const body = {
      id: this.processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.processItem = res.item;
            this.processDetail.emit(res.item);
            if (!this.processItem) {
              this.errorHandler.showError('Không lấy được thông tin hồ sơ');
            }
          } else {
            this.errorHandler.showError('Không lấy được thông tin hồ sơ');
          }
        }
      }
    );
  }

}
