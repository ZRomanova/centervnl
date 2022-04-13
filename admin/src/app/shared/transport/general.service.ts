import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL = environment.url
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  fetch(type: string): Observable<any> {
    return this.http.get<any>(`${URL}/api/data/${type}`)
  }

  update(type: string, data: any): Observable<any> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<any>(`${URL}/api/data/${type}`, json, {headers: myHeaders})
  }
}
