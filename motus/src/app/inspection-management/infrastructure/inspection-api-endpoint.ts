import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Inspection } from '../domain/model/inspection.entity';

@Injectable({ providedIn: 'root' })
export class InspectionApiEndpoint extends BaseApiEndpoint<Inspection> {
  constructor(private baseApi: BaseApi) {
    super(baseApi.getHttpClient(), `${baseApi.getBaseUrl()}/inspections`);
  }
}
