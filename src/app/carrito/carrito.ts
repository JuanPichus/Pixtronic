import { Component, computed, inject } from '@angular/core';
import { CarritoService } from '../servicios/carrito.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule, ITransactionItem } from 'ngx-paypal';
import { PedidoService } from '../servicios/pedido.service';

@Component({
    selector: 'app-carrito',
    standalone: true,
    imports: [CurrencyPipe, NgxPayPalModule, CommonModule],
    templateUrl: './carrito.html',
    styleUrls: ['./carrito.css']
})
export class CarritoComponent implements OnInit {
    private carritoService = inject(CarritoService);
    private pedidoService = inject(PedidoService);
    carrito = this.carritoService.productos;
    // subtotal (sum of product prices, no IVA)
    subTotal = computed(() => this.carritoService.total());
    // IVA based on subtotal
    IVA = computed(() => this.subTotal() * 0.16);
    // total = subtotal + IVA
    total = computed(() => this.subTotal() * 1.16);
    generarReciboXML = computed(() => this.carritoService.exportarXML());

    quitar(id: number) {
        this.carritoService.quitar(id);
    }
    vaciar() {
        this.carritoService.vaciar();
    }
    exportarXML() {
        this.carritoService.exportarXML();
    }
    trackById(index: number, producto: any): number {
        return producto.id;
    }

    public payPalConfig?: IPayPalConfig;

    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        const currency = 'MXN';
        const subtotalValue = this.subTotal();
        const ivaValue = this.IVA();
        const totalValue = this.total();

        const subtotalStr = subtotalValue.toFixed(2);
        const ivaStr = ivaValue.toFixed(2);
        const totalStr = totalValue.toFixed(2);

        this.payPalConfig = {
            currency: currency,
            clientId: 'AU6vrMiGw-XfxnHXuTH6nNpvA-A2IUvpszLKG_Jip3hvexiEDL0c8Poa6CgrYxsm18G_vVw6APYyi6mg',
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: totalStr,
                            breakdown: {
                                item_total: {
                                    currency_code: currency,
                                    value: subtotalStr
                                },
                                tax_total: {
                                    currency_code: currency,
                                    value: ivaStr
                                }
                            }
                        },
                        items: this.carrito().map(x => <ITransactionItem>{
                            name: x.nombre,
                            quantity: "1",
                            category: 'PHYSICAL_GOODS',
                            unit_amount: {
                                currency_code: currency,
                                value: Number(x.precio).toFixed(2),
                            },
                        })
                    }
                ]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then((details: any) => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });
            },
            onClientAuthorization: (data) => {
                // Guardamos los datos del carrito
                const itemsSnapshot = [...this.carrito()];

                // Obtenemos el id del usuario que esta haciendo el pedido (este se guarda en local al hacer login)
                const userStr = localStorage.getItem('currentUser');
                if (!userStr) {
                    console.error('Usuario no encontrado en localStorage.');
                    alert('No se pudo registrar el pedido: usuario no identificado.');
                    return;
                }
                const user = JSON.parse(userStr);
                const fk_user = Number(user?.id_user ?? user?.fk_user ?? user?.id);
                if (!Number.isInteger(fk_user) || fk_user <= 0) {
                    console.error('id_user inválido en currentUser:', user);
                    alert('No se pudo registrar el pedido: usuario inválido.');
                    return;
                }

                // construimos el payload de productos 
                const productosPayload = itemsSnapshot.map((p: any) => {
                    const idProd = Number(
                        p?.id_producto ?? p?.id ?? p?.producto_id ?? p?.idProd
                    );
                    return { id_producto: idProd, cant_prod: 1, _debug: p };
                });

                // una simple validacion de los ids de productos
                const validos = productosPayload.filter(x => Number.isInteger(x.id_producto) && x.id_producto > 0);
                if (validos.length !== productosPayload.length) {
                    console.error('Productos con id inválido. Snapshot:', productosPayload);
                    alert('No se pudo registrar el pedido: hay productos sin id válido.');
                    return;
                }

                // construir el payload final
                const payload = {
                    fk_user,
                    productos: validos.map(({ id_producto, cant_prod }) => ({ id_producto, cant_prod }))
                };

                // guardar en la base de datos, si todo sale bien, tambien genera el XMl y vacia el carrito.
                this.pedidoService.crearPedidoConItems(payload).subscribe({
                    next: (resp) => {
                        if (resp?.ok) {
                            this.generarReciboXML();
                            this.vaciar();
                        } else {
                            console.error('Backend no confirmó ok:', resp);
                            alert('No se pudo registrar el pedido en la base de datos.');
                        }
                    },
                    error: (err) => {
                        console.error('Error al registrar pedido:', err);
                        alert('Ocurrió un error al guardar el pedido. Intenta nuevamente.');
                    }
                });
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
            },
            onError: err => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            },
        };
    }
}