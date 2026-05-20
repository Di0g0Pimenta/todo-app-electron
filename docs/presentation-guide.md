# Guia de Apresentacao - 10 minutos

## Objetivo em uma frase

Esta aplicacao e uma ToDo List desktop com calendario, feita com Angular na interface, Electron como app desktop e SQLite para guardar dados localmente.

## Roteiro sugerido

### 1. Introducao - 1 minuto

- Dizer o problema: gerir tarefas com data limite numa app desktop simples.
- Mostrar rapidamente a app aberta.
- Criar uma tarefa e mostrar que ela aparece no calendario.

### 2. Stack - 1 minuto

- Angular: interface e componentes.
- Electron: janela desktop e acesso controlado ao sistema.
- SQLite: base de dados local.
- better-sqlite3: biblioteca usada no processo main.

### 3. Arquitetura - 2 minutos

Mostrar esta ideia:

```txt
Angular
  -> TodoService
    -> window.api
      -> electron/preload.js
        -> electron/ipc.js
          -> electron/database.js
            -> data/todos.db
```

Frase-chave: "O Angular nunca toca diretamente no SQLite. Ele pede dados por uma API segura exposta pelo preload."

### 4. Electron - 2 minutos

Abrir estes ficheiros:

- `electron/main.js`: cria a janela e carrega o Angular compilado.
- `electron/preload.js`: expoe `window.api`.
- `electron/ipc.js`: recebe os pedidos do renderer.
- `electron/database.js`: executa SQL.

Ponto importante: `contextIsolation: true` e `nodeIntegration: false` deixam o renderer mais seguro.

### 5. Angular - 2 minutos

Abrir estes ficheiros:

- `src/app/app.component.ts`: coordena estado geral.
- `src/app/services/todo.service.ts`: chama `window.api`.
- `src/app/components/calendar/`: calendario mensal.
- `src/app/components/task-modal/`: formulario de criacao.
- `src/app/components/task-list/`: lista e apagar/concluir.

Ponto importante: cada componente tem uma responsabilidade.

### 6. Dados e demo final - 1 minuto

- Mostrar `data/todos.db`.
- Dizer que `npm run seed` cria tarefas demo.
- Mostrar `npm test` para validar regras simples.

### 7. Fecho - 1 minuto

Resumo:

- Interface organizada com Angular.
- Separacao segura com Electron preload + IPC.
- Persistencia local com SQLite.
- Projeto preparado para crescer com novas funcionalidades.

## Comandos uteis no dia

```bash
npm run seed
npm test
npm start
```
