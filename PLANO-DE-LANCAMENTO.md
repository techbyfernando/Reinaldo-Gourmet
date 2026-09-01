# Plano de lancamento e evolucao

Este documento separa o que ja esta pronto, o que deve acontecer no lancamento oficial e o que depende de materiais, acessos ou aprovacoes do proprietario.

## Estado atual

- A nova landing page esta publicada em um endereco de apresentacao, com acesso privado.
- O dominio `reinaldoquoos.com.br` continua servindo o site anterior.
- A pagina de apresentacao nao possui Google Analytics, Meta Pixel, Google Tag Manager ou outros pixels publicitarios.
- O Google Fonts e um recurso externo. Portanto, a descricao correta e "sem rastreadores publicitarios e ferramentas de analise", nao "sem scripts de terceiros".
- A preferencia de tema fica apenas no navegador do visitante.
- A pagina nao apresenta a alegacao `+150 empresas`.
- Os numeros institucionais visiveis sao 2009, como ano de inicio da Gourmet at Home, e 46 anos, dentro da biografia fornecida. Ambos devem ser confirmados com Reinaldo antes do lancamento.

## Decisao editorial dos titulos

Titulos e chamadas curtas foram apresentados sem acentos por uma diretriz visual solicitada durante o desenvolvimento. Os textos corridos usam a acentuacao normal da lingua portuguesa.

Essa escolha deve ser explicada como uma preferencia editorial da proposta e aprovada por Reinaldo. Nao deve ser apresentada como necessidade tecnica, melhoria de compatibilidade ou regra de sites premium. Se nao houver uma diretriz oficial da marca, a recomendacao linguistica e restaurar os acentos tambem nos titulos.

## Estrategia recomendada para o dominio

### Primeira fase

1. Publicar a nova landing page como pagina inicial do dominio oficial.
2. Preservar temporariamente blog, politica de privacidade, depoimentos, galerias e paginas detalhadas de cardapio.
3. Medir acessos organicos e consultar o Google Search Console antes de excluir qualquer URL antiga.
4. Atualizar visualmente as paginas internas em uma segunda fase ou incorporar seu conteudo na nova estrutura.

Essa abordagem reduz o risco de perder paginas indexadas, links recebidos e conteudo que ainda possa gerar visitas.

### Mapa inicial de URLs

| URL anterior | Destino recomendado | Condicao |
| --- | --- | --- |
| `/` | Nova landing page | No lancamento |
| `/a-cozinha/` | `/#experiencia` | Redirecionar quando o conteudo antigo estiver representado na nova pagina |
| `/o-gourmet/` | `/#chef` | Redirecionar depois da conferencia final da biografia |
| `/galeria/` | Manter inicialmente; depois `/#galeria` | Conferir trafego e imagens exclusivas |
| `/galeria/eventos-particulares/casamentos/` | Manter inicialmente; depois `/#cardapios` | Incorporar conteudo relevante antes do redirecionamento |
| `/galeria/eventos-particulares/aniversarios/` | Manter inicialmente; depois `/#cardapios` | Incorporar conteudo relevante antes do redirecionamento |
| `/galeria/eventos-particulares/comemoracoes/` | Manter inicialmente; depois `/#cardapios` | Incorporar conteudo relevante antes do redirecionamento |
| `/galeria/eventos-particulares/festas-tematicas/` | Manter inicialmente; depois `/#cardapios` | Incorporar conteudo relevante antes do redirecionamento |
| `/galeria/eventos-corporativos/formaturas/` | Manter inicialmente; depois `/#corporativo` | Conferir trafego e conteudo exclusivo |
| `/galeria/eventos-corporativos/reuniao-de-negocios/` | Manter inicialmente; depois `/#corporativo` | Conferir trafego e conteudo exclusivo |
| `/galeria/eventos-corporativos/treinamento-confraternizacao/` | Manter inicialmente; depois `/#corporativo` | Conferir trafego e conteudo exclusivo |
| `/galeria/eventos-corporativos/happy-hour/` | Manter inicialmente; depois `/#corporativo` | Conferir trafego e conteudo exclusivo |
| `/menu/` e paginas de cardapio | Manter inicialmente; depois `/#cardapios` | Nao eliminar paginas indexadas antes da analise |
| `/galeria/depoimentos/` | Manter ate existir `/#depoimentos` | Migrar relatos autorizados primeiro |
| `/contato/` | `/#contato` | No lancamento |
| `/blog/` e seus artigos | Manter | Preserva conteudo e potencial organico |
| `/politica-de-privacidade/` | Manter ou recriar no novo projeto | Obrigatorio revisar antes de instalar rastreadores |

Os redirecionamentos definitivos devem usar HTTP 301 e ser testados individualmente. Antes da mudanca, deve ser exportada uma lista completa das URLs indexadas no Search Console e no sitemap antigo; o menu do site nao representa necessariamente todas as paginas existentes.

