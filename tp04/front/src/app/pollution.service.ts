import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Pollution } from './pollution';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private url = environment.apiUrl + '/pollutions';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Pollution[]>(this.url); }
  getById(id: number) { return this.http.get<Pollution>(`${this.url}/${id}`); }
  create(pollution: Pollution) { return this.http.post<Pollution>(this.url, pollution); }
  update(pollution: Pollution) {
    return this.http.put<Pollution>(`${this.url}/${pollution.id}`, pollution);
  }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
