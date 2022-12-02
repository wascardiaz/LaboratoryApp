import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkAccordionModule } from '@angular/cdk/accordion';



@NgModule({
  declarations: [],
  imports: [
    // CommonModule,
    // MatDialogModule,
    // MatButtonModule,
    // MatTableModule,
    // MatSortModule, // Required for Sorting table
    // MatPaginatorModule,
    // MatCardModule,
    // MatFormFieldModule,
    // MatProgressSpinnerModule,
    // MatInputModule,
    // MatSelectModule,
    // MatIconModule,
  ],
  exports: [

    // CDK
    OverlayModule,
    CdkMenuModule,
    DragDropModule,
    CdkTreeModule,
    CdkAccordionModule,

    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule, // Required for Sorting table
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    MatNativeDateModule,
    MatRippleModule,
    MatAutocompleteModule
  ]
})
export class MaterialModule { }
