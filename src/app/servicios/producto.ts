import { Producto } from '../modelos/producto';

export class ProductoService {
  async getProductos(): Promise<Producto[]> {
    const response = await fetch('assets/producto.xml');
    const xmlText = await response.text();

    //Parsear
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const productos: Producto[] = [];
    const nodos = xmlDoc.getElementsByTagName('catalogo');
    for (let i = 0; i < nodos.length; i++) {
      const nodo = nodos[i];
      productos.push({
        id: Number(nodo.getElementsByTagName('id')[0].textContent),
        nombre: nodo.getElementsByTagName('nombre')[0].textContent,
        tipo: nodo.getElementsByTagName('tipo')[0].textContent,
        marca: nodo.getElementsByTagName('marca')[0].textContent,
        precio: Number(nodo.getElementsByTagName('precio')[0].textContent),
      });
    }
    return productos;
  }
}
