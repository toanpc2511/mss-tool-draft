import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';

@Component({
  selector: 'app-popup-detail-attachment',
  templateUrl: './popup-detail-attachment.component.html',
  styleUrls: ['./popup-detail-attachment.component.css']
})
export class PopupDetailAttachmentComponent implements OnInit {

  @Input() attachmentId;
  detailAttachment: any;
  fileDown: any;

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private missionService: MissionService,
  ) { }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    this.getDetailAttachment();
  }

  ngOnInit(): void {
  }
  // lấy detial chữ ký
  getDetailAttachment(): void {
    const body = {
      id: this.attachmentId,
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.detailAttachment = res.item;
          }
        }
      }
    );
  }

  // tải file xuống
  downloadFile(): void {
    if (this.detailAttachment.fileContent === null) {
      return;
    }
    if (this.detailAttachment.fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      && this.detailAttachment.fileType !== 'application/pdf'
    ) {
      return;
    }
    if (this.detailAttachment.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const base64Doc = this.detailAttachment.fileContent;
      const linkSource = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64Doc;
      const downloadLink = document.createElement('a');
      const fileName = this.detailAttachment.fileName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
    if (this.detailAttachment.fileType === 'application/pdf') {
      const base64Pdf = this.detailAttachment.fileContent;
      const linkSource = 'data:application/pdf;base64,' + base64Pdf;
      const downloadLink = document.createElement('a');
      const fileName = this.detailAttachment.fileName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }

}
