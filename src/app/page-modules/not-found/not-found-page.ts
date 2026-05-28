import { Component } from '@angular/core';
import { Error } from '../../shared-modules/layout/error/error';

@Component({
  selector: 'app-not-found-page',
  imports: [Error],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.css',
})
export class NotFoundPage {}
