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
