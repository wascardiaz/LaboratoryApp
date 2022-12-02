import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorAddComponent } from './distributor-add.component';

describe('DistributorAddComponent', () => {
  let component: DistributorAddComponent;
  let fixture: ComponentFixture<DistributorAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributorAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
