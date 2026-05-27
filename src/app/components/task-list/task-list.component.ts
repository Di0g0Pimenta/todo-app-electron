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
  @Output() editTodo = new EventEmitter<Todo>();
  @Output() deleteTodo = new EventEmitter<number>();

  onToggle(todo: Todo, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleTodo.emit({ id: todo.id, done: checkbox.checked });
  }
}
