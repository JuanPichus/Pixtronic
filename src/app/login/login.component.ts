import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServicioAutenticacion } from '../servicios/auth.service'; // Cambiar import

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

  private authService = inject(ServicioAutenticacion); // Usar nombre correcto
  private router = inject(Router);

  // Cambiar a async para manejar la Promise
  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // USAR AWAIT para obtener el Observable desde la Promise
      const observable = await this.authService.iniciarSesion(this.credentials);
      
      // Ahora sí podemos usar subscribe en el Observable
      observable.subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Login exitoso:', response);
          
          // Guardar usuario en localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // Navegar al catálogo
          this.router.navigate(['/catalogo']);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Error en el login';
          console.error('Error en login:', error);
        }
      });

    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || 'Error en el proceso de login';
      console.error('Error capturado:', error);
    }
  }
}