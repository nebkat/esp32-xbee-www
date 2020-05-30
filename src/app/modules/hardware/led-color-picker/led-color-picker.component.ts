import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CdkDragMove } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-led-color-picker',
  templateUrl: './led-color-picker.component.html',
  styleUrls: ['./led-color-picker.component.scss']
})
export class LedColorPickerComponent implements OnInit, OnChanges {
  constructor() { }

  @ViewChild('hueHandle') hueHandleElement: ElementRef<HTMLDivElement>;
  @ViewChild('hueHandleContainer') hueHandleContainerElement: ElementRef<HTMLDivElement>;

  colorCss = '#ff0000';

  brightness = 0.5;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

  }
}
