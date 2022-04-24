import { PersonRepository } from '@/adapters/repositories/person.repository';
import { Person } from '@/core/entities/Person';
import { personRepositoryFactory } from '@/infra/factories/repositories.factory';
import { Request, Response } from 'express';
import {
  basePath as Router,
  get as GET,
  post as POST,
} from 'express-decorators';
import { PersonPayload } from '../helpers/payload.helper';

@Router('/persons')
export class PersonController {
  personRepostiry: PersonRepository;

  constructor() {
    this.personRepostiry = personRepositoryFactory();
  }

  @GET('/')
  async getAllPersons() {
    return this.personRepostiry.getAllPersons();
  }

  @POST('/')
  async createPerson(request: Request, response: Response) {
    const personPayload: PersonPayload = { ...request.body };
    let friends: Person[] = [];

    try {
      friends = await Promise.all(
        personPayload.friends.map(async (friendName: string) => {
          const response = await this.personRepostiry.getPersonByName(
            friendName,
          );
          return response;
        }),
      );
    } catch (error) {
      const { message } = error;
      return response.status(400).json({
        message: message,
      });
    }

    const personEntity = new Person({
      name: personPayload.name,
      friends: friends,
    });

    const dbResponse = await this.personRepostiry.createPerson(personEntity);

    response.send(dbResponse);
  }
}
