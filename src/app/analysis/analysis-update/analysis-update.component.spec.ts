import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisUpdateComponent } from './analysis-update.component';

describe('AnalysisUpdateComponent', () => {
  let component: AnalysisUpdateComponent;
  let fixture: ComponentFixture<AnalysisUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
