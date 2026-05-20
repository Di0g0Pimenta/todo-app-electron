# ToDo Calendar Electron

Aplicacao desktop de tarefas com **Electron**, **Angular** e **SQLite**.

## Como correr

```bash
npm install
npm start
```

O `npm start` compila o Angular e depois abre o Electron.

## Scripts uteis

```bash
npm run build     # compila o Angular para dist/
npm run electron  # abre o Electron usando o build atual
npm run dev       # Angular em watch mode
npm run seed      # adiciona tarefas demo usando o runtime do Electron
npm test          # corre testes basicos
npm run rebuild   # recompila better-sqlite3 para Electron
```

## Estrutura

```txt
electron/           main process, preload, IPC, SQLite e validacao backend
src/                Angular renderer
data/todos.db       base de dados local
docs/ipc-contract.md
```

## Fluxo de dados

```txt
Angular Component
  -> TodoService
    -> window.api.addTodo(...)
      -> electron/preload.js
        -> electron/ipc.js
          -> electron/database.js
            -> SQLite
```

## Notas para apresentacao

- O Electron separa o **main process** do **renderer process**.
- O SQLite fica apenas no main process.
- O Angular nao usa Node diretamente.
- O `electron/preload.js` expoe uma API controlada com `contextBridge`.
- O IPC e o limite seguro entre interface e sistema.

## Apoio para apresentacao

- `docs/presentation-guide.md`: roteiro de 10 minutos.
- `docs/question-bank.md`: perguntas provaveis e respostas.
- `docs/demo-checklist.md`: checklist para a demo.
