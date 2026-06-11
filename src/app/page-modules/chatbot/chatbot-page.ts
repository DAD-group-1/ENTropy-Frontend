import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../core/data-services';
import { finalize } from 'rxjs/operators';
import { FrontMarkdownService } from '../../shared-modules/service/front-markdown.service';

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
  constructor() {
    effect(() => {
      this.messages();

      setTimeout(() => this.scrollToBottom());
    });
  }

  @ViewChild('chatWindow')
  private readonly chatWindow!: ElementRef<HTMLDivElement>;

  private readonly agentService = inject(AgentService);
  protected readonly frontMarkdownService = inject(FrontMarkdownService);

  private initialCount = 1;

  messages = signal<ChatMessage[]>([
    {
      id: this.initialCount,
      role: 'assistant',
      content: '## Hello 👋\nI am **EntropIA**, your academic assistant for Novacampus Alliance.\nI can help you with:\r- Course schedules and academic information\n- Grades and attendance tracking\n- Administrative procedures\n- Campus information\n- General questions about the ENT platform\n\nHow can I assist you today?'},
  ]);

  input = '';
  loading = signal(false);

  private idCounter = this.initialCount;

  sendMessage() {
    if (this.loading()) return;

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

    this.agentService
      .agentChat({ agentRequest: { message: text } })
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
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

  private scrollToBottom() {
    const el = this.chatWindow?.nativeElement;

    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }
}
