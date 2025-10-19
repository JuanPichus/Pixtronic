import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioCriptografia } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class ServicioAutenticacion {
  private urlAPI = 'http://localhost:3000/api/auth';
  private servicioCripto = inject(ServicioCriptografia);

  constructor(private http: HttpClient) {}

  // Registrar nuevo usuario
  async registrarUsuario(datosUsuario: any): Promise<Observable<any>> {
    try {
      // PASO 1: Generar par de llaves RSA 4096 bits
      console.log('Generando par de llaves RSA...');
      const parLlaves = await this.servicioCripto.generarParLlavesRSA();
      
      // PASO 2: Generar llave simétrica AES-256
      console.log('Generando llave simétrica AES...');
      const llaveSimetricaAES = await this.servicioCripto.generarLlaveSimetricaAES();
      
      // PASO 3: Encriptar la llave privada RSA con AES
      console.log('Encriptando llave privada con AES...');
      const llavePrivadaEncriptada = await this.servicioCripto.encriptarConAES(
        parLlaves.llavePrivada, 
        llaveSimetricaAES
      );
      
      // PASO 4: Encriptar la contraseña del usuario con AES
      console.log('Encriptando contraseña del usuario...');
      const contraseñaEncriptada = await this.servicioCripto.encriptarConAES(
        datosUsuario.password, 
        llaveSimetricaAES
      );
      
      // PASO 5: Encriptar la llave simétrica AES con RSA pública
      console.log('Encriptando llave AES con RSA pública...');
      const llaveAESEncriptada = await this.servicioCripto.encriptarConRSA(
        llaveSimetricaAES, 
        parLlaves.llavePublica
      );

      // Preparar datos para enviar a la API
      const datosEncriptados = {
        // Datos personales en texto plano
        username: datosUsuario.username,
        lastname: datosUsuario.lastname,
        email: datosUsuario.email,
        birth_date: datosUsuario.birth_date,
        
        // Datos criptográficos
        llave_publica: parLlaves.llavePublica, // Texto plano
        llave_privada_encriptada: llavePrivadaEncriptada, // Encriptada con AES
        contraseña_encriptada: contraseñaEncriptada, // Encriptada con AES
        llave_aes_encriptada: llaveAESEncriptada // Encriptada con RSA
      };

      console.log('Datos listos para registrar:', datosEncriptados);
      return this.http.post(`${this.urlAPI}/registrar`, datosEncriptados);

    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      throw error;
    }
  }

  // Iniciar sesión
  async iniciarSesion(credenciales: any): Promise<Observable<any>> {
    try {
      // PASO 1: Obtener datos criptográficos del usuario desde la BD
      console.log('Obteniendo datos criptográficos del usuario...');
      const datosCripto: any = await this.http.get(
        `${this.urlAPI}/datos-cripto/${credenciales.email}`
      ).toPromise();

      if (!datosCripto) {
        throw new Error('Usuario no encontrado');
      }

      // PASO 2: Desencriptar la llave AES usando RSA privada
      // (En un caso real necesitaríamos la llave privada, pero para login usamos un enfoque diferente)
      console.log('Verificando credenciales...');
      
      // Para login, enviamos las credenciales y el servidor hace la verificación
      const datosLogin = {
        email: credenciales.email,
        contraseña_intento: credenciales.password,
        llave_aes_encriptada: datosCripto.llave_aes_encriptada,
        llave_publica: datosCripto.llave_publica
      };

      return this.http.post(`${this.urlAPI}/login`, datosLogin);

    } catch (error: any) {
      console.error('Error en el proceso de login:', error);
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