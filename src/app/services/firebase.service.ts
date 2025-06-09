import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { firebaseUrl } from '../firebaseUrl';


@Injectable({providedIn: 'root'})
export class FirebaseService {

  http = inject(HttpClient);


  getRequest<T>(name: string): Observable<T> {
    return this.http.get<T>(`${firebaseUrl}${name}.json`);
  }

  postRequest(url: string, body: any, options: any): Observable<ArrayBuffer> {
    return this.http.post(url, body, options);
  }
}

