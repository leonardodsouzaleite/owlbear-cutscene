import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  // O Owlbear carrega a extensao em iframes. Durante o desenvolvimento,
  // o servidor precisa aceitar requisicoes vindas do dominio do Owlbear.
  server: {
    cors: {
      origin: ["https://www.owlbear.rodeo", "https://owlbear.rodeo"],
    },
  },
  preview: {
    cors: {
      origin: ["https://www.owlbear.rodeo", "https://owlbear.rodeo"],
    },
  },
  // A extensao tem tres paginas de entrada: painel, background e player.
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        background: resolve(rootDir, "background.html"),
        player: resolve(rootDir, "player.html"),
      },
    },
  },
});
