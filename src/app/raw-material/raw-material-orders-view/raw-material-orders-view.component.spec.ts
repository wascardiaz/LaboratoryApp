import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialOrdersViewComponent } from './raw-material-orders-view.component';

describe('RawMaterialOrdersViewComponent', () => {
  let component: RawMaterialOrdersViewComponent;
  let fixture: ComponentFixture<RawMaterialOrdersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialOrdersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
