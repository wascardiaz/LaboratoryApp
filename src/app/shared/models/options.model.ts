import { SortDirection } from "@angular/material/sort";

export interface Options {
    orderBy: string;
    orderDir: SortDirection;// 'ASC' | 'DESC';
    search: string;
    size: number;
    page: number;
}