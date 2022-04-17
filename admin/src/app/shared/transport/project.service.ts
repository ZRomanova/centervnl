import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Project[]> {
    return this.http.get<Project[]>(`${URL}/api/projects`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<Project> {
    return this.http.get<Project>(`${URL}/api/projects/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/projects/${id}`)
  }

  create(data: any): Observable<Project> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Project>(`${URL}/api/projects`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Project> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Project>(`${URL}/api/projects/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, image?: File, images?: File[]): Observable<Project> {
    const fd = new FormData()
    if (image) fd.append('image', image, image.name)
    if (images) {
      for (let i = 0; i < images.length; i++) {
        fd.append(`gallery`, images[i], images[i].name)
      }
    }
    return this.http.patch<Project>(`${URL}/api/projects/${id}`, fd)
  }
}
