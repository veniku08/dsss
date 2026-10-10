import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Incident } from '../domain/model/incident.entity';

@Injectable({ providedIn: 'root' })
export class IncidentApiEndpoint extends BaseApiEndpoint<Incident> {
  constructor(private baseApi: BaseApi) {
    super(baseApi.getHttpClient(), `${baseApi.getBaseUrl()}/incidents`);
  }
}
