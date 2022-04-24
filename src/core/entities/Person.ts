import { PersonDoesntKnowAnyoneException } from './utils/exceptions/person.exception';

export interface IPersonConstructor {
  name: string;
  friends?: Person[];
}

export class Person {
  private _name: string;
  private _friends?: Person[];

  constructor(person: IPersonConstructor) {
    this._name = person.name;
    this._friends = person.friends;
  }

  get name(): string {
    return this._name;
  }

  get friends(): Person[] {
    if (!this._friends) throw new PersonDoesntKnowAnyoneException(this.name);
    return this._friends;
  }

  friendsBuilder(person: Person): Person {
    this._friends = this._friends || [];
    this._friends.push(person);
    return this;
  }

  get friendsOfFriendsThatIDontKnow(): Person[] {
    const friendsOfFriends = this.friends.map((friend: Person) => {
      return friend.friends;
    });

    const response = friendsOfFriends.reduce(
      (acc: Person[], friendOfFriend: Person[]) => acc.concat(friendOfFriend),
    );

    return response.filter(
      (person: Person) => person !== this && !this.friends.includes(person),
    );
  }
}
