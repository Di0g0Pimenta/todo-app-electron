# Tutorial Completo: ToDo Calendar com Electron, Angular e SQLite

## Introdução

Este tutorial guia-te passo a passo na construção de uma aplicação desktop de gestão de tarefas com calendário. É um projeto completo que combina:

- **Electron** (v35): Framework para criar aplicações desktop com tecnologias web
- **Angular** (v20): Framework moderno para construir interfaces de utilizador
- **SQLite** (better-sqlite3): Base de dados leve e integrada
- **Tailwind CSS**: Framework de estilos utilitários via CDN
- **TypeScript**: Linguagem tipada que compila para JavaScript

A aplicação inclui:
- Calendário mensal com visualização de tarefas
- Lista de tarefas com notas e datas limite
- System Tray para minimizar/restaurar a janela
- Dark/Light mode com persistência em localStorage
- Base de dados SQLite para persistência de dados

---

## Pré-requisitos

Antes de começar, certifica-te que tens instalado:

| Software | Versão Recomendada | Como Instalar |
|----------|-------------------|---------------|
| Node.js | 18.x ou superior | https://nodejs.org/ |
| npm | 9.x ou superior | Incluído com Node.js |
| Git | Qualquer versão recente | https://git-scm.com/ |

Para verificar se tens tudo instalado, executa no terminal:

```bash
node --version
npm --version
git --version
```

---

## Passo 1: Criar a Pasta do Projeto

Cria uma nova pasta para o projeto e entra nela:

```bash
mkdir todo-calendar-electron
cd todo-calendar-electron
```

Inicializa um repositório Git:

```bash
git init
```

---

## Passo 2: Inicializar o package.json

Cria o ficheiro `package.json` na raiz do projeto com as dependências e scripts:

**Ficheiro: `package.json`**

```json
{
  "name": "todo-calendar-electron",
  "version": "1.0.0",
  "description": "ToDo List com Electron, SQLite e calendario mensal.",
  "main": "electron/main.js",
  "scripts": {
    "start": "npm run build && electron .",
    "build": "ng build",
    "dev": "ng build --watch --configuration development",
    "electron": "electron .",
    "seed": "set ELECTRON_RUN_AS_NODE=1&& electron scripts/seed-demo.js",
    "test": "node --test tests/*.test.js",
    "rebuild": "electron-rebuild -f -w better-sqlite3",
    "postinstall": "electron-rebuild -f -w better-sqlite3"
  },
  "keywords": [
    "electron",
    "sqlite",
    "todo",
    "calendar"
  ],
  "author": "Diogo Pimenta",
  "license": "MIT",
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "better-sqlite3": "^12.3.0",
    "electron": "^35.0.0",
    "rxjs": "^7.8.0",
    "tslib": "^2.8.0",
    "zone.js": "^0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "^20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "@electron/rebuild": "^3.7.2",
    "typescript": "~5.8.0"
  }
}
```

### O que este ficheiro faz:

- **main**: Aponta para `electron/main.js` como ponto de entrada da aplicação
- **scripts**: Comandos npm para construir, executar e testar
- **postinstall**: Reconstrói `better-sqlite3` após instalar, necessário para compilar código nativo
- **dependencies**: Bibliotecas que a aplicação precisa para funcionar
- **devDependencies**: Ferramentas para desenvolvimento (Angular CLI, TypeScript)

---

## Passo 3: Instalar Dependências

Instala todas as dependências do projeto:

```bash
npm install
```

Este comando pode levar alguns minutos. Vai criar uma pasta `node_modules/` com todas as bibliotecas necessárias.

---

## Passo 4: Criar a Estrutura de Pastas

Cria a seguinte estrutura de diretórios:

```bash
mkdir -p electron
mkdir -p electron/shared
mkdir -p src/app/components/calendar
mkdir -p src/app/components/task-list
mkdir -p src/app/components/task-modal
mkdir -p src/app/models
mkdir -p src/app/services
mkdir -p src/app/types
mkdir -p src/app/utils
mkdir -p data
mkdir -p tests
mkdir -p scripts
```

---

## Passo 5: Criar Ficheiros de Configuração do TypeScript

### Ficheiro: `tsconfig.json`

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "base​Url": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

### Ficheiro: `tsconfig.app.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
```

---

## Passo 6: Criar a Configuração do Angular

### Ficheiro: `angular.json`

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "todo-calendar-electron": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/todo-calendar-electron",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": [],
            "styles": ["src/styles.css"]
          },
          "configurations": {
            "production": {
              "outputHashing": "none",
              "optimization": true,
              "sourceMap": false
            },
            "development": {
              "optimization": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        }
      }
    }
  }
}
```

---

## Passo 7: Criar Ficheiros do Frontend Angular

### Ficheiro: `src/index.html`

