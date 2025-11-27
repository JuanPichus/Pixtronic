import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  showModal = false;
  modalTitle = '';
  modalContent = '';

  legalSections = {
    terminosCondiciones: {
      title: 'Términos y Condiciones',
      content: `Al acceder y utilizar los servicios de Pixtronic, usted acepta estar sujeto a los siguientes términos y condiciones:

• Debe ser mayor de edad según la legislación mexicana para realizar compras.
• La información proporcionada debe ser veraz y actualizada.
• Se compromete a hacer un uso adecuado de los servicios y no infringir derechos de terceros.
• Las transacciones están sujetas a disponibilidad de inventario.
• Los precios pueden cambiar sin previo aviso.
• Pixtronic se reserva el derecho de rechazar o cancelar pedidos.

El incumplimiento de estos términos puede resultar en la suspensión o cancelación de su cuenta.`
    },
    usoServicio: {
      title: 'Uso de servicio',
      content: `La Empresa se dedica a la venta de componentes de computadora y otros productos relacionados. Al utilizar nuestros servicios, usted acepta que recabemos y tratemos sus datos personales, los cuales son necesarios para:

• Procesar sus órdenes y realizar entregas.
• Brindar atención al cliente.
• Enviar información sobre promociones y novedades.
• Cumplir con obligaciones legales.

Los datos que podemos recopilar incluyen, pero no se limitan a: nombre, dirección, correo electrónico, número de teléfono y datos de pago.`
    },
    registroCuentas: {
      title: 'Registro y cuentas',
      content: `Al usar los servicios de Pixtronic el usuario se compromete a brindar los datos de: nombre de usuario, contraseña, número de teléfono, dirección de envío y datos de pago, además el usuario afirma ser una persona mayor de edad dentro del territorio mexicano.`
    },
    propiedadIntelectual: {
      title: 'Propiedad intelectual',
      content: `La información, contenido, diseño, gráficos, logotipos, íconos, imágenes, audio, video y cualquier otro material disponible en este sitio web son propiedad exclusiva de Pixtronic o de terceros que han autorizado su uso. Todos los derechos están reservados.`
    },
    limitacionResponsabilidad: {
      title: 'Limitación de responsabilidad',
      content: `Pixtronic y sus asociados conservarán los datos personales del Titular durante el tiempo que sea necesario para procesar sus solicitudes de información, productos y/o servicios.

Pixtronic no se hace responsable por los daños y perjuicios que puedan derivarse del uso indebido de los servicios ofrecidos en el sitio web. Asimismo, no garantiza la disponibilidad y continuidad del funcionamiento del sitio, ni la ausencia de errores en el acceso y uso del mismo.`
    },
    modificacionTerminos: {
      title: 'Modificación de términos',
      content: `Pixtronic se reserva el derecho de modificar este Aviso de Privacidad en cualquier momento. Cualquier cambio será debidamente informado a los usuarios a través de nuestro sitio web. Se recomienda revisar periódicamente este Aviso para estar al tanto de cualquier actualización.`
    }
  };

  openModal(section: keyof typeof this.legalSections): void {
    this.modalTitle = this.legalSections[section].title;
    this.modalContent = this.legalSections[section].content;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalTitle = '';
    this.modalContent = '';
  }
}
