export class FriendNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FriendNotFoundException';
  }
}

export class PersonNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PersonNotFoundException';
  }
}