```html
<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>ToDo Calendar</title>
    <base href="./" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
      }
    </script>
  </head>
  <body class="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-100">
    <app-root></app-root>
  </body>
</html>
```

### Ficheiro: `src/styles.css`

```css
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: minmax(104px, 1fr);
  gap: 8px;
}

.calendar-day {
  min-width: 0;
  min-height: 104px;
}

.task-card {
  overflow-wrap: anywhere;
}

@media (max-width: 720px) {
  .calendar-grid {
    grid-auto-rows: minmax(84px, 1fr);
    gap: 6px;
  }

  .calendar-day {
    min-height: 84px;
  }
}
```

### Ficheiro: `src/main.ts`

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent).catch((error) => console.error(error));
```

---

## Passo 8: Criar Models e Tipos

### Ficheiro: `src/app/models/todo.ts`

Define as interfaces TypeScript para as tarefas:

```typescript
export interface Todo {
  id: number;
  name: string;
  notes: string;
  done: boolean;
  dueDate: string | null;
}

export interface TodoInput {
  name: string;
  notes: string;
  dueDate: string | null;
}
```

### Ficheiro: `src/app/types/window-api.d.ts`

Define o contrato entre Angular e Electron:

```typescript
import { Todo, TodoInput } from "../models/todo";

declare global {
  interface Window {
    api: {
      getTodos: () => Promise<Todo[]>;
      addTodo: (data: TodoInput) => Promise<Todo>;
      updateTodo: (id: number, data: Partial<TodoInput & { done: boolean }>) => Promise<Todo>;
      toggleTodo: (id: number, done: boolean) => Promise<Todo>;
      deleteTodo: (id: number) => Promise<boolean>;
    };
  }
}

export {};
```

---

## Passo 9: Criar Serviço de Tarefas

### Ficheiro: `src/app/services/todo.service.ts`

O serviço comunica com o Electron através da API exposta no preload:

```typescript
import { Injectable } from "@angular/core";
import { Todo, TodoInput } from "../models/todo";

@Injectable({ providedIn: "root" })
export class TodoService {
  // O Angular fala apenas com window.api; SQLite fica isolado no Electron.
  getAll(): Promise<Todo[]> {
    return window.api.getTodos();
  }

  add(todo: TodoInput): Promise<Todo> {
    return window.api.addTodo(todo);
  }

  toggle(id: number, done: boolean): Promise<Todo> {
    return window.api.toggleTodo(id, done);
  }

  delete(id: number): Promise<boolean> {
    return window.api.deleteTodo(id);
  }
}
```

---

## Passo 10: Criar Utilitários de Data

### Ficheiro: `src/app/utils/date-utils.ts`

Utilitários para trabalhar com datas no calendário:

```typescript
export const monthFormatter = new Intl.DateTimeFormat("pt-PT", {
  month: "long",
  year: "numeric"
});

export const fullDateFormatter = new Intl.DateTimeFormat("pt-PT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getMonthMatrix(monthDate: Date): Date[] {
  const firstDay = startOfMonth(monthDate);
  const gridStart = new Date(firstDay);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  gridStart.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_value, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}
```

### Ficheiro: `src/app/utils/todo-validation.ts`

Validação de tarefas no lado do cliente:

```typescript
import { TodoInput } from "../models/todo";

export function normalizeDate(value: string | null | undefined): string | null {
  if (!value) return null;

  const cleanValue = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    throw new Error("A data deve estar no formato YYYY-MM-DD.");
  }

  return cleanValue;
}

export function normalizeTodoInput(data: TodoInput): TodoInput {
  const name = data.name.trim();

  if (!name) {
    throw new Error("O nome da tarefa e obrigatorio.");
  }

  return {
    name,
    notes: data.notes.trim(),
    dueDate: normalizeDate(data.dueDate)
  };
}
```

---

## Passo 11: Criar Componentes Angular

### Ficheiro: `src/app/components/calendar/calendar.component.ts`

Componente do calendário mensal:

```typescript
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Todo } from "../../models/todo";
import { capitalize, fromDateKey, getMonthMatrix, monthFormatter, startOfMonth, toDateKey } from "../../utils/date-utils";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./calendar.component.html"
})
export class CalendarComponent {
  @Input({ required: true }) todos: Todo[] = [];
  @Input({ required: true }) selectedDate = "";
  @Input({ required: true }) visibleMonth = startOfMonth(new Date());

  @Output() dateSelected = new EventEmitter<string>();
  @Output() monthChanged = new EventEmitter<number>();
  @Output() todayRequested = new EventEmitter<void>();

  get monthTitle(): string {
    return capitalize(monthFormatter.format(this.visibleMonth));
  }

  get calendarSummary(): string {
    const todos = this.monthlyTodos;
    const pendingCount = todos.filter((todo) => !todo.done).length;
    return `${todos.length} tarefa(s) neste mes, ${pendingCount} por concluir`;
  }

