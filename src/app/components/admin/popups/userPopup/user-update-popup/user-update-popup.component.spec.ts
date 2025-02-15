import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdatePopupComponent } from './user-update-popup.component';

describe('UserUpdatePopupComponent', () => {
  let component: UserUpdatePopupComponent;
  let fixture: ComponentFixture<UserUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpdatePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
