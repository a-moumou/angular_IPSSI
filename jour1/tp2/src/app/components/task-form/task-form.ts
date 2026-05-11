import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
})
export class TaskForm {
  newTitle = '';
  @Output() add = new EventEmitter<string>();

  onSubmit() {
    if (!this.newTitle.trim()) return;
    this.add.emit(this.newTitle.trim());
    this.newTitle = '';
  }
}
