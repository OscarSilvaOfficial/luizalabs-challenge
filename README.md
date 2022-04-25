# LuizaLabs Challenge

## Como rodar o projeto localmente?
> O projeto foi criado em Node.js na versão v16.14.0 mas é compatível com as versões 12.x e 13.x...

### Executar projeto com Node.js

Para instala-lo, basta executar o comando:
```bash
npm install
```

ou 
  
```zsh
yarn install
```

É possível rodar o servidor de `desenvolvimento` utilizando o comando:

```zsh
yarn dev
``` 

ou  

```zsh
npm run dev
```

### Rodar os testes
  
```zsh
yarn test
```
ou
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
Para criação do projeto procurei seguir os princípios do Clean Achitecture
