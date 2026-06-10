import { Component, Input, Signal } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { Roles } from '../../service/front-auth.service';
import { RouterLink } from '@angular/router';
import { PersonalDatePipe } from '../../utils';

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
  imports: [TitleCasePipe, Card, NgClass, RouterLink, PersonalDatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  @Input({ required: true }) userData!: Signal<ProfileData | null>;
  @Input({ required: true }) profileType!: Signal<Roles | null>;
  @Input({ required: true }) userId!: string | undefined;
  @Input({ required: true }) isMyProfile!: boolean;

  public Roles = Roles;

  public readonly roleMap: Record<Roles, string> = {
    Student: 'bg-blue-100 text-blue-700',
    Instructor: 'bg-green-100 text-green-700',
    Management: 'bg-amber-100 text-amber-800',
    Admin: 'bg-red-100 text-red-800',
  };
}
