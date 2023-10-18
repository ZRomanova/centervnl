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

  fetch(type = 'documents'): Observable<Doc[]> {
    return this.http.get<Doc[]>(`${URL}/api/${type}/`)
  }

  fetchById(id: string,type = 'documents'): Observable<Doc> {
    return this.http.get<Doc>(`${URL}/api/${type}//${id}`)
  }

  delete(id: string, type = 'documents'): Observable<any> {
    return this.http.delete<any>(`${URL}/api/${type}/${id}`)
  }

  create(data: any, type = 'documents'): Observable<Doc> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Doc>(`${URL}/api/${type}`, json, {headers: myHeaders})
  }

  update(id: string, data: any, type = 'documents'): Observable<Doc> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Doc>(`${URL}/api/${type}/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, file: File, type = 'documents'): Observable<Doc> {
    const fd = new FormData()
    fd.append('file', file, file.name)
    return this.http.patch<Doc>(`${URL}/api/${type}/${id}`, fd)
  }
}
