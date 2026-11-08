---
title: Owlbear Cutscene
description: Play synchronized full-screen video cutscenes for everyone in an Owlbear Rodeo room.
author: Leonardo Leite
image: https://raw.githubusercontent.com/leonardodsouzaleite/owlbear-cutscene/main/public/icon.svg
icon: https://raw.githubusercontent.com/leonardodsouzaleite/owlbear-cutscene/main/public/icon.svg
tags:
  - other
manifest: https://owlbear-cutscene.leonardosouzaleite2020.workers.dev/manifest.json
learn-more: https://github.com/leonardodsouzaleite/owlbear-cutscene
---

# Owlbear Cutscene

Turn important moments in your tabletop session into cinematic scenes. The Game Master can start a video and show it in a full-screen overlay to everyone currently connected to the Owlbear Rodeo room.

## Features

- Full-screen video overlay for the room's participants.
- The Game Master starts, pauses, resumes, or ends the presentation.
- A preparation delay gives participants time to load the video before playback.
- Periodic position updates help reduce playback differences between participants.
- The overlay closes when the Game Master ends the cutscene or the video finishes.
- A local video-link library is available in the Game Master's browser.

## How to use

1. Install the extension using the **Install** link above.
2. Enable **Owlbear Cutscene** in your Owlbear Rodeo room.
3. As the Game Master, open the extension panel.
4. Enter a title and a direct HTTPS link to a video file.
5. Optionally save the video link in your local library.
6. Choose the preparation delay and select **Start for everyone**.
7. Use the controls in the cinematic overlay to pause, resume, or end the presentation.

## Video requirements

The extension does not host or upload video files. The Game Master must provide a direct HTTPS URL that all participants can access without signing in. MP4 files using H.264 video and AAC audio are recommended. A normal web page or a private file-sharing link may not work as a video source.

## Important notes

- Browser autoplay policies can affect playback with sound. A participant may need to press the on-screen play button if their browser blocks autoplay.
- Playback starts are scheduled across participants and corrected periodically; small differences can occur due to network latency or buffering.
- The video overlay covers the Owlbear game area, not the browser or operating-system interface. Participants can use their browser's full-screen mode for a fully immersive display.
- The saved video-link library is local to the Game Master's browser and is not shared with other devices.

## Support and feedback

To report a problem, request help, or suggest an improvement, please open an issue in the [GitHub repository](https://github.com/leonardodsouzaleite/owlbear-cutscene/issues).

## Source code and license

The source code is available at [github.com/leonardodsouzaleite/owlbear-cutscene](https://github.com/leonardodsouzaleite/owlbear-cutscene) under the MIT License.
