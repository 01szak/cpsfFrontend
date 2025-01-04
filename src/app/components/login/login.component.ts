import {Component, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatHint} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/form-field';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {AuthenticatorRequest, LoginService} from '../../service/LoginService';
import {CommonModule, NgIf} from '@angular/common';
import {AdminPageComponent} from '../admin/admin-main-page/admin-page.component';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatHint,
    MatLabel,
    MatButton,
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardHeader,
    CommonModule,
    MatAnchor,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {

  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  constructor(private loginService: LoginService, private router: Router) {
  }

  active: string = "login";
  isLogged: boolean = false;
  errorMessage: string = "";

  onLoginTab(): void {
    this.active = 'login';

  }

  request: AuthenticatorRequest = {
    email: '',
    password: ''
  }


  onSubmitLogin(): void {
    this.onSubmitLoginEvent.emit({"email": this.request.email, "password": this.request.password});
    this.loginService.login(this.request).subscribe({
      next: (req) => {
        this.isLogged = true;
        console.log(JSON.stringify(req));
        this.router.navigate(["/admin-page/calendar"])
      },
      error: (error: Error) => {
        console.log(this.request)
        this.errorMessage = "Wrong email or password"

      }
    });
  }


  onRegisterTab(): void {
    this.active = 'register';
  }

}
