import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './servicios/auth.service';
import { FooterComponent } from './footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Pixtronic';
  mostrarNavbar = true;
  usuario$;

  constructor(public authService: AuthService, private router: Router) {
    this.usuario$ = this.authService.currentUser;
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const u = e.urlAfterRedirects || e.url;
        const sinNavbar = ['/login', '/registro', '/recuperar-password'];
        this.mostrarNavbar = !sinNavbar.some(p => u.startsWith(p));
      });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}