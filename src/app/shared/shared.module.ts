import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorDisplayComponent } from './error-display/error-display.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UpdateStatusComponent } from './update-status/update-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { PersonComponent } from './person/person.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { AnalysisResultEditDialogComponent } from './dialogs/analysis-result-edit-dialog/analysis-result-edit-dialog.component';



@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    ErrorDisplayComponent,
    NotFoundComponent,
    UpdateStatusComponent,
    PersonComponent,
    ConfirmDialogComponent,
    AnalysisResultEditDialogComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  exports: [
    MaterialModule,
    NavigationComponent,
    FooterComponent,
    PersonComponent
  ],
  entryComponents:[
    PersonComponent,
    ConfirmDialogComponent,
    AnalysisResultEditDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
