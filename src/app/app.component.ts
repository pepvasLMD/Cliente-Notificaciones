import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  host_local: string = ""
  token: string = ""


  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://apidraizapp.azurewebsites.net/notificaciones", {
      accessTokenFactory: () => {
        return this.token;
      },
    })   // mapping to the chathub as in startup.cs
    .configureLogging(signalR.LogLevel.Information)
    .build();

  @ViewChild('usuariosLista')
  usuariosLista!: ElementRef;

  usuario: string = "";
  conectado: boolean = false;
  error: boolean = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    console.log("Iniciando aplicacion");
  }



  public iniciarEscucha = () => {
    this.connection.on('broadcastMessage', (name, mensaje) => {
      this.createData(name + " " + mensaje)
    });
  }

  public SoloYoReciboMensaje = () => {
    console.log(this.usuario);
    this.connection.invoke('sendPersonal', this.usuario, "mensaje para solo pepe")
      .catch(err => console.error(err));
  }



  createData(mensaje: string): void {
    const elemntLi = this.renderer.createElement('li');
    const text = this.renderer.createText(mensaje);
    this.renderer.appendChild(elemntLi, text);
    //this.renderer.appendChild(this.discusion.nativeElement, elemntLi);
  }

  public unirse = () => {
    if (!this.conectado)
      this.startConnection();
  }

  public eventoUnirse = () => {
    this.connection.on('usuario_conectado', (name, mensaje) => {
      console.log(name + " " + mensaje)
    });
  }

  public startConnection = () => {
    this.error = false;
    this.connection
      .start()
      .then(e => {
        this.conectado = true;
        this.eventoUnirse();
        this.eventoListaUsuarios();
      })
      .catch(err => {
        this.conectado = false;
        this.error = true;
      })
  }

  public eventoListaUsuarios = () => {
    this.connection.on('lista_usuarios', (name: string, lista: Array<string>) => {

      const childElements = this.usuariosLista.nativeElement.childNodes;

      for (let child of childElements) {
        this.renderer.removeChild(this.usuariosLista.nativeElement, child);
      }


      lista.forEach(value => {
        const elemntLi = this.renderer.createElement('li');
        const text = this.renderer.createText(value);
        this.renderer.appendChild(elemntLi, text);
        this.renderer.appendChild(this.usuariosLista.nativeElement, elemntLi);
      });

    })
  }

  title = 'Chat-DreizApp';
}
