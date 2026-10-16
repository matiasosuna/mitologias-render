type Txt = { es: string; en?: string; pt?: string };
export type Quien = { nombre: Txt; subtitulo: Txt; como: string; fondo?: string; escala?: number };
export const INTRO_QUIEN: number;
export function tiemposShort(g: unknown): { intro: number; entrada: number; pausa: number; salida: number; outro: number; cartel?: number; cartelTras?: number; salidaFinal?: number };
export const FONDO_QUIEN: Record<string, string>;
export function textosQuien(quien: Quien, idioma?: string): { titulo: string; nombre: string; subtitulo: string };
export function tamQueEntra(texto: string, max: number, porLetra: number, ancho?: number): number;
export function erroresQuien(g: unknown, elenco?: Set<string>): string[];
