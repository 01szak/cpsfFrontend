import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationUpdatePopupComponent } from './reservation-update-popup.component';

describe('ReservationUpdatePopupComponent', () => {
  let component: ReservationUpdatePopupComponent;
  let fixture: ComponentFixture<ReservationUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationUpdatePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
