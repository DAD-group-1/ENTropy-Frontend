import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPage } from './resources-page';
import { provideRouter } from '@angular/router';

describe('ResourcesPage', () => {
  let component: ResourcesPage;
  let fixture: ComponentFixture<ResourcesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
