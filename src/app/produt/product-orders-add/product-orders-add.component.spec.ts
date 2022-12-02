import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrdersAddComponent } from './product-orders-add.component';

describe('ProductOrdersAddComponent', () => {
  let component: ProductOrdersAddComponent;
  let fixture: ComponentFixture<ProductOrdersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductOrdersAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOrdersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