## SEO e compartilhamento no lancamento

Somente quando a nova pagina responder pelo dominio oficial:

- Alterar `og:image` para `https://www.reinaldoquoos.com.br/assets/media/hero-1920.webp`.
- Adicionar canonical para `https://www.reinaldoquoos.com.br/`.
- Adicionar `og:url` com o mesmo endereco canonico.
- Definir se a versao oficial sera com `www` e redirecionar a outra variante.
- Confirmar que a imagem social responde publicamente e possui proporcao adequada.
- Atualizar sitemap e solicitar nova indexacao no Google Search Console.
- Verificar titulo, descricao, dados estruturados e previa de compartilhamento.

Apontar canonical e `og:image` para o dominio oficial antes de a pagina existir nesse endereco produziria sinais inconsistentes e nao deve ser feito.

## Depoimentos e prova social

A nova secao deve ser criada quando houver de tres a cinco relatos autorizados. Para cada depoimento, solicitar:

- Texto final aprovado pelo cliente.
- Nome ou forma de identificacao autorizada.
- Tipo e ano do evento.
- Fotografia autorizada, quando disponivel.
- Autorizacao separada para uso de nome, imagem e marca empresarial.

Local recomendado: depois de "Como funciona" ou imediatamente antes do formulario. Nao usar depoimentos inventados, fotos genericas ou logos sem permissao.

## Parceiros

Os links publicos devem ser revisados a cada tres meses e tambem antes de campanhas. Registrar data da conferencia, responsavel e resultado.

Na versao atual:

- Casa da Nina usa o perfil de Facebook informado.
- Chacara do Jua direciona o visitante para consultar o contato com Reinaldo; nenhum endereco externo nao confirmado e exibido.
- Museu da Imaginacao usa o dominio `.org.br` e o perfil de Facebook informado.

## Metricas e conversao

Nao instalar ferramentas apenas para "ter analytics". Primeiro definir quais perguntas precisam ser respondidas. Eventos recomendados:

- Clique em "Criar meu evento".
- Inicio do formulario.
- Escolha entre evento particular e corporativo.
- Clique em "Continuar no WhatsApp".
- Clique nos demais atalhos de WhatsApp.
- Clique no Instagram.
- Interesse em cada formato de cardapio.

O evento "Continuar no WhatsApp" mede intencao de contato, nao confirma que a mensagem foi enviada. Nomes, telefones, datas, cidade, quantidade de convidados e detalhes do formulario nao devem ser enviados ao Analytics ou ao Pixel.

Para campanhas, solicitar antes da implementacao:

- ID do Google Tag Manager ou Google Analytics 4.
- ID do Meta Pixel e acesso ao Business Manager.
- Definicao das conversoes e nomenclatura dos eventos.
- URLs e parametros UTM das campanhas.

## Consentimento e privacidade

Enquanto nao houver rastreadores nao essenciais, nao deve ser exibido um banner de consentimento ficticio. Quando Analytics, Meta Pixel ou outras tecnologias forem instaladas:

1. Escolher uma plataforma de consentimento adequada a LGPD.
2. Bloquear tags nao essenciais antes da escolha do visitante.
3. Permitir aceitar, recusar e revisar preferencias.
4. Atualizar a politica de privacidade com finalidades, fornecedores e prazos.
5. Testar consentimento em navegacao anonima e nos principais navegadores.
6. Implementar Google Consent Mode somente se fizer parte da estrategia aprovada.

## Verificacao em aparelhos fisicos

Antes de campanhas e da troca do dominio, executar a ultima rodada em aparelhos reais:

| Plataforma | Verificacoes |
| --- | --- |
| iPhone / Safari | Video, menu, carrossel, tema, seletores, teclado, formulario e abertura do WhatsApp |
| Android / Chrome | Video, menu, carrossel, tema, seletores, teclado, formulario e abertura do WhatsApp |
| Conexao movel limitada | Poster antes do video, tempo de carregamento, estabilidade e consumo de dados |
| Orientacao horizontal | Cabecalho, abertura, imagens e formulario |

Registrar modelo, versao do sistema, navegador, data e resultado. Os testes feitos ate agora usam janelas simuladas do navegador e nao substituem essa rodada fisica.

## Dependencias para concluir o lancamento

- Aprovacao expressa de Reinaldo sobre textos, numeros institucionais e titulos sem acentos.
- Acesso ao DNS e a hospedagem do dominio oficial.
- Exportacao do sitemap e dados do Google Search Console.
- Decisao sobre blog, galerias, depoimentos e paginas de cardapio.
- Depoimentos e autorizacoes, caso a secao seja incluida no lancamento.
- IDs e acessos das plataformas de anuncios, caso existam campanhas.
- Responsavel pela politica de privacidade e pelo consentimento.
- Dois aparelhos fisicos para a verificacao final.
