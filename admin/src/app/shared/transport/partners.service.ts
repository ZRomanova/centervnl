import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Partner } from '../interfaces';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class PartnersService {

  constructor(private http: HttpClient) { }

  fetch(): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${URL}/api/partners`)
  }

  fetchById(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${URL}/api/partners/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/partners/${id}`)
  }

  create(data: any): Observable<Partner> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Partner>(`${URL}/api/partners`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Partner> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Partner>(`${URL}/api/partners/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, image: File): Observable<Partner> {
    const fd = new FormData()
    fd.append('image', image, image.name)
    return this.http.patch<Partner>(`${URL}/api/partners/${id}`, fd)
  }
}
