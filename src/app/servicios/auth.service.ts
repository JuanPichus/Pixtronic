import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioCriptografia } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class ServicioAutenticacion {
  private urlAPI = 'http://localhost:3000/api/registro';
  private servicioCripto = inject(ServicioCriptografia);

  constructor(private http: HttpClient) {}

  // Registrar nuevo usuario
  async registrarUsuario(datosUsuario: any): Promise<Observable<any>> {
    try {
      // PASO 1: Generar par de llaves RSA 4096 bits
      console.log('Generando par de llaves RSA...');
      const parLlavesRegistro = await this.servicioCripto.generarParLlavesRSA();
      
      // PASO 2: Generar llave simétrica AES-256
      console.log('Generando llave simétrica AES...');
      const llaveSimetricaAESRegistro = await this.servicioCripto.generarLlaveSimetricaAES();
      
      // PASO 3: Encriptar la llave privada RSA con AES usando clave derivada
      console.log('Encriptando llave privada con AES...');

      // Derivar clave AES desde la contraseña (SOLO password ahora)
      const claveAESDerivadaRegistro = await this.servicioCripto.derivarClaveDesdePassword(
        datosUsuario.password
      );

      const llavePrivadaEncriptadaRegistro = await this.servicioCripto.encriptarConAES(
        parLlavesRegistro.llavePrivada, 
        claveAESDerivadaRegistro
      );
      
      // PASO 4: Encriptar la contraseña del usuario con AES
      console.log('Encriptando contraseña del usuario...');
      const contraseñaEncriptadaRegistro = await this.servicioCripto.encriptarConAES(
        datosUsuario.password, 
        llaveSimetricaAESRegistro
      );
      
      // PASO 5: Encriptar la llave simétrica AES con RSA pública
      console.log('Encriptando llave AES con RSA pública...');
      const llaveAESEncriptadaRegistro = await this.servicioCripto.encriptarConRSA(
        llaveSimetricaAESRegistro, 
        parLlavesRegistro.llavePublica
      );

      // Preparar datos para enviar a la API
      const datosEncriptados = {
        username: datosUsuario.username,
        lastname: datosUsuario.lastname,
        email: datosUsuario.email,
        birth_date: datosUsuario.birth_date,
        llave_publica: parLlavesRegistro.llavePublica,
        llave_privada_encriptada: llavePrivadaEncriptadaRegistro,
        contraseña_encriptada: contraseñaEncriptadaRegistro,
        llave_aes_encriptada: llaveAESEncriptadaRegistro
      };

      console.log('Datos listos para registrar:', datosEncriptados);
      return this.http.post(`${this.urlAPI}/register`, datosEncriptados);

    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      throw error;
    }
  }

  // Iniciar sesión
  async iniciarSesion(credenciales: any): Promise<Observable<any>> {
    try {
      console.log('Iniciando proceso de login criptografico...');
      
      // PASO 1: Obtener datos criptográficos del usuario
      console.log('Obteniendo datos criptograficos del usuario...');
      const datosCripto: any = await this.http.get(
        `${this.urlAPI}/datos-cripto/${credenciales.email}`
      ).toPromise();

      if (!datosCripto) {
        throw new Error('Usuario no encontrado');
      }

      console.log('Datos criptograficos obtenidos');

      // PASO 2: Derivar clave AES desde la contraseña (SOLO password ahora)
      console.log('Derivando clave AES desde la contraseña...');
      
      const claveAESDerivadaLogin = await this.servicioCripto.derivarClaveDesdePassword(
        credenciales.password
      );

      // PASO 3: Desencriptar la llave privada RSA usando la clave AES derivada
      console.log('Desencriptando llave privada RSA...');
      const llavePrivadaDesencriptadaLogin = await this.servicioCripto.desencriptarConAES(
        datosCripto.llave_privada_encriptada,
        claveAESDerivadaLogin
      );

      // PASO 4: Desencriptar la llave AES con RSA privada
      console.log('Desencriptando llave AES con RSA privada...');
      const llaveAESDesencriptadaLogin = await this.servicioCripto.desencriptarConRSA(
        datosCripto.llave_aes_encriptada,
        llavePrivadaDesencriptadaLogin
      );

      // PASO 5: Encriptar la contraseña ingresada con la llave AES para comparar
      console.log('Encriptando contraseña para comparacion...');
      const contraseñaEncriptadaParaComparar = await this.servicioCripto.encriptarConAES(
        credenciales.password,
        llaveAESDesencriptadaLogin
      );

      // PASO 6: Enviar datos para verificación
      const datosLogin = {
        email: credenciales.email,
        contraseña_encriptada: contraseñaEncriptadaParaComparar,
        llave_aes_encriptada: datosCripto.llave_aes_encriptada
      };

      console.log('Enviando datos de login criptografico...');
      return this.http.post(`${this.urlAPI}/login-cripto`, datosLogin);

    } catch (error: any) {
      console.error('Error en el proceso de login criptografico:', error);
      
      if (error.message.includes('decrypt') || error.message.includes('desencriptar') || error.message.includes('derivar')) {
        throw new Error('Contraseña incorrecta');
      }
      throw error;
    }
  }

  // Método auxiliar para desencriptar contraseña (si se necesita en el frontend)
  async desencriptarContraseña(
    contraseñaEncriptada: string, 
    llaveAESEncriptada: string, 
    llavePrivadaBase64: string
  ): Promise<string> {
    try {
      // 1. Desencriptar llave AES con RSA privada
      const llaveAES = await this.servicioCripto.desencriptarConRSA(
        llaveAESEncriptada, 
        llavePrivadaBase64
      );
      
      // 2. Desencriptar contraseña con AES
      return await this.servicioCripto.desencriptarConAES(
        contraseñaEncriptada, 
        llaveAES
      );
      
    } catch (error) {
      console.error('Error desencriptando contraseña:', error);
      throw error;
    }
  }
}