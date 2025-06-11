import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private apiKey = 'AIzaSyAXPqRzd843XcAQD3PPNpbVTj4cnCcwxyQ';

  constructor(private http: HttpClient) {}

  getChatCompletion(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    };

    const url = `${this.apiUrl}?key=${this.apiKey}`;
    return this.http.post(url, body, { headers });
  }
}
