import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CreateTaskDto, TaskDto} from '../../models/task';
import {TaskService} from '../../services/task';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { TaskAddDialog } from '../task-add-dialog/task-add-dialog';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatButton, MatIconButton,
    MatSidenavModule,
    MatDialogModule,
    TaskAddDialog, MatMiniFabButton, MatTooltip,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {

  // Verileri tutacağımız liste (başlangıçt boş)
  tasks: TaskDto[] = [];
  selectedTaskId: string | null = null;

  displayedColumns: string[] = ['createdDate','header','body','hoursTaken','isCompleted','actions'];

  // DIŞARIYA VERİ YOLLAYICI (Sinyalci)
  @Output() taskSelected = new EventEmitter<string>();

  // Servisi DI ile alıyoruz
  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  // Component ilk açıldığında çalışır
  ngOnInit(): void {
    this.loadTasks();

    // refreshNeeded$ her tetiklendiğinde listeyi tekrar çek
    this.taskService.refreshNeeded$.subscribe(() => {
      this.loadTasks();
    });
  }

  // servisten verileri çeken metod
  loadTasks(){
    this.taskService.getTasks().subscribe({
      next: (data) => {
        console.log('veriler geldi',data);
        this.tasks = data;
      },
      error: (err) => {
        console.error('Veri çekme hatası', err)
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TaskAddDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // KOD NE KADAR TEMİZLENDİ BAK:
        // Sadece tarihleri paketleyip yolluyoruz.
        const newTask: CreateTaskDto = {
          startDate: result.start,
          endDate: result.end
        };

        this.createTask(newTask);
      }
    });
  }
  // API'ye kayıt isteği
  createTask(task: CreateTaskDto) {
    this.taskService.createTask(task).subscribe({
      next: (res) => {
        console.log('Başarıyla eklendi',res);
        this.loadTasks(); // Listeyi yeniledik
      },
      error: (err) => {console.error('Ekleme hatası',err)}
    });
  }

  // Satıra tıklandığında çalışacak metod
  selectTask(id: string) {
    console.log("Seçilen Görev ID:", id);
    this.selectedTaskId = id; // Tıklanan ID'yi kaydet (CSS class için)
    this.taskSelected.emit(id); // Sinyali ateşle!
  }

  // Şimdilik boş metodlar (butonlar hata vermesin diye)
  onDelete(id: string) {
    console.log("Silinecek ID:", id);
  }

  onEdit(id: string) {
    console.log("Düzenlenecek ID:", id);
  }

  // Görevin durumuna göre CSS sınıfı döndüren metod
  getLeftBorderColor(task: TaskDto): string {

    if (task.isCompleted) {
      return 'border-green';
    }

    const today = new Date();
    const endDate = new Date(task.endDate);

    const diffTime = endDate.getTime() - today.getTime();

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      return 'border-red';
    }
    else if (diffDays >= 3 && diffDays <= 5) {
      return 'border-orange';
    }
    else {
      return 'border-green';
    }
  }

}
