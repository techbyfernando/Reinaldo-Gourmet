# Revisao visual e responsiva — 30/08/2026

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
