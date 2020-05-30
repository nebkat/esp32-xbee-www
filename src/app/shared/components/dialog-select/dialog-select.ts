import {
  Component, ContentChild, Directive, HostBinding, HostListener,
  Input,
  OnDestroy,
  Optional,
  Self,
  TemplateRef, ViewEncapsulation
} from '@angular/core';
import { MatFormFieldControl } from "@angular/material/form-field";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { Subject } from "rxjs";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/overlay";

let nextUniqueId = 0;

@Directive({
  selector: 'app-dialog-select-trigger'
})
export class DialogSelectTrigger {}

@Component({
  selector: 'app-dialog-select',
  templateUrl: './dialog-select.html',
  styleUrls: ['./dialog-select.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'id': 'id',
    'class': 'app-dialog-select',
    '[class.app-dialog-select-disabled]': 'disabled',
    '[class.app-dialog-select-invalid]': 'errorState',
    '[class.app-dialog-select-required]': 'required',
    '[class.app-dialog-select-empty]': 'empty',
  },
  providers: [
    {provide: MatFormFieldControl, useExisting: DialogSelectComponent},
  ],
})
export class DialogSelectComponent<D, T> implements MatFormFieldControl<T>, OnDestroy, ControlValueAccessor {
  controlType: string = 'app-dialog-select';

  /** `View -> model callback called when value changes` */
  private _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when select has been touched` */
  private _onTouched = () => {};

  dialogRef: MatDialogRef<D, T> | null = null;

  @Input() dialogComponent: ComponentType<D> | TemplateRef<D>;

  constructor(@Optional() @Self() public ngControl: NgControl, private dialog: MatDialog) {
    if (this.ngControl != null) this.ngControl.valueAccessor = this;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  readonly errorState: boolean;
  readonly stateChanges: Subject<void> = new Subject();

  private _uid = `app-dialog-select-${nextUniqueId++}`;

  @Input()
  get id(): string { return this._id; }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  get value(): T {
    return this._value;
  }
  set value(value: T) {
    this._value = value;
    this.stateChanges.next()
  }
  private _value: T = null;

  get empty(): boolean { return this.value === null; }

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

  @ContentChild(DialogSelectTrigger) customTrigger: DialogSelectTrigger;

  @Input()
  get placeholder() { return this._placeholder; }
  set placeholder(placeholder) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }
  private _placeholder: string;

  get focused(): boolean {
    return this._focused || this.dialogRef !== null;
  }
  private _focused = false;

  get shouldLabelFloat(): boolean { return this.dialogRef != null || !this.empty; }

  onContainerClick(event: MouseEvent): void {
    this.dialogRef = this.dialog.open(this.dialogComponent);
    this.dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.value = result;
        this._onChange(result);
      }
      this.dialogRef = null;
      this.stateChanges.next();
    });
    this.stateChanges.next();
  }

  @HostBinding('[attr.aria-describedby]') describedByIds: string | null = null;
  setDescribedByIds(ids: string[]) {
    this.describedByIds = ids.join(' ');
  }

  @HostListener('focus') onFocus() {
    if (!this.disabled) this.stateChanges.next();
  }

  @HostListener('blur') onBlur() {
    if (!this.disabled) {
      this._onTouched();
      this.stateChanges.next();
    }
  }

  registerOnChange(fn: (value: T) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: T): void {
    this.value = value;
  }
}
