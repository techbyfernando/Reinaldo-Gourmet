# Revisao visual e responsiva — 30/08/2026

## Titulos sem numeracao — 01/09/2026 (revisao 9)

Removidas as numeracoes decorativas das chamadas de secao, dos cartoes de cardapio, das etapas do atendimento, dos formatos corporativos e dos parceiros. Datas, quantidades informativas e a numeracao acessivel do carrossel foram preservadas. O antigo titulo "02 Experiencias" passou a se chamar "Cardapios", em coerencia com o conteudo e com a navegacao principal.

Os espacamentos que dependiam dos numeros foram recalibrados para que titulos, descricoes e divisorias continuem alinhados nos temas claro e escuro. O CSS recebeu uma nova versao de cache. No navegador integrado, os dois temas ficaram sem transbordamento horizontal e sem qualquer indice decorativo remanescente. Os dezenove testes automatizados passaram.

## Linhas da abertura e campo de evento — 01/09/2026 (revisao 8)

Removidos exclusivamente o traco horizontal sob "Conhecer a experiencia" e o traco vertical ao lado de "2009". Os demais separadores e detalhes graficos da pagina foram preservados. O seletor "Tipo de evento" recebeu o mesmo dimensionamento, alinhamento e acabamento dos outros campos, com seta propria consistente entre navegadores.

Na verificacao mobile integrada, o campo ficou com 46,4 pixels de altura e exatamente os mesmos limites horizontais do campo de nome. As duas bordas solicitadas mediram zero pixel, sem transbordamento horizontal. O formulario apareceu normalmente ao entrar na secao. CSS e JavaScript receberam uma nova versao de cache para impedir que navegadores que ja visitaram o site misturem arquivos antigos com a pagina atual. Os dezoito testes automatizados passaram.

## Reproducao sem controles de pausa — 01/09/2026 (revisao 7)

Removidos integralmente os controles de pausa e reproducao do video e do carrossel, incluindo marcacao HTML, estilos e eventos JavaScript associados. O texto "Cozinha movel personalizada" tambem foi removido da abertura. O video continua automatico, silencioso e em loop. O carrossel nao para mais por hover, foco ou arraste; o gesto de arraste foi removido. As setas continuam disponiveis e, depois da transicao manual, o movimento continuo e retomado automaticamente. Aba oculta, conteudo fora da tela, preferencia de movimento reduzido e economia de dados continuam suspendendo processamento sem oferecer um controle de pausa na interface.

No navegador, confirmados zero controles de pausa, ausencia do texto solicitado e video em reproducao. Com o cursor mantido sobre o carrossel por 1,1 segundo, a faixa avancou de 4,5322 para 44,1966 pixels e permaneceu marcada como ativa. Depois da seta, avancou novamente de 548,679 para 580,414 pixels. Os dezessete testes automatizados passaram, incluindo ausencia dos controles e continuidade por hover, foco e navegacao manual.

## Substituicao pelo novo video Full HD — 31/08/2026 (revisao 6)

Substituido o video anterior pelo novo arquivo `Chef_plating_dish_for_video_202608311708.mp4`, confirmado em 1920 x 1080, 24 fps e oito segundos. O fundo desktop usa esta nova filmagem em Full HD. A entrega mobile deriva dela em 1280 x 720, para reduzir transferencia de dados. Ambos sao silenciosos e possuem inicio progressivo; os posters tambem foram extraidos do novo arquivo. Os nomes dos arquivos mudaram para evitar a exibicao da versao anterior em cache.

No navegador, confirmados arquivo e resolucao desktop 1920 x 1080 em janela de 1440 pixels, entrega mobile 1280 x 720 em janela de 390 pixels, reproducao automatica sem som, loop e modo inline. Observado um ciclo completo, alem de pausa e retomada pelos controles. Sem transbordamento horizontal nas duas verificacoes. Os dezessete testes automatizados passaram, agora incluindo explicitamente a escolha do arquivo mobile. Carrossel, logos, temas, conteudo e categorias de evento permaneceram inalterados. Testes em janelas simuladas, nao em aparelhos fisicos.

Esta revisao substitui a filmagem e as resolucoes de video descritas no historico abaixo.

## Faixa continua e novas midias — 31/08/2026 (revisao 5)

O carrossel agora e uma faixa de seis fotografias com movimento continuo para a esquerda a 34 pixels por segundo. Uma segunda sequencia identica, fora da arvore de acessibilidade e sem foco, permite a passagem do fim ao inicio. A flutuacao suave de cada cartao usa a mesma fase nas duas sequencias. Os controles anterior/proximo fazem uma transicao suave; tambem ha pausa, teclado e arraste horizontal. Hover, foco, aba oculta e secao fora de vista interrompem o movimento intencionalmente. Movimento reduzido e economia de dados impedem o inicio automatico. Sem JavaScript, as fotos permanecem disponiveis em uma faixa com rolagem nativa.

