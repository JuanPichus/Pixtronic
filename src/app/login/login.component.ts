import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Login attempt:', this.credentials);
    
    if (this.credentials.email && this.credentials.password) {
      // Si el login funciono te manda a catalogo
      this.router.navigate(['/catalogo']);
    } else {
      alert('Please enter both email and password');
    }
  }
}