import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Staff } from '../interfaces';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${URL}/api/team`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchPositions(): Observable<string[]> {
    return this.http.get<string[]>(`${URL}/api/team/positions`)
  }

  fetchById(id: string): Observable<Staff> {
    return this.http.get<Staff>(`${URL}/api/team/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/team/${id}`)
  }

  create(data: any): Observable<Staff> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Staff>(`${URL}/api/team`, json, {headers: myHeaders})
  }

  add(id: string, data: any): Observable<Staff> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Staff>(`${URL}/api/team/${id}`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Staff> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Staff>(`${URL}/api/team/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, image: File): Observable<Staff> {
    const fd = new FormData()
    fd.append('image', image, image.name)
    return this.http.patch<Staff>(`${URL}/api/team/${id}`, fd)
  }
}
