# Otimizacao e retorno da entrada original

Verificação local em 3 de setembro de 2026.

## Alteracoes

- Removida a abertura experimental: máscara, inicialização, controlador e dependência GSAP. Hero, título e botões ficam disponíveis imediatamente, como antes. O vídeo 1080p e as imagens aprovadas não foram reeditados.
- Fontes Cormorant Garamond e Manrope servidas pelo próprio site, em WOFF2, com suas licenças OFL. Eliminadas as dependências de carregamento do Google Fonts; fontes usadas no primeiro quadro e poster adequado à largura recebem prioridade.
- Lenis mantido em uma única atualização por quadro. Inércia da roda ajustada de 0,10 para 0,12 para reduzir a demora ao acompanhar novos gestos. Deslocamentos por links levam entre 0,55 e 1,2 segundo, com desaceleração progressiva e sem travar a rolagem.
- Preservados toque nativo, campos de formulário, navegação por teclado, foco, histórico e preferência por movimento reduzido. Corrigida a interrupção de um clique muito cedo pelo evento inicial de exibição da página. Ao ocultar a aba, não fica uma viagem de navegação pendente.
- Cabeçalho só altera sua classe ao mudar de estado, em vez de escrever no DOM a cada evento de rolagem. Removido o desfoque dinâmico do cabeçalho quase opaco. O carrossel solicita a camada gráfica adicional apenas enquanto está em movimento.
- A publicação inclui somente as variantes de mídia referenciadas pelo site. São 61 arquivos de mídia, com 37.998.090 bytes, em vez de 94 com 51.603.285 bytes. Redução de 13.605.195 bytes, cerca de 26,4% no conjunto de mídia publicado. Isso não equivale a 26,4% menos tempo de carregamento: muitas imagens já carregavam sob demanda. Os 94 arquivos originais continuam no projeto.
- Preservados identidade, fotos, textos, biografia integral, parceiros, temas, carrossel contínuo e formulário. Nenhum rastreador ou efeito novo foi adicionado.

## Verificacao realizada

- Build concluído e sintaxe JavaScript válida.
- 33 testes automatizados Node aprovados, incluindo integridade da biografia, mídia referenciada, temas, vídeo, carrossel, fontes locais, formulário, foco e histórico.
- 12 testes em Chrome real isolado, controlado por Playwright, aprovados. Incluem entrada sem máscara, clique imediato, falta ou atraso do Lenis, JavaScript desabilitado, movimento reduzido, economia de dados, menu móvel, formulário sem envio, histórico, vídeo, carrossel e roda do mouse com inversão de direção.
- Matriz de larguras 320, 390, 768, 1024, 1440 e 1920 pixels nos temas escuro e claro, sem transbordamento horizontal nos testes. Capturas desktop e móvel inspecionadas visualmente.
- Recursos próprios da página carregaram localmente. O computador injeta tráfego de seu antivírus no navegador; essa proteção não foi modificada e seu tráfego é distinguido dos recursos do site no teste.

## Reproducao e limites

Use `npm run build` e `npm test`. Para os testes de interface, instale `tests/requirements.txt`, mantenha a prévia local em `http://127.0.0.1:4173/` e execute `python tests/browser.test.py`. O teste aceita somente endereço local e não envia mensagens reais.

As capturas ficam em `.tools/browser-checks/chrome/`, fora da publicação. Os testes não substituem conferência em aparelhos físicos iPhone e Android. Não foram medidos Core Web Vitals de usuários reais, FPS em aparelhos físicos nem percentuais de ganho de conversão. O registro de publicação, quando concluído, pertence ao histórico do Sites e não é inferido a partir deste relatório local.
