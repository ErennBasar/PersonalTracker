import {Component} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-task-add-dialog',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './task-add-dialog.html',
  styleUrl: './task-add-dialog.scss',
})
export class TaskAddDialog {

  // Tarih aralığını tutacak form grubu
  range = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
    isCommon: new FormControl(false)
  });

  constructor(
    public dialogRef: MatDialogRef<TaskAddDialog>,
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave(){
    if(this.range.valid){
      // Seçilen tarih (start, end) ana sayfaya geri yolla
      this.dialogRef.close(this.range.value);
    }
  }
}
