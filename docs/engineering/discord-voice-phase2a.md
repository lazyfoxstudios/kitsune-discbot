# Building a local AI Discord companion: text chat to outbound encrypted voice

**Engineering reference — November 2026 · Lazy Fox Studios**

This guide documents the architecture and validation approach of an accepted restricted pilot. It is a reference for independent implementations, not a distribution of the private application, a turnkey installer, or a security certification. Use your own Discord application, credentials and infrastructure.

## 1. Scope and prerequisites

Start with single-turn slash-command text chat. Add outbound synthesized speech only after text acceptance. Incoming audio, transcription, persistent memory, web tools and household automation are deliberately out of scope.

You need a Linux Docker host, a Discord test server and application, an operator-controlled LLM endpoint (for example Ollama), and a local TTS service (for example Kokoro) behind a small HTTP adapter. Consult the current Discord developer documentation and discord.py voice documentation before selecting dependencies. Platform requirements can change.

## 2. Architecture

```text
Discord slash command
    -> restricted connector -> local LLM -> text reply
                             -> bounded speech queue
                             -> local speech HTTP adapter -> TTS
                             -> WAV -> FFmpeg PCM -> Opus/DAVE
                             -> approved Discord voice channel
```

The connector owns authorization, command lifecycle and transport. Inference and synthesis remain shared services. Do not expose a new inbound web port merely to establish an outbound Discord Gateway connection. Allow the necessary outbound voice connectivity, including negotiated UDP, according to current platform requirements.

## 3. Phase 1: restricted text

Create a bot in the Discord developer portal and install it only into a controlled guild using the required bot and application-command permissions. Grant only channel visibility, message sending and later voice connect/speak permissions as needed. Do not grant Administrator. Keep ordinary message and privileged intents disabled unless an independently reviewed feature requires them.

Configure the application ID, guild ID and text-channel ID independently of user input. Register /chat at guild scope, not global scope. Verify the application identity and channel type before synchronization. Reject unexpected existing commands before modifying the command set. Reject DMs, threads, bots and unauthorized channels. Defer the interaction before long inference; return a bounded reply with mentions disabled.

Send only the current prompt and fixed persona instructions to the local model. Pin the model identity and check that it is installed, without treating ordinary idle unloading as model removal. Use bounded timeouts, concurrency, output length, cooldowns and request admission. The pilot used one active inference, a 15-second user cooldown and 100 admitted requests per rolling hour. These are example limits, not Discord defaults.

Keep the token in a separate read-only file, readable only by the service UID. Never place it in a Dockerfile, source code, command line, log or public issue. Use fixed operational log events, bounded log rotation and a health signal independent of user content. Avoid persistent prompt/reply transcripts.

Gate: valid /chat returns text, unauthorized locations reject, provider failures terminate safely, no unexpected command registrations or new listening ports.

## 4. Phase 2A: voice dependencies

Develop on a separate branch and build a separate image; retain the accepted text image. The pilot used Python 3.12, discord.py 2.7.1, PyNaCl 1.6.2, davey 0.1.4, FFmpeg and libopus. These are historical tested versions, not recommendations to install the latest packages blindly. The pilot resolved a voice-extra dependency constraint by installing explicit packages and checking dependency consistency. Verify support against current upstream requirements; imports alone do not prove encrypted transport works. Pin the resolved dependency graph and base image digest for your release.

Use guild and voice-state intents only as needed. Join the single approved voice channel self-deafened. Never install or invoke receive/record/transcribe functionality in this phase.

## 5. Speech interface and audio pipeline

An example local adapter contract is POST /synthesize with JSON containing a fixed profile and bounded text; return audio/wav. GET /health can advertise readiness. Restrict the allowed profile, request size, response size, duration and concurrency. Use timeouts and reject redirects and malformed media. Never allow a Discord user to choose the service URL.

Convert validated WAV to signed little-endian 16-bit stereo PCM at 48 kHz:

```sh
ffmpeg -hide_banner -loglevel error -f wav -i pipe:0 \
  -vn -t 120 -ac 2 -ar 48000 -f s16le pipe:1
```

This command is an illustrative conversion step; validate size and duration before running it and bound the subprocess output and runtime. Cancel and reap the process when interrupted. A 20 ms PCM frame contains 960 samples per channel, or 3,840 bytes. Pad the final partial frame with silence if needed. Use a discord.py PCM audio source, volume transformer and Opus encoder rather than implementing Discord encryption yourself. Verify live DAVE negotiation with the supported library.

## 6. Commands and lifecycle

| Command | Behavior |
|---|---|
| /chat | Text reply, optionally queued for playback |
| /join | Join approved channel self-deafened |
| /say | Queue bounded submitted text |
| /volume | Adjust local playback volume |
| /voice on or off | Control automatic spoken replies |
| /stop | Cancel synthesis/playback, clear queue, disable automatic speech |
| /leave | Stop and disconnect |

