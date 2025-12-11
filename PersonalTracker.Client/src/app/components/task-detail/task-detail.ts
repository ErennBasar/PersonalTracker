import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
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
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TaskLogGallery} from '../task-log-gallery/task-log-gallery';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,
    MatSnackBarModule,MatCheckbox,MatIcon,MatTooltip,MatSelectModule, MatToolbarModule,
    TaskCharts,
    TaskLogGallery,
  ],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail implements OnChanges {

  @Output() closeDetail = new EventEmitter<void>();
  @Input() taskId: string | null = null; // Dışarıdan Id gelecek
  selectedTask: TaskDto | null = null;
  isGridView: boolean = false;
  allTasks: TaskDto[] = [];
  isSaving = false;
  selectedCompareTasks: TaskDto[] = [];
  availableTasksForCompare: TaskDto[] = [];
  modifiedLogIds: Set<string> = new Set<string>();

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {
  }

  toggleViewMode(){
    this.isGridView = !this.isGridView;
  }

  markLogAsModified(logId: string) {
    this.modifiedLogIds.add(logId);
  }

  goBack() {
    this.closeDetail.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId'] && this.taskId) {
      this.loadTaskDetail(this.taskId);

      // Grafikler için tüm listeyi çektik
      this.taskService.getTasks().subscribe(res => {
        this.allTasks = res;
        this.updateAvailableTasks();
      });
    }
  }

  loadTaskDetail(id: string) {
    this.taskService.getTaskById(id).subscribe(data => {
      this.selectedTask = data;

      if (this.selectedTask) {
        this.selectedTask.logs = this.selectedTask.logs ?? [];
      }
      this.updateAvailableTasks();
      this.modifiedLogIds.clear();
    });
  }

  updateAvailableTasks() {
    if (!this.selectedTask || this.allTasks.length === 0) return;

    // Şu anki görevi listeden çıkar (İnsan kendini kendisiyle kıyaslamaz)
    this.availableTasksForCompare = this.allTasks.filter(t => t.id !== this.selectedTask?.id);

    // Eğer ana görev değiştiyse, eski seçimleri temizle ki grafik sapıtmasın
    this.selectedCompareTasks = [];
  }

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

        // KONTROL: Eğer bu logun ID'si "değişenler" listesinde varsa yolla
        if (this.modifiedLogIds.has(log.id)) {

          // Ufak bir optimizasyon: Sadece saati veya açıklaması dolu olanları güncelleyelim
          const logUpdateModel: UpdateTaskLogDto = {
            hoursSpent: log.hoursSpent,
            description: log.description,
          };

          // Her bir log için ayrı bir istek oluşturup havuza atıyoruz
          requests.push(this.taskService.updateLog(log.id, logUpdateModel));
        }
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
        this.snackBar.open('Hata oluştu!', 'Kapat', {duration: 3000});
        this.isSaving = false;
      }
    });

  }

  // Metin kutusuna sembol ekleme fonksiyonu
  addSymbol(targetObj: any, field: string, type: 'list' | 'check') {

    const symbol = type === 'list' ? '• ' : '☐ ';
    let currentText = targetObj[field] || '';

    // Eğer kutu boşsa direkt ekle, doluysa yeni satıra geçip ekle
    if (currentText.length > 0) {
      targetObj[field] = currentText + '\n' + symbol;
    } else {
      targetObj[field] = symbol;
    }
  }

  // Opsiyonel: Dolu/Boş kutu değiştirme (Basit toggle)
  // Kullanıcı manuel de yapabilir ama butonla yapmak isterse:
  toggleCheck(targetObj: any, field: string){
    let text = targetObj[field] || '';
    // Boş kutuyu dolu yap, doluysa boş yap
    if (text.includes('☐')) {
      targetObj[field] = text.replace(/☐/g, '☑');
    } else if (text.includes('☑')) {
      targetObj[field] = text.replace(/☑/g, '☐');
    }
  }

  // 1. BUTON İÇİN: İmlecin olduğu yere kutucuk ekle
  addCheckbox(targetObj: any, field: string) {
    const text = targetObj[field] || '';
    // Eğer kutu doluysa alt satıra geçip ekle, boşsa direkt ekle
    targetObj[field] = text + (text.length > 0 ? '\n⚪ ' : '⚪ ');
  }

  // 2. KLAVYE (ENTER) İÇİN: Alt satıra otomatik kutu aç
  handleEnter(event: KeyboardEvent, targetObj: any, field: string) {
    if (event.key === 'Enter') {
      const textarea = event.target as HTMLTextAreaElement;
      const cursor = textarea.selectionStart;
      const value = textarea.value;

      // O anki satırı bul
      const lastNewLine = value.lastIndexOf('\n', cursor - 1);
      const currentLine = value.substring(lastNewLine + 1, cursor);

      // Eğer satır başında bu işaretler varsa, alt satıra da ekle
      if (currentLine.trim().startsWith('⚪') || currentLine.trim().startsWith('✅')) {
        event.preventDefault(); // Normal enter'ı durdur

        // Araya yeni satır ve boş kutu ekle
        const newValue = value.substring(0, cursor) + '\n⚪ ' + value.substring(textarea.selectionEnd);
        targetObj[field] = newValue;

        // İmleci ayarla
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursor + 3; // 3 karakter ilerlet (\n + ⚪ + boşluk)
        });
      }
    }
  }

  // 3. TIKLAMA İLE KUTUCUK DEĞİŞTİRME (HASSAS MOD)
  toggleCheckbox(event: MouseEvent, targetObj: any, field: string) {
    const textarea = event.target as HTMLTextAreaElement;
    const cursor = textarea.selectionStart;
    const text = textarea.value;

    // Sadece imlecin TAM YANINDAKİ (bitişik) karakterlere bakıyoruz
    const charLeft = text.charAt(cursor - 1); // İmlecin solu
    const charRight = text.charAt(cursor);     // İmlecin sağı

    let newText = text;
    let changed = false;

    // SENARYO 1: İmleç kutunun SAĞINDAYSA (⚪|)
    if (charLeft === '⚪') {
      newText = text.substring(0, cursor - 1) + '✅' + text.substring(cursor);
      changed = true;
    }
    else if (charLeft === '✅') {
      newText = text.substring(0, cursor - 1) + '⚪' + text.substring(cursor);
      changed = true;
    }
    // SENARYO 2: İmleç kutunun SOLUNDAYSA (|⚪)
    else if (charRight === '⚪') {
      newText = text.substring(0, cursor) + '✅' + text.substring(cursor + 1);
      changed = true;
    }
    else if (charRight === '✅') {
      newText = text.substring(0, cursor) + '⚪' + text.substring(cursor + 1);
      changed = true;
    }

    if (changed) {
      event.preventDefault(); // Tıklama işlemini durdur (İmleç kaçmasın)
      targetObj[field] = newText;

      // İmleci olduğu yerde sabit tut
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursor;
      });
    }
  }
}
