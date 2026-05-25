import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesPage } from './grades-page';
import { provideRouter } from '@angular/router';

describe('GradesPage', () => {
  let component: GradesPage;
  let fixture: ComponentFixture<GradesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GradesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
