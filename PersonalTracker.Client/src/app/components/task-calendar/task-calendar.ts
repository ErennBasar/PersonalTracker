import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // Ana Modül
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // Tipler
import dayGridPlugin from '@fullcalendar/daygrid'; // Ay görünümü eklentisi
import interactionPlugin from '@fullcalendar/interaction'; // Tıklama olayları için
import {TaskDto} from '../../models/task';

@Component({
  selector: 'app-task-calendar',
  imports: [CommonModule,FullCalendarModule],
  templateUrl: './task-calendar.html',
  styleUrl: './task-calendar.scss',
})
export class TaskCalendar implements OnChanges{

  @Input() tasks: TaskDto[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Aylık görünüm
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: [], // Verileri buraya yükleyeceğiz
    eventClick: (info) => this.handleEventClick(info) // Tıklanınca ne olsun?
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tasks && this.tasks.length > 0) {
      this.updateCalendarEvents();
    }
  }

  updateCalendarEvents() {
    // Bizim TaskDto'yu -> FullCalendar Event formatına çeviriyoruz
    const events: EventInput[] = this.tasks.map(task => ({
      id: task.id,
      title: task.header,
      start: task.startDate, // ISO string formatı uygundur
      end: task.endDate,     // FullCalendar bitiş tarihini exclusive (dahil etmeyerek) alır, bazen +1 gün eklemek gerekebilir ama şimdilik böyle deneyelim.

      // Renklendirme Mantığı (Trafik lambası veya tamamlanma durumu)
      backgroundColor: this.getColor(task),
      borderColor: 'transparent',
      textColor: 'white'
    }));

    // Ayarları güncelle
    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  getColor(task: TaskDto): string {
    // 1. TAMAMLANANLAR: Gri/Soluk Yeşil
    // "Bu iş bitti, dikkatini buna verme" mesajı.
    if (task.isCompleted) {
      return '#9e9e9e'; // Gri (Material Grey) - Veya '#81c784' (Soft Green)
    }

    // Tarih hesaplama
    const today = new Date();
    // Saati sıfırla ki sadece gün kıyaslayalım
    today.setHours(0,0,0,0);

    const endDate = new Date(task.endDate);
    endDate.setHours(0,0,0,0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 2. GECİKENLER (veya bugün bitmesi gerekenler): Kırmızı
    if (diffDays < 0) {
      return '#d32f2f'; // Koyu Kırmızı (Material Red 700) - GECİKMİŞ
    }
    if (diffDays <= 2) {
      return '#f44336'; // Normal Kırmızı - ÇOK ACİL (Son 2 gün)
    }

    // 3. YAKLAŞANLAR: Turuncu
    if (diffDays <= 5) {
      return '#fb8c00'; // Koyu Turuncu - DİKKAT
    }

    // 4. RAHAT OLANLAR: Mavi
    // Sol listede yeşil kullanmıştık ama takvimde Mavi daha standarttır "Planlanmış İş" için.
    // İstersen sol listeyle birebir uysun diye Yeşil (#4caf50) de yapabilirsin.
    return '#3f51b5'; // İndigo/Mavi - STANDART
  }

  // Basit bir aciliyet kontrolü (Kırmızı yapmak için)
  // isUrgent(task: TaskDto): boolean {
  //   if (task.isCompleted) return false;
  //   const today = new Date();
  //   const end = new Date(task.endDate);
  //   const diff = end.getTime() - today.getTime();
  //   const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  //   return days < 3;
  // }

  handleEventClick(info: any) {
    console.log('Takvimde tıklanan görev ID:', info.event.id);
    // Burada AppComponent'e haber vermemiz gerekecek (Output ile)
    // Şimdilik konsola yazsın.
  }
}
