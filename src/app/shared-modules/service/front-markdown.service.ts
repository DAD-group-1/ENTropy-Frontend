import { inject, Injectable } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

marked.use({
  async: false,
});

@Injectable({ providedIn: 'root' })
export class FrontMarkdownService {
  constructor() {
    marked.use({
      async: false,
      gfm: true,
    });
  }

  private readonly sanitizer = inject(DomSanitizer);

  renderMarkdown(content: string): SafeHtml {
    const html = marked.parse(content) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
