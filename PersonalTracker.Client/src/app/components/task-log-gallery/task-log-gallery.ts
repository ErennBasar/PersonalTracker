import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskLogDto} from '../../models/task';

@Component({
  selector: 'app-task-log-gallery',
  imports: [CommonModule],
  templateUrl: './task-log-gallery.html',
  styleUrl: './task-log-gallery.scss',
})
export class TaskLogGallery {

  // Dışarıdan (TaskDetail'den) log listesini bekliyoruz
  @Input() logs: TaskLogDto[] = [];
}
