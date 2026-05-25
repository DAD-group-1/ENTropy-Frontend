import { Component } from '@angular/core';
import {
  DisplayTable,
  TableColumn,
  TableRow,
} from '../../shared-modules/app-common/display-table/display-table';

@Component({
  selector: 'app-absences-page',
  imports: [DisplayTable],
  templateUrl: './absences-page.html',
  styleUrl: './absences-page.css',
})
export class AbsencesPage {
  // TODO: Change remove student column if not instructor
  public headers: TableColumn[] = [
    {
      key: 'student',
      label: 'Student',
    },
    {
      key: 'associatedCourse',
      label: 'Associated course',
    },
    {
      key: 'startMissingDate',
      label: 'Start missing date',
      sort: {
        sortField: true,
        sortOrder: -1,
      },
    },
    {
      key: 'endMissingDate',
      label: 'End missing date',
    },
    {
      key: 'reason',
      label: 'Reason',
    },
  ];

  //TODO: Get your grades if student, get everyone grade if instructor
  public rows: TableRow[] = [
    {
      student: 'Alice Martin',
      startMissingDate: '2026-01-10 08:30',
      endMissingDate: '2026-01-10 11:45',
      reason: 'Sick leave',
      associatedCourse: 'Math Midterm',
    },
    {
      student: 'Lucas Bernard',
      startMissingDate: '2026-01-12 13:00',
      endMissingDate: '2026-01-12 17:00',
      reason: 'Family emergency',
      associatedCourse: 'Physics Final',
    },
    {
      student: 'Emma Dubois',
      startMissingDate: '2026-01-15 09:15',
      endMissingDate: '2026-01-15 10:30',
      reason: 'Medical appointment',
      associatedCourse: 'Chemistry Quiz',
    },
    {
      student: 'Hugo Petit',
      startMissingDate: '2026-01-18 08:00',
      endMissingDate: '2026-01-18 12:00',
      reason: 'Unknown',
      associatedCourse: 'History Test',
    },
    {
      student: 'Chloé Moreau',
      startMissingDate: '2026-01-20 14:20',
      endMissingDate: '2026-01-20 16:10',
      reason: 'Late arrival',
      associatedCourse: 'English Essay',
    },
  ];
}
