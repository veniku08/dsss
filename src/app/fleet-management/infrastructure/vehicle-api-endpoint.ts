import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Vehicle } from '../domain/model/vehicle.entity';

@Injectable({ providedIn: 'root' })
export class VehicleApiEndpoint extends BaseApiEndpoint<Vehicle> {
  constructor(private baseApi: BaseApi) {
    super(baseApi.getHttpClient(), `${baseApi.getBaseUrl()}/vehicles`);
  }
}
