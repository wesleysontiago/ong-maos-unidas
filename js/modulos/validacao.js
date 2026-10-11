// =========================================================
// validacao.js — VALIDAÇÃO DO FORMULÁRIO (regras + estados visuais)
// Não sabe o que acontece depois do envio: avisa quem chamou
// através do callback "aoEnviarValido" (baixo acoplamento).
// - Valida ao sair do campo (focusout) e corrige em tempo real (input)
// - No envio (submit) confere tudo e mostra um resumo dos erros
// - Marca o campo com .campo--erro / .campo--sucesso e injeta
//   uma mensagem <span class="mensagem-erro"> logo abaixo dele
// =========================================================
import { cpfValido } from './mascaras.js';

export const REGEX = {
  nome:     /^[A-Za-zÀ-ÿ'-]+(\s+[A-Za-zÀ-ÿ'-]+)+$/, // nome + sobrenome (aceita hífen e apóstrofo)
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,       // algo@dominio.com
  cpf:      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,         // 000.000.000-00
  telefone: /^\([1-9]\d\) \d{4,5}-\d{4}$/,        // DDD de 11 a 99 + fixo ou celular
  cep:      /^\d{5}-\d{3}$/                        // 00000-000
};

// Calcula a idade a partir de "aaaa-mm-dd"
function calcularIdade(data) {
  const hoje = new Date();
  const nasc = new Date(data + 'T00:00:00');
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

// Cada regra devolve '' (válido) ou a mensagem de erro
export const REGRAS = {
  nome: function (v) {
    if (!v) return 'Informe seu nome completo.';
    if (!REGEX.nome.test(v)) return 'Digite nome e sobrenome, usando apenas letras.';
    return '';
  },
  email: function (v) {
    if (!v) return 'Informe seu e-mail.';
    if (!REGEX.email.test(v)) return 'E-mail inválido. Exemplo: nome@exemplo.com';
    return '';
  },
  cpf: function (v) {
    if (!v) return 'Informe seu CPF.';
    if (!REGEX.cpf.test(v)) return 'CPF incompleto. Use o formato 000.000.000-00.';
    if (!cpfValido(v)) return 'CPF inválido. Confira os números digitados.';
    return '';
  },
  telefone: function (v) {
    if (!v) return 'Informe um telefone para contato.';
    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(v)) return 'Telefone incompleto. Use (00) 00000-0000.';
    if (!REGEX.telefone.test(v)) return 'DDD inválido. Confira os dois primeiros números.';
    return '';
  },
  nascimento: function (v) {
    if (!v) return 'Informe sua data de nascimento.';
    const idade = calcularIdade(v);
    if (idade < 0 || idade > 120) return 'Data de nascimento inválida.';
    if (idade < 16) return 'É preciso ter pelo menos 16 anos.';
    return '';
  },
  cep: function (v) {
    if (!v) return 'Informe seu CEP.';
    if (!REGEX.cep.test(v)) return 'CEP incompleto. Use o formato 00000-000.';
    return '';
  },
  endereco: function (v) {
    if (!v) return 'Informe seu endereço.';
    if (v.length < 5) return 'Endereço muito curto. Inclua rua e número.';
    return '';
  },
  cidade: function (v) { return v ? '' : 'Informe sua cidade.'; },
  estado: function (v) { return v ? '' : 'Selecione seu estado.'; },
  participacao: function (v) { return v ? '' : 'Escolha como deseja participar.'; },
  termos: function (v) { return v ? '' : 'É preciso aceitar os termos para continuar.'; }
};

// Lê o valor conforme o tipo do campo
function lerValor(campo) {
  if (campo.type === 'checkbox') return campo.checked;
  if (campo.type === 'radio') {
    const marcado = campo.form.querySelector('[name="' + campo.name + '"]:checked');
    return marcado ? marcado.value : '';
  }
  return campo.value.trim();
}

// Onde a classe de estado e a mensagem devem ficar
function alvoVisual(campo) {
  if (campo.type === 'radio') return campo.closest('fieldset');
  return campo;
}
function pontoDaMensagem(campo) {
  if (campo.type === 'radio') return campo.closest('fieldset').lastElementChild;
  if (campo.type === 'checkbox') return campo.closest('.opcao') || campo;
  return campo;
}

