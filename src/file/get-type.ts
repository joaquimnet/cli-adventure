import fs from 'node:fs';
// import path from 'node:path';

export enum FileType {
  File = 'file',
  Directory = 'directory',
  URL = 'url',
  Invalid = 'invalid',
}

export function getSourceType(source: string): FileType {
  if (!source?.length) return FileType.Invalid;

  const urlRegex = new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  );
  const isUrl = urlRegex.test(source);
  let isFile = false;
  try {
    isFile = fs.existsSync(source) && fs.lstatSync(source).isFile();
  } catch {}
  let isDirectory = false;
  try {
    isDirectory = fs.existsSync(source) && fs.lstatSync(source).isDirectory();
  } catch {}

  if (isUrl) {
    return FileType.URL;
  }
  if (isFile) {
    return FileType.File;
  }
  if (isDirectory) {
    return FileType.Directory;
  }
  return FileType.Invalid;
}
