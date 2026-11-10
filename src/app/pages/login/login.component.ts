import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.error = '';
    this.isSubmitting = true;
    const success = await this.auth.login(this.username.trim(), this.password.trim());
    this.isSubmitting = false;

    console.log('Login success:', success);
    if (success) {
      const role = this.auth.getRole();
      this.router.navigate([role === 'Driver' ? '/driver-home' : '/dashboard']);
      return;
    }
    this.error = 'Invalid username or password';
  }
}
