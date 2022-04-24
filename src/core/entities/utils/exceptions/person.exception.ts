export class PersonDoesntKnowAnyoneException extends Error {
  constructor(name: string) {
    super(`${name} doesn't know anyone`);
  }
}
