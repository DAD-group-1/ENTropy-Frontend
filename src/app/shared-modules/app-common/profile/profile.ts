import { Component, Input } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Card } from 'primeng/card';

export type ProfileType = 'student' | 'instructor';

export interface ProfileData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthday: string;
  campus: string;

  program?: string;
  enrollmentYear?: number;
  emergency_phone?: string;
  emergency_contact?: string;
  address?: string;
  city?: string;
  zipCode?: string;

  department?: string;
  hire_date?: string;
  specialization?: string;
}

@Component({
  selector: 'app-profile',
  imports: [TitleCasePipe, Card, NgClass],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  @Input({ required: true }) userData!: ProfileData;
  @Input({ required: true }) profileType!: ProfileType;

  public readonly roleMap: Record<ProfileType, string> = {
    student: 'bg-blue-100 text-blue-700',
    instructor: 'bg-green-100 text-green-700',
  };
}
