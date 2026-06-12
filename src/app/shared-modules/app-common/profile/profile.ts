import { Component, inject, Input, signal, Signal, WritableSignal, OnChanges } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { FrontAuthService, Roles } from '../../service/front-auth.service';
import { RouterLink } from '@angular/router';
import { PersonalDatePipe } from '../../utils';
import { Dialog } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { CreateNotificationDto, NotificationsService } from '../../../core/data-services';
import { FrontToastService } from '../../service/front-toast.service';

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
  imports: [
    TitleCasePipe,
    Card,
    NgClass,
    RouterLink,
    PersonalDatePipe,
    Dialog,
    ButtonDirective,
    ReactiveFormsModule,
    InputText,
    Textarea,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnChanges {
  @Input({ required: true }) userData!: Signal<ProfileData | null>;
  @Input({ required: true }) profileType!: Signal<Roles | null>;
  @Input({ required: true }) userId!: string | undefined;
  @Input({ required: true }) isMyProfile!: boolean;

  public readonly fb = inject(FormBuilder);
  public readonly frontAuthService = inject(FrontAuthService);
  public readonly notificationsService = inject(NotificationsService);
  private readonly frontToastService = inject(FrontToastService);

  public Roles = Roles;

  public readonly roleMap: Record<Roles, string> = {
    Student: 'bg-blue-100 text-blue-700',
    Instructor: 'bg-green-100 text-green-700',
    Management: 'bg-amber-100 text-amber-800',
    Admin: 'bg-red-100 text-red-800',
  };

  public showModal: WritableSignal<boolean> = signal(false);

  notificationForm = this.fb.group({
    user_id: [this.userId, Validators.required],
    title: ['', Validators.required],
    message: ['', Validators.required],
    target_url: [''],
  });

  ngOnChanges() {
    if (this.userId) {
      this.notificationForm.patchValue({
        user_id: this.userId,
      });
    }
  }

  submitNotification() {
    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      return;
    }

    const raw = this.notificationForm.value;

    const payload: CreateNotificationDto = {
      user_id: Number(raw.user_id),
      title: raw.title ?? '',
      message: raw.message ?? '',
      target_url: raw.target_url ?? undefined,
    };

    this.notificationsService.notificationsCreate({ createNotificationDto: payload }).subscribe({
      next: () => {
        this.showModal.set(false);
        this.notificationForm.reset();
        this.notificationForm.patchValue({
          user_id: this.userId,
        });
        this.frontToastService.success('Notification sent successfully');
      },

      error: (err) => {
        console.error(err);
        this.frontToastService.error('An error occured', err);
      },
    });
  }
}
