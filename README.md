# Owlbear Cutscene

Extensão experimental para o Owlbear Rodeo que abre uma cutscene em tela cheia para todos os participantes da sala quando o mestre inicia uma apresentação.

**Versão:** 1.0.0  
**Idioma da interface:** português (Brasil)  
**Tecnologias:** JavaScript, Vite e `@owlbear-rodeo/sdk`.

## O que esta versão faz

- Mostra um painel de controle para o mestre.
- Permite informar um título e um link HTTPS direto para um vídeo.
- Permite salvar links em uma pequena biblioteca local do navegador do mestre.
- Envia o comando de início a todos os participantes conectados.
- Abre um modal em tela cheia sobre a interface do Owlbear.
- Agenda o início alguns segundos depois do comando para dar tempo de carregar o vídeo.
- Oferece pausa, retomada e encerramento no painel cinematográfico do mestre.
- Envia atualizações periódicas de posição do vídeo para reduzir diferenças de sincronização.
- Fecha a apresentação automaticamente quando o vídeo termina.

## Limitações conhecidas da versão 1.0.0

1. A biblioteca é salva no armazenamento local do navegador do mestre. Ela não é compartilhada entre contas ou computadores.
2. O vídeo não é enviado para o Owlbear nem para a hospedagem da extensão. O campo recebe uma URL HTTPS que deve apontar diretamente para um arquivo de vídeo acessível.
3. A extensão não converte vídeos. Prefira MP4 com vídeo H.264 e áudio AAC.
4. O começo é sincronizado por agendamento local após a mensagem chegar. Pequenos atrasos de rede e diferenças de carregamento podem ocorrer; mensagens periódicas tentam corrigir desvios durante a reprodução.
5. A permissão `autoplay` é solicitada no manifesto. Ainda assim, certos navegadores/dispositivos podem bloquear a reprodução automática com áudio. Nessa situação, o participante verá um botão para iniciar manualmente. Teste com os navegadores e dispositivos do seu grupo antes da sessão.
6. O modal cobre a área do Owlbear dentro da página, mas não oculta a interface do navegador ou do sistema operacional. Para ocultar essas barras, cada participante precisa usar o modo de tela cheia do navegador.
7. A extensão não é um serviço de streaming. Para uma mesa com muitos jogadores, hospede os vídeos em um serviço apropriado e verifique os limites de tráfego e os direitos de exibição.

## Requisitos

- Node.js 22.12 ou superior recomendado.
- npm.
- Uma conta Owlbear Rodeo.
- Um navegador moderno.

## 1. Executar localmente para desenvolvimento

Abra um terminal na pasta `owlbear-cutscene` e execute:

```bash
npm install
npm run dev
```

O Vite deve informar um endereço local, normalmente:

```text
http://localhost:5173
```

Mantenha esse terminal aberto enquanto testa a extensão localmente.

### Adicionar a versão local ao Owlbear

1. Abra o Owlbear Rodeo no mesmo computador em que o Vite está rodando.
2. Abra o menu do seu perfil e escolha a opção de adicionar uma extensão (Add Extension).
3. Informe o manifesto local:

   `http://localhost:5173/manifest.json`

4. Salve a extensão.
5. Crie uma sala de teste e habilite **Owlbear Cutscene** na lista de extensões da sala. Em uma sala existente, abra o gerenciador de extensões e habilite-a.
6. Se o Owlbear pedir autorização para reprodução automática, conceda a permissão. O manifesto solicita `autoplay` para reduzir a chance de o navegador bloquear o vídeo com áudio.
7. Entre na sala como mestre. O ícone da extensão deve aparecer na área de ações.
8. Clique no ícone, informe um link HTTPS direto para um MP4 e clique em **Iniciar para todos**.

> O endereço `localhost` só existe no seu próprio computador. Jogadores em outros computadores não conseguem acessar o seu servidor local. Para testar com amigos à distância, publique a versão de teste no Cloudflare Pages conforme a seção 3.

## 2. Teste de sincronização

Antes de usar em uma sessão real:

1. Publique a versão de teste ou use duas sessões de navegador no mesmo computador.
2. Entre na mesma sala com uma conta de mestre e pelo menos uma conta de jogador.
3. Habilite a extensão na sala.
4. Como mestre, abra o painel, informe um link de teste e inicie a cutscene.
5. Confirme que os dois participantes veem o modal.
6. Teste pausa, retomada e encerramento.
7. Repita o teste em todos os navegadores e celulares usados pelo grupo, especialmente para conferir o áudio automático.

## 3. Publicar gratuitamente no Cloudflare Pages

O Cloudflare Pages pode hospedar os arquivos estáticos da extensão. O código deste projeto gera a pasta `dist` com `npm run build`.

### 3.1 Criar um repositório no GitHub

1. Entre em <https://github.com>.
2. Clique em **New repository**.
3. Use o nome `owlbear-cutscene`.
4. Marque o repositório como **Public**.
5. Não marque a opção para criar README, `.gitignore` ou licença, porque estes arquivos já estão neste projeto.
6. Crie o repositório.

### 3.2 Enviar os arquivos para o GitHub

Extraia o ZIP deste projeto. Abra um terminal dentro da pasta `owlbear-cutscene` e execute:

