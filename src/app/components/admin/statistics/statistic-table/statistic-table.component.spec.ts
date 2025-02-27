import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticTableComponent } from './statistic-table.component';

describe('StatisticTableComponent', () => {
  let component: StatisticTableComponent;
  let fixture: ComponentFixture<StatisticTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
