export interface TaskDto {
  id: string;
  header: string;
  body: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  hoursTaken: number;
  logs?: TaskLogDto[];
}

export interface CreateTaskDto {
  startDate: string;
  endDate: string;
}

export interface UpdateTaskDto {
  header: string;
  body: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  hoursTaken?: number;
}
export interface TaskLogDto {
  id: string;
  logTime: string;
  hoursSpent: number;
  description: string;
}

export interface UpdateTaskLogDto {
  hoursSpent?: number;
  description?: string;
}
