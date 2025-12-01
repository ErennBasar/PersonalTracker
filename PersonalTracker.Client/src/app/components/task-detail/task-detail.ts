import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {TaskDto, UpdateTaskDto, UpdateTaskLogDto} from '../../models/task';
import {TaskService} from '../../services/task';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {forkJoin, Observable} from 'rxjs';
import {MatCheckbox} from '@angular/material/checkbox';
import { TaskCharts } from '../task-charts/task-charts';

@Component({
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatCheckbox,
    TaskCharts,
  ],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail implements OnChanges {

  @Input() taskId: string | null = null; // Dışarıdan Id gelecek
  selectedTask: TaskDto | null = null;

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {
  }
  allTasks: TaskDto[] = [];
  ngOnChanges(changes: SimpleChanges) {
    if(changes['taskId'] && this.taskId){
      this.loadTaskDetail(this.taskId);

      // Grafikler için tüm listeyi çektik
      this.taskService.getTasks().subscribe(res => this.allTasks = res);
    }
  }
  loadTaskDetail(id: string){
    this.taskService.getTaskById(id).subscribe(data => {
      this.selectedTask = data
    });
  }

  saveLogs(){
    console.log("Kaydedilecek veriler:", this.selectedTask?.logs);
  }

  isSaving = false;
  saveChanges() {
    if (!this.selectedTask) return;

    this.isSaving = true;

    // Yapılacak API isteklerini (Requests) biriktireceğimiz havuz
    const requests: Observable<any>[] = [];

    // 1. ANA GÖREV GÜNCELLEMESİ (Header, Body, Date vb.)
    // Bunu her zaman ekleyebiliriz veya değişiklik kontrolü yapabiliriz.
    // Şimdilik her zaman güncelleyelim (garanti olsun).
    const taskUpdateModel: UpdateTaskDto = {
      header: this.selectedTask.header,
      body: this.selectedTask.body,
      startDate: this.selectedTask.startDate,
      endDate: this.selectedTask.endDate,
      isCompleted: this.selectedTask.isCompleted,
      //hoursTaken: this.selectedTask.hoursTaken // Bu aslında backend'de hesaplanıyor ama DTO istiyor
    };

    // Ana görev güncelleme isteğini havuza at
    requests.push(this.taskService.updateTask(this.selectedTask.id, taskUpdateModel));


    // 2. LOG GÜNCELLEMELERİ
    // Eğer loglarda değişiklik varsa (veya garanti olsun diye hepsini) havuza at.
    if (this.selectedTask.logs) {
      this.selectedTask.logs.forEach(log => {

        // Ufak bir optimizasyon: Sadece saati veya açıklaması dolu olanları güncelleyelim
        // (Veya hepsini güncelleyebilirsin, sorun olmaz)
        const logUpdateModel: UpdateTaskLogDto = { // Senin Angular modeline bu interface'i eklemen lazım
          hoursSpent: log.hoursSpent,
          description: log.description
        };

        // Her bir log için ayrı bir istek oluşturup havuza atıyoruz
        requests.push(this.taskService.updateLog(log.id, logUpdateModel));
      });
    }

    // 3. HEPSİNİ AYNI ANDA ATEŞLE (ForkJoin)
    // forkJoin: Havuzdaki tüm istekleri paralel gönderir ve HEPSİ bitince subscribe olur.
    forkJoin(requests).subscribe({
      next: (results) => {
        console.log("Tüm işlemler başarıyla bitti!", results);

        // Kullanıcıya güzel bir mesaj göster
        this.snackBar.open('Tüm değişiklikler kaydedildi!', 'Tamam', {
          duration: 3000,
          panelClass: ['green-snackbar']
        });

        // Ekrandaki verileri yenile (Özellikle toplam saatin güncellenmesi için önemli)
        if (this.taskId) {
          this.loadTaskDetail(this.taskId);
        }
        this.isSaving = false;
      },
      error: (err) => {
        console.error("Kaydederken hata oluştu:", err);
        this.snackBar.open('Hata oluştu!', 'Kapat', { duration: 3000 });
        this.isSaving = false;
      }
    });

}

}
