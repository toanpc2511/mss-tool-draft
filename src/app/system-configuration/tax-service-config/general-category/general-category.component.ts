import { Component, OnInit } from '@angular/core';
import {CATEGORY_TYPES} from '../../shared/contants/system-constant';
import {TaxServiceConfigService} from '../tax-service-config.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {FileService} from '../../../shared/services/file.service';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';
import {IError} from "../../shared/models/error.model";

@Component({
  selector: 'app-general-category',
  templateUrl: './general-category.component.html',
  styleUrls: ['./general-category.component.scss']
})
export class GeneralCategoryComponent implements OnInit {
  categoryTypes = CATEGORY_TYPES;
  constructor(
    private taxService: TaxServiceConfigService,
    private notify: CustomNotificationService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Cấu hình dịch vụ',
      'Thuế',
      'Danh mục dùng chung',
    ]);
  }

  onUpdate(api: string): void {
    this.taxService.asyncCategory(api).subscribe((x) => {
      this.notify.success('Thông báo', 'Cập nhật thông tin thành công');
    }, (error: IError) => {
      this.notify.handleErrors(error);
    });
  }

  exportFile(api: string): void {
    this.fileService.downloadFileMethodGet(api);
  }

}
