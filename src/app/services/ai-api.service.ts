// src/app/services/openrouter.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenrouterService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private apiKey =
    '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';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': '<YOUR_SITE_URL>', // Optional
      'X-Title': '<YOUR_SITE_NAME>', // Optional
    });

    const body = {
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
