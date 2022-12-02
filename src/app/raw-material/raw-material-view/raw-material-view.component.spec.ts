import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialViewComponent } from './raw-material-view.component';

describe('RawMaterialViewComponent', () => {
  let component: RawMaterialViewComponent;
  let fixture: ComponentFixture<RawMaterialViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
