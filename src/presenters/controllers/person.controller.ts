import { Person } from '@/core/entities/Person';
import { personRepositoryFactory } from '@/infra/factories/repositories.factory';
import {
  PersonFriendsPayloadResponse,
  PersonPayload,
  PersonPayloadResponse,
} from '../helpers/payload.helper';
import {
  Route,
  Path,
  Controller,
  Get,
  Post,
  Body,
  SuccessResponse,
  TsoaResponse,
  Res,
} from 'tsoa';

const personRepostiry = personRepositoryFactory();

@Route('persons')
export class PersonController extends Controller {
  @Get()
  async getAllPersons(
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>,
  ): Promise<PersonPayloadResponse[]> {
    let persons;

    try {
      persons = await personRepostiry.getAllPersons();
    } catch (error) {
      return notFoundResponse(404, { reason: error.message });
    }

    const responseData = persons.map((person) => ({
      name: person.name,
      friends: person.friends.map((friendName) => friendName),
    }));

    return responseData;
  }

  @Get('{name}/friends')
  async getPersonFriends(
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>,
    @Path() name?: string,
  ): Promise<PersonPayloadResponse> {
    let person;

    try {
      person = await personRepostiry.getPersonByName(name);
    } catch (error) {
      return notFoundResponse(404, { reason: error.message });
    }

    return {
      name: person.name,
      friends: person.friends.map((friendName) => friendName),
    };
  }

  @Get('{name}/friendsOfFriends')
  async getPersonFriendsOfFriends(
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>,
    @Path() name?: string,
  ): Promise<PersonFriendsPayloadResponse> {
    let person;

    try {
      person = await personRepostiry.getPersonByName(name);
    } catch (error) {
      return notFoundResponse(404, { reason: error.message });
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

  @SuccessResponse('201', 'Created')
  @Post()
  async createPerson(
    @Res() internalError: TsoaResponse<500, { reason: string }>,
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>,
    @Body() personPayload: PersonPayload,
  ): Promise<object> {
    const friends = await Promise.all(
      personPayload.friends.map(async (friendName: string) => {
        let person;
        try {
          person = await personRepostiry.getPersonByName(friendName);
        } catch (error) {
          return notFoundResponse(404, { reason: error.message });
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
      return internalError(500, { reason: 'Person is not Created' });
    }

    return {
      message: 'Person created',
    };
  }
}