  get days(): Date[] {
    return getMonthMatrix(this.visibleMonth);
  }

  get monthlyTodos(): Todo[] {
    return this.todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = fromDateKey(todo.dueDate);
      return todoDate.getMonth() === this.visibleMonth.getMonth() && todoDate.getFullYear() === this.visibleMonth.getFullYear();
    });
  }

  dayKey(date: Date): string {
    return toDateKey(date);
  }

  dayTodos(date: Date): Todo[] {
    return this.todos.filter((todo) => todo.dueDate === this.dayKey(date));
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.visibleMonth.getMonth();
  }

  isToday(date: Date): boolean {
    return this.dayKey(date) === toDateKey(new Date());
  }

  selectDate(date: Date): void {
    const dateKey = this.dayKey(date);
    this.dateSelected.emit(dateKey);

    if (!this.isCurrentMonth(date)) {
      const offset = date < this.visibleMonth ? -1 : 1;
      this.monthChanged.emit(offset);
    }
  }
}
```

### Ficheiro: `src/app/components/calendar/calendar.component.html`

Template do calendário:

```html
<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
  <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="text-2xl font-semibold text-slate-950 dark:text-slate-50">{{ monthTitle }}</h2>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ calendarSummary }}</p>
    </div>

    <div class="flex items-center gap-2">
      <button class="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-xl text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-slate-600" type="button" aria-label="Mes anterior" (click)="monthChanged.emit(-1)">
        &lsaquo;
      </button>
      <button class="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-slate-600" type="button" (click)="todayRequested.emit()">
        Hoje
      </button>
      <button class="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-xl text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-slate-600" type="button" aria-label="Mes seguinte" (click)="monthChanged.emit(1)">
        &rsaquo;
      </button>
    </div>
  </div>

  <div class="grid grid-cols-7 border-b border-slate-200 pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
    <span>Seg</span>
    <span>Ter</span>
    <span>Qua</span>
    <span>Qui</span>
    <span>Sex</span>
    <span>Sab</span>
    <span>Dom</span>
  </div>

  <div class="calendar-grid mt-3">
    <button
      *ngFor="let day of days"
      class="calendar-day flex flex-col rounded-lg border p-3 text-left transition focus:outline-none focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900"
      type="button"
      [class.border-teal-700]="dayKey(day) === selectedDate"
      [class.bg-teal-50]="dayKey(day) === selectedDate"
      [class.dark:bg-teal-950]="dayKey(day) === selectedDate"
      [class.ring-2]="dayKey(day) === selectedDate || isToday(day)"
      [class.ring-teal-700]="dayKey(day) === selectedDate"
      [class.ring-amber-400]="dayKey(day) !== selectedDate && isToday(day)"
      [class.text-slate-950]="isCurrentMonth(day)"
      [class.dark:text-slate-50]="isCurrentMonth(day)"
      [class.text-slate-400]="!isCurrentMonth(day)"
      [class.dark:text-slate-600]="!isCurrentMonth(day)"
      [class.shadow-sm]="dayTodos(day).length"
      [class.border-slate-200]="dayKey(day) !== selectedDate"
      [class.dark:border-slate-700]="dayKey(day) !== selectedDate"
      [class.bg-white]="dayKey(day) !== selectedDate"
      [class.dark:bg-slate-800]="dayKey(day) !== selectedDate"
      (click)="selectDate(day)"
    >
      <div class="flex items-start justify-between gap-2">
        <span class="grid h-8 w-8 place-items-center rounded-full text-sm font-semibold" [class.bg-amber-100]="isToday(day)" [class.text-amber-800]="isToday(day)" [class.dark:bg-amber-900]="isToday(day)" [class.dark:text-amber-200]="isToday(day)">
          {{ day.getDate() }}
        </span>
        <span *ngIf="dayTodos(day).length" class="rounded-full bg-teal-700 px-2 py-1 text-xs font-semibold text-white dark:bg-teal-600">
          {{ dayTodos(day).length }}
        </span>
      </div>

      <div *ngIf="dayTodos(day).length" class="mt-3 space-y-1">
        <p
          *ngFor="let todo of dayTodos(day).slice(0, 2)"
          class="truncate rounded-md px-2 py-1 text-xs font-medium"
          [class.bg-slate-100]="todo.done"
          [class.dark:bg-slate-700]="todo.done"
          [class.text-slate-500]="todo.done"
          [class.dark:text-slate-400]="todo.done"
          [class.line-through]="todo.done"
          [class.bg-teal-100]="!todo.done"
          [class.dark:bg-teal-900]="!todo.done"
          [class.text-teal-900]="!todo.done"
          [class.dark:text-teal-200]="!todo.done"
        >
          {{ todo.name }}
        </p>
        <p *ngIf="dayTodos(day).length > 2" class="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          +{{ dayTodos(day).length - 2 }} mais
        </p>
      </div>
    </button>
  </div>
