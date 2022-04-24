export interface DBContract {
  getAll(): Promise<any>;
  getByName(name: string): Promise<any>;
  create(data: any): Promise<any>;
}
