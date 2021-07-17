import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface PumpPole {

}

@Injectable({
  providedIn: 'root'
})
export class Step3Service {
  constructor(private http: HttpService) { }
  
}
