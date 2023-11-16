import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserInfo } from '../_models/user';
import { environment } from 'src/environments/environment';
import { SearchUser } from '../_models/systemUsers';
import { Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Response } from '../_models/response';
@Injectable({ providedIn: 'root' })
export class RelationshipListService {
    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService) { }
    dto = {};
    getRelationshipList(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/guardianRelation/listAll`, this.dto);
    }
}
