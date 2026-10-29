import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Pollution } from './pollution';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private url = environment.apiUrl + '/pollutions';

  constructor(private http: HttpClient) {}

  getAll()                 { return this.http.get<Pollution[]>(this.url); }
  getById(id: string)      { return this.http.get<Pollution>(`${this.url}/${id}`); }
  create(p: Pollution)     { return this.http.post<Pollution>(this.url, p); }
  update(p: Pollution)     { return this.http.put<Pollution>(`${this.url}/${p.id}`, p); }
  delete(id: string)       { return this.http.delete(`${this.url}/${id}`); }
}
