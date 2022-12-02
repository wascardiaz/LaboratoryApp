import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialOrdersAddComponent } from './raw-material-orders-add.component';

describe('RawMaterialOrdersAddComponent', () => {
  let component: RawMaterialOrdersAddComponent;
  let fixture: ComponentFixture<RawMaterialOrdersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialOrdersAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialOrdersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
