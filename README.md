# MSA Turbo — primeira versão

Site estático pronto para GitHub Pages. Envie **todo o conteúdo desta pasta** para a raiz de um repositório (ou mantenha a pasta e selecione `/docs` somente se mudar sua estrutura). Ative Pages em Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

## Antes de divulgar

Abra `config.js` e substitua as três strings vazias pelos links reais: `oneYear` (checkout de R$ 497), `twoYears` (checkout de R$ 597) e `whatsapp` (número de atendimento no formato `https://wa.me/55DDDNUMERO`). Sem esses links, os botões exibem um aviso de atualização.

Confira no checkout o parcelamento de 12x de R$ 51,40 para o plano de dois anos. Revise também as condições atuais de calls, suporte e premiações antes de divulgar. As fotos e o vídeo estão na pasta `assets/` e precisam ser enviados junto com os arquivos HTML, CSS e JS.

Para testar localmente: `python3 -m http.server 8000` nesta pasta e abra `http://localhost:8000`.
