import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {tap} from 'rxjs/operators'
import { environment } from 'src/environments/environment';

const URL = environment.url
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null
  private user = null

  constructor(private http: HttpClient) {
  }

  login(user): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${URL}/api/auth/login`, user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token)
            this.jwtDecode(token)
            this.setToken(token)
          }
        )
      )
  }

  jwtDecode(t) {
    this.user = JSON.parse(atob(t.split(' ')[1].split('.')[1]))
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return localStorage.getItem('auth-token')
  }

  isAuthenticated(): boolean {
    if (!this.token) this.token = this.getToken()
    return !!this.token
  }

  isAdmin(): boolean {
    if (this.isAuthenticated() && !this.user) this.jwtDecode(this.token)
    return !!(this.user && this.user.isAdmin)
  }

  logout() {
    this.setToken(null)
    localStorage.clear()
  }
}
