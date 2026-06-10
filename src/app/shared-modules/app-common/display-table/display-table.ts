import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePipe, NgClass } from '@angular/common';
import { DateFormat } from '../../utils';
import { FrontNavigationService } from '../../service/front-navigation.service';

export interface TableColumn {
  key: string;
  label: string;
  hide?: boolean;
  sort?: {
    sortField: boolean;
    sortOrder: number;
  };
  isBoolean?: boolean;
  dateFormat?: DateFormat;
  click?: {
    baseUrl: string;
    parameterColumn?: string;
  };
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

  frontNavigationService = inject(FrontNavigationService);

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

  onCellClick(header: TableColumn, row: TableRow) {
    if (!header.click) return;

    const headerParameter = header.click.parameterColumn;
    let urlParameter = '';

    if (headerParameter) {
      const value = row[headerParameter];

      if (value === null || value === undefined) return;

      urlParameter = String(value);
    }


    const url = `${header.click.baseUrl}/${urlParameter}`;

    this.frontNavigationService.navigate(url);
  }
}