</div>
```

### Ficheiro: `src/app/components/task-list/task-list.component.ts`

Componente que mostra lista de tarefas:

```typescript
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Todo } from "../../models/todo";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./task-list.component.html"
})
export class TaskListComponent {
  @Input({ required: true }) todos: Todo[] = [];
  @Input() emptyText = "Nao existem tarefas.";

  @Output() toggleTodo = new EventEmitter<{ id: number; done: boolean }>();
  @Output() deleteTodo = new EventEmitter<number>();

  onToggle(todo: Todo, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleTodo.emit({ id: todo.id, done: checkbox.checked });
  }
}
```

### Ficheiro: `src/app/components/task-list/task-list.component.html`

Template da lista de tarefas:

```html
<div class="space-y-3">
  <p *ngIf="!todos.length" class="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
    {{ emptyText }}
  </p>

  <article *ngFor="let todo of todos" class="task-card rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
    <div class="flex items-start gap-3">
      <input
        class="mt-1 h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-600 dark:border-slate-500"
        type="checkbox"
        [checked]="todo.done"
        (change)="onToggle(todo, $event)"
      />

      <div class="min-w-0 flex-1">
        <h3 class="text-sm font-semibold" [class.text-slate-500]="todo.done" [class.dark:text-slate-400]="todo.done" [class.line-through]="todo.done" [class.text-slate-950]="!todo.done" [class.dark:text-slate-50]="!todo.done">
          {{ todo.name }}
        </h3>
        <p *ngIf="todo.notes" class="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-400">
          {{ todo.notes }}
        </p>
        <p *ngIf="todo.dueDate" class="mt-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
          {{ todo.dueDate }}
        </p>
      </div>

      <button class="rounded-lg px-2 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100 dark:text-red-400 dark:hover:bg-red-950 dark:focus:ring-red-900" type="button" (click)="deleteTodo.emit(todo.id)">
        Eliminar
      </button>
    </div>
  </article>
</div>
```

### Ficheiro: `src/app/components/task-modal/task-modal.component.ts`

Modal para criar novas tarefas:

```typescript
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TodoInput } from "../../models/todo";
import { normalizeTodoInput } from "../../utils/todo-validation";

@Component({
  selector: "app-task-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./task-modal.component.html"
})
export class TaskModalComponent implements OnChanges {
  @Input({ required: true }) isOpen = false;
  @Input({ required: true }) selectedDate = "";

  @Output() closeModal = new EventEmitter<void>();
  @Output() createTodo = new EventEmitter<TodoInput>();

  name = "";
  notes = "";
  dueDate: string | null = null;
  errorMessage = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isOpen"]?.currentValue) {
      this.name = "";
      this.notes = "";
      this.dueDate = this.selectedDate;
      this.errorMessage = "";
    }
  }

  submit(): void {
    try {
      const todo = normalizeTodoInput({
        name: this.name,
        notes: this.notes,
        dueDate: this.dueDate
      });

      this.errorMessage = "";
      this.createTodo.emit(todo);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel validar a tarefa.";
    }
  }
}
```

### Ficheiro: `src/app/components/task-modal/task-modal.component.html`

Template do modal:

```html
<div
  *ngIf="isOpen"
  class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
  aria-hidden="false"
  (click)="closeModal.emit()"
>
  <div class="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-slate-800" (click)="$event.stopPropagation()">
    <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
      <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">Criar tarefa</h2>
      <button class="grid h-9 w-9 place-items-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50 dark:focus:ring-slate-600" type="button" aria-label="Fechar" (click)="closeModal.emit()">
        &times;
      </button>
    </div>

    <form class="space-y-5 px-6 py-5" (ngSubmit)="submit()">
      <label class="block">
        <span class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Nome</span>
        <input class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-teal-500 dark:focus:ring-teal-900" type="text" placeholder="Ex.: Estudar Electron" name="name" [(ngModel)]="name" required />
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Notas</span>
        <textarea class="min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-teal-500 dark:focus:ring-teal-900" placeholder="Detalhes opcionais..." name="notes" [(ngModel)]="notes"></textarea>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Data limite</span>
        <input class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:focus:border-teal-500 dark:focus:ring-teal-900" type="date" name="dueDate" [(ngModel)]="dueDate" />
      </label>

      <p *ngIf="errorMessage" class="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-400">
        {{ errorMessage }}
      </p>

      <div class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end">
        <button class="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-slate-600" type="button" (click)="closeModal.emit()">
          Cancelar
        </button>
        <button class="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800" type="submit">
          Guardar tarefa
        </button>
      </div>
    </form>
  </div>
