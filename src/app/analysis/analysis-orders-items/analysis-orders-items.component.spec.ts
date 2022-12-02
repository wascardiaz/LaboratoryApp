import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisOrdersItemsComponent } from './analysis-orders-items.component';

describe('AnalysisOrdersItemsComponent', () => {
  let component: AnalysisOrdersItemsComponent;
  let fixture: ComponentFixture<AnalysisOrdersItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisOrdersItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisOrdersItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
