import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Report } from '../interfaces';

const URL = environment.url

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  fetch(params: any): Observable<Report[]> {
    return this.http.get<Report[]>(`${URL}/api/reports`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  fetchChapters(): Observable<string[]> {
    return this.http.get<string[]>(`${URL}/api/reports/chapters`)
  }

  fetchById(id: string): Observable<Report> {
    return this.http.get<Report>(`${URL}/api/reports/${id}`)
  }

  create(data: any): Observable<Report> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<Report>(`${URL}/api/reports`, json, {headers: myHeaders})
  }

  update(id: string, data: any): Observable<Report> {
    let json = JSON.stringify(data)
    const myHeaders = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.put<Report>(`${URL}/api/reports/${id}`, json, {headers: myHeaders})
  }

  upload(id: string, annual?: File, justice?: File, finance?: File): Observable<Report> {
    const fd = new FormData()
    if (annual) fd.append('annual', annual, annual.name)
    if (justice) fd.append('justice', justice, justice.name)
    if (finance) fd.append('finance', finance, finance.name)
    return this.http.patch<Report>(`${URL}/api/reports/${id}`, fd)
  }
}
