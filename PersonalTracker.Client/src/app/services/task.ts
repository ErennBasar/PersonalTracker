import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {CreateTaskDto, TaskDto, UpdateTaskDto, UpdateTaskLogDto} from '../models/task';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  // Bu bizim "Yenileme Zili"miz
  private _refreshNeeded$ = new Subject<void>();

  // Diğer bileşenler bu zili dinleyecek
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) {
  }

  // Listeleme (Get)
  getTasks(userId: string): Observable<TaskDto[]> {
    let params = new HttpParams().set('userId', userId);

    return this.http.get<TaskDto[]>(this.apiUrl, {params: params});
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
