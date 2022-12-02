import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisResultEditDialogComponent } from './analysis-result-edit-dialog.component';

describe('AnalysisResultEditDialogComponent', () => {
  let component: AnalysisResultEditDialogComponent;
  let fixture: ComponentFixture<AnalysisResultEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisResultEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisResultEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
