import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PedidoProductoPayload {
  id_producto: number;
  cant_prod: number;
}

export interface CrearPedidoPayload {
  fk_user: number;
  productos: PedidoProductoPayload[];
}

export interface CrearPedidoResponse {
  ok: boolean;
  id_pedido?: number;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  // Ajusta al puerto de tu API Node
  private baseUrl = 'http://localhost:3000/api/pedidos';

  crearPedidoConItems(payload: CrearPedidoPayload): Observable<CrearPedidoResponse> {
    return this.http.post<CrearPedidoResponse>(this.baseUrl, payload);
  }
}