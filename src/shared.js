export const CHANNEL = "com.leonardoleite.owlbear-cutscene";
export const MODAL_ID = "com.leonardoleite.owlbear-cutscene/player";
export const LIBRARY_KEY = "owlbear-cutscene-library-v1";

export function isSafeVideoUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function createEventId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function buildPlayerUrl(origin, message, localStartAt) {
  const url = new URL("/player.html", origin);
  url.searchParams.set("src", message.url);
  url.searchParams.set("title", message.title || "Cutscene");
  url.searchParams.set("startAt", String(localStartAt));
  url.searchParams.set("eventId", message.eventId);
  return url.toString();
}

export async function isTrustedGM(OBR, connectionId) {
  try {
    const ownConnectionId = await OBR.player.getConnectionId();
    if (ownConnectionId && connectionId === ownConnectionId) {
      return (await OBR.player.getRole()) === "GM";
    }

    const players = await OBR.party.getPlayers();
    const sender = players.find((player) => player.connectionId === connectionId);
    return sender?.role === "GM";
  } catch (error) {
    console.warn("Não foi possível verificar o remetente da mensagem.", error);
    return false;
  }
}
