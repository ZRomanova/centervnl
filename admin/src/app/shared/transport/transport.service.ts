import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  constructor(private http: HttpClient) { }

  fetch(path: string, params: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/api/${path}`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(path: string, id: string): Observable<any> {
    return this.http.get<any>(`${URL}/api/${path}/${id}`)
  }

  delete(path: string, id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/${path}/${id}`)
  }

  create(path: string, data: any): Observable<any> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<any>(`${URL}/api/${path}`, json, {headers: myHeaders})
  }

  update(path: string, id: string, data: any): Observable<any> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<any>(`${URL}/api/${path}/${id}`, json, {headers: myHeaders})
  }

  upload(path: string, id: string, image?: File, images?: File[]): Observable<any> {
    const fd = new FormData()
    if (image) fd.append('image', image, image.name)
    if (images) {
      for (let i = 0; i < images.length; i++) {
        fd.append(`gallery`, images[i], images[i].name)
      }
    }
    return this.http.patch<any>(`${URL}/api/${path}/${id}`, fd)
  }

}
