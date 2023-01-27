import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacrureFormDialogComponent } from './facrure-form-dialog.component';

describe('FacrureFormDialogComponent', () => {
  let component: FacrureFormDialogComponent;
  let fixture: ComponentFixture<FacrureFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacrureFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacrureFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
