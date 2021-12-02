import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable } from 'rxjs';
import { DataResponse } from '../../../shared/models/data-response.model';
import { INews } from './model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpService) { }

  getAll(): Observable<DataResponse<INews[]>> {
    return this.http.get<INews[]>('news');
  }

  create(data: INews): Observable<DataResponse<boolean>> {
    return this.http.post<boolean>('news', data);
  }

  update(data: INews, id: number): Observable<DataResponse<boolean>> {
    return this.http.put<boolean>(`news/${id}`, data);
  }

  delete(id: number): Observable<DataResponse<boolean>> {
    return this.http.delete<boolean>(`news/${id}`);
  }
}
