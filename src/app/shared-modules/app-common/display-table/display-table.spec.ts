import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTable } from './display-table';

describe('DisplayTable', () => {
  let component: DisplayTable;
  let fixture: ComponentFixture<DisplayTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
