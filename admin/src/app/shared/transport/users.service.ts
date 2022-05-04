import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<User[]> {
    return this.http.get<User[]>(`${URL}/api/users`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchById(id: string): Observable<User> {
    return this.http.get<User>(`${URL}/api/users/${id}`)
  }

  update(id: string, data: any): Observable<User> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<User>(`${URL}/api/users/${id}`, json, {headers: myHeaders})
  }

}
