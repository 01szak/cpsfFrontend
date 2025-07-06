import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormButtonsComponent} from './../form-buttons/form-buttons.component';


@Component({
  selector: 'app-popup-confirmation',
  imports: [
    MatDialogContent,
    FormButtonsComponent
  ],
  templateUrl: './popup-confirmation.component.html',
  styleUrl: './popup-confirmation.component.css'
})
export class PopupConfirmationComponent {
  readonly popupConfirmationRef = inject(MatDialogRef<PopupConfirmationComponent,ConfirmationData>);
  readonly confirmationData = inject<ConfirmationData>(MAT_DIALOG_DATA);

  firstAction = () => this.close();
  secondAction = () => {this.confirmationData.action(); this.firstAction()}

  close() {
    this.popupConfirmationRef.close();
  }

}

export interface ConfirmationData {
  message: string,
  action: () => void;
}