Require the invoking member to be in the approved voice channel as well as the approved text channel for voice operations. Recheck authorization after awaiting a lock. Automatic speech starts disabled; use an authorization generation counter to invalidate pending AI replies after stop, leave or mode changes. Use one worker and a bounded queue (the pilot used three queued entries). Rate-limit speech separately from inference. Keep synthesis and conversion cancellable. Complete playback futures safely from the audio callback thread.

On unauthorized bot movement or unexpected undeafening, disconnect. On participant departure, the pilot conservatively cancels all pending playback and disables automatic speech. Disconnect after five minutes of inactivity. Test event races and avoid lock/cancellation deadlocks. Turning automatic speech off prevents future automatic admissions; define and test whether already queued entries are cancelled separately.

## 7. Deployment and security boundaries

Use a non-root service UID, read-only root filesystem, small tmpfs, dropped Linux capabilities, no-new-privileges, PID/memory/CPU bounds, and bounded logging. Keep restart disabled during initial controlled activation. Use a healthcheck that reports recent readiness without credentials or messages.

Use a dedicated internal Docker bridge for speech connectivity rather than attaching the connector to the entire application network. Declare the network in Compose for both participants so recreation preserves membership. A manually attached network alone is not durable. An internal bridge is not endpoint authorization: for stronger isolation place a restricted proxy or authenticated adapter in front of the speech service and permit only the intended synthesis route and profile. The pilot validated bridge connectivity, not a fully enforced endpoint ACL.

Before activation, publish accurate privacy and terms disclosures and notify authorized participants. Explain local text synthesis, voice-state metadata, audible speech, and the absence of participant listening/recording. Do not claim that Discord or other participants retain nothing.

## 8. Verification gates

| Stage | Required evidence |
|---|---|
| Dependency build | Imports, pip check, FFmpeg and Opus availability |
| Audio unit tests | Synthetic WAV conversion, frame alignment, malformed input rejection |
| Controller tests | Queue bound, cancellation during synthesis, volume and disconnect |
| Startup tests | Exact guild command set, missing permissions rejected, no unexpected commands |
| Live synthesis | Actual local TTS WAV converted and encoded |
| Cutover | One active Gateway client, healthy container, original text chat works |
| Live voice | Join, say, volume, automatic chat speech, stop, off, leave |
| Negative tests | Wrong text/voice channel rejection |
| Lifecycle | Participant departure cancels playback, five-minute idle disconnect |
| Operations | Resource sample, policy publication, rollback preflight |

The pilot passed these live functional categories. Unexpected move/undeafen/disconnect safeguards were tested with simulated events; destructive command rollback was not exercised on production. Store executable tests and evidence rather than relying on screenshots or conversational claims.

## 9. Controlled cutover and rollback

Preserve the original image identity, configuration and any mounted source overlays with checksums. Save the original command schema. Prepare a REST-only rollback helper that verifies the application and guild, refuses foreign commands, and defaults to read-only. It should remove only the known added voice commands or restore the exact saved schema. Verify the final command list. Test actual deletion in a disposable guild first.

Stop the text client before starting the voice candidate. Never run two competing Gateway clients under the same token during cutover. Check health and run positive and negative acceptance. If unsuccessful, stop the candidate, restore command registration, then recreate the original container from the preserved configuration. Restoring only the image may fail if the original startup guard rejects newly registered commands.

## 10. Observed performance and open work

A point-in-time pilot sample showed about 37 MiB of connector memory and 0.01% CPU, with the speech adapter using about 52 MiB and 5.23% CPU. These figures exclude the inference and synthesis backends and do not measure peak load. Chat-to-voice latency was subjectively acceptable, not benchmarked. Record synthesis time, queue wait and time to first audible frame in future tests.

Remaining engineering work includes full reproducible dependency locks, durable deployment integration, endpoint restrictions, persistent automated regression tests and destructive rollback validation in a test guild. Do not treat functional acceptance as proof of these additional properties.

## 11. Handoff to an engineer or AI coding agent

1. Inspect the target repository and current deployment; record the accepted baseline and existing command set.
2. Implement Phase 1 in an isolated branch and pass its gates before adding voice.
3. Add the speech adapter and audio conversion with synthetic and real TTS tests.
4. Implement outbound-only voice commands, authorization, cancellation and idle behavior.
5. Run offline tests without credentials or external networking where possible.
6. Review privacy disclosures, dependency provenance, network isolation and rollback before live activation.
7. Obtain operator approval before changing live services or Discord registration; perform a single-client cutover.
8. Record actual test outputs, commit identity, image digest, dependency versions and unresolved risks. Never invent successful results.
9. Leave incoming audio disabled until a separate consent, privacy and security design is approved.

## Upstream references

- [Discord developer documentation](https://discord.com/developers/docs/intro)
- [discord.py documentation](https://discordpy.readthedocs.io/)
- [FFmpeg documentation](https://ffmpeg.org/documentation.html)
- [Docker Compose documentation](https://docs.docker.com/compose/)

This public guide intentionally omits deployment-specific identifiers, credentials and private application source.
