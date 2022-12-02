import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisOrdersViewComponent } from './analysis-orders-view.component';

describe('AnalysisOrdersViewComponent', () => {
  let component: AnalysisOrdersViewComponent;
  let fixture: ComponentFixture<AnalysisOrdersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisOrdersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
