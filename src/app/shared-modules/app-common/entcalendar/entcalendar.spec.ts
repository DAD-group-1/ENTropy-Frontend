import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENTCalendar } from './entcalendar';
import { provideRouter } from '@angular/router';

describe('ENTCalendar', () => {
  let component: ENTCalendar;
  let fixture: ComponentFixture<ENTCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ENTCalendar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ENTCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
