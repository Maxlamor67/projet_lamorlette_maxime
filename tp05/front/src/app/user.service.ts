import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LoginResponse, User } from './user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = environment.apiUrl + '/api/users';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<User[]>(this.url); }
  getById(id: number) { return this.http.get<User>(`${this.url}/${id}`); }
  create(user: User) { return this.http.post<User>(this.url, user); }
  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.url}/login`, { username, password });
  }
  update(user: User) {
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }
  delete(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}