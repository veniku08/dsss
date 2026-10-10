import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { TelemetryRecord } from '../domain/model/telemetry-record.entity';

@Injectable({ providedIn: 'root' })
export class TelemetryApiEndpoint extends BaseApiEndpoint<TelemetryRecord> {
  constructor(private baseApi: BaseApi) {
    super(baseApi.getHttpClient(), `${baseApi.getBaseUrl()}/telemetry`);
  }
}
