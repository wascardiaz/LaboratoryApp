import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorUpdateComponent } from './distributor-update.component';

describe('DistributorUpdateComponent', () => {
  let component: DistributorUpdateComponent;
  let fixture: ComponentFixture<DistributorUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributorUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
