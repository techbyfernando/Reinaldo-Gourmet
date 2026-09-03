# Reinaldo Quoos Gourmet at Home
## Cinco caminhos para uma chegada memorável

Análise de 2 de setembro de 2026. As cinco cenas abaixo são propostas, ainda não implementadas. A alteração confirmada e executada nesta etapa é o Smooth Scroll.

## O que a página já comunica

A página tem uma base visual própria: fundo escuro, dourado da marca, tipografia editorial, pimenta no logotipo, vídeo de finalização de um prato e fotografias reais dos serviços. A cozinha aparece como parte de uma experiência de receber pessoas. O churrasco é importante, mas a oferta também inclui feijoada, coffee break, celebrações e eventos corporativos.

O título “Seu evento, a sua maneira.” e o botão “Criar meu evento” já estão disponíveis antes do vídeo carregar. Essa característica merece ser preservada. A chegada atual usa essencialmente a passagem do poster para o vídeo; não existe ainda uma cena de abertura com começo e fim próprios.

O principal cuidado é não criar a impressão de uma churrascaria convencional, nem transformar a página em uma vinheta publicitária. O diferencial a mostrar é a cozinha autoral que chega ao evento, com atenção ao preparo e ao serviço.

## Discussão criativa: três perspectivas imaginárias

Estas são lentes de discussão, não depoimentos nem pesquisas com clientes:

**Direção de marca:** a surpresa deve partir da comida, do gesto do chef ou da pimenta original. Fumaça artificial, partículas douradas e efeitos holográficos não acrescentam identidade.

**Hospitalidade:** o visitante precisa sentir que está sendo recebido. Mostrar uma mesa preparada ou a finalização de um prato pode comunicar cuidado melhor do que uma animação abstrata do logotipo.

**Conversão:** o efeito deve acontecer enquanto a pessoa entende a proposta. Título, navegação e botão permanecem visíveis e utilizáveis; nenhuma tela de espera, contagem ou obrigação de assistir.

Síntese: uma única transformação perceptível, com duração aproximada de um segundo, e uma composição estática igualmente boa quando o movimento não for adequado.

## 1. O gesto final

**O que é:** transformar o vídeo atual em uma pequena apresentação do prato. O enquadramento começa levemente aproximado e repousa na composição final, como se o chef acabasse de servir o visitante.

**Cena:** no primeiro quadro já aparecem poster, título, marca e botão. Durante cerca de 1,15 segundo, somente a camada visual passa de escala 1,025 para 1, com desaceleração suave. O vídeo assume seu funcionamento normal sem depender do término da cena. Não sincronizar a entrada com um gesto exato do vídeo, pois o tempo de carregamento varia.

**O que transmite:** cuidado, proximidade, alimento como protagonista e sofisticação discreta.

**Implementação:** GSAP básico; sem novas imagens, máscara complexa ou plugins extras. No celular, aproximação ainda menor ou estado estático para não cortar o prato.

**Ressalva:** é o caminho mais conservador. Um zoom de 2,5% pode ser percebido apenas como acabamento, sem produzir a surpresa forte solicitada.

## 2. Da brasa à mesa

**O que é:** uma narrativa breve que conecta o calor do preparo ao prazer de receber um prato pronto.

**Cena:** a área visual mostra um detalhe de brasas reais e transita para a finalização do prato em aproximadamente 1,5 segundo. O texto e o botão continuam fixos e disponíveis durante a transição. Depois, permanece apenas o vídeo principal em loop.

**O que transmite:** sabor, técnica e a ligação da marca com o churrasco.

**Implementação:** exige um novo take com iluminação, cor e composição compatíveis com o vídeo atual. É preferível preparar a montagem da mídia e usar GSAP somente na apresentação da camada visual. Não acrescentar fogo sintético, fumaça artificial ou distorção de calor à imagem atual.

**Ressalva:** a mídia existente mostra empratamento, não brasas. Sem material dedicado, a cena pode parecer uma propaganda genérica de carnes. Também pode reduzir a percepção da variedade de serviços da marca.

