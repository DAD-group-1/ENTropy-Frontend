import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePipe, NgClass } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sort?: {
    sortField: boolean;
    sortOrder: number;
  };
  isBoolean?: boolean;
  isDate?: boolean
  click?: {
    baseUrl: string,
    parameter: string
  }
}
export type TableRow = Record<TableColumn['key'], string | number | boolean | null>;

@Component({
  selector: 'app-display-table',
  imports: [
    FormsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    InputTextModule,
    NgClass,
    DatePipe,
  ],
  templateUrl: './display-table.html',
  styleUrl: './display-table.css',
})
export class DisplayTable implements OnInit {
  @Input({ required: true }) headers!: WritableSignal<TableColumn[]>;
  @Input({ required: true }) rows!: WritableSignal<TableRow[]>;
  @Input({ required: true }) totalRecords!: WritableSignal<number>;

  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();

  searchValue: string | undefined;

  defaultSortField?: TableColumn;
  globalFilterFields: string[] = [];

  ngOnInit(): void {
    this.defaultSortField = this.headers().find((c) => c.sort?.sortField);
    this.globalFilterFields = this.headers().map((c) => c.key);
  }

  clear(dt: Table) {
    this.searchValue = '';
    dt.reset();
  }
}
