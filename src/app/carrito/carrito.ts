import { Component, computed, inject } from '@angular/core';
import { CarritoService } from '../servicios/carrito.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule, ITransactionItem } from 'ngx-paypal';
@Component({
    selector: 'app-carrito',
    standalone: true,
    imports: [CurrencyPipe, NgxPayPalModule, CommonModule],
    templateUrl: './carrito.html',
    styleUrls: ['./carrito.css']
})
export class CarritoComponent implements OnInit {
    private carritoService = inject(CarritoService);
    carrito = this.carritoService.productos;
    total = computed(() => this.carritoService.total());
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
        const totalAmount = this.total().toString();

        this.payPalConfig = {
            currency: currency,
            clientId: 'AU6vrMiGw-XfxnHXuTH6nNpvA-A2IUvpszLKG_Jip3hvexiEDL0c8Poa6CgrYxsm18G_vVw6APYyi6mg',
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: totalAmount,
                            breakdown: {
                                item_total: {
                                    currency_code: currency,
                                    value: totalAmount
                                }
                            }
                        },
                        items: this.carrito().map(x => <ITransactionItem>
                            {
                                name: x.nombre,
                                quantity: '1',
                                category: 'PHYSICAL_GOODS',
                                unit_amount: {
                                    currency_code: currency,
                                    value: x.precio.toString(),
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
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
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