</div>
```

### Ficheiro: `src/app/app.component.ts`

Componente raiz da aplicação (orquestra todo o comportamento):

```typescript
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskModalComponent } from "./components/task-modal/task-modal.component";
import { Todo, TodoInput } from "./models/todo";
import { TodoService } from "./services/todo.service";
import { capitalize, fromDateKey, fullDateFormatter, startOfMonth, toDateKey } from "./utils/date-utils";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, CalendarComponent, TaskListComponent, TaskModalComponent],
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  selectedDate = toDateKey(new Date());
  visibleMonth = startOfMonth(new Date());
  isModalOpen = false;
  errorMessage = "";
  isDarkMode = false;

  constructor(private readonly todoService: TodoService) {}

  async ngOnInit(): Promise<void> {
    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved === 'true';
    this.applyDarkMode();
    await this.loadTodos();
  }

  get selectedDateTitle(): string {
    return capitalize(fullDateFormatter.format(fromDateKey(this.selectedDate)));
  }

  get selectedTodos(): Todo[] {
    return this.todos.filter((todo) => todo.dueDate === this.selectedDate);
  }

  get undatedTodos(): Todo[] {
    return this.todos.filter((todo) => !todo.dueDate);
  }

  async createTodo(todo: TodoInput): Promise<void> {
    try {
      await this.todoService.add(todo);
      this.isModalOpen = false;
      await this.loadTodos();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel criar a tarefa.";
    }
  }

  async deleteTodo(todoId: number): Promise<void> {
    if (!window.confirm("Queres mesmo eliminar esta tarefa?")) return;

    try {
      await this.todoService.delete(todoId);
      await this.loadTodos();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel eliminar a tarefa.";
    }
  }

  async toggleTodo(event: { id: number; done: boolean }): Promise<void> {
    try {
      await this.todoService.toggle(event.id, event.done);
      await this.loadTodos();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel atualizar a tarefa.";
    }
  }

  changeMonth(offset: number): void {
    this.visibleMonth = new Date(this.visibleMonth.getFullYear(), this.visibleMonth.getMonth() + offset, 1);
  }

  goToToday(): void {
    const today = new Date();
    this.selectedDate = toDateKey(today);
    this.visibleMonth = startOfMonth(today);
  }

  selectDate(dateKey: string): void {
    this.selectedDate = dateKey;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    this.applyDarkMode();
  }

  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private async loadTodos(): Promise<void> {
    try {
      this.todos = await this.todoService.getAll();
      this.errorMessage = "";
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel carregar as tarefas.";
    }
  }
}
```

### Ficheiro: `src/app/app.component.html`

Template principal (contém o layout e dark mode toggle):

```html
<main class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-6">
  <header class="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-700 md:flex-row md:items-center md:justify-between">
    <div>
      <p class="text-sm font-medium uppercase tracking-wide text-teal-700 dark:text-teal-400">Electron + Angular + SQLite</p>
      <h1 class="mt-1 text-3xl font-semibold text-slate-950 dark:text-slate-50">Calendario de tarefas</h1>
    </div>

    <div class="flex items-center gap-3">
      <!-- Botão dark mode -->
      <button
        id="dark-mode-toggle"
        class="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-xl transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
        type="button"
        [attr.aria-label]="isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
        [title]="isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
        (click)="toggleDarkMode()"
      >
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>

      <button
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 dark:bg-teal-600 dark:hover:bg-teal-700"
        type="button"
        (click)="isModalOpen = true"
      >
        <span class="text-lg leading-none">+</span>
        Criar tarefa
      </button>
    </div>
  </header>

  <p *ngIf="errorMessage" class="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-400">
    {{ errorMessage }}
  </p>

  <section class="grid flex-1 gap-5 lg:grid-cols-[1fr_360px]">
    <app-calendar
      [todos]="todos"
      [selectedDate]="selectedDate"
      [visibleMonth]="visibleMonth"
      (dateSelected)="selectDate($event)"
      (monthChanged)="changeMonth($event)"
      (todayRequested)="goToToday()"
    />

    <aside class="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="border-b border-slate-200 p-5 dark:border-slate-700">
        <p class="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Dia selecionado</p>
        <h2 class="mt-1 text-xl font-semibold text-slate-950 dark:text-slate-50">{{ selectedDateTitle }}</h2>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-5">
        <app-task-list
          [todos]="selectedTodos"
          emptyText="Nao existem tarefas neste dia."
          (toggleTodo)="toggleTodo($event)"
          (deleteTodo)="deleteTodo($event)"
        />
      </div>

      <div class="border-t border-slate-200 p-5 dark:border-slate-700">
        <p class="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Sem data</p>
        <app-task-list
          [todos]="undatedTodos"
          emptyText="Nao existem tarefas sem data."
          (toggleTodo)="toggleTodo($event)"
          (deleteTodo)="deleteTodo($event)"
        />
      </div>
    </aside>
  </section>
