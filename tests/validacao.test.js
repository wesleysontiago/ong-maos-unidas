// Testes das regras de validação do cadastro (funções puras, sem DOM)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REGRAS } from '../js/modulos/validacao.js';

const valido = (regra, valor) => REGRAS[regra](valor) === '';

test('nome exige nome e sobrenome, aceitando hífen e acentos', () => {
  assert.ok(valido('nome', 'Ana-Maria Souza'));
  assert.ok(valido('nome', 'João D\'Ávila'));
  assert.ok(!valido('nome', 'Ana'));
  assert.ok(!valido('nome', '<b>Ana</b> Souza'));
  assert.ok(!valido('nome', ''));
});

test('e-mail', () => {
  assert.ok(valido('email', 'ana@ong.org'));
  assert.ok(!valido('email', 'ana@'));
  assert.ok(!valido('email', 'ana @ong.org'));
});

test('CPF: formato e dígitos', () => {
  assert.ok(valido('cpf', '529.982.247-25'));
  assert.match(REGRAS.cpf('529.982.247'), /incompleto/);
  assert.match(REGRAS.cpf('111.111.111-11'), /inválido/);
});

test('telefone: formato e DDD', () => {
  assert.ok(valido('telefone', '(84) 98765-4321'));
  assert.ok(valido('telefone', '(11) 3000-0000'));
  assert.match(REGRAS.telefone('(00) 98765-4321'), /DDD/);
});

test('data de nascimento: idade mínima de 16 anos', () => {
  assert.ok(valido('nascimento', '1990-05-10'));
  const anoPassado = new Date().getFullYear() - 1;
  assert.match(REGRAS.nascimento(anoPassado + '-01-01'), /16 anos/);
  assert.match(REGRAS.nascimento('2999-01-01'), /inválida/);
});

test('CEP e campos obrigatórios', () => {
  assert.ok(valido('cep', '01310-100'));
  assert.ok(!valido('cep', '01310100'));
  assert.ok(!valido('cidade', ''));
  assert.ok(!valido('termos', false));
  assert.ok(valido('termos', true));
});
