import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDataService {
  http = inject(HttpClient);

  constructor() {}

  getRequest(url: string, options: any): Observable<ArrayBuffer> {
    return this.http.get(url, options);
  }

  patchRequest(url: string, body: any, options: any): Observable<any> {
    return this.http.patch(url, body, options);
  }
}
