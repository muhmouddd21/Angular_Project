import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  http = inject(HttpClient);
  constructor() { }

    patchRequest(url: string, body: any, options: any): Observable<ArrayBuffer> {
      return this.http.patch(url, body, options);
    }
    putRequest(url: string, body: any, options: any): Observable<ArrayBuffer> {
      return this.http.put(url, body, options);
    }
}
