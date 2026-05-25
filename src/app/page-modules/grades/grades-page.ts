import { Component } from '@angular/core';
import {
  DisplayTable,
  TableColumn,
  TableRow,
} from '../../shared-modules/app-common/display-table/display-table';

@Component({
  selector: 'app-grades-page',
  imports: [DisplayTable],
  templateUrl: './grades-page.html',
  styleUrl: './grades-page.css',
})
export class GradesPage {
  public headers: TableColumn[] = [
    // TODO: Change remove student column if not instructor
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

  //TODO: Get your grades if student, get everyone grade if instructor
  public rows: TableRow[] = [
    {
      student: 'Alice Martin',
      exam: 'Math Midterm',
      date: '2026-01-10',
      grade: '15/20',
      passed: true,
    },
    {
      student: 'Lucas Bernard',
      exam: 'Physics Final',
      date: '2026-01-12',
      grade: '12/20',
      passed: true,
    },
    {
      student: 'Emma Dubois',
      exam: 'Chemistry Quiz',
      date: '2026-01-15',
      grade: '18/20',
      passed: true,
    },
    {
      student: 'Hugo Petit',
      exam: 'History Test',
      date: '2026-01-18',
      grade: '9/20',
      passed: true,
    },
    {
      student: 'Chloé Moreau',
      exam: 'English Essay',
      date: '2026-01-20',
      grade: '14/20',
      passed: true,
    },
    {
      student: 'Alice Martin',
      exam: 'Math Midterm',
      date: '2026-01-10',
      grade: '15/20',
      passed: true,
    },
    {
      student: 'Lucas Bernard',
      exam: 'Physics Final',
      date: '2026-01-12',
      grade: '12/20',
      passed: true,
    },
    {
      student: 'Emma Dubois',
      exam: 'Chemistry Quiz',
      date: '2026-01-15',
      grade: '18/20',
      passed: true,
    },
    {
      student: 'Hugo Petit',
      exam: 'History Test',
      date: '2026-01-18',
      grade: '9/20',
      passed: false,
    },
    {
      student: 'Chloé Moreau',
      exam: 'English Essay',
      date: '2026-01-20',
      grade: '14/20',
      passed: true,
    },
    {
      student: 'Alice Martin',
      exam: 'Math Midterm',
      date: '2026-01-10',
      grade: '15/20',
      passed: true,
    },
    {
      student: 'Lucas Bernard',
      exam: 'Physics Final',
      date: '2026-01-12',
      grade: '12/20',
      passed: true,
    },
    {
      student: 'Emma Dubois',
      exam: 'Chemistry Quiz',
      date: '2026-01-15',
      grade: '18/20',
      passed: true,
    },
    {
      student: 'Hugo Petit',
      exam: 'History Test',
      date: '2026-01-18',
      grade: '9/20',
      passed: false,
    },
    {
      student: 'Chloé Moreau',
      exam: 'English Essay',
      date: '2026-01-20',
      grade: '14/20',
      passed: true,
    },
    {
      student: 'Alice Martin',
      exam: 'Math Midterm',
      date: '2026-01-10',
      grade: '15/20',
      passed: true,
    },
    {
      student: 'Lucas Bernard',
      exam: 'Physics Final',
      date: '2026-01-12',
      grade: '12/20',
      passed: false,
    },
    {
      student: 'Emma Dubois',
      exam: 'Chemistry Quiz',
      date: '2026-01-15',
      grade: '18/20',
      passed: true,
    },
    {
      student: 'Hugo Petit',
      exam: 'History Test',
      date: '2026-01-18',
      grade: '9/20',
      passed: false,
    },
    {
      student: 'Chloé Moreau',
      exam: 'English Essay',
      date: '2026-01-20',
      grade: '14/20',
      passed: true,
    },
    {
      student: 'Alice Martin',
      exam: 'Math Midterm',
      date: '2026-01-10',
      grade: '15/20',
      passed: true,
    },
    {
      student: 'Lucas Bernard',
      exam: 'Physics Final',
      date: '2026-01-12',
      grade: '12/20',
      passed: true,
    },
    {
      student: 'Emma Dubois',
      exam: 'Chemistry Quiz',
      date: '2026-01-15',
      grade: '18/20',
      passed: true,
    },
    {
      student: 'Hugo Petit',
      exam: 'History Test',
      date: '2026-01-18',
      grade: '9/20',
      passed: false,
    },
    {
      student: 'Chloé Moreau',
      exam: 'English Essay',
      date: '2026-01-20',
      grade: '14/20',
      passed: true,
    },
  ];
}
