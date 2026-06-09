import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesPage } from './attendances-page';

describe('AbsencesPage', () => {
  let component: AttendancesPage;
  let fixture: ComponentFixture<AttendancesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendancesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AttendancesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
