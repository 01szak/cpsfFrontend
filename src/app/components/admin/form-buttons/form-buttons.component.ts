import {Component, Input} from '@angular/core';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-form-buttons',
  imports: [
    MatButton
  ],
  templateUrl: './form-buttons.component.html',
  styleUrl: './form-buttons.component.css'
})
export class FormButtonsComponent {
  @Input() firstButtonText: string = 'Cofnij';
  @Input() secondButtonText: string = 'Wyślij';
  @Input() firstAction?: () => any;
  @Input() secondAction?: () => any;
}
