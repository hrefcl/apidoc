/**
 * TypeScript declarations for modules that haven't been migrated yet
 */

declare module './core/index' {
  export function setGeneratorInfos(info: { name: string; time: string; url: string; version: string }): void;
  export function setLogger(logger: any): void;
  export function setMarkdownParser(parser: any): void;
  export function setPackageInfos(info: any): void;
  export function parse(options: any): any;
}

declare module './reader' {
  export class Reader {
    constructor(app: any);
    read(): any;
  }
}

declare module './writer' {
  export default class Writer {
    constructor(api: any, app: any);
    write(): Promise<void>;
  }
}

declare module './send_sample_request.js' {
  export function initSampleRequest(): void;
}

declare module './locales/locale.mjs' {
  export function __(key: string): string;
  export function setLanguage(lang: string): void;
}

declare module './hb_helpers' {
  export function register(): void;
}

// jQuery Bootstrap extensions
interface JQuery {
  scrollspy(options?: any): JQuery;
  popover(options?: any): JQuery;
  tab(action?: string): JQuery;
  trigger(event: string): JQuery;
}

interface JQueryStatic {
  urlParam?: (name: string) => string | null;
}

declare global {
  interface NodeJS {
    Timeout: number;
  }
}