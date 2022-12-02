import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialAddComponent } from './raw-material-add.component';

describe('RawMaterialAddComponent', () => {
  let component: RawMaterialAddComponent;
  let fixture: ComponentFixture<RawMaterialAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
