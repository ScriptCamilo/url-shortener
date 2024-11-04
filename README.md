# URL Shortener

Este projeto é um encurtador de URLs construído com NestJS e Prisma. Ele permite que os usuários encurtem URLs, rastreiem cliques e gerenciem URLs através de uma API REST.

## Features

- Registro e autenticação de usuários
- Encurtamento de URLs com um máximo de 6 caracteres
- Rastreamento de cliques para URLs encurtadas
- Gerenciamento de URLs específico do usuário (listar, editar, excluir)
- Exclusão lógica de registros
- Rastreamento de timestamps para atualizações de registros

## Pré-Requisitos

- [Node.js (latest stable version)](https://nodejs.org/en)
- [Docker (version 27.2.1 or similar)](https://www.docker.com/get-started)

## Environment Variables

Para executar este projeto, você precisará adicionar as seguintes variáveis de ambiente ao arquivo .env

`NODE_ENV=development`

`PORT=8080`

`JWT_SECRET=your_jwt_secret`

`HOST_URL=http://localhost:8080`

`DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/url_shortener_db?schema=public"`

`DB_USER=johndoe`

`DB_PASS=randompassword`

`DB_NAME=url_shortener_db`

## Installation

1. **Clone o repositório**:

```bash
git clone https://github.com/ScriptCamilo/url-shortener.git
cd url-shortener
```

2. **Caso queira rodar o projeto totalmente Dockerizado**:

Você pode rodar o seguinte comando para subir todos os containers e rodar em ambiente docker, lembrando que é necessário ter criado o arquivo .env primeiro e configurado todas as variáveis de ambiente. **Utilizando esse comando não é necessário fazer os próximos passos, caso queira rodar localmente sem dockerizar a aplicação NestJS basta pular esse passo. Caso rode a aplicação Dockerizado e depois tente rodar localmente, ou vice-versa, é possível que seja necessário deletar antes as pastas node_modules ou dist**.

```bash
npm run docker:up
```

1. **Faça a instalação das dependências**:

```bash
npm install
```

1. **Configure o banco de dados PostgreSQL**:

```bash
docker compose up -d --build postgres
```

5. **Inicialize o prisma**:

```bash
npx prisma migrate dev
npx prisma generate
```

## Executando o Projeto Localmente

1. **Inicie a aplicação NestJS**:

```bash
npm run start:dev
```

2. **Acesse a documentação da API com o Swagger**:

Estará disponível em <http://localhost:8080/api>

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm test
```

## Screenshots

![App Screenshot](https://github.com/ScriptCamilo/url-shortener/blob/main/SwaggerUI.jpeg)

## 🏗️ Arquitetura e Decisões Técnicas

Este projeto foi estruturado e pensado para garantir escalabilidade, organização e facilidade de manutenção. Abaixo estão as principais decisões técnicas tomadas ao longo do desenvolvimento:

### 1️⃣ Estrutura de Pastas

Optei por uma estrutura de pastas um pouco mais simples, dividindo os "modules" da aplicação NestJS dentro de uma pasta com seus respectivos *services* e *controllers*. Tentei manter algo limpo e simples, mas para melhorar poderíamos criar uma estrutura inspirada na *Clean Architecture*, utilizando pastas como *domain*, *shared*, *infrastructure* e *application*.

### 2️⃣ Prisma

Escolhi o **Prisma** como ORM (Object-Relational Mapping) pela sua simplicidade e excelente suporte ao **TypeScript**. O **NestJS** possui integração nativa com o Prisma, o que facilita a configuração e permite criar consultas e relações de forma intuitiva e eficiente. Isso agiliza o desenvolvimento e reduz a complexidade na manipulação dos dados.

### 3️⃣ Testes com Jest

Optei por utilizar **Jest** para os testes do projeto, já que ele é nativamente suportado pelo **NestJS**. A integração é fácil e direta, o que torna o processo de criação de testes conveniente. Para um projeto simples como este, o **Jest** oferece a cobertura necessária para garantir a confiabilidade do código sem a complexidade de setups adicionais.

### 4️⃣ Dockerização

A **dockerização** do projeto foi uma escolha estratégica para simplificar o processo de deploy e garantir que o ambiente de desenvolvimento seja o mais consistente possível. Com o **Docker**, qualquer pessoa pode rodar o projeto sem se preocupar com o versionamento de dependências ou a configuração de serviços externos. Isso melhora a portabilidade e diminui os riscos de problemas de compatibilidade em diferentes máquinas.

### 5️⃣ Caching

Uma forma de melhorar ainda mais a performance da aplicação seria utilizar uma estratégia de cache e umas das melhores opções é o Redis, por várias razões técnicas. Entre elas porque o Redis é extremamente rápido, armazenando dados na memória RAM, o que permite tempos de leitura e escrita muito baixos. Porém, pela facilidade de integração com o NestJS optei por utilizar o cache-manager nesse primeiro momento.

### 6️⃣ Monitoramento

Uma das melhorias fundamentais seria a utilização de monitoramento como o Sentry, que oferece monitoramento de erros em tempo real, permitindo identificar e corrigir problemas rapidamente. Ele fornece informações detalhadas sobre os erros, como stack traces e contexto do usuário, facilitando a resolução de problemas.
