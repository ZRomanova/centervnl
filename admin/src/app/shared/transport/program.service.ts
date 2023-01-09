import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Program } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Program[]> {
    return this.http.get<Program[]>(`${URL}/api/programs`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<Program> {
    return this.http.get<Program>(`${URL}/api/programs/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/programs/${id}`)
  }

  create(data: any): Observable<Program> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Program>(`${URL}/api/programs`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Program> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Program>(`${URL}/api/programs/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, image?: File, images?: File[]): Observable<Program> {
    const fd = new FormData()
    if (image) fd.append('image', image, image.name)
    if (images) {
      for (let i = 0; i < images.length; i++) {
        fd.append(`gallery`, images[i], images[i].name)
      }
    }
    return this.http.patch<Program>(`${URL}/api/programs/${id}`, fd)
  }
}
