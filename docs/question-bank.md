# Perguntas Provaveis

## Porque usaste Electron?

Porque permite criar uma app desktop usando tecnologias web. Neste projeto, o Angular faz a interface e o Electron permite abrir uma janela nativa e usar recursos do sistema, como ficheiros e SQLite.

## Porque nao aceder ao SQLite diretamente pelo Angular?

Porque o Angular corre no renderer, que deve comportar-se como um browser. Por seguranca, o renderer nao deve ter acesso direto a Node.js nem ao sistema de ficheiros. O acesso passa pelo `preload.js` e por IPC.

## O que e o preload.js?

E um ficheiro carregado pelo Electron antes da pagina Angular. Ele usa `contextBridge` para expor uma API controlada chamada `window.api`.

## O que e IPC?

IPC significa Inter-Process Communication. E a comunicacao entre o renderer process, onde esta o Angular, e o main process, onde esta o Node.js e a base de dados.

## Onde esta a base de dados?

Em `data/todos.db`. O ficheiro e criado automaticamente quando a aplicacao arranca.

## Porque SQLite?

Porque e simples, local e nao precisa de servidor. Para uma app desktop pequena, e uma escolha pratica.

## Porque better-sqlite3?

Porque tem uma API simples e sincrona para SQLite, adequada para operacoes pequenas no main process.

## Porque Angular?

Porque organiza a interface em componentes e servicos. Como ja conhecia Angular, fica mais facil manter e apresentar o codigo.

## O que acontece quando crio uma tarefa?

O `TaskModalComponent` envia os dados para o `AppComponent`, que usa o `TodoService`. O servico chama `window.api.addTodo`, que passa pelo preload, chega ao IPC e finalmente executa um INSERT em `database.js`.

## Como a seguranca foi considerada?

O projeto usa `contextIsolation: true`, `nodeIntegration: false` e expoe apenas uma API pequena no preload. Assim o Angular nao recebe acesso completo ao Node.js.

## O que melhorarias a seguir?

Edicao de tarefas, prioridades, filtros, notificacoes, pesquisa e empacotamento da app com instalador.
