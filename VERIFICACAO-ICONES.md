# Revisao de icones e formulario

Data: 3 de setembro de 2026.

## Resultado local

Build concluído. 34 testes Node e 14 testes Chrome passaram.
A falha anterior de importação do Playwright era uma restrição de acesso do sandbox à instalação existente. A execução autorizada fora do sandbox funcionou, sem reinstalar dependências.

Cobertura: entrada direta, links internos, histórico e foco, menu móvel, temas, ausência de JavaScript, Lenis indisponível ou lento, movimento reduzido, economia de dados, vídeo, ciclo do carrossel, teclado, FAQ e recursos locais. Matriz de larguras: 320, 390, 768, 1024, 1440 e 1920 px nos dois temas, sem transbordamento horizontal detectado.

SVGs decorativos conferidos com aria-hidden, sem foco e sem glifos Unicode de sol/lua/setas. Alternância dos dois ícones testada no navegador.

## Campos e regras

- Nome e cidade: obrigatórios, até 100 caracteres; corrigida aceitação de conteúdo composto somente por espaços.
- Tipo: somente Eventos Particulares e Eventos Corporativos.
- Data: opcional; mínimo calculado pela data local, datas passadas rejeitadas.
- Convidados: obrigatório, inteiro a partir de 1; zero, negativos e frações rejeitados.
- Menu: opcional, seleção existente preservada, incluindo preenchimento por links de cardápios.
- Detalhes: opcional, até 1200 caracteres.
- WhatsApp: número conferido no código e destino interceptado no teste; todos os campos e caracteres especiais preservados na mensagem. Nenhuma mensagem enviada.
- Sem banco de dados ou reserva automática: disponibilidade e orçamento continuam sujeitos à conversa com o chef.
- Corrigida menção desatualizada ao Google Fonts na nota de privacidade: as fontes são locais.

## Latencia e publicacao

Caminho crítico: interação -> validação nativa -> montagem e codificação da mensagem -> navegação ao WhatsApp. Não há API intermediária. Ícones SVG locais dispensam download de biblioteca ou fonte de ícones.

Uma consulta de leitura ao site publicado retornou HTTP 200, x-vercel-cache HIT e cache-control public, max-age=0, must-revalidate. Tempo observado até cabeçalhos e conclusão: aproximadamente 268 ms nesta máquina. Trata-se de uma amostra, não de p95/p99, tempo de renderização ou garantia de desempenho móvel.

A versão publicada ainda contém os símbolos Unicode e não contém os novos SVGs. Não houve commit, push ou deploy nesta revisão.

## Limites

Testes realizados no Chrome de computador com variação de viewport, não em aparelhos físicos iPhone/Android ou Safari. Contatos de parceiros, disponibilidade real, autorização de depoimentos e números institucionais não foram reconfirmados com os responsáveis nesta rodada. Não foi realizado teste de carga ou envio real ao WhatsApp.
