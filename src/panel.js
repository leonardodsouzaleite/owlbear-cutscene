import OBR from "@owlbear-rodeo/sdk";
import { CHANNEL, LIBRARY_KEY, MODAL_ID, buildPlayerUrl, createEventId, isSafeVideoUrl } from "./shared.js";
import "./styles.css";

const $ = (id) => document.getElementById(id);
const status = $("status");
const gmPanel = $("gm-panel");
const playerPanel = $("player-panel");
const titleInput = $("title");
const urlInput = $("video-url");
const delayInput = $("delay");
const librarySelect = $("library");
const startButton = $("start");
const saveButton = $("save-video");
const deleteButton = $("delete-video");
function setStatus(message, kind = "info") {
  status.textContent = message;
  status.dataset.kind = kind;
}

function readLibrary() {
  try {
    const value = JSON.parse(localStorage.getItem(LIBRARY_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item) => item && typeof item.title === "string" && isSafeVideoUrl(item.url)) : [];
  } catch {
    return [];
  }
}

function writeLibrary(items) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error(error);
    setStatus("Não foi possível salvar a biblioteca neste navegador.", "error");
    return false;
  }
}

function renderLibrary() {
  const items = readLibrary();
  librarySelect.replaceChildren();
  if (items.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nenhum vídeo salvo";
    librarySelect.append(option);
  } else {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione um vídeo salvo…";
    librarySelect.append(placeholder);
    items.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = item.title;
      librarySelect.append(option);
    });
  }
  deleteButton.disabled = items.length === 0 || librarySelect.value === "";
}

function getFormData() {
  const title = titleInput.value.trim() || "Cutscene";
  const url = urlInput.value.trim();
  if (!isSafeVideoUrl(url)) {
    throw new Error("Informe um link HTTPS que aponte diretamente para um arquivo de vídeo.");
  }
  return { title, url };
}

function saveCurrentVideo() {
  try {
    const video = getFormData();
    const items = readLibrary();
    const existingIndex = items.findIndex((item) => item.url === video.url);
    if (existingIndex >= 0) items[existingIndex] = video;
    else items.unshift(video);
    if (writeLibrary(items)) {
      renderLibrary();
      librarySelect.value = String(items.findIndex((item) => item.url === video.url));
      deleteButton.disabled = false;
      setStatus("Vídeo salvo na biblioteca deste navegador.", "success");
    }
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function startCutscene() {
  try {
    const video = getFormData();
    const delayMs = Number(delayInput.value) * 1000;
    startButton.disabled = true;
    setStatus("Enviando a cutscene para a sala…", "info");

    const message = {
      type: "START",
      eventId: createEventId(),
      title: video.title,
      url: video.url,
      delayMs,
    };
    const localStartAt = Date.now() + delayMs;
    const localUrl = buildPlayerUrl(window.location.origin, message, localStartAt);

    // Envia aos outros participantes e abre a janela do mestre em paralelo.
    const remoteSend = OBR.broadcast.sendMessage(CHANNEL, message, { destination: "REMOTE" });
    const localOpen = (async () => {
      try { await OBR.modal.close(MODAL_ID); } catch { /* modal ainda não aberto */ }
      await OBR.modal.open({
        id: MODAL_ID,
        url: localUrl,
        fullScreen: true,
        hideBackdrop: true,
        hidePaper: true,
      });
    })();
    const results = await Promise.allSettled([remoteSend, localOpen]);
    if (results[0].status === "rejected") throw results[0].reason;
    if (results[1].status === "rejected") {
      console.error("O comando foi enviado, mas a janela local não abriu.", results[1].reason);
      setStatus("O comando foi enviado aos jogadores, mas a cutscene não abriu no seu dispositivo.", "error");
      return;
    }

    setStatus("Cutscene iniciada. Os outros participantes receberam o comando.", "success");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Não foi possível iniciar a cutscene.", "error");
  } finally {
    startButton.disabled = false;
  }
}

librarySelect.addEventListener("change", () => {
  if (librarySelect.value === "") {
    deleteButton.disabled = true;
    return;
  }
  const index = Number(librarySelect.value);
  const item = readLibrary()[index];
  if (item) {
    titleInput.value = item.title;
    urlInput.value = item.url;
  }
  deleteButton.disabled = !item;
});

saveButton.addEventListener("click", saveCurrentVideo);
startButton.addEventListener("click", startCutscene);
deleteButton.addEventListener("click", () => {
  if (librarySelect.value === "") return;
  const index = Number(librarySelect.value);
  const items = readLibrary();
  if (!Number.isInteger(index) || index < 0 || index >= items.length) return;
  items.splice(index, 1);
  writeLibrary(items);
  renderLibrary();
  setStatus("Vídeo removido da biblioteca local.", "success");
});

OBR.onReady(async () => {
  try {
    const isGM = (await OBR.player.getRole()) === "GM";
    if (isGM) {
      gmPanel.hidden = false;
      renderLibrary();
      startButton.disabled = false;
      setStatus("Conectado. Somente o mestre pode iniciar cutscenes.", "success");
    } else {
      playerPanel.hidden = false;
      setStatus("Extensão conectada. Aguardando o mestre.", "info");
    }
  } catch (error) {
    console.error(error);
    setStatus("Não consegui identificar seu papel na sala. Feche e reabra a extensão.", "error");
  }
});
