import { Component } from '@angular/core';
import { Error } from '../../shared-modules/layout/error/error';

@Component({
  selector: 'app-forbidden-page',
  imports: [Error],
  templateUrl: './forbidden-page.html',
  styleUrl: './forbidden-page.css',
})
export class ForbiddenPage {}
