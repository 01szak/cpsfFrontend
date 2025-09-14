import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByPopupComponent } from './search-by-popup.component';

describe('SearchByPopupComponent', () => {
  let component: SearchByPopupComponent;
  let fixture: ComponentFixture<SearchByPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchByPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
