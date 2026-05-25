import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTable } from './display-table';
import { provideRouter } from '@angular/router';

describe('DisplayTable', () => {
  let component: DisplayTable;
  let fixture: ComponentFixture<DisplayTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayTable],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayTable);
    component = fixture.componentInstance;

    component.headers = [
      {
        key: 'student',
        label: 'Student',
      },
      {
        key: 'exam',
        label: 'Exam',
      },
      {
        key: 'date',
        label: 'Date',
        sort: {
          sortField: true,
          sortOrder: -1,
        },
      },
      {
        key: 'grade',
        label: 'Grade',
      },
      {
        key: 'passed',
        label: 'Passed',
        isBoolean: true,
      },
    ];

    component.rows = [
      {
        student: 'Alice Martin',
        exam: 'Math Midterm',
        date: '2026-01-10',
        grade: '15/20',
        passed: true,
      },
    ];

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
