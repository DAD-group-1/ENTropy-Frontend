import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FrontWebsocketService {
  private socket?: Socket;

  connect(userId: string) {
    if (this.socket) return;

    this.socket = io(environment.apiUrl, {
      auth: { userId },
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = undefined;
  }

  on<T>(event: string, callback: (data: T) => void) {
    if (!this.socket) {
      console.warn('Socket not initialized yet');
      return;
    }

    this.socket?.on(event, callback);
  }

  emit(event: string, data: unknown) {
    this.socket?.emit(event, data);
  }
}
