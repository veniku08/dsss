import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type UserRole = 'DRIVER' | 'FLEET_MANAGER';

export class User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  licenseNumber?: string;
  employeeCode?: string;

  constructor() {
    super();
    this.email = '';
    this.name = '';
    this.role = 'DRIVER';
  }
}
