import { Person } from '@/core/entities/Person';
import { personRepositoryFactory } from '@/infra/factories/repositories.factory';
import { PersonPayload } from '../helpers/payload.helper';
import {
  Route,
  Path,
  Controller,
  Get,
  Post,
  Body,
  SuccessResponse,
} from 'tsoa';

interface PersonPayloadResponse {
  name: string;
  friends: string[];
}

interface PersonFriendsPayloadResponse {
  name: string;
  friendsOfFriends: string[];
}

const personRepostiry = personRepositoryFactory();

@Route('persons')
export class PersonController extends Controller {
  @Get()
  async getAllPersons(): Promise<PersonPayloadResponse[]> {
    let persons;

    try {
      persons = await personRepostiry.getAllPersons();
    } catch (error) {
      // return response.status(404).json({
      //   message: error.message,
      // });
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
      // return response.status(404).json({
      //   message: error.message,
      // });
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
      // return response.status(404).json({
      //   message: error.message,
      // });
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

  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  async createPerson(@Body() personPayload: PersonPayload): Promise<object> {
    const friends = await Promise.all(
      personPayload.friends.map(async (friendName: string) => {
        let person;
        try {
          person = await personRepostiry.getPersonByName(friendName);
        } catch (error) {
          // throw response.status(404).json({
          //   message: error.message,
          // });
        }
        return person;
      }),
    );

    const personEntity = new Person({
      name: personPayload.name,
      friends: friends,
    });

    const dbResponse = await personRepostiry.createPerson(personEntity);

    // if (!dbResponse) {
    //   return response.status(500).json({
    //     message: 'Error creating person',
    //   });
    // }

    return {
      message: 'Person created',
    };
  }
}
