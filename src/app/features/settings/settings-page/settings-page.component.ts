import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {CamperPlaceTypeService} from '@features/settings/services/CamperPlaceTypeService';
import {CamperPlaceFormComponent} from './settings-form-component/form-component/camper-place-form.component';
import {MatCard} from '@angular/material/card';
import {CamperPlaceTypeFormComponent} from './settings-form-component/form-component/camper-place-type-form.component';

@Component({
  selector: 'settings-page',
  imports: [
    CommonModule,
    CamperPlaceFormComponent,
    MatCard,
    CamperPlaceTypeFormComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  standalone: true,
})
export class SettingsPage {

  protected camperPlaces$ = this.camperPlaceService.camperPlacesForTable$;
  protected camperPlaceTypes$ = this.camperPlaceTypeService.camperPlaceType$;

  constructor(
    private camperPlaceService: CamperPlaceService,
    private camperPlaceTypeService: CamperPlaceTypeService
  ) {}
}