// Aplica o estado visual (erro ou sucesso) e injeta/remove a mensagem
function mostrarEstado(campo, erro) {
  const alvo = alvoVisual(campo);
  const idMensagem = 'erro-' + campo.name;
  let mensagem = document.getElementById(idMensagem);
  const grupo = campo.type === 'radio'
    ? campo.form.querySelectorAll('[name="' + campo.name + '"]')
    : [campo];

  if (erro) {
    alvo.classList.add('campo--erro');
    alvo.classList.remove('campo--sucesso');
    if (!mensagem) {
      mensagem = document.createElement('span');
      mensagem.id = idMensagem;
      mensagem.className = 'mensagem-erro';
      pontoDaMensagem(campo).insertAdjacentElement('afterend', mensagem);
    }
    mensagem.textContent = erro;
    grupo.forEach(function (c) {
      c.setAttribute('aria-invalid', 'true');
      c.setAttribute('aria-describedby', idMensagem);
    });
  } else {
    alvo.classList.remove('campo--erro');
    if (campo.type !== 'checkbox') alvo.classList.add('campo--sucesso');
    if (mensagem) mensagem.remove();
    grupo.forEach(function (c) {
      c.removeAttribute('aria-invalid');
      c.removeAttribute('aria-describedby');
    });
  }
}

// Valida um campo e devolve true/false
function validarCampo(campo) {
  const regra = REGRAS[campo.name];
  if (!regra) return true;
  const erro = regra(lerValor(campo));
  mostrarEstado(campo, erro);
  return !erro;
}

// Resumo de erros no topo do formulário (alerta)
function mostrarResumo(form, quantidade) {
  let resumo = form.querySelector('.resumo-erros');
  if (quantidade === 0) { if (resumo) resumo.remove(); return; }
  if (!resumo) {
    resumo = document.createElement('div');
    resumo.className = 'alerta alerta--erro resumo-erros';
    resumo.setAttribute('role', 'alert');
    resumo.innerHTML = '<span class="alerta__icone" aria-hidden="true">&times;</span><p></p>';
    form.prepend(resumo);
  }
  resumo.querySelector('p').textContent = quantidade === 1
    ? 'Há 1 campo para corrigir. Ele está destacado em vermelho.'
    : 'Há ' + quantidade + ' campos para corrigir. Eles estão destacados em vermelho.';
}

export function limparEstados(form) {
  form.querySelectorAll('.campo--erro, .campo--sucesso').forEach(function (el) {
    el.classList.remove('campo--erro', 'campo--sucesso');
  });
  form.querySelectorAll('.mensagem-erro, .resumo-erros').forEach(function (el) { el.remove(); });
  form.querySelectorAll('[data-tocado]').forEach(function (el) { delete el.dataset.tocado; });
  form.querySelectorAll('[aria-invalid]').forEach(function (el) {
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  });
}

export function iniciarValidacao(form, opcoes) {
  if (!form || form.dataset.validacao) return;
  const aoEnviarValido = (opcoes && opcoes.aoEnviarValido) || function () {};
  form.dataset.validacao = 'ativa';
  form.setAttribute('novalidate', ''); // o JS assume as mensagens (sem JS, vale a validação nativa)

  // Ao sair de um campo já preenchido: valida (delegação no formulário)
  form.addEventListener('focusout', function (e) {
    const campo = e.target;
    if (campo.name && campo.dataset.tocado) validarCampo(campo);
  });

  // Enquanto digita: marca como "tocado" e, se já havia erro, revalida na hora
  form.addEventListener('input', function (e) {
    const campo = e.target;
    if (!campo.name) return;
    campo.dataset.tocado = 'sim';
    if (alvoVisual(campo).classList.contains('campo--erro')) validarCampo(campo);
  });

  // Seleções, rádios, caixas e datas: valida na mudança
  form.addEventListener('change', function (e) {
    if (e.target.name) { e.target.dataset.tocado = 'sim'; validarCampo(e.target); }
  });

  // Envio: valida tudo
  let acabouDeEnviar = false; // evita que um 2º clique valide o formulário já limpo
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (acabouDeEnviar) return;
    const nomes = new Set();
    const campos = Array.from(form.elements).filter(function (c) {
      if (!REGRAS[c.name] || nomes.has(c.name)) return false;
      nomes.add(c.name);
      return true;
    });

    const invalidos = campos.filter(function (c) { return !validarCampo(c); });
    mostrarResumo(form, invalidos.length);

    if (invalidos.length > 0) {
      invalidos[0].focus();                 // leva o usuário ao primeiro erro
      return;
    }
    acabouDeEnviar = true;
    setTimeout(function () { acabouDeEnviar = false; }, 1500);
    aoEnviarValido(form);   // quem iniciou a validação decide o que fazer
  });

  form.addEventListener('reset', function () { limparEstados(form); });
}

