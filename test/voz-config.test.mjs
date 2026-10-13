// Voz de motor-narrar en la Mac y en la nube (Linux): sin `say`, Modal sin .venv, VOZ_EN desde el entorno.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerEnv, usaChatterbox, binModal, motorDeVoz } from '../lib/voz-config.mjs';

test('leerEnv: clave=valor, ignora comentarios y conserva los = del valor', () => {
  assert.deepEqual(leerEnv('A=1\n# B=2\nC = x=y \n\nmal'), { A: '1', C: 'x=y' });
});

test('VOZ_EN: el entorno manda sobre el .env (en la nube no hay .env)', () => {
  assert.equal(usaChatterbox({ VOZ_EN: 'chatterbox' }, {}), true);
  assert.equal(usaChatterbox({}, { VOZ_EN: 'chatterbox' }), true);
  assert.equal(usaChatterbox({ VOZ_EN: 'eleven' }, { VOZ_EN: 'chatterbox' }), false);
  assert.equal(usaChatterbox({}, {}), false);
});

test('binModal: MODAL_BIN, si no .venv de la Mac, si no el del PATH', () => {
  assert.equal(binModal({ MODAL_BIN: '/opt/v/bin/modal' }, () => true), '/opt/v/bin/modal');
  assert.equal(binModal({}, (f) => f === '.venv/bin/modal'), '.venv/bin/modal');
  assert.equal(binModal({}, () => false), 'modal');
});

test('motorDeVoz: inglés con Chatterbox en Linux; say solo en macOS', () => {
  assert.equal(motorDeVoz('en', { chatter: true, eleven: true, plataforma: 'linux' }), 'chatterbox');
  assert.equal(motorDeVoz('en', { chatter: false, eleven: true, plataforma: 'linux' }), 'eleven');
  assert.equal(motorDeVoz('es', { chatter: true, eleven: false, plataforma: 'darwin' }), 'say');
  assert.throws(() => motorDeVoz('es', { chatter: true, eleven: false, plataforma: 'linux' }), /VOZ_EN=chatterbox/);
  assert.throws(() => motorDeVoz('en', { chatter: false, eleven: false, plataforma: 'linux' }), /say/);
});
