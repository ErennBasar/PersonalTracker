import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CreateTaskDto, TaskDto} from '../../models/task';
import {TaskService} from '../../services/task';
import { AuthService } from '../../services/auth';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import { TaskAddDialog } from '../task-add-dialog/task-add-dialog';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatIcon,
    MatIconButton,
    MatSidenavModule,
    MatDialogModule,
    MatMiniFabButton, MatTooltip,
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
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
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
    const currentUserId = this.authService.getCurrentUserId();

    console.log("AuthService'den gelen ID:", currentUserId);

    if (!currentUserId) {
      console.warn("Giriş yapmamış kullanıcı. Görevler yüklenemiyor.");
      this.tasks = [];
      return;
    }

    if (currentUserId){
      this.taskService.getTasks(currentUserId).subscribe({
        next: (data) => {
          console.log('veriler geldi',data);
          this.tasks = data;
        },
        error: (err) => {
          console.error('Veri çekme hatası', err)
        }
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TaskAddDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 1. Giriş yapan kullanıcının ID'sini al
        const currentUserId = this.authService.getCurrentUserId();

        if (!currentUserId) {
          console.error("Kullanıcı girişi yapılmamış!");
          return;
        }

        // 2. DTO'yu hazırla (Dialog verisi + UserID)
        const newTask: CreateTaskDto = {
          startDate: result.start,
          endDate: result.end,
          userId: currentUserId,
          isCommon: result.isCommon || false,
        };

        // 3. Servise gönder
        this.taskService.createTask(newTask).subscribe({
          next: (res) => {
            console.log("Görev oluşturuldu:", res);
            this.loadTasks(); // Listeyi yenile
          },
          error: (err) => console.error("Hata:", err)
        });
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

  selectTask(id: string) {
    console.log("Seçilen Görev ID:", id);
    this.selectedTaskId = id; // Tıklanan ID'yi kaydet (CSS class için)
    this.taskSelected.emit(id); // Sinyali ateşle!
  }

  onDelete(id: string) {
    if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {

      // 2. Evet dediyse servise git
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          // 3. Başarılıysa bildirim göster
          this.snackBar.open('Görev silindi', 'Tamam', {
            duration: 3000,
            panelClass: ['red-snackbar'] // Kırmızı uyarı stili (CSS'te tanımlıysa)
          });

          // NOT: Listeyi yenilemeye gerek yok, servisteki 'tap' sayesinde
          // ngOnInit'teki subscribe çalışacak ve liste yenilenecek.
        },
        error: (err) => {
          console.error('Silme hatası:', err);
          this.snackBar.open('Bir hata oluştu', 'Kapat', { duration: 3000 });
        }
      });
    }
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
