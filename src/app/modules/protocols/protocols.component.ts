import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-protocols',
  templateUrl: './protocols.component.html',
  styleUrls: ['./protocols.component.scss']
})
export class ProtocolsComponent implements OnInit {
  ntripCasters: NtripCasterDefinition[] = [{
    id: 'lol',
    port: 2101,
    maxConnections: 5
  }];

  constructor() { }

  ngOnInit(): void {
  }
}

export interface ProtocolDefinition {
  id: string;
}

export interface NtripCasterDefinition extends ProtocolDefinition {
  port: number;
  maxConnections: number;
}

export interface NtripServerClientDefinition extends ProtocolDefinition {
  type: 'server' | 'client';
  host: string;
  port: number;
  mountpoint: string;
  ntripVersion: 1 | 2;
}

export interface TcpUdpServerDefinition extends ProtocolDefinition {
  type: 'tcp' | 'udp';
  port: number;
}

export interface TcpUdpClientDefinition extends ProtocolDefinition {
  type: 'tcp' | 'udp';
  host: string;
  port: number;
}
