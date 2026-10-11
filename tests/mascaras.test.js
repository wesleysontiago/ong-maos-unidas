// Testes das máscaras e do cálculo do CPF (funções puras, sem DOM)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mascaraCPF, mascaraTelefone, mascaraCEP, cpfValido } from '../js/modulos/mascaras.js';

test('máscara de CPF formata e ignora caracteres extras', () => {
  assert.equal(mascaraCPF('52998224725'), '529.982.247-25');
  assert.equal(mascaraCPF('CPF: 529.982.247-25 '), '529.982.247-25');
  assert.equal(mascaraCPF('5299822472599'), '529.982.247-25'); // corta no 11º dígito
});

test('máscara de telefone aceita fixo e celular', () => {
  assert.equal(mascaraTelefone('1130000000'), '(11) 3000-0000');
  assert.equal(mascaraTelefone('11987654321'), '(11) 98765-4321');
});

test('máscara de CEP', () => {
  assert.equal(mascaraCEP('01310100'), '01310-100');
});

test('CPF: dígitos verificadores', () => {
  assert.equal(cpfValido('529.982.247-25'), true);
  assert.equal(cpfValido('529.982.247-24'), false);
  assert.equal(cpfValido('111.111.111-11'), false); // todos iguais
  assert.equal(cpfValido('123'), false);
});
