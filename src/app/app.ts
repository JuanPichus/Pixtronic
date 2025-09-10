import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductoService } from './servicios/producto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [ProductoService],
})
export class App {
  protected readonly title = signal('pixtronic');
}
