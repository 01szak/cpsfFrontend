import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {EmployeeService} from '../../../service/EmployeeService';
import {Observable} from 'rxjs';
import {Employee} from '../../Interface/Employee';
import {AsyncPipe} from '@angular/common';
import {MatMenu, MatMenuContent, MatMenuTrigger} from '@angular/material/menu';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    AsyncPipe,
    MatMenuTrigger,
    MatMenu,
    MatMenuContent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
export class NavbarComponent implements OnInit {

  protected employee$: Observable<Employee>;

  constructor(private service: EmployeeService, private router: Router) {
    this.employee$ = service.employee$;
  }

  ngOnInit() {
    this.service.getEmployee().subscribe();
  }

  protected logout():void{
    sessionStorage.removeItem('jwtToken');
    this.router.navigate(['/']);
  }

}
