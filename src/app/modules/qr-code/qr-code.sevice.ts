import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  constructor(private http: HttpService) {}

}
