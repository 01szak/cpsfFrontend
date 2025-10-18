import {Component, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {EmployeeService} from '../../../service/EmployeeService';
import {Observable} from 'rxjs';
import {Employee} from '../../Interface/Employee';
import {MatTooltip} from '@angular/material/tooltip';
import {AsyncPipe} from '@angular/common';
import {MatMenu, MatMenuContent, MatMenuTrigger} from '@angular/material/menu';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    MatDrawerContainer,
    MatDrawer,
    MatTooltip,
    AsyncPipe,
    MatMenuTrigger,
    MatMenu,
    MatMenuContent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
export class NavbarComponent {

  @ViewChild('drawer') drawer = new MatDrawer;

  protected clicked: boolean = false;
  protected drawerEntered: boolean = false;
  protected employee$: Observable<Employee>;

  constructor(private service: EmployeeService) {
    this.employee$ = service.employee$;
  }

  ngOnInit() {
    this.service.getEmployee().subscribe();
  }

  protected logout():void{
    sessionStorage.removeItem('jwtToken');
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
