# Damien's desktop

My portfolio: a macOS-inspired desktop built with React and Vite, with a glass dock, solid graphite windows, a sculptural black wallpaper, and Italian/English localization.

## Run locally

Use Node.js 22.12+.

```sh
cd react
npm ci
npm run dev
```

## Check and build

```sh
cd react
npm test
npm run lint
npm run build
npm run preview
```

## Content

- **Text and links:** `react/src/content.js` holds both translations, the social links and the public email. Italian is the default; the IT/EN switch saves the visitor's choice locally. There is no backend.
- **Apps:** the dock has Welcome, About, the Rebyte project (a work-in-progress marketplace, described in its own window with no link yet), GitHub, LinkedIn, Instagram, Contact and Settings. Social apps open the real profiles in a new tab. Contact's Email row opens the visitor's mail app and also copies the address.
- **Skills:** the logo grid in About comes from `react/src/skills.js`, generated from Simple Icons (CC0). To change it, edit the `pick` list in `react/scripts/gen-skills.cjs` and run `npm run skills`.
- **Wallpaper:** `react/public/wallpaper.jpg` is an original image generated with Codex and upscaled to 3200×2000. Prompt: OLED-black liquid glass folds, sinuous curves, delicate silver rim lighting and restrained blue/cyan/violet/amber refraction; wide landscape composition with a calm dark center, no text or UI.

Windows behave like macOS: drag them by the title bar, minimize into the dock and restore with position and scroll kept, maximize with the green button or a title-bar double-click, or find an app with Ctrl+K / Command+K. Settings contains Reduce Motion and Language; the system reduced-motion preference is respected too.
