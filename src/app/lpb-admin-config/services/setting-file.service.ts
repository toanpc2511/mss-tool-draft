import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataResponse} from '../../shared/models/data-response.model';
import {environment} from '../../../environments/environment';
import {API_BASE_URL} from '../../lpb-services/lpb-money-transfer-limit-service/shared/constants/Constants';
import {HttpService} from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class SettingFileService {

  private serviceRoute = `${environment.apiUrl}/lpb-common-service`;

  constructor(private http: HttpService) {
  }

  uploadFile(request): Observable<DataResponse<any>> {
    return this.http.postUpload<Array<File>>(`${this.serviceRoute}/file/upload`, request);
  }
}