</main>

<app-task-modal
  [isOpen]="isModalOpen"
  [selectedDate]="selectedDate"
  (closeModal)="isModalOpen = false"
  (createTodo)="createTodo($event)"
/>
```

---

## Passo 12: Criar Backend do Electron

### Ficheiro: `electron/constants.js`

Define constantes e caminhos:

```javascript
const path = require("path");

const DB_FILE_NAME = "todos.db";
const DATA_DIR = path.join(__dirname, "..", "data");

function getDbPath() {
  return process.env.TODO_DB_PATH || path.join(DATA_DIR, DB_FILE_NAME);
}

module.exports = {
  DATA_DIR,
  DB_FILE_NAME,
  getDbPath
};
```

### Ficheiro: `electron/shared/todo-validation.js`

Validação compartilhada entre servidor e cliente:

```javascript
function normalizeDate(value) {
  if (!value) return null;

  const cleanValue = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    throw new Error("A data deve estar no formato YYYY-MM-DD.");
  }

  return cleanValue;
}

function normalizeTodoInput(data) {
  const name = String(data?.name || "").trim();

  if (!name) {
    throw new Error("O nome da tarefa e obrigatorio.");
  }

  return {
    name,
    notes: String(data?.notes || "").trim(),
    dueDate: normalizeDate(data?.dueDate)
  };
}

function normalizeTodoUpdate(currentTodo, data) {
  const input = normalizeTodoInput({
    name: data?.name ?? currentTodo.name,
    notes: data?.notes ?? currentTodo.notes,
    dueDate: data?.dueDate === undefined ? currentTodo.dueDate : data.dueDate
  });

  return {
    ...input,
    done: data?.done === undefined ? Boolean(currentTodo.done) : Boolean(data.done)
  };
}

module.exports = {
  normalizeDate,
  normalizeTodoInput,
  normalizeTodoUpdate
};
```

### Ficheiro: `electron/database.js`

Gere a base de dados SQLite:

```javascript
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { getDbPath } = require("./constants");
const { normalizeTodoInput, normalizeTodoUpdate } = require("./shared/todo-validation");

let db;

function mapTodo(row) {
  // A DB usa snake_case; a interface Angular recebe camelCase.
  return {
    id: row.id,
    name: row.name,
    notes: row.notes || "",
    done: Boolean(row.done),
    dueDate: row.due_date
  };
}

function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    db = new Database(dbPath);
    // WAL melhora a fiabilidade para escrita/leitura local no SQLite.
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }

  return db;
}

function initDatabase() {
  // A tabela e criada no arranque, por isso a app funciona numa pasta limpa.
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      notes     TEXT,
      done      INTEGER DEFAULT 0,
      due_date  TEXT
    )
  `);
}

function getAllTodos() {
  return getDb()
    .prepare(`
      SELECT id, name, notes, done, due_date
      FROM todos
      ORDER BY
        CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
        due_date ASC,
        done ASC,
        id DESC
    `)
    .all()
    .map(mapTodo);
}

function addTodo(data) {
  const todo = normalizeTodoInput(data);

  const result = getDb()
    .prepare(`
      INSERT INTO todos (name, notes, due_date)
      VALUES (@name, @notes, @dueDate)
    `)
    .run(todo);

  return getTodoById(result.lastInsertRowid);
}

function getTodoById(id) {
  const row = getDb()
    .prepare(`
      SELECT id, name, notes, done, due_date
      FROM todos
      WHERE id = ?
    `)
    .get(id);

  return row ? mapTodo(row) : null;
}

function updateTodo(id, data) {
  const todoId = Number(id);
  const currentTodo = getTodoById(todoId);

  if (!currentTodo) {
    throw new Error("Tarefa nao encontrada.");
  }

  const todo = normalizeTodoUpdate(currentTodo, data);

  getDb()
    .prepare(`
      UPDATE todos
      SET name = @name,
          notes = @notes,
          done = @done,
          due_date = @dueDate
      WHERE id = @id
    `)
    .run({ id: todoId, ...todo, done: Number(todo.done) });

  return getTodoById(todoId);
}

function toggleTodo(id, done) {
  const todoId = Number(id);
  const currentTodo = getTodoById(todoId);

  if (!currentTodo) {
    throw new Error("Tarefa nao encontrada.");
  }

  getDb()
    .prepare("UPDATE todos SET done = ? WHERE id = ?")
    .run(Number(Boolean(done)), todoId);

  return getTodoById(todoId);
}

function deleteTodo(id) {
  const result = getDb()
    .prepare("DELETE FROM todos WHERE id = ?")
    .run(Number(id));

  return result.changes > 0;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  initDatabase,
  getDbPath,
  getAllTodos,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  closeDatabase
};
```

