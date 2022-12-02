import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisResultListComponent } from './analysis-result-list.component';

describe('AnalysisResultListComponent', () => {
  let component: AnalysisResultListComponent;
  let fixture: ComponentFixture<AnalysisResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisResultListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
