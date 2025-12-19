// models/languages.ts
import { ReactElement } from 'react';

export interface Language {
  label: string;
  image: ReactElement;
}

export type Locals = Language;
