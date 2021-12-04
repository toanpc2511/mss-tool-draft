import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable } from 'rxjs';
import { DataResponse } from '../../../shared/models/data-response.model';
import { INews } from './model';
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { map, skipWhile } from 'rxjs/operators';

interface IParam {
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  url = 'https://sunoil-management.firecloud.live/files'

  constructor(private http: HttpService, private httpClient: HttpClient) { }

  getAll(params: IParam): Observable<DataResponse<INews[]>> {
    return this.http.get<INews[]>('news', { params: this.createParam(params) });
  }

  getDetail(id: string): Observable<DataResponse<INews>> {
    return this.http.get<INews>(`news/details/${id}`);
  }

  createParam(param: IParam): HttpParams {
    return new HttpParams()
      .set('page', param.page.toString())
      .set('size', param.size.toString());
  }

  create(data: INews): Observable<DataResponse<boolean>> {
    return this.http.post<boolean>('news', data);
  }

  update(data: INews, id: string): Observable<DataResponse<boolean>> {
    return this.http.put<boolean>(`news/${id}`, data);
  }

  delete(id: number): Observable<DataResponse<boolean>> {
    return this.http.delete<boolean>(`news/${id}`);
  }

  uploadImage(body: FormData) {
    const params = new HttpParams().set('type', 'IMAGE').set('callApiType', 'background');
    const request = new HttpRequest('POST', this.url, body, {
      reportProgress: true,
      responseType: 'json',
      params
    });

    return this.httpClient.request(request).pipe(
      map((response: any) => {
        if (response.type === HttpEventType.Response) {
          const data = {imageUrl: response.body.data[0].url};
          const init = { body: data }
          const res = new HttpResponse({ body: data });
          return res;
        }
      }),
      skipWhile(x => !x),
    );
  }
}
