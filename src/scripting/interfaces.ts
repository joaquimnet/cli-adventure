import { Content } from '../file/load-file';

export interface Context {
  variables: Record<string, string | number>;
  cursor: number;
  content: Content[];
}

export interface Token {
  type: 'identifier' | 'operator' | 'value';
  content: string | number;
}

export interface Statement {
  left: string;
  right: string | number;
  operator: string;
}
