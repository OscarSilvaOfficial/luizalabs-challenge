import { Person } from '@/core/entities/Person';
import { PersonDoesntKnowAnyoneException } from '@/core/entities/utils/exceptions/person.exception';

describe('Testes da classe Person', () => {
  it('Teste de conhecimento de primeiro grau', () => {
    const luiza = new Person({ name: 'Luiza' });
    const joao = new Person({ name: 'João', friends: [luiza] });
    luiza.friendsBuilder(joao);

    expect(luiza.friends).toEqual([joao]);
    expect(joao.friends).toEqual([luiza]);
  });

  it('Teste de conhecimento de primeiro grau e segundo', () => {
    const luiza = new Person({ name: 'Luiza' });
    const joao = new Person({ name: 'João', friends: [luiza] });
    const ana = new Person({ name: 'Ana', friends: [joao] });
    luiza.friendsBuilder(joao);
    joao.friendsBuilder(ana);

    expect(luiza.friends).toEqual([joao]);
    expect(joao.friends).toEqual([luiza, ana]);
    expect(luiza.friendsOfFriendsThatIDontKnow).toEqual([ana]);
  });

  it('Teste de validação de pessoa que não conhece ninguém', () => {
    const luiza = new Person({ name: 'Luiza' });
    try {
      luiza.friendsOfFriendsThatIDontKnow;
      throw new Error();
    } catch (error) {
      expect(error).toBeInstanceOf(PersonDoesntKnowAnyoneException);
    }
  });
});
