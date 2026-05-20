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
