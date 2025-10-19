import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  userData = {
    username: '',
    lastname: '',
    email: '',
    password: '',
    birth_date: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validar campos llenos
    if (!this.userData.username || !this.userData.lastname || 
        !this.userData.email || !this.userData.password || 
        !this.userData.birth_date) {
      this.errorMessage = 'Todos los campos son obligatorios';
      this.isLoading = false;
      return;
    }

    // Usar el servicio de autenticacion
    this.authService.registrarUsuario(this.userData).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.successMessage = 'Registro exitoso! Redirigiendo al login...';
        
        // te redirige al login despues de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || error.error?.message || 'Error en el registro';
        console.error('Error en registro:', error);
      }
    });
  }
}