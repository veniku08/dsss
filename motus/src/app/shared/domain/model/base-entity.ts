export abstract class BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
