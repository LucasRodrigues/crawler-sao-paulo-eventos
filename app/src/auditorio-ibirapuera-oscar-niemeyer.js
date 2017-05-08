const Crawler = require('crawler');
const util = require('../util.js')

const leituraDaPaginaDeEvento = (link) => {
  return new Promise((resolve, reject) => {
    var c = new Crawler({
      maxConnections : 10,
      callback : function (error, res, done) {
          if (error) {
              reject(error);
          } else {
            const $ = res.$;
            const informacoesDoEvento = $('.infoEvento p');

            const artista = $($('.post h2')[0]).text();

            const informacoesDeData = $(informacoesDoEvento[0]).text();
            const separarDatas = informacoesDeData.split(' e ');
            const datas = []
            if(separarDatas.length >  1){
              // [ 'sábado 13', 'domingo 14 de maio de 2017' ]
              const ultimaData = separarDatas[separarDatas.length -1];
              const informacaoUltimaData = ultimaData.split(' de ');
              const mes = util.indiceMes(informacaoUltimaData[1]);
              const ano = informacaoUltimaData[2];

              separarDatas.forEach(separarData => {
                const dia = separarData.match(/\d+/)[0]
                datas.push(`${dia}-${mes}-${ano}`)
              })
            } else {
              // ['domingo 7 de maio de 2017' ]
              const conteudo = separarDatas[0];
              const informacao = conteudo.split(' de ');
              const dia = informacao[0].replace(/^\D+/g, '');
              const mes = util.indiceMes(informacao[1]);
              const ano = informacao[2];
              datas.push(`${dia}-${mes}-${ano}`)
            }

            // sábado às 21h | domingo às 19h
            const informacoesHorario =  $(informacoesDoEvento[1]).text();
            const separarHorarios = informacoesHorario.split('|');
            const horarios = separarHorarios.map(horario => {
              return util.pegarNumerosEmTexto(horario)[0]
            });

            // R$ 20 e R$ 10 (meia-entrada)
            const informacoesPreco = $(informacoesDoEvento[3]).text();
            const separarPrecos = informacoesPreco.split('e ');
            const precos =  separarPrecos.map(preco => {
              return util.pegarNumerosEmTexto(preco)[0]
            });
            const inteira = precos[0] || 'gratuito';
            const meia = precos[1] || 'gratuito';

            const eventoFormatado = [];
            datas.forEach((data, index) => {
              eventoFormatado.push({
                artista,
                data,
                horario: horarios[index],
                preco:{
                  inteira,
                  meia
                }
              });
            })

            resolve(eventoFormatado);
          }

          done();
      }
    });

    c.queue(link);
  });
}

const init = () => {
  return new Promise((resolve, reject) => {
    var c = new Crawler({
      maxConnections : 10,
      callback : function (error, res, done) {
          if(error){
              console.log(error);
          }else{
            var $ = res.$;
            const linksDosEventos = $(".info");
            const linksParaCadaEvento = [];

            for (var i = 0, length=linksDosEventos.length; i < length -1; i++) {
              const linksDoEvento = linksDosEventos[i];
              const links = $(linksDoEvento).find('a');

              linksParaCadaEvento
                .push($(links.length > 1 ?  links[1] : links[0]).attr('href'))
            }

            let promises = [];
            linksParaCadaEvento.forEach(link => {
              promises.push(leituraDaPaginaDeEvento(link))
            });

            Promise.all(promises)
              .then(function (eventos) {
                resolve({
                  local: 'Auditório Ibirapuera Oscar Niemeyer',
                  eventos: util.simplificarLista(eventos)
                });
                done();
              });
          }
      }
    });

    c.queue('http://www.auditorioibirapuera.com.br/category/programacao/');
  })

}

module.exports = {
  init
};
