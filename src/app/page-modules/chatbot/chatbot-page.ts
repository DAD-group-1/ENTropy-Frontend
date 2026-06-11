import { Component, inject, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../core/data-services';
import { finalize } from 'rxjs/operators';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chatbot-page',
  imports: [ButtonDirective, FormsModule],
  templateUrl: './chatbot-page.html',
  styleUrl: './chatbot-page.css',
})
export class ChatbotPage {
  private agentService = inject(AgentService);

  private initialCount = 1;

  messages = signal<ChatMessage[]>([
    {
      id: this.initialCount,
      role: 'assistant',
      content: `Hello! I am Entropy AI, your academic assistant for Novacampus Alliance.\n\nI can help you with:\n- Course schedules and academic information\n- Grades and attendance tracking\n- Administrative procedures\n- Campus information\n- General questions about the ENT platform\n\nHow can I assist you today?`,
    },
  ]);

  input = '';
  loading = signal(false);

  private idCounter = this.initialCount;

  sendMessage() {
    const text = this.input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: this.idCounter++,
      role: 'user',
      content: text,
    };

    this.messages.update((msgs) => [...msgs, userMsg]);

    this.input = '';
    this.loading.set(true);

    this.agentService.agentChat({ agentRequest: {message: text}})
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }))
      .subscribe({
        next: (res) => {
          console.log(res);
          const botMsg: ChatMessage = {
            id: this.idCounter++,
            role: 'assistant',
            content: res.data.reply,
          };

          this.messages.update((msgs) => [...msgs, botMsg]);
        },
        error: () => {
          this.messages.update((msgs) => [
            ...msgs,
            {
              id: this.idCounter++,
              role: 'assistant',
              content: 'Error: unable to reach AI service.',
            },
          ]);
        },
      });
  }
}
