import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellInputFormComponent } from './sell-input-form.component';

describe('SellInputFormComponent', () => {
  let component: SellInputFormComponent;
  let fixture: ComponentFixture<SellInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellInputFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
