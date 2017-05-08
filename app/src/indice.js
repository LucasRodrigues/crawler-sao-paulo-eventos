const centroCulturalSaoPaulo = require('./centro-cultural-sao-paulo.js')
const auditorioIbirapueraOscarNiemeyer = require('./auditorio-ibirapuera-oscar-niemeyer.js')


const rodar = async () => {
  const lugares = [
    centroCulturalSaoPaulo,
    auditorioIbirapueraOscarNiemeyer
  ];
  let eventosCompletos = 0;

  console.log('Começando a leitura dos sites');
  for(const lugar of lugares) {
    const eventosDoLugar = await lugar.init();
    eventosCompletos++;
    console.log(eventosDoLugar.local);
    console.log(eventosDoLugar.eventos.length);
    console.log('#'.repeat(eventosCompletos)
      + '='.repeat(lugares.length - eventosCompletos)
      + ((eventosCompletos/lugares.length) * 100) + '%' );
  }
  console.log('Terminando a leitura dos sites');
}

rodar()
