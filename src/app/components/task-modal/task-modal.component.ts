import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Todo, TodoInput } from "../../models/todo";
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
  @Input() todoToEdit: Todo | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() createTodo = new EventEmitter<TodoInput>();
  @Output() updateTodo = new EventEmitter<TodoInput>();

  name = "";
  notes = "";
  dueDate: string | null = null;
  errorMessage = "";

  get isEditing(): boolean {
    return Boolean(this.todoToEdit);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isOpen"]?.currentValue) {
      this.fillForm();
    }

    if (this.isOpen && changes["todoToEdit"]) {
      this.fillForm();
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
      if (this.isEditing) {
        this.updateTodo.emit(todo);
      } else {
        this.createTodo.emit(todo);
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel validar a tarefa.";
    }
  }

  private fillForm(): void {
    if (this.todoToEdit) {
      this.name = this.todoToEdit.name;
      this.notes = this.todoToEdit.notes;
      this.dueDate = this.todoToEdit.dueDate;
    } else {
      this.name = "";
      this.notes = "";
      this.dueDate = this.selectedDate;
    }

    this.errorMessage = "";
  }
}
