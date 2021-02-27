import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JunkBuyComponent } from './junk-buy.component';

describe('JunkBuyComponent', () => {
  let component: JunkBuyComponent;
  let fixture: ComponentFixture<JunkBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JunkBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JunkBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
