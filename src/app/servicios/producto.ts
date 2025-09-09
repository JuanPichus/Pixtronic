import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from '../modelos/producto';

export class ProductoService {
  private xmlUrl = 'assets/productos.xml';
  constructor(private http: HttpClient) {}
  getProductos(): Observable<Producto[]> {
    return this.http
      .get(this.xmlUrl, { responseType: 'text' })
      .pipe(map((xmlString) => this.parseXML(xmlString)));
  }
  private parseXML(xmlString: string): Producto[] {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'application/xml');
    const productos: Producto[] = [];
    const nodes = xml.getElementsByTagName('producto');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      productos.push({
        id: Number(node.getElementsByTagName('id')[0].textContent),
        nombre: 'hola',
        precio: 3000,
      });
    }
    return productos;
  }
}
