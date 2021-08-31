import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44304/chat")   // mapping to the chathub as in startup.cs
    .configureLogging(signalR.LogLevel.Information)
    .build();


  public startConnection = () => {
    this.connection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }


  public enviarMensaje = () => {
    this.connection.on('broadcastMessage', (name, mensaje) => {
      console.log(mensaje);
    });
  }

}