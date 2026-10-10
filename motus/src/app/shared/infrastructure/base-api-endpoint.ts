import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseEntity } from '../domain/model/base-entity';

export abstract class BaseApiEndpoint<T extends BaseEntity> {
  protected constructor(
    protected http: HttpClient,
    protected url: string
  ) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(resource: T): Observable<T> {
    return this.http.post<T>(this.url, resource);
  }

  update(id: number, resource: T): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, resource);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
