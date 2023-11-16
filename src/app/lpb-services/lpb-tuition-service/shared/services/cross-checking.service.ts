import {Injectable} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrossCheckingService {
  urlApi: string;

  constructor(
    private http: HttpService
  ) {
    this.urlApi = `${environment.apiUrl}/water-service`;
  }

}
