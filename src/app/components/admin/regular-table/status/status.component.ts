import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-status',
  imports: [
    NgClass
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent {
  @Input() status: string = '';
  statuses: string[] = ['active', 'coming', 'expired' ]
}
