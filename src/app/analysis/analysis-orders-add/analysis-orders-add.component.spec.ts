import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisOrdersAddComponent } from './analysis-orders-add.component';

describe('AnalysisOrdersAddComponent', () => {
  let component: AnalysisOrdersAddComponent;
  let fixture: ComponentFixture<AnalysisOrdersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisOrdersAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisOrdersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
