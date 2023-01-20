import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  constructor(private http: HttpClient) { }

  fetch(params: any = {}): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${URL}/api/shops`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<Shop> {
    return this.http.get<Shop>(`${URL}/api/shops/${id}`)
  }

  // fetchGroups(shop: string): Observable<string[]> {
  //   return this.http.get<string[]>(`${URL}/api/shops/groups/${shop}`)
  // }

  // delete(id: string): Observable<any> {
  //   return this.http.delete<any>(`${URL}/api/shops/${id}`)
  // }

  create(data: any): Observable<Shop> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Shop>(`${URL}/api/shops`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Shop> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Shop>(`${URL}/api/shops/${id}`, json, {headers: myHeaders})
  }
}