As fotos originais foram preservadas. O enquadramento dos cartoes agora usa `object-fit: cover`, sem barras laterais, com legendas em uma area de altura consistente. Removidos os indicadores de pagina e a faixa redundante de atributos. Removidos tambem o indicador "Role para descobrir", sua linha, dominios inativos e notas desatualizadas dos parceiros. O formulario oferece somente "Eventos Particulares" e "Eventos Corporativos", e todos os atalhos preenchem categorias validas.

Nova logo do cabecalho: PNG fornecido em 1536 x 1024, com copia integral identica e variantes de 192/384 pixels, sem recorte, redesenho ou alteracao de cores. A caixa da logo respeita proporcao e limites do cabecalho nos dois temas. O PNG do rodape e a historia integral do chef foram mantidos.

Video substituido pelo arquivo `Chef_plating_dish_for_video_202608311501.mp4`, nativo de 1280 x 720, 24 fps e oito segundos. Desktop preserva o fluxo de video sem recodificacao; celular recebe 960 x 540. O audio foi removido para uso como fundo silencioso. Novos posters foram extraidos do novo video. Mantidos loop, reproducao inline, pausa, preferencias de movimento/economia de dados e suspensao fora da tela. SHA256 do fluxo visual original e da entrega desktop coincidem: `2e465998c753855e4f7bea5e17fc3ef804549a5c34f570a5fa6d966f68caf58c`. Nao houve retoque nem ampliacao para 4K.

### Verificacao desta revisao

Dezessete testes automatizados passaram, incluindo dois ciclos completos sem variacao de velocidade, navegacao manual com suavizacao, pausa, foco, arraste, preservacao de progresso no redimensionamento, categorias do formulario, biografia e controles existentes. No navegador foram coletadas 140 amostras do movimento: a transicao de 2289,07 para 3,30276 pixels, em uma faixa de 2292 pixels, manteve o deslocamento esperado. A flutuacao da foto original e de sua copia coincidiu em todas as amostras. Todas as doze imagens da faixa carregaram. Confirmados avanco manual e movimento automatico tambem na janela mobile.

Verificados ambos os temas nas larguras efetivamente reportadas de 320, 390, 560, 700, 702, 768, 1024, 1100, 1102, 1440, 1920, 2560 e 3840 pixels: sem transbordamento horizontal da pagina ou dos blocos principais, sem corte das legendas e com a logo dentro do cabecalho. Inspecionadas capturas da abertura clara desktop/mobile e dos cartoes escuros desktop/claros mobile. Reproducao, pausa e retomada do video, abertura/fechamento do menu mobile e preenchimento corporativo foram conferidos sem envio do formulario.

Os testes de viewport foram feitos no navegador integrado, nao em aparelhos fisicos ou em uma matriz de diferentes motores. As verificacoes abaixo registram o historico anterior; a revisao 5 substitui o comportamento do carrossel e o video descritos nelas.

## Atualizacao de conteudo e carrossel — 31/08/2026

Substituida a antiga composicao da panela por um carrossel com as seis fotografias fornecidas. As imagens sao exibidas integralmente, sem recorte ou nova edicao. O primeiro quadro mostra a feijoada sendo servida. Avanco automatico a cada sete segundos, botoes anterior/proximo, selecao direta, pausa, teclado e gesto horizontal. A rotacao para ao interagir, receber foco, ficar fora da tela ou ocultar a aba. Movimento reduzido e economia de dados desativam o inicio automatico.

O rodape usa o PNG fornecido, com arquivo integral identico ao anexo e variantes menores em PNG. A base do rodape fica escura nos dois temas para preservar as letras claras da logo, sem caixa ou moldura individual. A historia do chef foi incluida em nove paragrafos e comparada com o texto integral fornecido. Hifens e travessoes foram removidos dos textos exibidos e descricoes acessiveis; URLs e codigo foram preservados.

Verificados no navegador os dois temas em 320, 390, 560, 700, 702, 768, 900, 1100, 1102, 1440 e 1920 px, sem transbordamento horizontal dos principais elementos, incluindo carrossel, biografia e parceiros. Inspecionados carrossel no desktop claro e celular escuro, parceiros no celular claro e biografia com fotografia fixa durante a leitura no desktop. Quatorze testes automatizados passaram, incluindo rotacao, pausa, foco, ocultacao, teclado, gestos, texto integral e preservacao dos controles existentes. Gestos e preferencia de movimento foram exercitados por simulacao automatizada, nao em aparelhos fisicos.

### Midia e limites desta atualizacao

Os anexos recebidos medem 1086 × 1448, 1448 × 1086 e 1386 × 1135 pixels; nao sao arquivos 4K nesta copia. Foram mantidos mestres WebP sem perdas na resolucao recebida, mais variantes menores para entrega. Nenhuma fotografia foi ampliada ou reconstruida nesta atualizacao.

O video foi preservado sem alteracao. As ferramentas de video disponiveis nao oferecem uma garantia de edicao localizada somente nas tatuagens mantendo todo o restante intacto; nao foi substituido por uma nova geracao. Integridade confirmada por SHA256 dos dois arquivos de entrega antes/depois:

