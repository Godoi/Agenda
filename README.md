# Teste para a vaga de Frontend - Dimedi 

O objetivo é criar uma agenda de compromissos utilizando as tecnologias que você achar adequadas.
Criar uma API Rest para executar as funções de back-end.

## Funcionalidades necessárias:

### Cadastrar compromisso.
* Não permitir cadastro de compromissos no mesmo horário e dia;
* Ter intervalo mínimo de 30 minutos entre compromissos.

### Excluir compromisso
* Não permitir exclusão de um compromisso do dia atual.

### Editar compromisso
* Não permitir reagendar compromissos antigos. (Não foi desenvolvido)

### Listar compromissos
* Paginação de 10 em 10 compromissos. (Não foi desenvolvido)

### Obs:
O banco de dados para armazenamento você decide, escolha o banco de dados que melhor se adaptar ao problema.
Junto com o teste, justifique o porquê utilizou o determinado framework e tecnologia.

## O que foi implementado

* Tela de Login;
* Tela de Cadastro Usuário;
* Tela do Agendamento;
* Os formulários são validado, não permitindo campos em branco;
* O campo Hora foi um _select_, cujas opções foram definidas no Typescript;
* A aplicação indica ao usuário o(s) campo(s) com erro;
* O usuário não é ser capaz de acessar as telas internas sem estar logado;
* Foi utilizado Angular (4) e Typescript;
* Foi utilizado a abordagem de _Reactive Forms_;
* Utilização de _api mock_ para montar "emular" as funções Back-end;
* Sem Banco de Dados a aplicação é toda javascript;

## Diferencial

* Desenvolvido um Helper para emular as funções do BackEnd;
* Angular mais atual;
* Typescript, ES6;
* _api mock_ do angular;

## Rodar a aplicação
* Instalar as 'dependencies' 'npm install';
* Rodar apalicação 'npm start' e acessar `http://localhost:4200/`;

## Configuração da aplicação

### Generated
* This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

### Development server
* Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Running unit tests
* Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

