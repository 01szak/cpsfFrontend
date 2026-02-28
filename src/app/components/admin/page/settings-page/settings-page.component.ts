import {Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CamperPlaceService} from '../../../../service/CamperPlaceService';
import {CamperPlaceTypeService} from '../../../../service/CamperPlaceTypeService';
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
export class  SettingsPage implements OnInit, OnDestroy {

  protected readonly displayedColumns = ["index", "type", "price"];
  protected camperPlaces$!: Observable<CamperPlaceForTable[]>;
  protected camperPlaceTypes$!: Observable<CamperPlaceType[]>;
  protected formChanged = false;

  protected reset = () => {
    this.rows.controls.forEach((control, i) => {
      control.reset({ ...this.camperPlaceFormLastState[i] });
    });
    this.formChanged = false}

  protected update = () => {
    const changedRows = this.getChangedRows()
    this.sub.add(
      this.camperPlaceService.update(changedRows).subscribe({
        next: () => {this.loadBuildForm(); this.formChanged = false},
        error: () => {this.reset()}
      })
    );
  };

  protected get rows() {
    return this.camperPlaceForm.get('rows') as FormArray;
  }

  private sub = new Subscription();
  private formBuilder = inject(FormBuilder);
  private camperPlaceFormLastState:CamperPlaceForTable[] = [];

  constructor(private camperPlaceService: CamperPlaceService, private camperPlaceTypeService: CamperPlaceTypeService) {
    this.sub.add(
      this.camperPlaceForm.events.subscribe(e => {
        if (e instanceof ValueChangeEvent) {
          if (this.getChangedRows().length > 0) {
            this.formChanged = true;
          }
        }
      })
    );
  }

  protected camperPlaceForm = this.formBuilder.group({
    rows: this.formBuilder.array([])
  });

  ngOnInit() {
    this.loadBuildForm();
    this.sub.add(this.camperPlaceTypeService.getCamperPlaceTypes().subscribe());
    this.camperPlaceTypes$ = this.camperPlaceService.camperPlaceType;
  }

  ngOnDestroy() {
    this.sub.unsubscribe;
  }

  private loadBuildForm () {
    this.camperPlaces$ =
      this.camperPlaceService.getCamperPlacesForTable().pipe(
        tap(cp => {
          this.camperPlaceFormLastState = cp;
          this.buildForm(this.camperPlaceFormLastState);
        })
      );
  }

  private buildForm(cp: CamperPlaceForTable[]) {
    const rows = this.camperPlaceForm.get('rows') as FormArray;
    rows.clear();

    cp.forEach(c => {
      rows.push(
        this.formBuilder.group({
          id: [c.id],
          index: [c.index],
          type: [c.type],
          price: [c.price],
        })
      );
    });
  }

  private getChangedRows(): CamperPlaceForTable[] {
    return this.rows.controls
      .filter(row => row.dirty)
      .map(row => row.value);
  }

  protected readonly console = console;
}
