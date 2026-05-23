import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReservationDto} from '../../../api';
import {DateFormater} from '@shared/helper/DateFormater';
import {NgClass} from '@angular/common';

export type ResColor = {name: string, colours: ColorConfig}
export type ColorConfig = {bgr: string, border: string}

@Component({
  selector: 'app-reservation-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass
  ],
  template: `
    <div [ngClass]="{'content': true, 'blink': isActiveUnpaid()}" [style]="setColor() + setParagraphPlacing()"><p>
      <strong>{{ getGuestName() }} </strong></p></div>
  `,
  styles: `
    .content {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 10px;
      display: flex;
      align-items: center;
      padding: 0 5px;
      overflow: hidden;
      white-space: nowrap;
    }

    p {
      margin: 0;
    }

    .blink {
      animation: blink 1s ease-in-out infinite;
    }
    @keyframes blink {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `
})
export class ReservationCellComponent {
  @Input() reservation!: ReservationDto;
  @Input() onlyCheckoutDisplay!: boolean;
  @Input() displayedLength!: number;

  private colorMap: ResColor[] = [
    {name: 'active', colours: {border: 'rgb(0 211 218)', bgr: 'rgb(0 247 255 / 0.6)'}},
    {name: 'coming', colours: {border: 'rgb(190 206 0)', bgr: 'rgb(238 255 0 / 0.6)'}},
    {name: 'expired', colours: {border: 'rgb(112 112 112)', bgr: 'rgb(112 112 112 / 0.6)'}},
    {name: 'expired-unpaid', colours: {border: 'rgb(225 30 0)', bgr: 'rgb(255 38 0 / 0.6)'}},
  ];

  protected getGuestName() {
    let fName = '';
    let lName = '';
    let delimeter = ' ';

    if (this.getResLength() <= 1 || this.displayedLength <= 1) {
      fName = this.reservation.guest.firstname?.substring(0, 1) ?? '';
      lName = this.reservation.guest.lastname?.substring(0, 1) ?? '';
      delimeter = '.'
    } else {
      fName = this.reservation.guest.firstname ?? '';
      lName = this.reservation.guest.lastname ?? '';
    }
    return (fName + delimeter + lName);
  }

  private getResLength() {
    const checkin = DateFormater.MOMENT(this.reservation.checkin);
    const checkout = DateFormater.MOMENT(this.reservation.checkout);
    let length = 0;
    if (checkin.month() < checkout.month()) {
      let daysToEOM = checkin.daysInMonth() - checkin.date();
      length = daysToEOM + checkout.date();
    } else {
      length = checkout.date() - checkin.date();
    }
    return length;
  }

  protected setColor() {
    const status = this.reservation.reservationStatus;
    let targetColorName = 'active';

     if (status === 'COMING') {
      targetColorName = 'coming';
    } else if (status === 'EXPIRED' && !this.reservation.paid) {
      targetColorName = 'expired-unpaid';
    } else if (status === 'EXPIRED') {
       targetColorName = 'expired';
     }
    const foundColors = this.colorMap.find(i => i.name === targetColorName)?.colours;
    const bgr = foundColors?.bgr ?? 'gray';
    const border = foundColors?.border ?? 'gray';
    return `background-color: ${bgr} !important; border: solid 5px ${border} !important;`;
  }

  protected isActiveUnpaid() {
    return this.reservation.reservationStatus === 'ACTIVE' && !this.reservation.paid;
  }

  protected setParagraphPlacing() {
    return `justify-content: flex-${!this.onlyCheckoutDisplay ? 'start' : 'end'} !important;`;
  }
}
