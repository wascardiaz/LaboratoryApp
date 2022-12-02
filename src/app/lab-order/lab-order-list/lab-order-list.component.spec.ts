import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrderListComponent } from './lab-order-list.component';

describe('LabOrderListComponent', () => {
  let component: LabOrderListComponent;
  let fixture: ComponentFixture<LabOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
