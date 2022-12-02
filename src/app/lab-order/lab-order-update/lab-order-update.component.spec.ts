import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrderUpdateComponent } from './lab-order-update.component';

describe('LabOrderUpdateComponent', () => {
  let component: LabOrderUpdateComponent;
  let fixture: ComponentFixture<LabOrderUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabOrderUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabOrderUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
