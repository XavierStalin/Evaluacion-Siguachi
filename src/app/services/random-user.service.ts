import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RandomUserResponse {
  results: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RandomUserService {
  private apiUrl = 'https://randomuser.me/api/';

  constructor(private httpClient: HttpClient) {}

  getUsers(count: number, nationalities: string = 'es,mx'): Observable<RandomUserResponse> {
    const url = `${this.apiUrl}?results=${count}&nat=${nationalities}`;
    return this.httpClient.get<RandomUserResponse>(url);
  }
}
