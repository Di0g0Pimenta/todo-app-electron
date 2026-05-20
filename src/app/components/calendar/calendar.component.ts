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
