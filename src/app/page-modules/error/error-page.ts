import { Component } from '@angular/core';
import { Error } from '../../shared-modules/layout/error/error';
@Component({
  selector: 'app-error-page',
  imports: [Error],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
})
export class ErrorPage {}
