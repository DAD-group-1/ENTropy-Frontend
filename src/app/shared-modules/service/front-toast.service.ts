import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastType = 'success' | 'error' | 'info' | 'warn';

@Injectable({ providedIn: 'root' })
export class FrontToastService {
  private readonly messageService = inject(MessageService)

  show(payload: {
    type: ToastType;
    title: string;
    description?: string;
    timeToShow?: number | null;
  }) {
    this.messageService.add({
      severity: this.mapType(payload.type),
      summary: payload.title,
      detail: payload.description,
      life: payload.timeToShow ?? 3000,
    });
  }

  success(title: string, description?: string, timeToShow = 3000) {
    this.show({ type: 'success', title, description, timeToShow });
  }

  error(title: string, description?: string, timeToShow = 3000) {
    this.show({ type: 'error', title, description, timeToShow });
  }

  info(title: string, description?: string, timeToShow = 3000) {
    this.show({ type: 'info', title, description, timeToShow });
  }

  warn(title: string, description?: string, timeToShow = 3000) {
    this.show({ type: 'warn', title, description, timeToShow });
  }

  private mapType(type: ToastType) {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      case 'warn':
        return 'warn';
    }
  }
}
