import { PersonDoesntKnowAnyoneException } from './utils/exceptions/person.exception';

export interface IPersonConstructor {
  name: string;
  friends?: Person[];
  friendsOfFriends?: string[];
}

export class Person {
  private _name: string;
  private _friends?: Person[];
  private _friendsOfFriends?: string[];

  constructor(person: IPersonConstructor) {
    this._name = person.name;
    this._friends = person.friends;
    this._friendsOfFriends = person.friendsOfFriends;
  }

  get name(): string {
    return this._name;
  }

  get friends(): Person[] {
    if (!this._friends) throw new PersonDoesntKnowAnyoneException(this.name);
    return this._friends;
  }

  getArraysIntersection(a1, a2) {
    return a1.filter(function (n) {
      return a2.indexOf(n) !== -1;
    });
  }

  get friendsOfFriends(): string[] {
    const allFriends = this._friendsOfFriends.filter(
      (friend) => friend !== this.name,
    );

    if (!allFriends) throw new PersonDoesntKnowAnyoneException(this.name);

    const intersection = this.getArraysIntersection(
      allFriends.map((friend) => friend),
      this.friends.map((friend) => friend),
    );

    return allFriends.filter((friend) => !intersection.includes(friend));
  }

  friendsBuilder(person: Person): Person {
    this._friends = this._friends || [];
    this._friends.push(person);
    return this;
  }

  friendsOfFriendsBuilder(persons: string[]): Person {
    this._friendsOfFriends = persons;
    return this;
  }
}
