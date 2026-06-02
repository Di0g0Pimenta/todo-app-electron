import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskModalComponent } from "./components/task-modal/task-modal.component";
import { Todo, TodoInput } from "./models/todo";
import { TodoService } from "./services/todo.service";
import { capitalize, fromDateKey, fullDateFormatter, startOfMonth, toDateKey } from "./utils/date-utils";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent, TaskListComponent, TaskModalComponent],
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  selectedDate = toDateKey(new Date());
  visibleMonth = startOfMonth(new Date());
  isModalOpen = false;
  editingTodo: Todo | null = null;
  todoPendingDelete: Todo | null = null;
  errorMessage = "";
  isDarkMode = false;
  searchQuery = "";

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

  get pendingTodosCount(): number {
    return this.todos.filter(t => !t.done).length;
  }

  get selectedTodos(): Todo[] {
    return this.todos.filter((todo) => todo.dueDate === this.selectedDate && this.matchesSearch(todo));
  }

  get undatedTodos(): Todo[] {
    return this.todos.filter((todo) => !todo.dueDate && this.matchesSearch(todo));
  }

  private matchesSearch(todo: Todo): boolean {
    if (!this.searchQuery) return true;
    const query = this.searchQuery.toLowerCase();
    return todo.name.toLowerCase().includes(query) || (todo.notes?.toLowerCase().includes(query) ?? false);
  }

  async createTodo(todo: TodoInput): Promise<void> {
    try {
      await this.todoService.add(todo);
      this.closeTaskModal();
      await this.loadTodos();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel criar a tarefa.";
    }
  }

  async updateTodo(todo: TodoInput): Promise<void> {
    if (!this.editingTodo) return;

    try {
      await this.todoService.update(this.editingTodo.id, todo);
      this.closeTaskModal();
      await this.loadTodos();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Nao foi possivel atualizar a tarefa.";
    }
  }

  openCreateModal(): void {
    this.editingTodo = null;
    this.isModalOpen = true;
  }

  openEditModal(todo: Todo): void {
    this.editingTodo = todo;
    this.isModalOpen = true;
  }

  closeTaskModal(): void {
    this.isModalOpen = false;
    this.editingTodo = null;
  }

  requestDeleteTodo(todo: Todo): void {
    this.todoPendingDelete = todo;
  }

  cancelDeleteTodo(): void {
    this.todoPendingDelete = null;
  }

  async confirmDeleteTodo(): Promise<void> {
    if (!this.todoPendingDelete) return;

    try {
      await this.todoService.delete(this.todoPendingDelete.id);
      this.todoPendingDelete = null;
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
