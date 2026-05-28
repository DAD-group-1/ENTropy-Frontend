import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profile } from './profile';
import { provideRouter } from '@angular/router';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;

    component.profileType = 'student';

    component.userData = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test@test.com',
      phone: '000',
      birthday: '2000-01-01',
      campus: 'Test',
      program: 'Test',
      enrollmentYear: 2024,
    };

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
