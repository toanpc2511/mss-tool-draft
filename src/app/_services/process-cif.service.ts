import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {catchError, delay, map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({providedIn: 'root'})
export class CifService {
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  regiserCif(obj: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/process/openCIF`, obj).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }
}