## 3. Assinatura da pimenta

**O que é:** usar a pimenta original como assinatura de um pequeno gesto visual, sem desmontar ou deformar o logotipo.

**Cena:** uma pimenta decorativa aparece em espaço reservado próximo ao título. Ela se acomoda com deslocamento curto, de cerca de 12 a 20 pixels, e rotação discreta de até 6 graus, em 0,9 segundo. Não atravessa o texto nem o botão. O logotipo do cabeçalho permanece no seu lugar desde o início.

**O que transmite:** personalidade, reconhecimento de marca e um toque de ousadia gastronômica.

**Implementação:** usar o PNG separado da pimenta já existente e GSAP com transformações leves. O elemento decorativo fica fora da navegação e da leitura de tecnologias assistivas. Não fingir separar partes do PNG que contém RQ e pimenta juntos.

**Ressalva:** se for minúscula no cabeçalho, a animação passa despercebida; se for grande ou saltitante, fica caricata. No celular, manter o gesto local e menor. Sem elasticidade, giro completo ou repetição.

## 4. A mesa acontece

**O que é:** uma composição fotográfica que mostra a transformação de comida em encontro: churrasco, acompanhamentos e mesa pronta para receber.

**Cena:** duas fotos reais entram com deslocamentos discretos e tempos ligeiramente diferentes, formando uma composição editorial em cerca de 1,2 segundo. Uma imagem apresenta o alimento; a outra, o ambiente e o serviço. Ao fim, as fotos ficam estáticas.

**O que transmite:** hospitalidade, variedade e a dimensão real do trabalho em eventos.

**Implementação:** aproveitar as fotos existentes, preparar recortes e usar GSAP para posição e opacidade. Essa composição substitui a camada visual do vídeo; não deve ser uma pilha de cards sobre um vídeo em movimento. No celular, usar uma foto dominante.

**Ressalva:** requer revisão da composição do hero. Muitas fotos, rotações ou uma levitação contínua lembrariam um slideshow promocional e competiriam com o carrossel da seção seguinte.

## 5. Um quadro que se abre

**O que é:** a gastronomia começa dentro de uma janela visual à direita e ganha toda a área de fundo da primeira dobra. A surpresa está na expansão do espaço, não em aumentar a imagem ou esconder o conteúdo.

**Cena proposta:**

| Momento | O que o visitante vê |
|---|---|
| Primeiro quadro | Título, texto, marca e botão em suas posições finais. Poster visível em uma janela generosa à direita. |
| Até aproximadamente 0,7 s | A máscara retangular da imagem se abre progressivamente e revela mais da cozinha. |
| Aproximadamente 1 s | A imagem ocupa o fundo do hero; a composição repousa. O vídeo segue seu comportamento habitual. |

**O que transmite:** presença, intenção de design e a sensação de entrar no universo do chef.

**Implementação:** GSAP básico em uma máscara simples da camada de poster/vídeo. Não animar altura do hero, corpo da página, cabeçalho ou posição do botão. Sem moldura dourada, traços ou números. Preservar o sombreado de contraste atrás do texto.

**Celular:** janela inicial mais ampla e uma expansão menor, preservando o prato no enquadramento. Caso a máscara prejudique a fluidez, manter a composição final estática. No tema claro, ajustar a superfície inicial para a paleta clara sem clarear o texto sobre o vídeo.

**Ressalva:** precisa de conferência de recorte e custo de pintura nos dispositivos. Usar o poster desde o primeiro quadro; nunca esperar o vídeo para exibir a janela.

**Minha recomendação:** melhor equilíbrio entre surpresa perceptível, material disponível e clareza. Desenvolver essa opção sozinha primeiro, sem somar a pimenta animada ou uma montagem de brasas.

## Avaliação técnica por três revisores reais

As revisões foram executadas uma de cada vez. As opiniões não foram unânimes:

