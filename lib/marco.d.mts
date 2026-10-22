import type { GuionVisual, Timeline, TramoMarco } from '../src/motor/tipos';
export const T_MARCO: { entrada: number; pausa: number; salida: number };
export function piezasMarco(g: unknown): { id: string; frases: Record<string, string>[] }[];
export function tramoMarco(tl: Timeline, ids: string[]): TramoMarco | null;
export function marcoParte(g: GuionVisual, tl: Timeline, i: number): { apertura: TramoMarco | null; final: TramoMarco | null };
export function sobraParte(g: GuionVisual, tl: Timeline): (i: number) => number;
export function horizontalConMarco<G, T>(g: G, tl: T): { guion: G; timeline: T };
