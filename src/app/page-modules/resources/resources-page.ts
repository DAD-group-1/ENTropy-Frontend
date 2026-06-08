import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-resources-page',
  imports: [InputText, ButtonModule],
  templateUrl: './resources-page.html',
  styleUrl: './resources-page.css',
})
export class ResourcesPage {}
