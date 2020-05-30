import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  columnsToDisplay: string[] = ['index', 'time', 'level', 'tag', 'comment'];
  logs: LogEntry[] = [
    {
      index: 1,
      time: 12345,
      level: 'info',
      tag: 'WIFI',
      comment: 'WIFI_AP_SSID: ESP_XBee_6FCCBD (open)'
    },
    {
      index: 2,
      time: 12346,
      level: 'info',
      tag: 'WIFI',
      comment: 'WIFI_AP_IP: ip: 192.168.4.1/24, gw: 192.168.4.1'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}

export interface LogEntry {
  index: number;
  time: number;
  level: 'verbose' | 'debug' | 'info' | 'warning' | 'error' | 'reset';
  tag: string;
  comment: string;
}
