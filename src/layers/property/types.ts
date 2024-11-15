// src/layers/property/types.ts
// Property Layer: Define basic data types
export type PropertyId = string;
export type PropertyValue = string | number | boolean | Date | string[];

export interface BaseProperty<T extends PropertyValue = PropertyValue> {
  id: PropertyId;
  value: T;
  label: string;
  required?: boolean;
  validation?: (value: T) => boolean;
}

export interface TextProperty extends BaseProperty<string> {
  type: 'text';
  multiline?: boolean;
  maxLength?: number;
}

export interface NumberProperty extends BaseProperty<number> {
  type: 'number';
  min?: number;
  max?: number;
}

export interface DateProperty extends BaseProperty<Date> {
  type: 'date';
  minDate?: Date;
  maxDate?: Date;
}

export interface TagsProperty extends BaseProperty<string[]> {
  type: 'tags';
  suggestions?: string[];
}

export type Property = TextProperty | NumberProperty | DateProperty | TagsProperty;