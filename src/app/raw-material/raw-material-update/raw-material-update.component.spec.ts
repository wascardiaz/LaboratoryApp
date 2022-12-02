import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialUpdateComponent } from './raw-material-update.component';

describe('RawMaterialUpdateComponent', () => {
  let component: RawMaterialUpdateComponent;
  let fixture: ComponentFixture<RawMaterialUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