| Revisor | Ordem de preferência | Principal argumento |
|---|---|---|
| Movimento e GSAP | 3, 5, 4, 1, 2 | A pimenta diferencia a marca; a abertura de janela produz a maior transformação editorial. O zoom isolado é pouco surpreendente. |
| Navegação e Lenis | 5, 3, 4, 1, 2 | A janela muda o visual mantendo conteúdo, limites da página e interação estáveis. |
| Identidade e Inspira UI | 1, 4, 5, 3, 2 | O gesto final preserva melhor o trabalho atual; a mesa mostra a hospitalidade com mais clareza. Cuidado para não exagerar no efeito. |

Minha síntese: **opção 5 para o objetivo de surpresa; opção 3 para reforçar o símbolo da marca; opção 1 se a prioridade mudar para máxima discrição.** A opção 4 merece um estudo de composição próprio. A opção 2 fica condicionada à produção de mídia.

Essas são avaliações de design e viabilidade. Não há pesquisa com visitantes ou teste A/B que comprove aumento de conversão.

## Arquitetura e bibliotecas

O projeto permanece em HTML, CSS e JavaScript, com um build simples que copia os arquivos para publicação. Não é necessário migrar para Vue, Nuxt ou React.

**GSAP:** versão 3.15.0 instalada e fixada. O núcleo é suficiente para as entradas propostas. GSAP não foi carregado na página nesta etapa porque a chegada ainda depende da escolha. SplitText, ScrollTrigger, DrawSVG e ScrollSmoother não são necessários agora. [Referência oficial](https://gsap.com/cheatsheet/).

**Lenis:** versão 1.3.26 instalada e integrada com arquivos servidos pelo próprio site. Suaviza a roda do mouse e as âncoras, preserva o comportamento nativo no toque, não prende a rolagem e desativa o efeito quando o sistema pede redução de movimento. O formulário e o menu móvel têm tratamento próprio. Atualmente utiliza seu único loop automático; se uma integração futura usar o ticker do GSAP, esse loop deve ser desativado para evitar atualização dupla. [Documentação](https://github.com/darkroomengineering/lenis).

**Inspira UI:** serve como referência de composição, não como dependência a importar integralmente. O repositório de documentação usa Nuxt, Vue e Tailwind. Algumas ideias são adaptáveis ao JavaScript atual; muitos componentes não são adequados a esta marca. Por exemplo, o Images Slider local espera todas as imagens antes de mostrar o conteúdo; Blur Reveal pode começar com desfoque e atrasos grandes; Focus acrescenta traços; Parallax Float mantém animação contínua. [Catálogo oficial](https://inspira-ui.com/docs/en/components).

**Escopo da inspeção:** inventário de todos os arquivos dos três repositórios e leitura aprofundada dos caminhos relevantes. GSAP: 180 arquivos inventariados; Lenis: 107, com os 12 arquivos do núcleo examinados; Inspira: 155 famílias de componentes, 155 documentos em inglês, 365 arquivos de UI e 202 exemplos inventariados, com leitura profunda de 14 famílias e 16 componentes Vue principais. Isso não significa auditoria integral de cada linha, dependência ou exemplo, nem execução dos três projetos completos.

## Skills adequadas para os responsáveis

| Responsabilidade | Skill indicada | Benefício e limite |
|---|---|---|
| Movimento | `gsap`, já disponível | Organização de tempos, transformações, easing e limpeza. As instruções específicas de exportação HyperFrames não se aplicam ao funcionamento deste site. |
| Identidade e interface | `web-design-guidelines`, da Vercel, como complemento opcional | Revisão de interface, acessibilidade e consistência sem exigir migração de framework. Não substitui a análise da marca. |
| Navegação e verificação visual | `vercel:agent-browser`, já disponível | Verificar navegação, foco, temas, formulário, screenshots e logs no navegador. Nesta máquina o inicializador do CLI falhou; a conferência visual desta rodada foi feita no navegador integrado. |
| Testes repetíveis | `webapp-testing`, da Anthropic, como opção futura | Automatiza testes locais com Playwright/Python. Exige runtime e navegador funcionais; não considerar rede ociosa como prova de término da animação. |
| Coordenação e memória da marca | `skill-creator`, já disponível | Depois de escolher a entrada, pode registrar um procedimento reutilizável com identidade e restrições. Não é um buscador de skills e não exige criar uma skill nova para cada tarefa. |

Usei também `find-skills` para orientar a busca. As duas opções adicionais foram verificadas no código oficial e no catálogo: `web-design-guidelines` apresentava aproximadamente 601,2 mil instalações e `webapp-testing`, 148,4 mil, na consulta desta data. Popularidade não garante segurança; as novas opções não foram instaladas nem ativadas nesta rodada. A primeira busca diretrizes remotas a cada revisão, o que exige leitura crítica do conteúdo recebido.

Fontes e instalação opcional:

- [Web Design Guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines): `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines`.
- [Webapp Testing](https://skills.sh/anthropics/skills/webapp-testing): `npx skills add https://github.com/anthropics/skills --skill webapp-testing`.

## ECC recomendado depois da escolha

Recomendo **ECC `verification-loop`**, complementado por **`e2e-testing`** se montarmos uma suíte de navegador. O papel do ECC será organizar uma checagem final: build, testes existentes, revisão do diff, navegação e falhas de mídia. Não é uma biblioteca de animação a incluir no site. [Fonte do workflow](https://github.com/affaan-m/ECC/tree/main/skills/verification-loop).

A instalação local do ECC foi identificada, mas esses workflows foram lidos apenas como referência nesta rodada. Não ativei hooks, permissões ampliadas ou automações. Não adicionaria ferramentas de tipos/lint só para marcar uma lista como completa: o relatório deve indicar o que está configurado e o que foi realmente testado.

## Roteiro sequencial

| Etapa | Responsável | Situação |
|---|---|---|
| Inspecionar página, conteúdo e build | Coordenação | Concluída |
| Analisar movimento e GSAP | Revisor de movimento | Concluída |
| Analisar scroll e Lenis | Revisor de navegação | Concluída |
| Analisar Inspira e identidade | Revisor de identidade | Concluída |
| Implementar apenas o Smooth Scroll confirmado | Coordenação | Concluída |
| Revisar integração e testar regressões | Coordenação e revisão pontual sequencial | Concluída nos limites abaixo |
| Escolher uma das cinco cenas | Fernando | Próxima decisão |
| Construir e validar somente a cena escolhida | Coordenação | Aguardando escolha |
| Rodada final ECC e aparelhos físicos | Verificação | Após o protótipo da cena |

## Verificação e limites desta entrega

- Build concluído e 27 testes automatizados aprovados: 20 existentes e 7 adicionais para integração de scroll, foco, âncoras, histórico, interrupção e fallback. Os novos testes do controlador simulam eventos; não equivalem a testes completos de navegadores.
- Verificação real no navegador integrado: carregamento local de Lenis; âncoras; pré-preenchimento do tipo de evento e menu; foco do campo de nome; menu móvel; temas claro e escuro; teclado; continuidade de movimento do carrossel; vídeo sem controles de pausa; nenhuma mensagem enviada pelo formulário.
- Larguras inspecionadas entre 320 e 1920 pixels, com conferência de overflow nos dois temas. Não foi detectada rolagem horizontal no documento nessas verificações. Isso não substitui uma inspeção visual de cada seção em cada combinação de aparelho e navegador.
- Respeito a movimento reduzido e fallback testados no controlador e na suíte existente. Falta comprovação dessas mudanças de preferência em sistemas reais, assim como histórico/BFCache completo, Firefox, Safari, iPhone e Android físicos.
- Não medi FPS, Core Web Vitals, economia de bateria ou melhora de conversão. Esses números não devem ser prometidos ao cliente.
- A identidade, textos, vídeo e carrossel foram preservados. Nenhuma das cinco cenas de chegada foi aplicada sem escolha prévia.
