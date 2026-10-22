export function palabras(texto: string): string[];
export function iniciosPalabras(texto: string, dur: number): number[];
export function palabraEn(texto: string, dur: number, f: number): number;
export type Pagina = { desde: number; renglones: string[][] };
export function paginar(texto: string, max?: number, renglones?: number): Pagina[];
export function paginaDe(pags: Pagina[], k: number): number;
