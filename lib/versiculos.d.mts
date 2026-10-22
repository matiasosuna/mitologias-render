export type Ref = { capitulo: number; versiculo: number } | null;
export type Verso = { chapter: number; verse: number; text: string };
export function versiculosDeFrases(frases: string[], versos: Verso[]): Ref[];
export function referencia(r: Ref): string;
export function versiculosDeGuion(guion: { escenas: { frases: Record<string, string | undefined>[] }[] }, versos: Verso[], idioma?: string): Ref[][];
export function zonaVersiculo(esc: { versiculo?: 'arriba' | 'abajo'; rotulos?: { y: number }[]; actores?: { y?: number }[]; elementos?: { tipo: string; y?: number }[] }): 'arriba' | 'abajo';
