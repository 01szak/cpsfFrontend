import {Component, inject, linkedSignal} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {NavbarComponent} from '@shared/ui/navbar/navbar.component';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {AsyncPipe} from '@angular/common';
import {MatMenu, MatMenuContent, MatMenuTrigger} from '@angular/material/menu';
import {filter, map, Observable} from 'rxjs';
import {Employee} from '@core/models/Employee';
import {EmployeeService} from '@core/services/openApiWrappers/EmployeeService';
@Component({
  selector: 'admin-page',
  imports: [
    NavbarComponent,
    RouterOutlet,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    AsyncPipe,
    MatMenu,
    MatMenuContent,
    RouterLink,
    RouterLinkActive,
    MatMenuTrigger,
  ],
  styles: `
    .screen {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
    }

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      padding-left: 10px;
    }

    .routers {
      display: flex;
      height: 95%;
      width: 100%;
      flex-direction: column;
      justify-content: space-between;
      align-items: start;
    }

    .navbarButton {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      color: var(--text-secondary);
      font-size: 1.75rem;
      text-decoration: none;
      border-radius: var(--radius-full);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }


    .routersButtons, .functionalButtons {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .menuItem {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .menuItem label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      display: block;
      margin-bottom: 0.25rem;
    }

    .menuItem p {
      margin: 0;
      font-weight: 500;
    }

    .functionalMenuItems {
      padding: 0.5rem;
    }

    .editRoute p.menuItem {
      border-radius: var(--radius-sm);
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    .fa-right-from-bracket {
      color: var(--status-error);
    }

    .row {
      width: 100%;
      display: flex;
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: background-color 0.2s;
    }

    .row:hover {
      background-color: var(--bg-overlay);
    }

    .row.active {
      background-color: var(--bg-overlay);
    }

    .row.active .navbarButton, .row.active p {
      color: var(--text-primary);
    }

    p {
      align-self: center;
    }

    mat-drawer-content {
      width: 100%;
      height: 100%;
    }

    .mobileBar {
      display: none;
    }

    .hamburger {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--text-primary);
      font-size: 1.5rem;
      cursor: pointer;
    }

    .hamburger:hover {
      background-color: var(--bg-overlay);
    }

    @media (max-width: 599.98px) {
      mat-drawer {
        width: 240px;
      }

      .mobileBar {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
    }
  `,
  template: `
    <mat-drawer-container class="screen">
      <mat-drawer [mode]="isMobile() ? 'over' : 'side'" [opened]="drawerOpen()" (openedChange)="drawerOpen.set($event)">
        <div class="content">
          <div class="routers">
            <div class="routersButtons">
              <div class="row" [matMenuTriggerFor]="menu"  [matMenuTriggerData]="{emp: employee$ | async}">
                <a class="navbarButton" ><i class="fa-solid fa-circle-user"></i></a>
                <p>Użytkownik</p>
              </div>
              <mat-menu #menu >
                <ng-template matMenuContent let-emp="emp" class="menu">
                  <div class="menuItem"><label><i class="fa-solid fa-user"></i> Nazwa użytkownika: </label><p>{{emp.username}}</p></div>
                  <div class="menuItem"><label><i class="fa-solid fa-envelope"></i> Email: </label><p>{{emp.email}}</p></div>
                  <div class="menuItem"><label><i class="fa-solid fa-shield"></i> Uprawnienia: </label><p>{{emp.role}}</p></div>
                  <div class="functionalMenuItems">
                    <div class="editRoute">
                    </div>
                    <div class="editRoute" >
                      <p class="menuItem" (click)="logout()"><i class="fa-solid fa-right-from-bracket"></i> Wyloguj się</p>
                    </div>
                  </div>

                </ng-template>
              </mat-menu>
            <div class="row" routerLink="dashboard" routerLinkActive="active">
              <a class="navbarButton" ><i class="fa-solid fa-table-columns"></i></a>
              <p>Dashboard</p>
            </div>
              <div class="row" routerLink="calendar" routerLinkActive="active">
              <a class="navbarButton" ><i class="fa-solid fa-calendar-days"></i></a>
              <p>Kalendarz</p>
            </div>
              <div class="row" routerLink="reservations" routerLinkActive="active">
                <a class="navbarButton"><i class="fa-solid fa-list"></i></a>
                <p>Rezerwacje</p>
              </div>
              <div class="row" routerLink="users" routerLinkActive="active">
                <a class="navbarButton" ><i class="fa-solid fa-users"></i></a>
                <p>Goście</p>
              </div>
              <div class="row" routerLink="statistics" routerLinkActive="active">
                <a class="navbarButton" ><i class="fa-solid fa-chart-pie"></i></a>
                <p>Statystyki</p>
              </div>
            </div>
            <div class="functionalButtons">
              <div class="row" routerLink="settings" routerLinkActive="active">
                <a class="navbarButton" ><i class="fa-solid fa-gear"></i></a>
                <p>Ustawienia</p>
              </div>
              <div class="row" (click)="toggleTheme()">
                <a class="navbarButton themeToggle" ><i class="fa-solid fa-circle-half-stroke"></i></a>
                <p>Motyw</p>
              </div>
              <div class="row" (click)="logout()">
                <a class="navbarButton" ><i class="fa-solid fa-right-from-bracket"></i></a>
                <p>Wyloguj</p>
              </div>
            </div>
          </div>
        </div>
      </mat-drawer>
      <mat-drawer-content>
        <div class="mobileBar">
          <button class="hamburger" type="button" aria-label="Menu" (click)="drawerOpen.set(!drawerOpen())">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>

<!--    <app-navbar></app-navbar>-->
<!--    <div class="screen">-->
<!--      -->
<!--      -->
<!--    </div>-->
  `,
  standalone: true
})
export class AdminPageComponent {

  protected employee$: Observable<Employee | null>;

  protected readonly isMobile = toSignal(
    inject(BreakpointObserver).observe(Breakpoints.XSmall).pipe(map(state => state.matches)),
    {initialValue: false}
  );

  // open by default on desktop, closed on mobile (re-evaluated when the breakpoint changes)
  protected readonly drawerOpen = linkedSignal(() => !this.isMobile());

  constructor(private service: EmployeeService, private router: Router) {
    this.employee$ = service.employee$;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      if (this.isMobile()) {
        this.drawerOpen.set(false);
      }
    });
  }

  ngOnInit() {
    this.service.getAppUser().subscribe();
    // this.applyPersistedTheme();
  }

  // private applyPersistedTheme(): void {
  //   const theme = sessionStorage.getItem('theme');
  //   if (theme === 'light') {
  //     document.body.classList.add('light-theme');
  //   }
  // }

  protected toggleTheme(): void {
    const isLight = document.body.classList.toggle('light-theme');
    sessionStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  protected logout(): void{
    sessionStorage.removeItem('jwtToken');
    this.router.navigate(['/']);
  }

}