### Ficheiro: `electron/ipc.js`

Gere os canais IPC entre Electron e Angular:

```javascript
const { ipcMain } = require("electron");
const database = require("./database");

let handlersRegistered = false;

function registerHandler(channel, callback) {
  // Cada handler traduz um pedido do renderer numa chamada segura ao backend.
  ipcMain.handle(channel, async (_event, ...args) => {
    try {
      return await callback(...args);
    } catch (error) {
      console.error(`[IPC:${channel}]`, error);
      throw new Error(error instanceof Error ? error.message : "Erro inesperado na aplicacao.");
    }
  });
}

function registerTodoHandlers() {
  if (handlersRegistered) return;
  handlersRegistered = true;

  // Estes nomes de canais sao o contrato entre preload.js e database.js.
  registerHandler("todos:getAll", () => database.getAllTodos());
  registerHandler("todos:add", (data) => database.addTodo(data));
  registerHandler("todos:update", (id, data) => database.updateTodo(id, data));
  registerHandler("todos:toggle", (id, done) => database.toggleTodo(id, done));
  registerHandler("todos:delete", (id) => database.deleteTodo(id));
}

module.exports = {
  registerTodoHandlers
};
```

### Ficheiro: `electron/preload.js`

Bridge seguro entre Angular e Electron (Context Isolation):

```javascript
const { contextBridge, ipcRenderer } = require("electron");

// Expomos uma API pequena e controlada em vez de dar Node.js inteiro ao Angular.
contextBridge.exposeInMainWorld("api", {
  getTodos: () => ipcRenderer.invoke("todos:getAll"),
  addTodo: (data) => ipcRenderer.invoke("todos:add", data),
  updateTodo: (id, data) => ipcRenderer.invoke("todos:update", id, data),
  toggleTodo: (id, done) => ipcRenderer.invoke("todos:toggle", id, done),
  deleteTodo: (id) => ipcRenderer.invoke("todos:delete", id)
});
```

### Ficheiro: `electron/main.js`

Ponto de entrada do Electron (cria a janela e o System Tray):

```javascript
const path = require("path");
const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");
const { initDatabase, closeDatabase } = require("./database");
const { registerTodoHandlers } = require("./ipc");

let mainWindow = null;
let tray = null;

// Impede que o app feche quando todas as janelas são fechadas (necessário para o tray)
app.on("window-all-closed", () => {
  // Não faz nada — a app fica viva no tray
});

function createTray() {
  const iconPath = path.join(__dirname, "tray-icon.png");
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  tray.setToolTip("ToDo Calendar");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Abrir Calendário",
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: "separator" },
    {
      label: "Sair Definitivamente",
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // Duplo clique no ícone do tray abre a janela
  tray.on("double-click", () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 940,
    minHeight: 680,
    backgroundColor: "#f8fafc",
    title: "ToDo Calendar",
    webPreferences: {
      // O preload e a unica ponte entre Angular e o processo main.
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Remove a barra de menus padrão (File, Edit, View, etc.)
  mainWindow.setMenu(null);

  // Ao clicar no "X", esconde a janela em vez de fechar
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // O Angular e compilado para dist/ antes de o Electron abrir a janela.
  mainWindow.loadFile(path.join(__dirname, "..", "dist", "todo-calendar-electron", "browser", "index.html"));
}

app.whenReady().then(() => {
  // A base de dados e os canais IPC ficam prontos antes da interface carregar.
  initDatabase();
  registerTodoHandlers();
  createWindow();
  createTray();

  app.on("activate", () => {
    // macOS: reabrir janela ao clicar no dock
    mainWindow.show();
  });
});

app.on("before-quit", () => {
  // Permite fechar a janela de verdade ao sair pelo menu do tray
  mainWindow.removeAllListeners("close");
  closeDatabase();
});
```

---

## Passo 13: Criar um Ícone para o System Tray

Para o System Tray funcionar, precisas de um ficheiro `tray-icon.png` de 16x16 píxeis.

Coloca a imagem em `electron/tray-icon.png`.

Se não tiveres uma imagem, podes criar uma simples com 16x16 píxeis usando ferramentas online ou um editor de imagens.

---

## Passo 14: Configurar o .gitignore

### Ficheiro: `.gitignore`

```
node_modules/
dist/
data/
.angular/
*.db
*.db-shm
*.db-wal
.DS_Store
```

---

## Passo 15: Compilar e Executar

Agora que tens todo o código pronto, é hora de compilar e executar o projeto.

### 1. Compilar o Angular

Primeiro, constrói o frontend Angular:

```bash
npm run build
```

Este comando:
- Compila o código TypeScript
- Gera os ficheiros HTML/CSS/JS otimizados
- Coloca tudo em `dist/todo-calendar-electron/`

