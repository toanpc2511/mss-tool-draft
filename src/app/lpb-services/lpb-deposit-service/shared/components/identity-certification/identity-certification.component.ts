import { Component, OnInit } from '@angular/core';
import { IdentityProfile } from '../../models/common';
import { DOC_TYPES_VI } from '../../constants/deposit-common';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { DepositCommonService } from '../../services/deposit-common.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-identity-certification',
  templateUrl: './identity-certification.component.html',
  styleUrls: ['./identity-certification.component.scss'],
})
export class IdentityCertificationComponent implements OnInit {
  lstIDCerts: IdentityProfile[] = [];
  showSpinner = false;

  constructor(private depositCommonService: DepositCommonService) {}

  ngOnInit() {}

  getIdentityCerts(cifNo: string) {
    if (!cifNo) {
      this.lstIDCerts = [];
      this.endFetching();
      return;
    }

    this.depositCommonService
      .getAttachment(cifNo?.trim())
      .pipe(
        finalize(() => {
          this.endFetching();
        })
      )
      .subscribe(
        (res) => {
          if (res) {
            this.lstIDCerts = this.transformIdentityCertResponse(res);
          }
        },
        (error) => {
          this.lstIDCerts = [];
          throw error;
        }
      );
  }

  transformIdentityCertResponse(items: IdentityProfile[]) {
    if (!items) {
      return [];
    }
    return items
      .filter((item) =>
        DOC_TYPES_VI.some((doc_type_vi) =>
          item.docTitle.includes(doc_type_vi.name)
        )
      )
      .map((item) => ({
        ...item,
        isImage: FilesHelper.checkImageFromMimeType(item.fileType),
        mimeType: item.fileType,
        fileUrl: FilesHelper.base64ToUrl({
          b64Data: item.fileContent,
          contentType: item.fileType,
        }),
      }));
  }

  startFetching(textSearch: string, type: 'cif' | 'acn' = 'cif') {
    this.showSpinner = true;
    if (type === 'cif') {
      this.getIdentityCerts(textSearch);
    } else {
    }
  }

  endFetching() {
    this.showSpinner = false;
  }
}
