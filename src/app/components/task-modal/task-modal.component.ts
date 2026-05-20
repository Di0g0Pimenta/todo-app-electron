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