### 2. Executar a Aplicação

Agora podes abrir a aplicação Electron:

```bash
npm start
```

Ou, se preferes apenas abrir o Electron sem compilar novamente:

```bash
npm run electron
```

---

## Como Correr o Projeto

### Modo Desenvolvimento (com hot-reload)

Se estás a desenvolver e queres que o Angular recompile automaticamente quando fazes mudanças:

```bash
npm run dev
```

Depois, em outro terminal:

```bash
npm run electron
```

### Modo Produção

Para compilar e executar numa única vez:

```bash
npm start
```

---

## Estrutura Final de Pastas

```
todo-calendar-electron/
├── electron/
│   ├── main.js                    # Ponto de entrada do Electron
│   ├── preload.js                 # Bridge seguro para Angular
│   ├── ipc.js                     # Canais IPC
│   ├── database.js                # Lógica da base de dados
│   ├── constants.js               # Constantes
│   ├── shared/
│   │   └── todo-validation.js     # Validação compartilhada
│   └── tray-icon.png              # Ícone do System Tray
├── src/
│   ├── index.html                 # HTML principal
│   ├── main.ts                    # Bootstrap do Angular
│   ├── styles.css                 # Estilos globais
│   └── app/
│       ├── app.component.ts       # Componente raiz
│       ├── app.component.html     # Template raiz
│       ├── models/
│       │   └── todo.ts            # Interfaces
│       ├── services/
│       │   └── todo.service.ts    # Serviço de comunicação com Electron
│       ├── components/
│       │   ├── calendar/          # Componente do calendário
│       │   ├── task-list/         # Componente da lista de tarefas
│       │   └── task-modal/        # Modal para criar tarefas
│       ├── types/
│       │   └── window-api.d.ts    # Tipos da API exposta
│       └── utils/
│           ├── date-utils.ts      # Utilidades de data
│           └── todo-validation.ts # Validação de tarefas
├── data/                          # Pasta para a base de dados (SQLite)
├── dist/                          # Ficheiros compilados (gerado automaticamente)
├── node_modules/                  # Dependências npm (gerado automaticamente)
├── package.json                   # Configuração npm
├── tsconfig.json                  # Configuração TypeScript
├── tsconfig.app.json              # Configuração TypeScript para app
├── angular.json                   # Configuração Angular
├── .gitignore                     # Ficheiros a ignorar no Git
└── TUTORIAL.md                    # Este ficheiro
```

---

## Funcionalidades Explicadas

### Dark Mode com Persistência

O dark mode é gerido em `AppComponent`:

1. **Inicialização**: No `ngOnInit()`, verifica se o utilizador tinha dark mode ativado em `localStorage`
2. **Toggle**: O botão `☀️/🌙` chama `toggleDarkMode()`
3. **Persistência**: O estado é guardado em `localStorage.setItem('darkMode', String(this.isDarkMode))`
4. **Aplicação**: A classe `dark` é adicionada/removida do elemento `<html>`
5. **Tailwind**: Tailwind CSS aplica os estilos com `dark:` classes

### System Tray

O System Tray é gerido em `electron/main.js`:

1. **Criação**: `createTray()` cria um ícone no tray
2. **Menu de Contexto**: Clique direito mostra opções para abrir ou sair
3. **Duplo Clique**: Duplo clique no ícone abre/foca a janela
4. **Minimizar**: Clicar no "X" esconde a janela em vez de fechar

### Base de Dados SQLite

1. **Criação**: `database.js` cria a tabela `todos` no arranque
2. **Persistência**: Os dados ficam guardados em `data/todos.db`
3. **IPC**: Os canais IPC em `ipc.js` recebem pedidos do Angular
4. **Validação**: Todos os dados são validados antes de guardar
5. **Segurança**: Prepared statements previnem SQL injection

---

## Troubleshooting

### better-sqlite3 não compila

```bash
npm run rebuild
```

### A aplicação não abre

Certifica-te que compilaste o Angular:

```bash
npm run build
```

### Dark mode não funciona

Verifica se o Tailwind CDN está carregando:

1. Abre as Developer Tools (F12)
2. Vê se há erros na consola
3. Verifica se `tailwind.config = { darkMode: 'class' }` está em `index.html`

### A base de dados está vazia

A pasta `data/` é criada automaticamente. Se precisas de dados de teste:

```bash
npm run seed
```

---

## Conclusão

Parabéns! Agora tens uma aplicação desktop completa com:

✅ Interface bonita com calendário  
✅ Gerenciamento de tarefas  
✅ Dark/Light mode  
✅ System Tray  
✅ Base de dados SQLite persistente  
✅ Arquitetura segura com Electron  

Podes agora customizar o projeto conforme necessário. Boa sorte!
