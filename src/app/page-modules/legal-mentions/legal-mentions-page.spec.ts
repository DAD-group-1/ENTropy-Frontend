import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMentionsPage } from './legal-mentions-page';

describe('LegalMentionsPage', () => {
  let component: LegalMentionsPage;
  let fixture: ComponentFixture<LegalMentionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalMentionsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalMentionsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
