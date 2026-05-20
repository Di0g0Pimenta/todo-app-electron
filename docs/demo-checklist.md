# Checklist da Demo

Antes da apresentacao:

```bash
npm install
npm run seed
npm test
npm start
```

Durante a demo:

1. Abrir a app.
2. Mostrar tarefas demo no calendario.
3. Criar uma nova tarefa com data.
4. Clicar no dia da tarefa.
5. Marcar uma tarefa como concluida.
6. Tentar eliminar uma tarefa e mostrar a confirmacao.
7. Abrir rapidamente os ficheiros:
   - `electron/main.js`
   - `electron/preload.js`
   - `electron/ipc.js`
   - `electron/database.js`
   - `src/app/services/todo.service.ts`

Plano B se algo falhar:

- Mostrar `README.md`.
- Mostrar `docs/ipc-contract.md`.
- Explicar o fluxo Angular -> IPC -> SQLite.