```bash
git init
git add .
git commit -m "Versao inicial da extensao Owlbear Cutscene"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/owlbear-cutscene.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu usuário do GitHub. Se o Git pedir identificação, configure seu nome e e-mail com `git config --global user.name "Seu Nome"` e `git config --global user.email "seu-email@example.com"`. Ao enviar, o GitHub pode abrir o navegador para autenticar.

Se o comando `git remote add origin` disser que o remoto já existe, use `git remote set-url origin https://github.com/SEU_USUARIO/owlbear-cutscene.git` e repita o `git push`.

### 3.3 Criar o site no Cloudflare Pages

1. Entre em <https://dash.cloudflare.com> e crie uma conta gratuita, caso ainda não tenha.
2. Abra **Workers & Pages**.
3. Escolha a opção para criar uma aplicação e selecione **Pages** com integração Git.
4. Conecte sua conta do GitHub e autorize o acesso ao repositório `owlbear-cutscene`.
5. Escolha o repositório e a branch `main`.
6. Configure o build:

   - **Framework preset:** Vite (ou None, se Vite não aparecer).
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** deixe em branco, porque o projeto está na raiz do repositório.

7. Inicie a implantação (**Save and Deploy**).
8. Quando terminar, o Cloudflare mostrará um endereço semelhante a `https://owlbear-cutscene.pages.dev`.
9. Teste no navegador se esta URL abre um JSON:

   `https://SEU-PROJETO.pages.dev/manifest.json`

10. No Owlbear Rodeo, adicione uma extensão usando exatamente esse endereço terminado em `/manifest.json`.

O Cloudflare Pages pode reconstruir e publicar o site automaticamente quando você enviar novas alterações para a branch principal.

### 3.4 Compartilhar com outras pessoas

Depois de publicar, compartilhe o link do manifesto com quem quiser usar:

`https://SEU-PROJETO.pages.dev/manifest.json`

O mestre adiciona esse endereço ao próprio perfil e habilita a extensão na sala. Os jogadores entram normalmente pelo convite da sala e devem atualizar a página depois que a extensão for habilitada. Caso algum participante não carregue a extensão em seu navegador, peça que ele também adicione o manifesto ao próprio perfil e reabra a sala.

**Publicar o site não coloca automaticamente a extensão na loja do Owlbear.** O endereço do manifesto já permite que outras pessoas instalem a extensão. A inclusão no catálogo público do Owlbear é uma etapa opcional e separada, feita por meio de uma contribuição ao repositório oficial de extensões, depois que o projeto estiver hospedado e testado.

## 4. Hospedar seus vídeos

A extensão recebe um endereço de vídeo; ela não armazena nem transmite o arquivo. O endereço precisa:

- começar com `https://`;
- abrir diretamente o arquivo de vídeo, em vez de uma página HTML de compartilhamento;
- estar acessível aos jogadores sem login;
- permitir que o navegador reproduza o formato e os codecs usados.

Links de páginas comuns do YouTube, Google Drive ou Dropbox não são necessariamente links diretos compatíveis. Use um serviço que forneça URL direta para o arquivo ou configure seu servidor Oracle Cloud para servir os MP4 por HTTPS.

Não recomendo colocar vídeos grandes no repositório GitHub ou nos arquivos estáticos do Cloudflare Pages. A documentação do Cloudflare Pages informa limite de 25 MiB por arquivo estático; arquivos maiores devem ficar em um serviço de armazenamento/streaming separado.

## 5. Solução de problemas

### A extensão não aparece

- Verifique se o endereço termina em `/manifest.json`.
- Abra esse endereço diretamente no navegador e confirme que o JSON aparece.
- Confirme que a extensão está habilitada na sala.
- Atualize a página da sala depois de publicar uma alteração.

### O modal abre, mas o vídeo não toca

- Confirme que o link é HTTPS e aponta diretamente para o vídeo.
- Teste o link em uma aba anônima. Se pedir login, os jogadores também não conseguirão acessar.
- Converta para MP4/H.264 + AAC.
- Veja se o host permite que o arquivo seja servido por HTTPS.

### O vídeo começa sem áudio ou pede um clique

- Confira se o navegador não bloqueou autoplay com áudio.
- Use o botão **Reproduzir vídeo** quando aparecer.
- Faça um teste prévio em cada dispositivo. O comportamento pode variar, especialmente em navegadores móveis.

### Um jogador não recebe a cutscene

- Confirme que ele entrou na sala e que a extensão está habilitada nela.
- Feche e reabra a sala.
- Verifique se o navegador do jogador consegue acessar tanto a extensão quanto o arquivo de vídeo.

### A sincronização não fica perfeita

A extensão corrige diferenças maiores de posição periodicamente, mas não é um sistema de videoconferência nem um streaming com relógio de mídia compartilhado. Uma conexão lenta ou um arquivo que demora a carregar pode causar diferenças. Aumente a preparação para 15 ou 20 segundos e use um host de vídeo mais rápido.

## 6. Estrutura do projeto

```text
owlbear-cutscene/
├── public/
│   ├── icon.svg
│   └── manifest.json
├── src/
│   ├── background.js
│   ├── panel.js
│   ├── player.js
│   ├── shared.js
│   └── styles.css
├── background.html
├── index.html
├── player.html
├── package.json
├── vite.config.js
└── README.md
```

## 7. Aviso de estágio

Esta é uma primeira implementação para teste. O pacote pode ser compilado localmente, mas a integração precisa ser validada dentro de uma sala real do Owlbear com mestre e jogadores em navegadores diferentes antes de ser considerado pronto para uma sessão importante. Não há backend, login próprio, analytics ou coleta de dados: a comunicação da sala usa a API de broadcast do Owlbear e a biblioteca fica no armazenamento local do navegador.
