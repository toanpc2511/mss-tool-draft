import { Component, OnInit, Input } from '@angular/core';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { finalize } from 'rxjs/operators';
import { IdentityProfile } from '../../models/common.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { DOC_TYPES_VI } from '../../constants/identity-certification';

@Component({
  selector: 'app-lpb-identity-certification',
  templateUrl: './lpb-identity-certification.component.html',
  styleUrls: ['./lpb-identity-certification.component.scss']
})
export class LpbIdentityCertificationComponent implements OnInit {
  lstIDCerts: IdentityProfile[] = [];
  showSpinner = false;

  @Input() skipScreenSpinner = false;

  constructor(private http: HttpService) {}

  fetchAttachment(cif: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/attachment/attachment?cif=${cif}`,
      this.skipScreenSpinner ? { headers: { 'x-skip-spinner': 'true' } } : {}
    );
  }

  ngOnInit() {}

  getIdentityCerts(cifNo: string) {
    if (!cifNo) {
      this.lstIDCerts = [];
      this.endFetching();
      return;
    }

    this.fetchAttachment(cifNo?.trim())
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
