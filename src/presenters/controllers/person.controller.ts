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
  async getAllPersons(_request: Request, response: Response) {
    let persons;

    try {
      persons = await this.personRepostiry.getAllPersons();
    } catch (error) {
      return response.status(404).json({
        message: error.message,
      });
    }

    const responseData = persons.map((person) => ({
      name: person.name,
      friends: person.friends.map((friendName) => friendName),
    }));

    return response.send(responseData);
  }

  @GET('/:name/friends')
  async getPersonFriends(request: Request, response: Response) {
    let person;
    const { name } = request.params;

    try {
      person = await this.personRepostiry.getPersonByName(name);
    } catch (error) {
      return response.status(404).json({
        message: error.message,
      });
    }

    return response.send({
      name: person.name,
      friends: person.friends.map((friendName) => friendName),
    });
  }

  @GET('/:name/friendsOfFriends')
  async getPersonFriendsOfFriends(request: Request, response: Response) {
    let person;
    const { name } = request.params;

    try {
      person = await this.personRepostiry.getPersonByName(name);
    } catch (error) {
      return response.status(404).json({
        message: error.message,
      });
    }

    const friendsOfFriendsData = await Promise.all(
      person.friends.map(async (friendName) => {
        const friend = await this.personRepostiry.getPersonByName(friendName);
        return friend.friends || [];
      }),
    );

    const friendsOfFriends = [...new Set([].concat(...friendsOfFriendsData))];

    person = new Person({
      name: person.name,
      friends: person.friends,
      friendsOfFriends: friendsOfFriends,
    });

    return response.send({
      name: person.name,
      friendsOfFriends: person.friendsOfFriends,
    });
  }

  @POST('/')
  async createPerson(request: Request, response: Response) {
    const personPayload: PersonPayload = { ...request.body };

    const friends = await Promise.all(
      personPayload.friends.map(async (friendName: string) => {
        let person;
        try {
          person = await this.personRepostiry.getPersonByName(friendName);
        } catch (error) {
          throw response.status(404).json({
            message: error.message,
          });
        }
        return person;
      }),
    );

    const personEntity = new Person({
      name: personPayload.name,
      friends: friends,
    });

    const dbResponse = await this.personRepostiry.createPerson(personEntity);

    if (!dbResponse) {
      return response.status(500).json({
        message: 'Error creating person',
      });
    }

    response.status(201).json({
      message: 'Person created',
    });
  }
}
