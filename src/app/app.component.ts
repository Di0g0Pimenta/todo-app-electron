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

  constructor(private readonly todoService: TodoService) {}

  async ngOnInit(): Promise<void> {
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

  private async loadTodos(): Promise<void> {
    try {
      this.todos = await this.todoService.getAll();
      this.errorMessage = "";
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel carregar as tarefas.";
    }
  }
}
