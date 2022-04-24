import { Person } from '@/core/entities/Person';
import { PersonNotFoundException } from '@/presenters/helpers/exception/db.exceptions';
import { DBContract } from '../contracts/db.contract';
import { PersonRepositoryContract } from '../contracts/person.repository.contract';

export class PersonRepository implements PersonRepositoryContract {
  constructor(private readonly db: DBContract<Person>) {}

  async getAllPersons(): Promise<Person[] | null> {
    const personData = await this.db.getAll();
    if (personData.length == 0)
      throw new PersonNotFoundException(`Person not found`);
    return await Promise.all(
      personData.map((person) => {
        return new Person({
          name: person.name,
          friends: person.friends,
        });
      }),
    );
  }

  async getPersonByName(name: string): Promise<Person | null> {
    const personData: any = await this.db.getByName(name);
    if (personData.length == 0)
      throw new PersonNotFoundException(`Person not found`);
    return new Person({
      name: personData.name,
      friends: personData.friends,
    });
  }

  async createPerson(person: Person): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
}
