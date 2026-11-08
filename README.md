# Owlbear Cutscene

Extensão comunitária para o Owlbear Rodeo que permite ao mestre iniciar vídeos em tela cheia, sincronizados para os participantes conectados à sala.

**Versão:** 1.0.0  
**Idioma da interface:** português (Brasil)  
**Licença:** MIT

## Instalação pública

Adicione a extensão ao seu perfil do Owlbear Rodeo usando este manifesto:

**[Instalar Owlbear Cutscene](https://owlbear-cutscene.leonardosouzaleite2020.workers.dev/manifest.json)**

No Owlbear Rodeo, abra o gerenciador de extensões, escolha **Add Extension**, cole o endereço do manifesto e confirme. Depois, habilite a extensão na sala.

Compartilhe o link do manifesto acima com outros mestres. Os jogadores entram na sala normalmente; não precisam abrir o painel da extensão.

## Recursos

- Iniciar uma cutscene para os participantes conectados à sala.
- Abrir o vídeo em uma janela modal que cobre a área de jogo do Owlbear.
- Configurar um intervalo de preparação antes da reprodução.
- Pausar, retomar e encerrar a apresentação pelo painel do mestre.
- Encerrar automaticamente a apresentação quando o vídeo termina.
- Salvar links frequentes em uma biblioteca local do navegador do mestre.

## Como utilizar

1. Habilite Owlbear Cutscene na sala.
2. Como mestre, abra a ação **Cutscene**.
3. Informe um título e um link HTTPS direto para um arquivo de vídeo, ou selecione um item salvo na biblioteca.
4. Escolha o tempo de preparação.
5. Clique em **Iniciar para todos**.

Os outros participantes conectados recebem o comando e a janela da apresentação automaticamente.

## Compatibilidade de vídeo

Use um endereço HTTPS público que aponte diretamente para o arquivo de vídeo. Recomendamos MP4 com vídeo H.264 e áudio AAC.

A extensão não hospeda, envia, converte nem transmite os vídeos. O mestre precisa utilizar um serviço de hospedagem que permita o acesso direto ao arquivo por todos os participantes e deve possuir os direitos necessários para exibir o conteúdo.

## Limitações conhecidas

- A biblioteca de vídeos fica armazenada localmente no navegador do mestre; ela não é sincronizada entre dispositivos.
- A reprodução é agendada em cada dispositivo. Latência, buffering e velocidade de conexão podem causar pequenas diferenças de sincronização.
- Navegadores e dispositivos podem bloquear autoplay com áudio. Nessa situação, o participante poderá precisar tocar em **Reproduzir vídeo**.
- O modal cobre a área de jogo do Owlbear, mas não oculta a interface do navegador ou do sistema operacional.
- A extensão não é um serviço de streaming. Para grupos maiores, escolha uma hospedagem de mídia adequada e teste o tráfego e os limites do provedor.

## Desenvolvimento local

Requisitos: Node.js 22.12 ou superior e npm.

Na pasta do projeto:

```bash
npm install
npm run dev
```

O Vite normalmente disponibiliza a extensão em `http://localhost:5173`. Para adicioná-la localmente ao Owlbear, use:

```text
http://localhost:5173/manifest.json
```

O endereço `localhost` funciona somente no computador que está executando o servidor de desenvolvimento.

Para gerar os arquivos de produção:

```bash
npm run build
```

A compilação gera a pasta `dist/`.

## Hospedagem e publicação

A versão pública utiliza Cloudflare Workers com arquivos estáticos. O arquivo `wrangler.jsonc` configura a pasta `dist/` como diretório de assets.

Em um projeto Cloudflare Workers conectado ao GitHub, configure:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Production branch:** `main`

O endereço público do manifesto é:

`https://owlbear-cutscene.leonardosouzaleite2020.workers.dev/manifest.json`

## Página para o catálogo oficial

A página de apresentação preparada conforme as instruções do catálogo do Owlbear Rodeo está em [docs/store.md](docs/store.md). A inclusão no catálogo oficial depende da aprovação e integração de um Pull Request no repositório [owlbear-rodeo/extensions](https://github.com/owlbear-rodeo/extensions).

## Suporte

Para relatar problemas, sugerir melhorias ou fazer perguntas, abra uma [GitHub Issue](https://github.com/leonardodsouzaleite/owlbear-cutscene/issues).

## Código-fonte e licença

Este projeto é distribuído sob a licença [MIT](LICENSE). Owlbear Cutscene é uma extensão comunitária independente e não é produzida nem endossada oficialmente pelo Owlbear Rodeo.
