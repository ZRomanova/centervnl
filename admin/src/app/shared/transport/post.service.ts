import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Post[]> {
    return this.http.get<Post[]>(`${URL}/api/posts`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<Post> {
    return this.http.get<Post>(`${URL}/api/posts/${id}`)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${URL}/api/posts/${id}`)
  }

  create(data: any): Observable<Post> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Post>(`${URL}/api/posts`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Post> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Post>(`${URL}/api/posts/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, image?: File, images?: File[]): Observable<Post> {
    const fd = new FormData()
    if (image) fd.append('image', image, image.name)
    if (images || images.length) {
      for (let i = 0; i < images.length; i++) {
        fd.append(`gallery`, images[i], images[i].name)
      }
    }
    return this.http.patch<Post>(`${URL}/api/posts/${id}`, fd)
  }
}
