import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  fetch(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${URL}/api/tags`)
  }

  fetchById(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${URL}/api/tags/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/tags/${id}`)
  }

  create(data: any): Observable<Tag> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Tag>(`${URL}/api/tags`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Tag> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Tag>(`${URL}/api/tags/${id}`, json, {headers: myHeaders})
  }
}
