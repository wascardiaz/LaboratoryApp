import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrdersViewComponent } from './product-orders-view.component';

describe('ProductOrdersViewComponent', () => {
  let component: ProductOrdersViewComponent;
  let fixture: ComponentFixture<ProductOrdersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductOrdersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
