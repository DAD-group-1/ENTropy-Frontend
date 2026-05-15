import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENTCalendar } from './entcalendar';

describe('ENTCalendar', () => {
  let component: ENTCalendar;
  let fixture: ComponentFixture<ENTCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ENTCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(ENTCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
