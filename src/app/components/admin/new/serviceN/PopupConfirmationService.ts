import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationData, PopupConfirmationComponent} from './../popup-confirmation/popup-confirmation.component';

@Injectable({providedIn: "root"})
export class PopupConfirmationService {
  readonly popupConfirmation: MatDialog = inject(MatDialog);

  openConfirmationPopup(message: string, action: () => void) {
    const confirmationData: ConfirmationData = {
      message: message,
      action: action,
    }
    this.popupConfirmation.open(PopupConfirmationComponent, {
      data: confirmationData,
    })
  }
}
