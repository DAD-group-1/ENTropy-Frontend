import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsencesPage } from './absences-page';

describe('AbsencesPage', () => {
  let component: AbsencesPage;
  let fixture: ComponentFixture<AbsencesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsencesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AbsencesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
