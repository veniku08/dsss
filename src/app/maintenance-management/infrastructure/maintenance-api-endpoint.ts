import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { MaintenanceOrder } from '../domain/model/maintenance-order.entity';

@Injectable({ providedIn: 'root' })
export class MaintenanceApiEndpoint extends BaseApiEndpoint<MaintenanceOrder> {
  constructor(private baseApi: BaseApi) {
    super(baseApi.getHttpClient(), `${baseApi.getBaseUrl()}/maintenanceOrders`);
  }
}
