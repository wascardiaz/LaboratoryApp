import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrderItemComponent } from './lab-order-item.component';

describe('LabOrderItemComponent', () => {
  let component: LabOrderItemComponent;
  let fixture: ComponentFixture<LabOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabOrderItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
