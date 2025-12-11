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

  @Input() comparisonTasks: TaskDto[] = [];

  // Varsayılan olarak hepsi açık (true)
  @Input() showTrend: boolean = true;   // Çizgi Grafiği
  @Input() showSummary: boolean = true; // Pasta ve Sütun Grafiği

  lineChartData: any[] = []
  pieChartData: any[] = []
  barChartData: any[] = []
  customColors: any[] = [];

  chartWidth: number = 1400;

  //colorPalette = ['#e91e63', '#9c27b0', '#009688', '#795548', '#607d8b'];
  colorPalette = ['#98739e', '#2196f3', '#a5ddf2', '#9c27b0', '#795548',];

  lineChartScheme: any = {
    domain: ['#4caf50', '#ff9800', '#2196f3', '#e91e63', '#9c27b0', '#795548']
  };

  ngOnChanges(changes: SimpleChanges) {
    if(this.currentTask) {
      this.prepareCharts();
    }
  }
  prepareCharts() {
    if (!this.currentTask) return;

    this.customColors = [];

    // Geçici bir dizi oluşturuyoruz
    const tempLineData = [];

    // --- 1. AŞAMA: ANA GÖREV ---
    const mainSeries = this.mapLogsToSeries(this.currentTask);

    console.log('Ana Görev Log Sayısı:', this.currentTask.header, mainSeries.length);

    tempLineData.push({
      name: this.currentTask.header,
      series: mainSeries
    });
    this.customColors.push({ name: this.currentTask.header, value: '#ff9800' });


    // --- 2. AŞAMA: KARŞILAŞTIRMA GÖREVLERİ ---
    this.comparisonTasks.forEach((task, index) => {

      const subSeries = this.mapLogsToSeries(task);

      console.log('Karşılaştırılan Görev Log Sayısı:', task.header, subSeries.length);

      if (subSeries.length > 0) {
        tempLineData.push({
          name: task.header,
          series: subSeries
        });

        // Renk paletinden renk seç
        const color = this.colorPalette[index % this.colorPalette.length];
        this.customColors.push({ name: task.header, value: color });
      } else {
        console.warn(`UYARI: ${task.header} için log verisi yok! API'den Include yapıldı mı?`);
      }
    });

    // --- 3. AŞAMA: GENİŞLİK HESAPLAMA (DÜZELTİLEN KISIM) ---
    // Artık tempLineData'ya bakıyoruz, this.lineChartData'ya değil!
    let maxDataPoints = 0;

    tempLineData.forEach(d => {
      if(d.series.length > maxDataPoints) maxDataPoints = d.series.length;
    });

    const minWidth = 1400;
    const calculatedWidth = maxDataPoints * 60;
    this.chartWidth = calculatedWidth > minWidth ? calculatedWidth : minWidth;

    // --- 4. AŞAMA: SON ATAMA ---
    // Veriyi en son atıyoruz
    this.lineChartData = [...tempLineData];
    // --- 2. PASTA GRAFİĞİ (PAYLAŞIM) ---
    // Mantık: [Bu Görev] + [Seçilen 1] + [Seçilen 2] + [Geriye Kalan Diğerleri]

    this.pieChartData = [];

    // A) Bu Görev
    this.pieChartData.push({ name: "Bu Görev", value: this.currentTask.hoursTaken });
    // (Rengi zaten yukarıda pushlamıştık ama 'Bu Görev' ismiyle tekrar garanti edelim)
    this.customColors.push({ name: "Bu Görev", value: '#ff9800' });

    // B) Seçilen Görevler
    let totalComparisonHours = 0;
    this.comparisonTasks.forEach((task, index) => {
      this.pieChartData.push({ name: task.header, value: task.hoursTaken });
      totalComparisonHours += task.hoursTaken;
      // Renk zaten yukarıda eklendi (header ile eşleşecek)
    });

    // C) Geriye Kalan Diğerleri
    // Tüm görevlerin toplam saati
    const totalAllHours = this.allTasks.reduce((sum, t) => sum + t.hoursTaken, 0);
    // Çıkarmamız gerekenler: Bu Görev + Seçilenler
    const remainingHours = totalAllHours - this.currentTask.hoursTaken - totalComparisonHours;

    if (remainingHours > 0) {
      this.pieChartData.push({ name: "Diğerleri", value: remainingHours });
      this.customColors.push({ name: "Diğerleri", value: '#3f51b5' }); // Mavi
    }


    // --- 3. SÜTUN GRAFİĞİ (KIYASLAMA) ---
    // Mantık: [Bu Görev] + [Seçilen 1] + [Seçilen 2] + [Ortalama]
    this.barChartData = [];

    // A) Bu Görev
    this.barChartData.push({ name: "Bu Görev", value: this.currentTask.hoursTaken });

    // B) Seçilen Görevler
    this.comparisonTasks.forEach(task => {
      this.barChartData.push({ name: task.header, value: task.hoursTaken });
    });

    // C) Ortalama (Genel Ortalamayı Hesapla)
    const average = this.allTasks.length > 0 ? (totalAllHours / this.allTasks.length) : 0;
    this.barChartData.push({ name: "Ortalama", value: average });
    this.customColors.push({ name: "Ortalama", value: '#9e9e9e' }); // Gri

  }

  // Yardımcı Fonksiyon: Logları grafik serisine çevirir
  private mapLogsToSeries(task: TaskDto): any[] {
    return (task.logs || []).map(log => ({
      name: new Date(log.logTime).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      value: log.hoursSpent
    }));
  }
}
