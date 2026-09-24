# MSA Turbo — site para GitHub Pages

Extraia o ZIP e coloque **todos os arquivos na raiz** do repositório, junto ao `index.html`. Não envie apenas o ZIP. Para atualizar a versão anterior, substitua `index.html`, `styles.css`, `script.js`, `README.md` e `denis-ruth.png`, e adicione as quatro imagens `modulos-*.png`. Os demais arquivos de mídia e `config.js` permanecem iguais à versão v10.

## Links e Pixel da Meta

Os três links estão configurados em `config.js`: checkout Kiwify de 1 ano, checkout Kiwify de 2 anos e WhatsApp. O Pixel da Meta `1089549670242762` está em `index.html`, com `PageView` na abertura. Em `script.js`, os cliques nos checkouts enviam o evento personalizado `CheckoutClick` (com plano e preço), e os cliques no WhatsApp enviam `Contact`. Isso não mede uma compra concluída: configure o mesmo Pixel na Kiwify para acompanhar os eventos do checkout e a compra. Evite instalar o código base duas vezes no site.

A página tem um carrossel único com 26 relatos, incluindo os três antigos painéis apresentados como nove cartões individuais. Ao tocar num cartão, a imagem abre em tela ampliada. Os módulos podem ser arrastados com o mouse; no celular, o botão revela o carrossel que pode ser deslizado com o dedo.

O vídeo principal `resultados-comunidade.mp4` inicia com áudio após um toque no aviso central. O vídeo de Dubai está em `premiacao-dubai.mp4`. O modal de garantia aparece uma vez por sessão na saída pelo topo no computador ou depois de 45% de rolagem no celular.

A vitrine transparente está em `linha-produtos.png`. Confira os textos pequenos dos rótulos antes de usar esse recorte em materiais ampliados.
