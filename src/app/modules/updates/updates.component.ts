import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UpdatesComponent implements OnInit {
  columnsToDisplay: string[] = ['version', 'date'];
  releases: GithubRelease[] = [];
  expandedRow: GithubRelease | null;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getReleases().subscribe(data => this.releases = data);
  }

  getReleases(): Observable<GithubRelease[]> {
    const href = 'https://api.github.com/repos/nebkat/esp32-xbee/releases';

    return this.httpClient.get<GithubRelease[]>(href);
  }
}

export interface GithubReleaseAsset {
  url: string,
  id: number,
  name: string,
  size: number,
  download_count: number,
  created_at: string,
  updated_at: string,
  browser_download_url: string
}

export interface GithubRelease {
  url: string,
  html_url: string,
  id: number,
  tag_name: string,
  name: string,
  body: string,
  draft: boolean,
  prerelease: boolean,
  created_at: string,
  published_at: string,
  assets: GithubReleaseAsset[]
}
