import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Checkout } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class CheckoutsService {

  constructor(private http: HttpClient) { }

  fetch(service: string, date: Date, params: any): Observable<Checkout[]> {
    return this.http.get<Checkout[]>(`${URL}/api/registrations/${service}/${date}`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchDates(service: string): Observable<Date[]> {
    return this.http.get<Date[]>(`${URL}/api/registrations/groups/${service}`)
  }

  fetchById(id: string): Observable<Checkout> {
    return this.http.get<Checkout>(`${URL}/api/registrations/${id}`)
  }

  update(id: string, data: any): Observable<Checkout> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Checkout>(`${URL}/api/registrations/${id}`, json, {headers: myHeaders})
  }
}

