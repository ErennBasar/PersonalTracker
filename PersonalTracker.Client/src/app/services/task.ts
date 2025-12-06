import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {CreateTaskDto, TaskDto, UpdateTaskDto, UpdateTaskLogDto} from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:5256/api/Todo';

  // Bu bizim "Yenileme Zili"miz
  private _refreshNeeded$ = new Subject<void>();

  // Diğer bileşenler bu zili dinleyecek
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) {
  }

  // Listeleme (Get)
  getTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`);
  }

  // Ekleme (Get)
  createTask(task: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, task);
  }

  // Güncelleme (Patch)
  updateTask(id: string, task: UpdateTaskDto): Observable<TaskDto> {
    return this.http.patch<TaskDto>(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  updateLog(id: string, log: UpdateTaskLogDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/log/${id}`, log).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    )
  }

  // Silme (Delete)
  deleteTask(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Silme başarılıysa zili çal, herkes duysun
        this._refreshNeeded$.next();
      })
    );
  }
}
