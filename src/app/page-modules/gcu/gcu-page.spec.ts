import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GcuPage } from './gcu-page';

describe('GcuPage', () => {
  let component: GcuPage;
  let fixture: ComponentFixture<GcuPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GcuPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GcuPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
