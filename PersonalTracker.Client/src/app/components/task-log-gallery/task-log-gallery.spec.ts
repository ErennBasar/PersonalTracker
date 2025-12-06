import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLogGallery } from './task-log-gallery';

describe('TaskLogGallery', () => {
  let component: TaskLogGallery;
  let fixture: ComponentFixture<TaskLogGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskLogGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskLogGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
