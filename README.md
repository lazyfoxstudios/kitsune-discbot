# Kitsune OS · Discord

**kitsune-os-bot** is a private, experimental AI chat bot by **Lazy Fox Studios**. Kitsune is the character behind the conversation; Kitsune OS is the project identity.

The initial scope is basic text conversation for authorized users. AI replies can be inaccurate or inappropriate. Access is restricted; there is no public installation link or availability guarantee.

## Public project information

- [Landing page](https://lazyfoxstudios.github.io/kitsune-discbot/)
- [Terms of Service — private text-chat pilot](https://lazyfoxstudios.github.io/kitsune-discbot/terms.html)
- [Privacy Policy — private text-chat pilot](https://lazyfoxstudios.github.io/kitsune-discbot/privacy.html)
- Contact: [LazyFoxStudios.VR@gmail.com](mailto:LazyFoxStudios.VR@gmail.com)

GitHub Pages is enabled, and the Privacy URL returned HTTPS 200 during the November 25, 2026 review. A reachable website does not establish that the bot is connected or available. Source is in [docs/](docs/).

## Repository scope

This repository contains the static public website, branding and policies for the restricted text-chat pilot. The bot implementation remains private. It is not an installation package or a mirror of the application repository. Do not submit credentials, private conversations, personal information or confidential configuration in issues or pull requests. Send privacy and security concerns to the contact email instead.

The website has no chat interface, sign-in, analytics, third-party fonts or embedded external services. It uses local assets and a small script to pause the portrait animation. GitHub's hosting practices are separate from this website's code.

## Branding

The purple app icon and the supplied clean blinking Kitsune GIF are existing project artwork. The GIF is shown in full without a circular mask or ear crop. No replacement character or placeholder branding is used. The GIF filename has been simplified for the website; its bytes are unchanged. See [asset notes](docs/assets/README.md).

No open-source license is granted for the private application or branding by publishing this repository. Copyright and other applicable rights remain with their respective owners.

## Enable GitHub Pages

1. Open [Settings → Pages](https://github.com/lazyfoxstudios/kitsune-discbot/settings/pages).
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose **main** and **/docs**, then **Save**.
4. Enable **Enforce HTTPS** when available. Wait for the Pages deployment to finish.
5. Open all three intended URLs above and confirm that the images, navigation and policy draft labels load correctly.

The site is plain HTML/CSS/JavaScript. `docs/.nojekyll` disables Jekyll processing; no package installation, build command, custom domain or custom workflow is required.

Reference: [GitHub publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Pilot scope and further review

The November 25 policy revision describes a restricted, single-turn `/chat` pilot: current-message local AI processing, channel-visible replies, no connector transcript storage, bounded operational logs and explicit independent-provider/deletion limits. Private deployment, authenticated Discord startup and live positive/negative acceptance are separate checks. Broader access and additional features require another review. See [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md). These documents do not represent independent legal advice or certification.

© 2026 Lazy Fox Studios.
