import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resources-page',
  imports: [InputText, ButtonModule, InputGroupAddon, InputGroup, RouterLink],
  templateUrl: './resources-page.html',
  styleUrl: './resources-page.css',
})
export class ResourcesPage {}
