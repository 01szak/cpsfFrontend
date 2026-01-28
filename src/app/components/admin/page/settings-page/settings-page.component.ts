import {Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CamperPlaceService} from '../../../../service/CamperPlaceService';
import {CamperPlaceForTable} from '../../../Interface/CamperPlaceForTable';
import {CamperPlaceType} from '../../../Interface/CamperPlaceType';
import {Observable, Subscription, tap, pipe} from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { FormControl, FormArray, FormBuilder } from '@angular/forms';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule, ValueChangeEvent} from '@angular/forms';
import {FormButtonsComponent} from '../../form-buttons/form-buttons.component';

@Component({
  selector: 'settings-page',
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    FormButtonsComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  standalone: true,
})
export class  SettingsPage implements OnInit {

  protected readonly displayedColumns = ["index", "type", "price"];
  protected camperPlaces$!: Observable<CamperPlaceForTable[]>;

  protected camperPlaceTypes$!: Observable<CamperPlaceType[]>;

  protected formChanged = false;


  protected reset = () => {
    this.rows.controls.forEach((control, i) => {
      control.reset({ ...this.camperPlaceFormLastState[i] });
    });
    this.formChanged = false}

  protected update = () => {console.log("kakak")};

  private sub!: Subscription;
  private formBuilder = inject(FormBuilder);
  private camperPlaceFormLastState:CamperPlaceForTable[] = [];

  constructor(private camperPlaceService: CamperPlaceService) {
    this.camperPlaceForm.events.subscribe(e => {
      if (e instanceof ValueChangeEvent) {

        const changedRows = this.rows.controls
          .filter(row => row.dirty)
          .map(row => row.value);
        if (changedRows.length > 0) {
          this.formChanged = true;
        }
        console.log(changedRows)
      }
    })
  }

  camperPlaceForm = this.formBuilder.group({
    rows: this.formBuilder.array([])
  });

  ngOnInit() {
    this.camperPlaces$ =
      this.camperPlaceService.getCamperPlacesForTable().pipe(
        tap(cp => {
          this.camperPlaceFormLastState = cp;
          this.buildForm(this.camperPlaceFormLastState);
        })
      );

    // console.log(this.camperPlaces$.pipe(tap))

    this.camperPlaceService.getCamperPlaceTypes().subscribe();
    this.camperPlaceTypes$ = this.camperPlaceService.camperPlaceType;
  }

  private buildForm(cp: CamperPlaceForTable[]) {
    const rows = this.camperPlaceForm.get('rows') as FormArray;
    rows.clear();

    cp.forEach(c => {
      rows.push(
        this.formBuilder.group({
          index: [c.index],
          type: [c.type],
          price: [c.price],
        })
      );
    });
  }

  get rows() {
    return this.camperPlaceForm.get('rows') as FormArray;
  }

  ngOnDestroy() {
    this.sub.unsubscribe;
  }



  protected readonly console = console;
}
