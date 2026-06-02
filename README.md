# ToDo Calendar Electron

Aplicacao desktop de tarefas com **Electron**, **Angular** e **SQLite**.

## Como correr em desenvolvimento

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
npm run dist      # gera instalador Windows em release/
```

## Estrutura

```txt
electron/           Processo principal Electron, preload, IPC, SQLite e notificacoes
src/                Interface Angular
scripts/            Scripts de apoio, como seed de dados demo
tests/              Testes Node.js
docs/               Documentacao tecnica e apoio a apresentacao/release
build/              Recursos de build, como icon do instalador
data/               Dados locais usados em desenvolvimento
release/            Instaladores gerados localmente (ignorado pelo Git)
```

Na app instalada, os dados nao ficam em `data/`; ficam na pasta `userData` do Electron, dentro do perfil do utilizador no Windows.

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
- `docs/project-structure.md`: organizacao tecnica atual do projeto.
- `docs/release.md`: como gerar e publicar releases alfa.
