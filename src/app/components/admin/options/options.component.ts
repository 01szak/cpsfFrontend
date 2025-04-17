import { Component } from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-options',
  imports: [
    MatCard,
    MatInput,
    MatLabel,
    FormsModule
  ],
  templateUrl: './options.component.html',
  standalone: true,
  styleUrl: './options.component.css'
})
export class OptionsComponent {

}
