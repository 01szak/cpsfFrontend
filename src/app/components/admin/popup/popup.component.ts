import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {NgForOf} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {CamperPlace} from '../calendar/CamperPlace'

@Component({
  selector: 'app-popup',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    NgForOf,

  ],
  templateUrl: './popup.component.html',
  standalone: true,
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  camperPlaceTypes: Array<string> = [];
  camperPlace: CamperPlace = {
    type:"",
    price: "0.00",
    reservations: []
  };
  constructor(public dialog: MatDialog, public camperPlaceService: CamperPlaceService) {
  }

  closePopup() {
    this.dialog.closeAll();
  }

  ngOnInit() {
    this.getCamperPlaceTypes()
  }

  getCamperPlaceTypes(): void {
    this.camperPlaceService.getCamperPlaceTypes().subscribe({
      next: (type: string[]) => {
        this.camperPlaceTypes = type;
        console.log(type);
      },
      error: (error: Error) => {
        console.error('failed to get camper place types');
      }
    });
  }

  addCamperPlace(): void {
    this.camperPlaceService.addCamperPlace(this.camperPlace).subscribe({

      next: (response) => {
        console.log(response);
        window.location.reload();
        this.closePopup();
      },
      error: (error: Error) => {
        console.error('failed to add camper place');
        console.log(this.camperPlace);
        this.closePopup();

      }
    });
  }
}
