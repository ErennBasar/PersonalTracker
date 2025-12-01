import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAddDialog } from './task-add-dialog';

describe('TaskAddDialog', () => {
  let component: TaskAddDialog;
  let fixture: ComponentFixture<TaskAddDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAddDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAddDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
