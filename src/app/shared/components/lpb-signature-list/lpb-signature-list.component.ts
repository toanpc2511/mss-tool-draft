import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { environment } from 'src/environments/environment';
import { SignatureInfo } from '../../models/common.interface';
import { DataResponse } from '../../models/data-response.model';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-lpb-signature-list',
  templateUrl: './lpb-signature-list.component.html',
  styleUrls: ['./lpb-signature-list.component.scss']
})
export class LpbSignatureListComponent implements OnInit {
  lstSign: SignatureInfo[] = [];
  lstCoOwenSign: SignatureInfo[] = [];
  showSpinner = false;

  @Input() skipScreenSpinner = false;
  @Input() serviceName: string = 'deposit-service';
  private serviceRoute = `${environment.apiUrl}/deposit-service`;

  constructor(private http: HttpService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.serviceName){
      this.serviceRoute = `${environment.apiUrl}/${this.serviceName}`;
    }
  }

  fetchSignatures(cifNo: string): Observable<DataResponse<SignatureInfo[]>> {
    return this.http.get<SignatureInfo[]>(
      `${this.serviceRoute}/signatureInfo?cifNo=${cifNo}`,
      this.skipScreenSpinner ? { headers: { 'x-skip-spinner': 'true' } } : {}
    );
  }


  fetchCoOwnerSignatures(acn: string): Observable<DataResponse<SignatureInfo[]>> {
    return this.http.get<SignatureInfo[]>(
      `${this.serviceRoute}/signatureInfo/getSignatureCoOwner?acn=${acn}`,
      this.skipScreenSpinner ? { headers: { 'x-skip-spinner': 'true' } } : {}
    );
  }

  ngOnInit() {}

  getSignatures(cifNo: string) {
    if (!cifNo) {
      this.lstSign = [];
      this.endFetching();
      return;
    }

    this.fetchSignatures(cifNo.trim())
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

    this.fetchCoOwnerSignatures(acn.trim())
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
