import {
  Component,
  Directive, DoCheck,
  ElementRef, EventEmitter,
  HostBinding,
  HostListener,
  Input, OnChanges,
  OnDestroy,
  Optional, Output,
  Self, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  ValidationErrors
} from '@angular/forms';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { CanUpdateErrorStateCtor, ErrorStateMatcher, mixinErrorState } from "@angular/material/core";

let nextUniqueId = 0;

const REGEX_MAC_PART_VALID = /^[0-9A-Fa-f]{0,2}$/;
const REGEX_MAC_PART_COMPLETE = /^[0-9A-Fa-f]{2}$/;
const REGEX_MAC_VALID_SEARCH = /(?<mac>(?:(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})))/;

@Directive({
  selector: 'input[appMacAddressInputPart]'
})
export class MacAddressInputPartDirective {
  private readonly el: HTMLInputElement;

  constructor(elementRef: ElementRef<HTMLInputElement>) {
    this.el = elementRef.nativeElement;
  }

  @HostListener('keydown', ['$event.key']) private onKeydown(k: string) {
    // Prevent tab if input is empty (in case user thinks tab is necessary after typing 1 value)
    if (this.el.value.length === 0 && k === 'Tab') return false;

    const caretStart = this.el.selectionStart === 0 && this.el.selectionEnd === 0;
    const caretEnd = this.el.selectionStart === this.el.value.length;
    const empty = this.el.value.length === 0;

    let direction: 'previous' | 'next';
    let final: boolean;

    // Move between inputs using arrow keys, backspace/delete, and decimal point
    if (caretStart && ['ArrowLeft', 'Left', 'Backspace', 'Home'].includes(k)) {
      direction = 'previous';
      final = k === 'Home';
    } else if (caretEnd && (['ArrowRight', 'Right', 'Delete', 'End'].includes(k) || !empty && [':', '-'].includes(k))) {
      direction = 'next';
      final = k === 'End';
    } else {
      return;
    }

    if (final) this.focusFinalInput(this.el, direction);
    else this.focusSiblingInput(this.el, direction);
    return false;
  }

  @HostListener('keypress', ['$event.key.toUpperCase()']) private onKeypress(k: string) {
    if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].includes(k)) return false;

    const sStart = this.el.selectionStart;
    let sEnd = this.el.selectionEnd;
    const curValue = this.el.value;

    // Insert at caret
    let newValue = curValue.slice(0, sStart) + k + curValue.slice(sEnd);
    // If invalid, replace single character at caret
    if (!REGEX_MAC_PART_VALID.test(newValue)) [newValue, sEnd] = [curValue.slice(0, sStart) + k + curValue.slice(sEnd + 1), sEnd + 1];
    // If invalid, replace all remaining characters from caret
    if (!REGEX_MAC_PART_VALID.test(newValue)) [newValue, sEnd] = [curValue.slice(0, sStart) + k, curValue.length];
    // If invalid, prevent input
    if (!REGEX_MAC_PART_VALID.test(newValue)) {
      // But skip to next input if at the end if this input and current value is complete
      if (sStart === curValue.length && curValue.length === 2)
        this.focusSiblingInput(this.el, 'next');
      return false;
    }

    this.el.selectionEnd = sEnd;
  }

  @HostListener('paste', ['$event', '$event.clipboardData.getData("Text")']) private onPaste(ev: ClipboardEvent, p: string) {
    // If valid address is pasted bubble up to main component, otherwise allow paste
    if (REGEX_MAC_VALID_SEARCH.test(p)) ev.preventDefault();
  }

  @HostListener('input') private onInput() {
    // Reset input if cut/paste results in invalid value
    if (!REGEX_MAC_PART_VALID.test(this.el.value)) this.el.value = '';

    // Skip to next input if current value is complete
    if (this.el.value.length === this.el.selectionStart && REGEX_MAC_PART_COMPLETE.test(this.el.value))
      this.focusSiblingInput(this.el, 'next');
  }

  private focusSiblingInput(e: HTMLInputElement, direction: 'next' | 'previous') {
    let element: Element | null = e;
    do {
      element = direction === 'next' ? element.nextElementSibling : element.previousElementSibling;
      if (element === null) return;
    } while (!(element instanceof HTMLInputElement));
    element.focus();
    element.selectionStart = element.selectionEnd = direction === 'next' ? 0 : element.value.length;
  }

  private focusFinalInput(e: HTMLInputElement, direction: 'next' | 'previous') {
    let final: HTMLInputElement = e;
    let element: Element | null = e;
    do {
      element = direction === 'next' ? element.nextElementSibling : element.previousElementSibling;
      if (element instanceof HTMLInputElement) final = element;
    } while (element != null);
    final.focus();
    final.selectionStart = final.selectionEnd = direction === 'previous' ? 0 : final.value.length;
  }
}

