import OBR from "@owlbear-rodeo/sdk";
import { CHANNEL, MODAL_ID, buildPlayerUrl, isSafeVideoUrl, isTrustedGM } from "./shared.js";

async function closePlayer() {
  try {
    await OBR.modal.close(MODAL_ID);
  } catch {
    // Tudo bem: talvez não exista uma cutscene aberta neste participante.
  }
}

OBR.onReady(() => {
  OBR.broadcast.onMessage(CHANNEL, async (event) => {
    const message = event?.data;
    if (!message || typeof message.type !== "string") return;

    const trusted = await isTrustedGM(OBR, event.connectionId);
    if (!trusted) {
      console.warn("Comando ignorado: a mensagem não veio do mestre.");
      return;
    }

    if (message.type === "START") {
      if (!message.eventId || !isSafeVideoUrl(message.url)) return;

      const delayMs = Math.min(Math.max(Number(message.delayMs) || 8000, 4000), 30000);
      const localStartAt = Date.now() + delayMs;
      const modalUrl = buildPlayerUrl(window.location.origin, message, localStartAt);

      await closePlayer();
      try {
        await OBR.modal.open({
          id: MODAL_ID,
          url: modalUrl,
          fullScreen: true,
          hideBackdrop: true,
          hidePaper: true,
        });
      } catch (error) {
        console.error("Falha ao abrir a cutscene.", error);
        OBR.notification.show("Não foi possível abrir a cutscene neste dispositivo.");
      }
      return;
    }

    if (message.type === "STOP") {
      await closePlayer();
    }
  });
});
