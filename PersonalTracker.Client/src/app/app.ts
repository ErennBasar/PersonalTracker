import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TaskList} from './components/task-list/task-list';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {TaskDetail} from './components/task-detail/task-detail';
import { TaskCalendar } from './components/task-calendar/task-calendar';
import { TaskService } from './services/task';
import {TaskDto} from './models/task';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    TaskList,
    MatDrawerContainer, MatDrawer, MatDrawerContent,
    TaskDetail,
    TaskCalendar, MatIcon, MatButton,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('PersonalTracker.Client');

  // Seçilen görevin ID'sini burada tutuyoruz
  selectedTaskId: string | null = null;

  // Tüm görevleri burada tutalım ki Child'lara dağıtalım
  allTasks: TaskDto[] = [];

  constructor(private taskService: TaskService) {
    this.loadAllTasks();

    // Sol tarafta bir değişiklik olunca (ekleme/silme),
    // takvimin de güncellenmesi için zili dinleyelim
    this.taskService.refreshNeeded$.subscribe(() => {
      this.loadAllTasks();
    });
  }

  loadAllTasks() {
    this.taskService.getTasks().subscribe(res => this.allTasks = res);
  }
  // Listeden sinyal gelince bu çalışır
  onTaskSelect(id: string) {
    this.selectedTaskId = id;
    // Artık selectedTaskId değiştiği için TaskDetail otomatik güncellenecek
  }

  backToCalendar() {
    this.selectedTaskId = null;
  }
}
