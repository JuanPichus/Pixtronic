import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validar que todos los campos estén llenos
    if (!this.userData.username || !this.userData.lastname || 
        !this.userData.email || !this.userData.password || 
        !this.userData.birth_date) {
      this.errorMessage = 'Todos los campos son obligatorios';
      this.isLoading = false;
      return;
    }

    // Llamar a la API para registrar el usuario
    this.http.post('http://localhost:3000/api/register', this.userData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Registro exitoso! Redirigiendo al login...';
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error en el registro';
          console.error('Error en registro:', error);
        }
      });
  }
}