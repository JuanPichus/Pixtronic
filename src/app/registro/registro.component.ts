import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServicioAutenticacion } from '../servicios/auth.service';

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

  private authService = inject(ServicioAutenticacion);
  private router = inject(Router);

  // Cambiar a async para manejar la Promise
  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Validar campos llenos
      if (!this.userData.username || !this.userData.lastname || 
          !this.userData.email || !this.userData.password || 
          !this.userData.birth_date) {
        this.errorMessage = 'Todos los campos son obligatorios';
        this.isLoading = false;
        return;
      }

      // USAR AWAIT para obtener el Observable desde la Promise
      const observable = await this.authService.registrarUsuario(this.userData);
      
      // Ahora sí podemos usar subscribe en el Observable
      observable.subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Registro exitoso! Redirigiendo al login...';
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || error.error?.message || 'Error en el registro';
          console.error('Error en registro:', error);
        }
      });

    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || 'Error en el proceso de registro';
      console.error('Error capturado:', error);
    }
  }
}