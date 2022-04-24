export interface DBContract<T> {
  getAll(): Promise<any>;
  getByName(name: string): Promise<any>;
  create(data: T): Promise<T>;
}
