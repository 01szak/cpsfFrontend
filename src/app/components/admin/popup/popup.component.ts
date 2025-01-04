import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {NgForOf} from '@angular/common';
import {CamperPlace} from '../calendar/CamperPlace';
import {Reservation} from '../calendar/Reservation';
import {FormsModule} from '@angular/forms';
import {CamperPlaceToJSONParser} from '../calendar/CamperPlace'

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
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  camperPlaceTypes: Array<string> = [];
  newCamperPlace: CamperPlaceToJSONParser = {
    type:"",
    price: 0
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
    this.camperPlaceService.addCamperPlace(this.newCamperPlace).subscribe({

      next: (response) => {
        console.log(response);
        this.closePopup();
      },
      error: (error: Error) => {
        console.error('failed to add camper place');
        console.log(JSON.stringify(this.newCamperPlace, null, 2));
        this.closePopup();

      }
    });
  }
}
