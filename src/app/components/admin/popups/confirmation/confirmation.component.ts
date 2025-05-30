import {Component, Inject, Injectable, Input} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {PopupService} from '../../../../service/PopupService';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContainer, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-confirmation',
  imports: [
    MatCard,
    MatButton,
    MatDialogContainer,
    MatDialogContent
  ],
  templateUrl: './confirmation.component.html',
  standalone: true,
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public action: string
  ) {
  }

  performAction(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  constructor(private dialog: MatDialog) {
  }

  performAction(action: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationComponent, {data: action});

    if (!dialogRef.afterClosed()) {
      dialogRef.close();
    }

    return dialogRef.afterClosed();
  }


}
