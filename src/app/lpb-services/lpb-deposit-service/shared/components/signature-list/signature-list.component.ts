import { Component, OnInit } from '@angular/core';
import { SignatureInfo } from '../../models/common';
import { BehaviorSubject } from 'rxjs';
import { DepositCommonService } from '../../services/deposit-common.service';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-signature-list',
  templateUrl: './signature-list.component.html',
  styleUrls: ['./signature-list.component.scss'],
})
export class SignatureListComponent implements OnInit {
  lstSign: SignatureInfo[] = [];
  lstCoOwenSign: SignatureInfo[] = [];
  showSpinner = false;

  constructor(private depositCommonService: DepositCommonService) {}

  ngOnInit() {}

  getSignatures(cifNo: string) {
    if (!cifNo) {
      this.lstSign = [];
      this.endFetching();
      return;
    }

    this.depositCommonService
      .getSignatures(cifNo.trim())
      .pipe(
        finalize(() => {
          this.endFetching();
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.lstSign = this.transformSignatureInfoResponse(res.data);
          }
        },
        (error) => {
          this.lstSign = [];
          throw error;
        }
      );
  }

  getCoOwnerSignatures(acn: string){
    if (!acn) {
      this.lstCoOwenSign = [];
      this.endFetching();
      return;
    }

    this.depositCommonService
      .getCoOwnerSignatures(acn.trim())
      .pipe(
        finalize(() => {
          this.endFetching();
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.lstCoOwenSign = this.transformSignatureInfoResponse(res.data);
          }
        },
        (error) => {
          this.lstCoOwenSign = [];
          throw error;
        }
      );
  }

  transformSignatureInfoResponse(data: SignatureInfo[]) {
    return data.map((item) => {
      const fileType = item.fileType?.toLowerCase() || '';
      const newItem = {
        ...item,
        isImage: FilesHelper.checkImageByExtension(fileType),
        mimeType: FilesHelper.getMimeTypeFromExt(fileType),
        fileUrl: FilesHelper.base64ToUrl({
          b64Data: item.fileContent,
          contentType: FilesHelper.getMimeTypeFromExt(fileType),
        }),
      };
      if (item.fileContent.trim().slice(0, 4) === 'data') {
        const mimeType = item.fileContent.match(/data:(.*);base64/)[1];
        newItem.isImage = FilesHelper.checkImageFromMimeType(mimeType);
        newItem.mimeType = mimeType;
        newItem.fileUrl = item.fileContent;
        newItem.fileContent = item.fileContent.match(',(.*)')[1].trim();
      }
      return newItem;
    });
  }

  startFetching(textSearch: string, type: 'cif' | 'acn' = 'cif') {
    this.showSpinner = true;
    if (type === 'cif') {
      this.getSignatures(textSearch);
    } else {
      this.getCoOwnerSignatures(textSearch);
    }
  }

  endFetching() {
    this.showSpinner = false;
  }
}
