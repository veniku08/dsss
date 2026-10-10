import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { User } from '../domain/model/user.entity';

@Injectable({ providedIn: 'root' })
export class AuthApiEndpoint extends BaseApiEndpoint<User> {
  constructor(private baseApi: BaseApi) {
    super(baseApi.getHttpClient(), `${baseApi.getBaseUrl()}/users`);
  }

  /**
   * Busca un usuario por email y password.
   * json-server soporta filtros vía query params.
   */
  findByCredentials(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?email=${email}&password=${password}`);
  }
}