class MacAddressInputBase {
  constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) {}
}
const _MacAddressInputBase: CanUpdateErrorStateCtor & typeof MacAddressInputBase =
  mixinErrorState(MacAddressInputBase);

@Component({
  selector: 'app-mac-address-input',
  templateUrl: './mac-address-input.html',
  styleUrls: ['./mac-address-input.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'id': 'id',
    'class': 'app-mac-address-input',
    '[class.app-mac-address-input-disabled]': 'disabled',
    '[class.app-mac-address-input-invalid]': 'errorState',
    '[class.app-mac-address-input-required]': 'required',
    '[class.app-mac-address-input-empty]': 'empty',
    '[class.app-mac-address-input-label-floating]': 'shouldLabelFloat'
  },
  providers: [
    {provide: MatFormFieldControl, useExisting: MacAddressInputComponent},
  ],
})
export class MacAddressInputComponent extends _MacAddressInputBase implements MatFormFieldControl<string | number[] | number>, DoCheck, OnDestroy, ControlValueAccessor {
  controlType: string = 'app-mac-address-input';

  /** `View -> model callback called when value changes` */
  private _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when select has been touched` */
  private _onTouched = () => {};

  /** Object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  constructor(
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    focusMonitor.monitor(elementRef, true).subscribe(origin => {
      if (this.focused && !origin) this._onTouched();
      this._focused = origin !== null;
      this.stateChanges.next();
    });

    if (this.ngControl != null) this.ngControl.valueAccessor = this;
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  private _uid = `app-mac-address-input-${nextUniqueId++}`;

  @Input()
  get id(): string { return this._id; }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  @Input()
  get value(): string | number[] | number | null | undefined {
    if (this._values.every(v => v === null)) return undefined;
    if (this._values.includes(null)) return null;
    if (this.valueType === 'array') return this._values.map(Number);
    if (this.valueType === 'string') return this._values.join('.');
    if (this.valueType === 'number') return this._values.reduce(
      (ip, part) => ip << 8 | Number(part),
    0) >>> 0;
    return null;
  }
  set value(value: string | number[] | number | null | undefined) {
    let array: number[];
    if (value instanceof Array) {
      array = value;
    } else if (typeof value === 'string') {
      array = value.split(':').map(Number);
    } else if (typeof value === 'number') {
      array = [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
    } else {
      array = [];
    }

    if (array.length < 6) array = array.concat(Array(6 - array.length).fill(null));

    array
      .map(p => Number.isInteger(p) && p >= 0 && p <= 255 ? p : null)
      .slice(0, 4)
      .forEach((p, i) => this._values[i] = p.toString(16));

    this.stateChanges.next();
  }
  _values: string[] = ['', '', '', '', '', ''];

  get empty(): boolean { return this._values.every(v => v === null); }

  @Input() valueType: 'string' | 'number' | 'array' = 'string';

  @Input()
  get required() { return this._required; }
  set required(required) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get placeholder() { return this._placeholders.map(p => p ?? '').join('.'); }
  set placeholder(placeholder: string) {
    placeholder.split('.')
      .slice(0, 6)
      .forEach((p, i) => this._placeholders[i] = p.length === 0 ? null : p);
    this.stateChanges.next();
  }
  _placeholders: string[] = ['', '', '', '', '', ''];

  get focused(): boolean { return this._focused; }
  private _focused = false;

  get shouldLabelFloat(): boolean { return this.focused || !this.empty; }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input' || (event.target as HTMLInputElement).disabled)
      (this.elementRef.nativeElement.querySelector('input:not([disabled])')! as HTMLInputElement).focus();
  }

  @HostBinding('attr.aria-describedby') describedByIds: string | null = null;
  setDescribedByIds(ids: string[]) {
    this.describedByIds = ids.join(' ');
  }

  onInputChange() {
    this._onChange(this.value);
    this.stateChanges.next();
  }

  @HostListener('paste', ['$event.clipboardData.getData("Text")']) private onPaste(p: string) {
    // If valid address set as value
    const mac = REGEX_MAC_VALID_SEARCH.exec(p)?.groups.mac;
    if (mac !== undefined) this.value = mac;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: string | null): void {
    this.value = value;
  }

  static validator(control: AbstractControl): ValidationErrors | null {
    // Empty inputs return undefined but null is returned for invalid addresses
    return control.value !== null ? null : {'mac': true};
  }
}
