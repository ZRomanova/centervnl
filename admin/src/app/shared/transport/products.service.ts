import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${URL}/api/products`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<Product> {
    return this.http.get<Product>(`${URL}/api/products/${id}`)
  }

  // delete(id: string): Observable<any> {
  //   return this.http.delete<any>(`${URL}/api/products/${id}`)
  // }

  create(data: any): Observable<Product> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Product>(`${URL}/api/products`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Product> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Product>(`${URL}/api/products/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, image?: File, images?: File[]): Observable<Product> {
    const fd = new FormData()
    if (image) fd.append('image', image, image.name)
    if (images) {
      for (let i = 0; i < images.length; i++) {
        fd.append(`gallery`, images[i], images[i].name)
      }
    }
    return this.http.patch<Product>(`${URL}/api/products/${id}`, fd)
  }
}
