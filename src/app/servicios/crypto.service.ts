import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioCriptografia {
  
  constructor() { }

  // Generar par de llaves RSA 4096 bits
  async generarParLlavesRSA(): Promise<{ llavePublica: string; llavePrivada: string }> {
    try {
      const parLlaves = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
          hash: { name: "SHA-256" }
        },
        true, // extractable
        ["encrypt", "decrypt"]
      );

      // Exportar llave pública
      const llavePublicaExportada = await window.crypto.subtle.exportKey(
        "spki",
        parLlaves.publicKey
      );

      // Exportar llave privada
      const llavePrivadaExportada = await window.crypto.subtle.exportKey(
        "pkcs8",
        parLlaves.privateKey
      );

      // Convertir a Base64 para almacenamiento
      const llavePublicaBase64 = this.arregloBytesABase64(llavePublicaExportada);
      const llavePrivadaBase64 = this.arregloBytesABase64(llavePrivadaExportada);

      return {
        llavePublica: llavePublicaBase64,
        llavePrivada: llavePrivadaBase64
      };

    } catch (error) {
      console.error('Error generando llaves RSA:', error);
      throw new Error('No se pudieron generar las llaves RSA');
    }
  }

  // Generar llave simétrica AES-256
  async generarLlaveSimetricaAES(): Promise<string> {
    try {
      const llaveAES = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256
        },
        true, // extractable
        ["encrypt", "decrypt"]
      );

      const llaveExportada = await window.crypto.subtle.exportKey("raw", llaveAES);
      return this.arregloBytesABase64(llaveExportada);

    } catch (error) {
      console.error('Error generando llave AES:', error);
      throw new Error('No se pudo generar la llave AES');
    }
  }

  // Encriptar datos con AES - VERSIÓN CORREGIDA
async encriptarConAES(datos: string, llaveAESBase64: string): Promise<string> {
  try {
    // Convertir la llave AES de Base64 a ArrayBuffer
    const llaveAESBuffer = this.base64AArregloBytes(llaveAESBase64);
    
    // Importar llave AES
    const llaveAES = await window.crypto.subtle.importKey(
      "raw",
      llaveAESBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    // Vector de inicialización (IV)
    const vectorInicializacion = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encriptar
    const datosEncriptados = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: vectorInicializacion
      },
      llaveAES,
      new TextEncoder().encode(datos)
    );

    // Combinar IV + datos encriptados - CORREGIDO
    const resultadoCombinado = new Uint8Array(vectorInicializacion.length + datosEncriptados.byteLength);
    resultadoCombinado.set(vectorInicializacion, 0);
    resultadoCombinado.set(new Uint8Array(datosEncriptados), vectorInicializacion.length);

    // CORRECCIÓN: Convertir Uint8Array a ArrayBuffer
    return this.arregloBytesABase64(resultadoCombinado.buffer);

  } catch (error) {
    console.error('Error encriptando con AES:', error);
    throw new Error('No se pudieron encriptar los datos');
  }
}
 // Desencriptar datos con AES - VERSIÓN CORREGIDA
async desencriptarConAES(datosEncriptadosBase64: string, llaveAESBase64: string): Promise<string> {
  try {
    // Convertir la llave AES de Base64 a ArrayBuffer
    const llaveAESBuffer = this.base64AArregloBytes(llaveAESBase64);
    
    // Importar llave AES
    const llaveAES = await window.crypto.subtle.importKey(
      "raw",
      llaveAESBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Separar IV y datos encriptados - CORREGIDO
    const datosCombinadosBuffer = this.base64AArregloBytes(datosEncriptadosBase64);
    const datosCombinados = new Uint8Array(datosCombinadosBuffer);
    
    const vectorInicializacion = datosCombinados.slice(0, 12);
    const datosEncriptados = datosCombinados.slice(12);

    // Desencriptar - CORREGIDO
    const datosDesencriptados = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: vectorInicializacion
      },
      llaveAES,
      datosEncriptados.buffer // Usar .buffer en lugar del Uint8Array directamente
    );

    return new TextDecoder().decode(datosDesencriptados);

  } catch (error) {
    console.error('Error desencriptando con AES:', error);
    throw new Error('No se pudieron desencriptar los datos');
  }
}

  // Encriptar con RSA (llave pública)
  async encriptarConRSA(datos: string, llavePublicaBase64: string): Promise<string> {
    try {
      // Convertir la llave pública de Base64 a ArrayBuffer
      const llavePublicaBuffer = this.base64AArregloBytes(llavePublicaBase64);
      
      // Importar llave pública
      const llavePublica = await window.crypto.subtle.importKey(
        "spki",
        llavePublicaBuffer,
        {
          name: "RSA-OAEP",
          hash: { name: "SHA-256" }
        },
        false,
        ["encrypt"]
      );

      // Encriptar
      const datosEncriptados = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        llavePublica,
        new TextEncoder().encode(datos)
      );

      return this.arregloBytesABase64(datosEncriptados);

    } catch (error) {
      console.error('Error encriptando con RSA:', error);
      throw new Error('No se pudieron encriptar los datos con RSA');
    }
  }

  // Desencriptar con RSA (llave privada)
  async desencriptarConRSA(datosEncriptadosBase64: string, llavePrivadaBase64: string): Promise<string> {
    try {
      // Convertir la llave privada de Base64 a ArrayBuffer
      const llavePrivadaBuffer = this.base64AArregloBytes(llavePrivadaBase64);
      
      // Importar llave privada
      const llavePrivada = await window.crypto.subtle.importKey(
        "pkcs8",
        llavePrivadaBuffer,
        {
          name: "RSA-OAEP",
          hash: { name: "SHA-256" }
        },
        false,
        ["decrypt"]
      );

      // Convertir datos encriptados de Base64 a ArrayBuffer
      const datosEncriptadosBuffer = this.base64AArregloBytes(datosEncriptadosBase64);

      // Desencriptar
      const datosDesencriptados = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        llavePrivada,
        datosEncriptadosBuffer
      );

      return new TextDecoder().decode(datosDesencriptados);

    } catch (error) {
      console.error('Error desencriptando con RSA:', error);
      throw new Error('No se pudieron desencriptar los datos con RSA');
    }
  }

  // Utilidades de conversión CORREGIDAS
  private arregloBytesABase64(arregloBytes: ArrayBuffer): string {
    const bytes = new Uint8Array(arregloBytes);
    let binario = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binario += String.fromCharCode(bytes[i]);
    }
    return btoa(binario);
  }

  private base64AArregloBytes(base64: string): ArrayBuffer {
    const binario = atob(base64);
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) {
      bytes[i] = binario.charCodeAt(i);
    }
    return bytes.buffer;
  }
}