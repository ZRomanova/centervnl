import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../interfaces';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Order[]> {
    return this.http.get<Order[]>(`${URL}/api/orders`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<Order> {
    return this.http.get<Order>(`${URL}/api/orders/${id}`)
  }

  update(id: string, data: any): Observable<Order> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Order>(`${URL}/api/orders/${id}`, json, {headers: myHeaders})
  }
}
