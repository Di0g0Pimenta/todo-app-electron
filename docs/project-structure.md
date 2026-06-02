# Organizacao do projeto

Este projeto esta organizado por responsabilidades: Electron trata do sistema operativo e persistencia, Angular trata da interface, e os scripts/testes ficam separados da app.

## Pastas principais

```txt
electron/
  main.js                 Arranque da app, janela, tray e ciclo de vida
  preload.js              Ponte segura entre Angular e Electron
  ipc.js                  Contrato IPC entre renderer e main process
  database.js             Acesso SQLite e operacoes de tarefas
  notifications.js        Regras e envio de notificacoes desktop
  constants.js            Caminhos de dados em dev e app instalada
  shared/                 Validacao reutilizada pelo backend/testes

src/
  app/
    components/           Componentes Angular reutilizaveis
    services/             Acesso a window.api
    models/               Tipos da app
    utils/                Validacao e datas no renderer

scripts/
  seed-demo.js            Recria dados de demonstracao

tests/
  *.test.js               Testes Node.js

docs/
  release.md              Processo de releases
  release-notes/          Notas publicadas nas releases GitHub
  project-structure.md    Este guia

build/
  icon.ico                Icon Windows usado pelo instalador
  icon-256.png            Base PNG do icon
```

## Dados locais

Em desenvolvimento, a base de dados fica em:

```txt
data/todos.db
```

Na app instalada, a base de dados fica na pasta `userData` do Electron. Isto evita tentar escrever dentro da pasta de instalacao, que pode nao ter permissoes de escrita.

## Janela da app

A app abre maximizada, mantendo a barra superior nativa do Windows com minimizar, maximizar e fechar.

Nao usamos fullscreen real porque isso remove os controlos da janela e torna a app menos pratica.

## Releases

As releases sao criadas por tag Git:

```bash
git tag v0.1.0-alpha.3
git push origin v0.1.0-alpha.3
```

O workflow em `.github/workflows/release.yml` gera o instalador Windows e publica os artefactos na aba **Releases** do GitHub.
