# Pousada Secreta

Modelo de site multipágina para uma pousada/agência de viagens, desenvolvido com HTML, CSS e JavaScript puro. A estrutura prioriza desempenho, manutenção simples, acessibilidade, SEO e futura integração com Supabase.

## Páginas

- `index.html`: apresentação, acomodações, diferenciais e localização.
- `quartos.html`: detalhes e galerias das acomodações.
- `reserva.html`: consulta de disponibilidade preparada para backend.
- `privacidade.html`: modelo inicial de transparência e LGPD.

## Como executar

Abra `index.html` no navegador. Para testar rotas e comportamento mais próximos de uma hospedagem real, use uma extensão de servidor local ou execute um servidor HTTP simples na pasta do projeto.

## Integração futura com Supabase

A função `sendReservationToBackend`, em `pratica.js`, é o único ponto a ser substituído pela chamada ao backend. A recomendação é enviar o formulário a uma API ou Supabase Edge Function que valide, limite e grave a solicitação.

Nunca inclua no JavaScript do navegador a chave `service_role`. Variáveis locais devem ficar em um arquivo `.env`, que não deve ser versionado. Ative Row Level Security nas tabelas e autorize somente as operações estritamente necessárias.

## Antes de publicar

- Trocar domínio, endereço, telefone e e-mails de exemplo.
- Revisar a Política de Privacidade com responsável jurídico.
- Otimizar as imagens para WebP/AVIF e criar uma imagem social 1200 × 630.
- Conectar o formulário ao backend e incluir proteção contra abuso.
- Cadastrar o sitemap no Google Search Console e medir Core Web Vitals.
