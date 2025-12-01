import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {TaskDto} from '../../models/task';

@Component({
  selector: 'app-task-charts',
  imports: [NgxChartsModule,CommonModule],
  templateUrl: './task-charts.html',
  styleUrl: './task-charts.scss',
})
export class TaskCharts implements OnChanges{
  @Input() currentTask: TaskDto | null = null;
  @Input() allTasks: TaskDto[] = [];

  // Varsayılan olarak hepsi açık (true)
  @Input() showTrend: boolean = true;   // Çizgi Grafiği
  @Input() showSummary: boolean = true; // Pasta ve Sütun Grafiği

  lineChartData: any[] = []
  pieChartData: any[] = []
  barChartData: any[] = []

  chartWidth: number = 1400;

  lineChartScheme: any = {
    domain: ['#4caf50']
  };

  ngOnChanges(changes: SimpleChanges) {
    if(this.currentTask) {
      this.prepareCharts();
    }
  }
  prepareCharts() {
    if(!this.currentTask) return;

    // --- 1. ÇİZGİ GRAFİĞİ (LOGLAR) ---
    // ngx-charts formatı: { name: "Seri Adı", series: [ {name: "Tarih", value: 4}, ... ] }
    const series = (this.currentTask.logs || []).map(log => ({
      name: new Date(log.logTime).toLocaleDateString('tr-TR', {day: '2-digit', month: 'short'}), // "21 Kas"
      value: log.hoursSpent
    }));

    this.lineChartData = [
      {
        name: this.currentTask.header,
        series: series
      }
    ];

    const dataPointCount = series.length;
    const minWidth = 1400; // Minimum genişlik
    const calculatedWidth = dataPointCount * 60; // Her gün için 60px yer ayır

    // Hangisi büyükse onu al
    this.chartWidth = calculatedWidth > minWidth ? calculatedWidth : minWidth;

    // --- 2. PASTA GRAFİĞİ (BU GÖREV vs DİĞERLERİ) ---
    // Diğer tüm görevlerin toplam saati
    const totalOthers = this.allTasks
      .filter(t => t.id !== this.currentTask?.id)
      .reduce((sum, t) => sum + t.hoursTaken, 0);

    this.pieChartData = [
      {
        name: "Bu Görev",
        value: this.currentTask.hoursTaken
      },
      {
        name: "Diğerleri",
        value: totalOthers
      }
    ];

    // Özel Renkler (Turuncu ve Mavi)
    this.customColors = [
      { name: "Bu Görev", value: '#ff9800' }, // Turuncu
      { name: "Diğerleri", value: '#3f51b5' } // Mavi
    ];

    // --- 3. SÜTUN GRAFİĞİ (ORTALAMA vs BU GÖREV) ---
    const totalAll = this.allTasks.reduce((sum, t) => sum + t.hoursTaken, 0);
    const average = this.allTasks.length > 0 ? (totalAll / this.allTasks.length) : 0;

    this.barChartData = [
      {
        name: "Bu Görev",
        value: this.currentTask.hoursTaken
      },
      {
        name: "Ortalama",
        value: average
      }
    ];
  }

  customColors: any[] = [];

}
