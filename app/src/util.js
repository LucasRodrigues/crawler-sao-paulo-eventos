const mes = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'
]

const indiceMes = nomeMes => {
  return mes.indexOf(nomeMes) + 1;
}

const pegarNumerosEmTexto = texto => {
  return texto.match(/\d+/) || []
}

const simplificarLista = lista => {
  return [].concat.apply([], lista)
}

module.exports = {
  indiceMes,
  pegarNumerosEmTexto,
  simplificarLista
};
