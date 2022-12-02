import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisOrdersEditComponent } from './analysis-orders-edit.component';

describe('AnalysisOrdersEditComponent', () => {
  let component: AnalysisOrdersEditComponent;
  let fixture: ComponentFixture<AnalysisOrdersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisOrdersEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisOrdersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
