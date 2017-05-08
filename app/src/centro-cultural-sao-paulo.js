const Crawler = require('crawler');

const init = () => {
  return new Promise((resolve, reject) => {
    var c = new Crawler({
      maxConnections : 10,
      callback : function (error, res, done) {
          if(error){
              reject(error);
          }else{
              var $ = res.$;
              const eventosFormatados = [];
              const eventosHtml = $(".P");
              for (var i = 0, length = eventosHtml.length; i < length - 1; i++) {
                  const evento = eventosHtml[i];

                  let artista = $(evento).find(".h2").text().trim();
                  const termoCancelado = 'CANCELADO';
                  const artistaFoiCancelado = artista.indexOf(termoCancelado) > -1;
                  if(artistaFoiCancelado){
                      artista = artista.replace(termoCancelado,'').replace('-','').trim()
                  }

                  const informacao =
                    $(evento).find(".vermelho").text().trim().split('-')
                  const data = informacao[0].replace('dia','').trim();
                  const horario = informacao[2].trim();

                  const conteudoQuePossuiPreco =
                    $(evento).find("#P").text().trim();
                  const indicePreco = conteudoQuePossuiPreco.indexOf('R$');
                  let inteira = 'grátis';
                  if (indicePreco > -1 ) {
                    inteira = conteudoQuePossuiPreco
                      .substring(indicePreco,indicePreco + 7);
                  }

                  eventosFormatados.push({
                    artista,
                    data,
                    horario,
                    preco: {
                      inteira
                    },
                    cancelado: artistaFoiCancelado
                  });
              }

              resolve({
                local: 'Centro Cultural São Paulo',
                eventos: eventosFormatados
              });
              done();
          }
      }
    });

    c.queue('http://www.centrocultural.sp.gov.br/programacao_musica_1.html');
  });
}

module.exports = {
  init
};
