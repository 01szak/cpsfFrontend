import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {CamperPlaceTypeService} from '@features/settings/services/CamperPlaceTypeService';
import {CamperPlaceSettingsComponent} from './settings-form-component/form-component/camper-place-settings.component';
import {MatCard} from '@angular/material/card';
import {CamperPlaceTypeSettingsComponent} from './settings-form-component/form-component/camper-place-type-settings.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';

@Component({
  selector: 'settings-page',
  imports: [
    CommonModule,
    CamperPlaceSettingsComponent,
    MatCard,
    CamperPlaceTypeSettingsComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  standalone: true,
})
export class SettingsPage implements OnInit {

  private camperPlaceService = inject(CamperPlaceService);
  private camperPlaceTypeService = inject(CamperPlaceTypeService);

  protected camperPlaces$ = this.camperPlaceService.camperPlacesForTable$;
  protected camperPlaceTypes$ = this.camperPlaceTypeService.camperPlaceType$;

  constructor() {
    merge(
      this.camperPlaces$,
      this.camperPlaceTypes$
    ).pipe(takeUntilDestroyed()).subscribe();
  }

  ngOnInit(): void {
  }
}
