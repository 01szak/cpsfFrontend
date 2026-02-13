import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {EmployeeService} from '../../../service/EmployeeService';
import {Observable} from 'rxjs';
import {Employee} from '../../Interface/Employee';
import {AsyncPipe} from '@angular/common';
import {MatMenu, MatMenuContent, MatMenuTrigger} from '@angular/material/menu';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    MatDrawerContainer,
    MatDrawer,
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

  @ViewChild('drawer') drawer!: MatDrawer;

  protected clicked: boolean = false;
  protected drawerEntered: boolean = false;
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

  protected keepOpen() {
    this.clicked = !this.clicked;
    if(this.drawer !== null) {
      if(!this.clicked) {
        this.drawer.close().then();
      }
    }
    this.drawer.open().then();
  }

  protected shouldClose(event?: MouseEvent) {
    if (this.drawer !== null) {
      setTimeout(() => {
        if (this.clicked) return;
        if (this.drawerEntered) return;
        this.drawer?.close().then();
      },150);
    }
 }

  onDrawerEnter() {
    this.drawerEntered = true
  }

  onDrawerLeave() {
    this.drawerEntered = false;
    this.shouldClose();
  }

  showUserInfo() {

  }
}
