# LuizaLabs Challenge

## Como rodar o projeto localmente?
> O projeto foi criado em Node.js na versão v16.14.0 mas é compatível com as versões 12.x e 13.x...

### Executar projeto com Node.js

Para instala-lo, basta executar o comando:
```bash
npm install
```

É possível rodar o servidor de `desenvolvimento` utilizando o comando:


```zsh
npm run pre:dev && npm run dev
```

### Rodar os testes
```zsh
npm run test
```

### Rodar via Docker
***obs: é necessário ter o `Docker` e o `Docker Compose` instalado e configurado.***

Rodar o projeto via Docker:

```zsh
docker-compose up
```

### Endpoits
Os endpoits da aplicação foram expostos no swagger, 
que você pode consultar pela URL: `http://localhost:3000/docs`

### Arquitetura utilizada:
Para criação do projeto procurei seguir os princípios do Clean Achitecture,
para não acoplar regras de negócio com camadas de infraestrutura.

O projeto é composto das seguintes camadas:

#### `Infra`
Responsável por todos os drivers como banco e libs de log, e algumas configurações como variáveis de ambiente.
Também no mesmo local foi inserido as `factories` dos objectos que precisam ser contruídos e são dessa camada.

#### `Presenters`
Possui a `controller`, onde recebe diretamente os dados das requisições chama os adapters e os utiliza para manipular dados e validar 
as regras de negócio chamando diretamente as entidades de domínio.

Também possui alguns `helpers` como exceptions específicas ou funções de propósito geral.

***obs: Optei por não criar casos de uso pois nesse caso quis deixar a abstração do fluxo mais simples***

#### `Adapters`
Local onde eu coloco os `contratos` que a aplicação deve respeitar para não acoplar regras de negócio com infra e
padronizar a criação de novas implementações.

Também criei `repositories` nessa camada para separar a implementação do banco de dados das camadas mais internas da aplicação. 

#### `Core`
Ai ficam as entidades da aplicação onde é feito todas as regras de negócio.

### Banco de dados
Utilizei o mongoDB pois tenho bastante famíliaridade, pela facilidade de utilização e manusei das informações, e por entender 
que esse modelo de dados pode escalar muito, e visto que a complexidade dos relacionamentos não são muito grandes,
acredito que a performance não será sacrificada.

### Patterns utilizados

#### `Repository`
Gosto muito de usar o repository pois torna mais abstrato o manuseio do banco de dados.

#### `Adapters`
Os adaptadores tem um papel crucial aqui, pois nele devem ser feitos todas as conversões de dados do mundo da infra com o mundo das entidades.

#### `Factory`
Facilita a criação de objetos complexos pois não preciso sujar o código das controllers com vários imports e conscontruções.

#### `Builder`
Criar para possibilitar a criação da entidade aos poucos sem necessáriamente precisar passar pelo construtor e sem tornar as propriedades
públicas.

