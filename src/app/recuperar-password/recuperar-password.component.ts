import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Agrega RouterModule aquí
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Agrega RouterModule aquí
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent {
  email: string = '';
  mensaje: string = '';
  error: string = '';
  enviando: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  recuperarPassword() {
    this.mensaje = '';
    this.error = '';
    this.enviando = true;

    this.http.post('http://localhost:3000/api/recuperar-password', { email: this.email })
      .subscribe({
        next: (response: any) => {
          this.mensaje = response.message;
          this.enviando = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.error = error.error.message || 'Error al enviar correo de recuperación';
          this.enviando = false;
        }
      });
  }
}