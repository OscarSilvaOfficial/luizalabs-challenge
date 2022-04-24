import { Person } from '@/core/entities/Person';

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
    luiza.friendsOfFriendsBuilder([ana.name]);

    expect(luiza.friends).toEqual([joao]);
    expect(joao.friends).toEqual([luiza, ana]);
    expect(luiza.friendsOfFriends).toEqual([ana.name]);
  });
});
