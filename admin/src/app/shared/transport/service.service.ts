import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Service[]> {
    return this.http.get<Service[]>(`${URL}/api/services`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<Service> {
    return this.http.get<Service>(`${URL}/api/services/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/services/${id}`)
  }

  create(data: any): Observable<Service> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Service>(`${URL}/api/services`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Service> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Service>(`${URL}/api/services/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, image?: File, images?: File[]): Observable<Service> {
    const fd = new FormData()
    if (image) fd.append('image', image, image.name)
    if (images) {
      for (let i = 0; i < images.length; i++) {
        fd.append(`gallery`, images[i], images[i].name)
      }
    }
    return this.http.patch<Service>(`${URL}/api/services/${id}`, fd)
  }
}
