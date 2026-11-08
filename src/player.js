import OBR from "@owlbear-rodeo/sdk";
import { CHANNEL, MODAL_ID, isTrustedGM } from "./shared.js";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const video = $("cutscene-video");
const loading = $("loading");
const blocked = $("blocked");
const errorBox = $("error");
const errorText = $("error-text");
const titleLabel = $("cutscene-title");
const controls = $("gm-controls");
const pauseButton = $("pause");
const resumeButton = $("resume");
const stopButton = $("stop");
const params = new URLSearchParams(window.location.search);
const source = params.get("src");
const title = params.get("title") || "Cutscene";
const eventId = params.get("eventId") || "";
const startAt = Number(params.get("startAt"));
let currentRole = "PLAYER";
let syncTimer = null;
let resumeTimer = null;
let started = false;

function showError(message) {
  loading.hidden = true;
  blocked.hidden = true;
  errorBox.hidden = false;
  errorText.textContent = message;
}

function showBlocked() {
  loading.hidden = true;
  blocked.hidden = false;
}

async function closeModal() {
  try {
    await OBR.modal.close(MODAL_ID);
  } catch (error) {
    console.warn("Não foi possível fechar a janela de cutscene.", error);
  }
}

async function tryPlay() {
  try {
    const elapsed = Math.max(0, (Date.now() - startAt) / 1000);
    if (Number.isFinite(video.duration) && elapsed >= video.duration) {
      loading.querySelector("p").textContent = "Aguardando o encerramento sincronizado pelo mestre…";
      if (currentRole === "GM") await stopEverywhere();
      return;
    }
    video.currentTime = elapsed;
    await video.play();
    started = true;
    loading.hidden = true;
    blocked.hidden = true;
    errorBox.hidden = true;
  } catch (error) {
    console.warn("Autoplay recusado pelo navegador.", error);
    showBlocked();
  }
}

function scheduleInitialPlay() {
  if (started) return;
  const remaining = startAt - Date.now();
  if (remaining > 0) {
    window.setTimeout(() => {
      if (!started) void tryPlay();
    }, remaining);
  } else {
    void tryPlay();
  }
}

async function sendToEveryone(message) {
  await OBR.broadcast.sendMessage(
    CHANNEL,
    { ...message, eventId },
    { destination: "ALL" },
  );
}

async function stopEverywhere() {
  try {
    await sendToEveryone({ type: "STOP" });
  } catch (error) {
    console.error("Não foi possível enviar o encerramento.", error);
  }
  await closeModal();
}

function setPausedUi(paused) {
  pauseButton.disabled = paused;
  resumeButton.disabled = !paused;
}

async function pauseEverywhere() {
  if (currentRole !== "GM") return;
  await sendToEveryone({ type: "PAUSE", position: video.currentTime });
}

async function resumeEverywhere() {
  if (currentRole !== "GM") return;
  const position = video.currentTime;
  await sendToEveryone({ type: "RESUME", position, delayMs: 1500 });
}

pauseButton.addEventListener("click", () => void pauseEverywhere());
resumeButton.addEventListener("click", () => void resumeEverywhere());
stopButton.addEventListener("click", () => void stopEverywhere());

$("manual-play").addEventListener("click", async () => {
  try {
    const elapsed = Math.max(0, (Date.now() - startAt) / 1000);
    if (Number.isFinite(video.duration) && elapsed >= video.duration) {
      video.currentTime = 0;
    } else {
      video.currentTime = elapsed;
    }
    await video.play();
    blocked.hidden = true;
    loading.hidden = true;
    started = true;
  } catch (error) {
    showError("O navegador continuou bloqueando o vídeo. Verifique as permissões de reprodução automática do site.");
  }
});

video.addEventListener("canplay", scheduleInitialPlay, { once: true });
video.addEventListener("error", () => {
  showError("O link não parece ser um arquivo de vídeo compatível ou o servidor recusou a reprodução. Use um MP4/H.264 hospedado em HTTPS.");
});
video.addEventListener("ended", async () => {
  // O mestre e a referência para o fim. Um jogador que chegue ao fim um
  // pouco antes permanece no ultimo quadro ate receber STOP do mestre.
  if (currentRole === "GM") await stopEverywhere();
});
video.addEventListener("play", () => setPausedUi(false));
video.addEventListener("pause", () => setPausedUi(true));

OBR.onReady(async () => {
  try {
    currentRole = await OBR.player.getRole();
    if (currentRole === "GM") controls.hidden = false;

    OBR.broadcast.onMessage(CHANNEL, async (event) => {
      const message = event?.data;
      if (!message || message.eventId !== eventId) return;
      if (!(await isTrustedGM(OBR, event.connectionId))) return;

      if (message.type === "PAUSE") {
        window.clearTimeout(resumeTimer);
        if (Number.isFinite(message.position)) video.currentTime = message.position;
        video.pause();
        setPausedUi(true);
      }

      if (message.type === "RESUME") {
        window.clearTimeout(resumeTimer);
        if (Number.isFinite(message.position)) video.currentTime = message.position;
        const delay = Math.min(Math.max(Number(message.delayMs) || 1500, 0), 10000);
        resumeTimer = window.setTimeout(async () => {
          try {
            await video.play();
            setPausedUi(false);
          } catch (error) {
            showBlocked();
          }
        }, delay);
      }

      if (message.type === "SYNC" && currentRole !== "GM" && Number.isFinite(message.position)) {
        const drift = message.position - video.currentTime;
        if (video.ended && message.position < video.duration - 0.5) {
          video.currentTime = message.position;
          try { await video.play(); } catch { showBlocked(); }
        } else if (!video.paused && Math.abs(drift) > 0.7) {
          video.currentTime = message.position;
        }
      }
    });

    if (!source || !eventId || !Number.isFinite(startAt)) {
      showError("Dados incompletos da cutscene. Feche a janela e peça ao mestre para iniciar novamente.");
      return;
    }

    const sourceUrl = new URL(source);
    if (sourceUrl.protocol !== "https:") {
      showError("Por segurança, esta extensão aceita apenas vídeos hospedados em HTTPS.");
      return;
    }

    titleLabel.textContent = title;
    video.src = sourceUrl.toString();
    video.load();

    if (currentRole === "GM") {
      syncTimer = window.setInterval(() => {
        if (!video.paused && !video.ended) {
          void sendToEveryone({ type: "SYNC", position: video.currentTime }).catch((error) => console.warn(error));
        }
      }, 5000);
    }
  } catch (error) {
    console.error(error);
    showError("A extensão não conseguiu se conectar ao Owlbear Rodeo.");
  }
});

window.addEventListener("pagehide", () => {
  window.clearInterval(syncTimer);
  window.clearTimeout(resumeTimer);
});
