import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL = environment.url
@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }

  fetch(type: string): Observable<any> {
    return this.http.get<any>(`${URL}/api/files/${type}`)
  }

  create(data: any): Observable<any> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<any>(`${URL}/api/files/gallery`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<any> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<any>(`${URL}/api/files/gallery/${id}`, json, {headers: myHeaders})
  }

  upload(files?: File[]): Observable<any> {
    const fd = new FormData()
    for (let file of files) {
      fd.append('files', file, file.name)
    }
    return this.http.post<any>(`${URL}/api/files/server`, fd)
  }

  delete(type: string, id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/files/${type}`, {params: {id}})
  }
}
