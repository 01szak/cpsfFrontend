import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamperPlacePopupComponent } from './camperPlacePopup.component';

describe('PopupComponent', () => {
  let component: CamperPlacePopupComponent;
  let fixture: ComponentFixture<CamperPlacePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CamperPlacePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamperPlacePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
