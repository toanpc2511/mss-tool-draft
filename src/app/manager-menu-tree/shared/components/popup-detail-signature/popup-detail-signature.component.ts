import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-popup-detail-signature',
  templateUrl: './popup-detail-signature.component.html',
  styleUrls: ['./popup-detail-signature.component.css']
})
export class PopupDetailSignatureComponent implements OnInit, OnChanges {
  @Input() signatureId;
  detailSignature: any;
  fileDown: any;
  myimage: Observable<any>;
  isViewSignature = false;

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private missionService: MissionService,
  ) { }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    this.getDetailSignature();
  }
  ngOnInit(): void {
  }

  // lấy detial chữ ký
  getDetailSignature(): void {
    const body = {
      id: this.signatureId,
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.detailSignature = res.item;
          }
        }
      }
    );
  }

  // tải file xuống
  downloadFile(): void {
    if (this.detailSignature.fileContent === null) {
      return;
    }
    if (this.detailSignature.fileType !== 'image/jpeg'
      && this.detailSignature.fileType !== 'application/pdf'
      && this.detailSignature.fileType !== 'image/png'
    ) {
      return;
    }
    if (this.detailSignature.fileType === 'image/jpeg') {
      this.isViewSignature = true;
      const base64 = this.detailSignature.fileContent;
      const imageName = this.detailSignature.fileName;
      const imageBlob = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpg' });
      this.fileDown = imageFile;
      this.convertToBase64(this.fileDown);
    }
    if (this.detailSignature.fileType === 'application/pdf') {
      this.isViewSignature = false;
      const base64Pdf = this.detailSignature.fileContent;
      const linkSource = 'data:application/pdf;base64,' + base64Pdf;
      const downloadLink = document.createElement('a');
      const fileName = this.detailSignature.fileName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
    if (this.detailSignature.fileType === 'image/png') {
      this.isViewSignature = true;
      const base64 = this.detailSignature.fileContent;
      const imageName = this.detailSignature.fileName;
      const imageBlob = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
      this.fileDown = imageFile;
      this.convertToBase64(this.fileDown);
    }
  }

  // tslint:disable-next-line: typedef
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpg' });
    return blob;
  }
  // tslint:disable-next-line: typedef
  convertToBase64(file: File) {
    this.myimage = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
  }

  // tslint:disable-next-line: typedef
  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

}