- Desktop: `e57f6fa0af3246b7cbfc1b3e37951bb98782a24d750b512d2f5785c660e66c04`
- Celular: `d73493b6a8e1368d7b08528c7d4103490f0c9572cd4807a2244f614700146e72`

### Verificacao dos parceiros

- Casa da Nina: dominio fornecido sem resolucao DNS nas tentativas HTTP e HTTPS. Nome social mantido como fornecido. O endereco [facebook.com/casadanina123](https://www.facebook.com/casadanina123/) aparece em uma [entrevista sobre a propria Casa da Nina](https://clubedejazz.com/as-ressonancias-de-louise-woolley/). A disponibilidade atual do perfil nao foi confirmada pelo ambiente de teste; o dominio antigo nao virou um botao ativo.
- Chacara do Jua: dominio fornecido sem resolucao DNS. A [Secretaria de Turismo de Aruja](https://www.visitearuja.com.br/espaco_eventos) indica `chacaradojua.alboompro.com`, mas esse endereco exibiu "Website nao localizado" no navegador. Nao foi inventado um endereco de Facebook. Nome e dominio permanecem informativos, com caminho para consultar o contato com Reinaldo. O link atualizado foi solicitado ao usuario.
- Museu da Imaginacao: mantido o dominio oficial atual [.org.br](https://museudaimaginacao.org.br/), corroborado pela pagina institucional indexada. O Facebook [museudaimaginacao](https://www.facebook.com/museudaimaginacao/) e citado em [referencia publica](https://www.avivaescolainfantil.com.br/blog/museu-da-imaginacao-um-lugar-incrivel-para-as-criancas/). A tentativa ao vivo no site apresentou erro de conexao SSL; nao se afirma verificacao integral da disponibilidade externa.

As observacoes a seguir registram a revisao anterior e permanecem como historico.

## Ajustes entregues

- Logo simplificada fornecida no cabecalho; logo completa fornecida no rodape. Proporcoes e transparencia preservadas, com variantes menores para carregamento responsivo.
- Secao 01: fotos alinhadas em grade, sem posicionamento absoluto ou sobreposicoes. A panela ganhou uma composicao horizontal; as fotos empilham em telas de ate 700 px. Legendas e diferenciais acompanham o fluxo da pagina.
- Secao 05: titulo separado da galeria, quatro fotografias com proporcao consistente e legendas alinhadas. Duas colunas no desktop/tablet e uma em telas de ate 700 px.
- Tema claro: fundos, textos secundarios, detalhes dourados, botoes, campos, foco, menu e rodape revistos. A logo completa permanece sobre uma base escura para preservar a leitura do texto claro da marca.
- Espaco reservado entre chamadas e controle do video em celulares pequenos. Compensacao da navegacao por ancoras ajustada para o cabecalho fixo.

## Testes no navegador

Larguras verificadas nos dois temas: 320, 375, 390, 430, 560, 700, 702, 768, 900, 902, 1024, 1100, 1102, 1280, 1440, 1920 e 2560 px. Foram conferidos limites horizontais da pagina e dos principais blocos, alem de intersecoes entre fotos, legendas/diferenciais e cabecalho da galeria. Sem transbordamento horizontal ou sobreposicoes entre os elementos dessas duas secoes nas verificacoes finais.

Inspecao visual de capturas: experiencia em desktop escuro, galeria em desktop claro, experiencia e galeria em celular claro, menu/formulario/rodape em celular claro, experiencia em tablet escuro e abertura em 320 px. A verificacao em 320 px identificou proximidade entre o controle de video e a chamada; apos o ajuste, a distancia medida foi de 48 px.

Menu movel: abriu, exibiu os destinos e fechou ao navegar para o contato. Alternancia de tema e persistencia apos recarregar conferidas no navegador. Nenhuma mensagem ou formulario foi enviado a terceiros.

Contraste calculado para 171 elementos textuais por tema sobre fundos de cor uniforme: nenhuma amostra abaixo de 4,5:1 para texto normal ou 3:1 para texto grande. Menor razao medida: 5,39:1 no claro e 8,11:1 no escuro. Textos sobre fotografias, efeitos de transparencia, estados de interacao e placeholders nao integram essa contagem; a medicao nao constitui uma auditoria completa de acessibilidade.

## Verificacoes automatizadas

Oito testes passaram: integridade de titulos/ancoras/arquivos, alternancia e persistencia de tema, armazenamento indisponivel, controles do video, movimento reduzido/economia de dados, menu e Escape, escolha de menu/montagem de mensagem e correspondencia dos arquivos da versao de entrega.

## Limites

Os testes de tamanho foram feitos em janelas redimensionadas do navegador integrado. Nao foram testes fisicos em aparelhos iOS/Android nem uma matriz completa de Safari/Firefox/Chrome. Ainda e recomendavel uma rodada nesses aparelhos antes de campanhas. O video existente permanece Full HD. A nova foto da panela foi reconstruida por IA e ampliada para entrega em 3840 × 2560; nao e captura nativa 4K.
