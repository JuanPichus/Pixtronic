import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Usar el servicio de autenticación
    this.authService.loginUsuario(this.credentials).subscribe({
      next: (data) => {
        this.isLoading = false;
        console.log('Login exitoso:', data);
        
        // Guardar usuario en localStorage o servicio de autenticación
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Navegar al catálogo
        this.router.navigate(['/catalogo']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Error en el login';
        console.error('Error en login:', error);
      }
    });
  }
}