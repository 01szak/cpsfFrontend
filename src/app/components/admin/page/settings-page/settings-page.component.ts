import {Component, OnInit, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CamperPlaceService} from '../../../../service/CamperPlaceService';
import {CamperPlaceTypeService} from '../../../../service/CamperPlaceTypeService';
import {CamperPlaceForTable} from '../../../Interface/CamperPlaceForTable';
import {CamperPlaceType} from '../../../Interface/CamperPlaceType';
import {forkJoin, Observable, Subscription} from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule} from '@angular/forms';
import {CamperPlaceFormComponent} from './camper-place-form/camper-place-form.component';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'settings-page',
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    CamperPlaceFormComponent,
    MatCard
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  standalone: true,
})
export class SettingsPage implements OnInit, OnDestroy {

  protected camperPlaces$!: Observable<CamperPlaceForTable[]>;
  protected camperPlaceTypes$!: Observable<CamperPlaceType[]>;

  private sub = new Subscription();


  constructor(
    private camperPlaceService: CamperPlaceService,
    private camperPlaceTypeService: CamperPlaceTypeService
  ) {}

  ngOnInit() {
    this.sub.add(
      forkJoin({
        places: this.camperPlaceService.getCamperPlacesForTable(),
        types: this.camperPlaceTypeService.getCamperPlaceTypes()
      }).subscribe(({ places, types }) => {
        this.camperPlaces$ = this.camperPlaceService.camperPlacesForTable$;
        this.camperPlaceTypes$ = this.camperPlaceTypeService.camperPlaceType$;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
