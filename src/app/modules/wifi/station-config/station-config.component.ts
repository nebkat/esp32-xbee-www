import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { WifiService, WifiStaApConfig, WifiStaApInfo } from "@modules/wifi/wifi.service";
import { MatTableDataSource } from "@angular/material/table";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";
import { AlertDialogComponent } from "@shared/components/alert-dialog/alert-dialog.component";
import { StationApConfigDialogComponent } from "@modules/wifi/station-ap-config-dialog/station-ap-config-dialog.component";

@Component({
  selector: 'app-station-config',
  templateUrl: './station-config.component.html',
  styleUrls: ['./station-config.component.scss']
})
export class StationConfigComponent implements OnChanges {
  maxConnections = 10;

  @Input() data: WifiStaApConfig[];
  @Output() dataChange: EventEmitter<WifiStaApConfig[]> = new EventEmitter();

  availableColumnsToDisplay: string[] = ['header', 'ssid', 'auth', 'action'];
  available = new MatTableDataSource<WifiStaApInfo>();

  savedColumnsToDisplay: string[] = ['header', 'ssid', 'auth', 'action'];
  saved = new MatTableDataSource<WifiStaApConfig>();

  scanning = false;

  constructor(private wifiService: WifiService, private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.saved.data = this.data;
  }

  onListDrop(event: CdkDragDrop<WifiStaApConfig[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    this.saved.data = this.data;
    this.dataChange.emit(this.data);
  }

  onScanClick() {
    if (this.scanning) return false;
    this.scanning = true;
    this.wifiService.scanStations()
      .subscribe(
        stations => this.available.data = stations,
        () => this.available.data = [],
        () => this.scanning = false
      );
  }

  onNewClick() {
    this.dialog.open(StationApConfigDialogComponent, {
      data: {}
    });
  }

  onSaveClick(ap: WifiStaApInfo) {
    this.dialog.open(StationApConfigDialogComponent, {
      data: {
        info: ap
      }
    });
  }

  onEditClick(ap: WifiStaApConfig) {
    this.dialog.open(StationApConfigDialogComponent, {
      data: {
        config: ap
      }
    });
  }

  onForgetClick(ap: WifiStaApConfig) {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: `Forget '${ap.ssid}'?`,
        content: 'Connections will no longer be made to this SSID and any saved authentication information will be removed.',
        actions: [
          {
            result: false,
            title: 'Cancel'
          }, {
            result: true,
            title: 'Forget'
          }
        ]
      }
    }).afterClosed().subscribe(forget => {
      if (!forget) return;

      this.data = this.data.filter(a => a !== ap);
      this.dataChange.emit(this.data);
    })
  }

  isSavedConnection(info: WifiStaApInfo): boolean {
    return this.findSavedConnection(info) !== undefined;
  }

  findSavedConnection(info: WifiStaApInfo): WifiStaApConfig | undefined {
    const ssidMatches = this.data.filter(config => config.ssid === info.ssid);
    // Look for exact BSSID match, otherwise return any SSID match
    return ssidMatches.find(config => config.bssid === info.bssid) || ssidMatches[0];
  }

  rssiIconStrength(rssi: number): number {
    if (rssi > -50) return 4;
    else if (rssi > -60) return 3;
    else if (rssi > -70) return 2;
    else return 1;
  }
}
