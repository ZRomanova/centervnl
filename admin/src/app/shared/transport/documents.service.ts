import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Doc } from '../interfaces';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  constructor(private http: HttpClient) { }

  fetch(): Observable<Doc[]> {
    return this.http.get<Doc[]>(`${URL}/api/documents`)
  }

  fetchById(id: string): Observable<Doc> {
    return this.http.get<Doc>(`${URL}/api/documents/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/documents/${id}`)
  }

  create(data: any): Observable<Doc> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Doc>(`${URL}/api/documents`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Doc> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Doc>(`${URL}/api/documents/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, file: File): Observable<Doc> {
    const fd = new FormData()
    fd.append('file', file, file.name)
    return this.http.patch<Doc>(`${URL}/api/documents/${id}`, fd)
  }
}
