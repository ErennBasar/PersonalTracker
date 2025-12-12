export interface TaskDto {
  id: string;
  userId: string;
  header: string;
  body: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  updatedDate: string;
  isCompleted: boolean;
  isCommon: boolean;
  hoursTaken: number;
  logs?: TaskLogDto[];
}

export interface CreateTaskDto {
  startDate: string;
  endDate: string;
  userId: string;
  isCommon: boolean;
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
  updatedDate: string;
}

export interface UpdateTaskLogDto {
  hoursSpent?: number;
  description?: string;
}
