import {Component, computed, inject} from '@angular/core';
import {Field, RegularTableComponent} from '@shared/ui/data-table/regular-table.component';
import {ReservationService, ReservationStatus} from '@core/services/openApiWrappers/ReservationService';
import {ReservationDto} from '../../../../api';
import {CamperPlaceService} from '@core/services/openApiWrappers/CamperPlaceService';
import {PopupConfirmationService} from '@core/services/PopupConfirmationService';

@Component({
  imports: [
    RegularTableComponent
  ],
  selector: 'app-unpaid-reservations-widget',
  styles: ``,
  template: `
    <app-regular-table
      [tittle]="'Nie opłacone'"
      [dtoData]="reservationService.unpaidActiveReservations.value().content"
      [displayData]="mapToDisplayData()"
      [isLoading]="reservationService.unpaidActiveReservations.isLoading()"
      [totalElements]="reservationService.unpaidActiveReservations.value().totalElements"
      [tabColumns]="fields()"
      [pageableSignal]="reservationService.unpaidActivePageable"
      [searchRequestSignal]="reservationService.unpaidActiveSearchRequest"
      [displayViewFilter]="false"

    >
    </app-regular-table>

  `,
})
export class UnpaidReservationsWidget {
  protected readonly reservationService = inject(ReservationService);
  protected readonly camperPlaceService = inject(CamperPlaceService);
  protected readonly confirmation = inject(PopupConfirmationService);

  protected fields = computed<Field[]>(() => [
    {name: 'pay', displayName: '', type: "ACTION", actionLabel: 'OPŁAĆ', action: this.payForReservation },
    {name: 'price', displayName: 'Cena [PLN]', type: "NUMBER" },
    {name: 'guest', displayName: 'Gość', type: 'OBJECT', innerFields: [{type: "TEXT", displayName: 'Imie', name: 'firstname', value: ''}, {type: "TEXT", displayName: 'Nazwisko', name: 'lastname', value: ''}]},
    {name: 'camperPlace', displayName: 'Parcela', type: 'OBJECT', innerFields: [{type: "NUMBER", displayName: 'Indeks', name: 'index', selectOption: this.camperPlaceService.indexes(), value: ''}]},
    {name: 'checkout', displayName: 'Wyjazd', type: 'DATE', value: ''},
    {name: 'creator', displayName: 'Autor', type: "OBJECT", innerFields: [{type: "TEXT", displayName: 'Nazwa użytkownika', name: 'username', value: ''}]},
  ]);

  protected mapToDisplayData() {
    return this.reservationService.unpaidActiveReservations.value().content.map(r  => {
      const res = r as ReservationDto;
      return {
        id: res.id,
        price: res.price,
        checkout: res.checkout,
        guest: `${res.guest?.firstname || ''} ${res.guest?.lastname || ''}`.trim(),
        camperPlace: res.camperPlace?.index ?? '',
        creator: `${res.creator?.username || ''}`
      }
    })
  }

  protected payForReservation = (r: ReservationDto) => {
    this.confirmation.openConfirmationPopup({
      title: 'Czy chcesz opłacić tą rezerwacje?',
      action: () => this.reservationService.update({...r, paid: true}).subscribe()
    });

  };

}
