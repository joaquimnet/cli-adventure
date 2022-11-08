import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import { parse } from 'comment-json';

import { FileType } from './get-type';

export interface Adventure {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  version?: string;
  content: Content[];
}

export interface Content {
  type: 'text' | 'choice' | 'goto';
  content?: string;
  label?: string;
  condition?: string;
  script?: string[];
}

export interface AdventureLoaded {
  source: string;
  adventure: Adventure;
}

export async function loadFile(
  file: string,
  sourceType: FileType,
): Promise<AdventureLoaded> {
  let adventure;
  let source = file;

  if (sourceType === FileType.File) {
    const json = fs.readFileSync(file, 'utf8');
    adventure = parseAdventure(json);
  }

  if (sourceType === FileType.Directory) {
    const jsonFiles = fs
      .readdirSync(file)
      .filter((f) => f.endsWith('.json') || f.endsWith('.cjson'));
    const json = fs.readFileSync(path.join(file, jsonFiles[0]), 'utf8');
    adventure = parseAdventure(json);
    source = path.join(file, jsonFiles[0]);
  }

  if (sourceType === FileType.URL) {
    const response = await axios.get(file);
    adventure = parseAdventure(response.data);
  }

  if (adventure) {
    return { adventure, source };
  } else {
    throw new Error(`Invalid adventure. "${source}"`);
  }
}

export function parseAdventure(json: string): Adventure | null {
  const adventure = parse(json) as unknown as Adventure;
  if (!isAdventure(adventure)) {
    return null;
  }
  return adventure;
}

export function isAdventure(obj: any): boolean {
  return (
    obj.title &&
    obj.content &&
    obj.content.length &&
    obj.content[0].type &&
    obj.content[0].content
  );
}
