import {Component, Inject, inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarLabel, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  imports: [
    MatSnackBarLabel
  ],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public msg: string) { }
}
