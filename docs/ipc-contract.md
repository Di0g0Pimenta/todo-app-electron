# Contrato IPC

O renderer Angular nunca acede diretamente ao SQLite. Ele usa `window.api`, exposta pelo `electron/preload.js`, e o `electron/ipc.js` encaminha cada pedido para `electron/database.js`.

```txt
Angular component
  -> TodoService
    -> window.api
      -> electron/preload.js
        -> electron/ipc.js
          -> electron/database.js
            -> data/todos.db
```

## API exposta no renderer

| Metodo | Canal IPC | Descricao |
| --- | --- | --- |
| `getTodos()` | `todos:getAll` | Lista todas as tarefas. |
| `addTodo(data)` | `todos:add` | Cria uma tarefa. |
| `updateTodo(id, data)` | `todos:update` | Atualiza nome, notas, estado ou data. |
| `toggleTodo(id, done)` | `todos:toggle` | Marca ou desmarca uma tarefa. |
| `deleteTodo(id)` | `todos:delete` | Elimina uma tarefa. |

## Modelo

```ts
interface Todo {
  id: number;
  name: string;
  notes: string;
  done: boolean;
  dueDate: string | null;
}
```
