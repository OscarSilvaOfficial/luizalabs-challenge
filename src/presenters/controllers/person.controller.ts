import { Person } from '@/core/entities/Person';
import { personRepositoryFactory } from '@/infra/factories/repositories.factory';
import {
  PersonFriendsPayloadResponse,
  PersonPayload,
  PersonPayloadResponse,
} from '../helpers/payload.helper';
import { Route, Path, Controller, Get, Post, Body } from 'tsoa';

const personRepostiry = personRepositoryFactory();

@Route('persons')
export class PersonController extends Controller {
  @Get()
  async getAllPersons(): Promise<PersonPayloadResponse[]> {
    let persons;

    try {
      persons = await personRepostiry.getAllPersons();
    } catch (error) {
      this.setStatus(404);
      return;
    }

    const responseData = persons.map((person) => ({
      name: person.name,
      friends: person.friends.map((friendName) => friendName),
    }));

    return responseData;
  }

  @Get('{name}/friends')
  async getPersonFriends(
    @Path() name?: string,
  ): Promise<PersonPayloadResponse> {
    let person;

    try {
      person = await personRepostiry.getPersonByName(name);
    } catch (error) {
      this.setStatus(404);
      return;
    }

    return {
      name: person.name,
      friends: person.friends.map((friendName) => friendName),
    };
  }

  @Get('{name}/friendsOfFriends')
  async getPersonFriendsOfFriends(
    @Path() name?: string,
  ): Promise<PersonFriendsPayloadResponse> {
    let person;

    try {
      person = await personRepostiry.getPersonByName(name);
    } catch (error) {
      this.setStatus(404);
      return;
    }

    const friendsOfFriendsData = await Promise.all(
      person.friends.map(async (friendName) => {
        const friend = await personRepostiry.getPersonByName(friendName);
        return friend.friends || [];
      }),
    );

    const friendsOfFriends = [...new Set([].concat(...friendsOfFriendsData))];

    person = new Person({
      name: person.name,
      friends: person.friends,
      friendsOfFriends: friendsOfFriends,
    });

    return {
      name: person.name,
      friendsOfFriends: person.friendsOfFriends,
    };
  }

  @Post()
  async createPerson(@Body() personPayload: PersonPayload): Promise<object> {
    const friends = await Promise.all(
      personPayload.friends.map(async (friendName: string) => {
        let person;
        try {
          person = await personRepostiry.getPersonByName(friendName);
        } catch (error) {
          throw this.setStatus(404);
        }
        return person;
      }),
    );

    const personEntity = new Person({
      name: personPayload.name,
      friends: friends,
    });

    const dbResponse = await personRepostiry.createPerson(personEntity);

    if (!dbResponse) {
      this.setStatus(500);
      return;
    }

    this.setStatus(201);

    return {
      message: 'Person created',
    };
  }
}
