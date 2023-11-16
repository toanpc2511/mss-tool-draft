import {Component, OnInit} from '@angular/core';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {IError} from '../../../../system-configuration/shared/models/error.model';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {SettingFileService} from '../../../services/setting-file.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  fileName!: string;
  filesUpload: any;
  actions: ActionModel[] = [{
    actionName: 'Upload',
    actionIcon: 'send',
    actionClick: () => this.onUpload(),
  }];
  formUpload = this.fb.group({
    serviceName: ['', Validators.required],
    file: [null, Validators.required],
    description: ['', Validators.required]
  });
  files: any;

  constructor(private customNotificationService: CustomNotificationService,
              private settingFileService: SettingFileService,
              private fb: FormBuilder) {
  }


  ngOnInit(): void {
  }

  onFileSelect($event): void {
    this.files = $event;
  }

  onClearSelected($event): void {
    this.formUpload.get('file').patchValue(null);
  }

  onUpload(): void {
    // = files;
    // this.dataSource = [];
    const formData = new FormData();
    formData.append('file', this.files[0]);
    formData.append('serviceName', this.formUpload.get('serviceName').value);
    formData.append('description', this.formUpload.get('description').value);
    this.settingFileService.uploadFile(formData).pipe().subscribe((res) => {
      // this.actions = [];
      if (res) {
        this.customNotificationService.handleResponse(res);
      }
    }, (error: IError) => this.customNotificationService.handleErrors(error));
  }


}
