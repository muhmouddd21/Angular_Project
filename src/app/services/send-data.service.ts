import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  http = inject(HttpClient);
  constructor() { }

    postRequest(url: string, body: any, options: any): Observable<ArrayBuffer> {
      return this.http.post(url, body, options);
    }
}
