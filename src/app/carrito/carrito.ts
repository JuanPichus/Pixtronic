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
                this.generarReciboXML();
                this.vaciar();
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