import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrderAddComponent } from './lab-order-add.component';

describe('LabOrderAddComponent', () => {
  let component: LabOrderAddComponent;
  let fixture: ComponentFixture<LabOrderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabOrderAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
