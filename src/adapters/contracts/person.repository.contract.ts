import { Person } from '@/core/entities/Person';

export interface PersonRepositoryContract {
  getAllPersons(): Promise<Person[] | null>;
  getPersonByName(name: string): Promise<Person | null>;
  createPerson(person: Person): Promise<boolean>;
}
