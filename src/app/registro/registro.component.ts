import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  // Datos de usuario
  username: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  birth_date: string = '';

  // Dirección completa como texto
  direccion: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  validarEmail(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(this.email);
  }

  registro() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones
    if (!this.validarEmail()) {
      this.errorMessage = 'El formato del correo electrónico no es válido';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.direccion.trim()) {
      this.errorMessage = 'La dirección física es requerida';
      return;
    }

    const datos = {
      username: this.username,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      birth_date: this.birth_date,
      direccion: this.direccion
    };

    this.http.post('http://localhost:3000/api/registro', datos).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Registro exitoso. Redirigiendo al login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error al registrar usuario';
      }
    });
  }
}