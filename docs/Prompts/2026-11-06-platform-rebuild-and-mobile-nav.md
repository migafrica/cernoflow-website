# Prompt — Platform page responsive rebuild, mobile menu, platform copy pass

Date: 2026-11-06 · Author: Miguel Silva (with Claude) · Repo: cernoflow-website · Branch: main
Follows: `2026-11-06-pt-pt-pass.md` (pushed; `main` = `origin/main` at `183eea4`).

## Problem

1. `platform.html` is one fixed full-screen stage (`body { overflow: hidden }`, `.stage { height: calc(100vh - 64px) }`). Headline, wheel, a left "Explore" panel and the conversation compete for one screen with absolute positioning. At 1366×768 the headline is pushed out and the conversation covers the right of the outer ring. On phones the conversation sits over the wheel and the side panels collapse to a few words per line. "Hover to explore" cannot work on touch.
2. Both `index.html` and `platform.html` hide `.topbar-nav` at ≤880px with no replacement, so there is no menu on phones.
3. Several wheel tooltips misstate the model or carry pre-glossary PT.

## Decisions (do not reopen)

- Keep the animation. Rebuild the layout around three bands; the visual design (colours, wedge geometry, tints, typography, vignette, grain) stays.
- The left "Explore" side panel is removed. Its job moves to a **wedge card** that lives next to or below the wheel.
- The page scrolls. No layout may depend on a fixed viewport height.
- Phones get no live animation: a static transcript plus a static wheel illustration and a tappable list of the ten areas.
- One mobile menu pattern shared by both pages.

## Scope

In: `platform.html`, `index.html` (nav only), new `assets/js/nav.js`, `docs/translation-review.md`, `docs/glossary.md` if a term changes.
Out: `cases/mobility.html`, homepage layout other than the nav, `assets/css/` (do not stage).

## Mandatory read steps

1. `git status -sb`, `git log --oneline -3`. Expect `main` level with `origin/main` at `183eea4`, and only `assets/css/` and this prompt file untracked. Otherwise stop.
2. Read `platform.html` in full: the `<style>` block, the topbar markup, the `T` dictionaries (en/pt/es/fr), `INNER_WEDGES` / `OUTER_WEDGES`, `Conversation`, `App` (state: `headIn`, `convoIn`, `convoSettled`, `convoDone`, `hovered`, `tick`, `tipText`), and every CSS rule for `.scene`, `.heading-block`, `.diagram-wrap`, `.side-column*`, `.convo-floater*`, `.convo-inline`, `.timecode`, `.replay`.
3. Read the topbar markup and nav CSS in `index.html` (around `.topbar-nav`, `@media (max-width: 880px)`, light-theme overrides).
4. Read `assets/js/i18n.js` and `assets/js/theme.js` to see how shared scripts are loaded and how the language switch re-renders `platform.html` (`data-reload-on-lang`).

## Part A — Mobile menu (both pages)

A1. New file `assets/js/nav.js`, loaded by both pages next to `i18n.js`. It wires every `.nav-toggle` button:
- toggles `.open` on the `.topbar-nav` it controls (`aria-controls`), and sets `aria-expanded`;
- closes on Escape, on a click outside the topbar, and on any nav link click;
- closes the language menu when the nav opens, and vice versa;
- does nothing above 880px (the button is hidden there).

A2. Markup, both pages: add one button inside `.topbar-right`, before the language switcher:
`<button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false"><span class="i18n" data-en="Menu" data-pt="Menu" data-es="Menú" data-fr="Menu">Menu</span></button>`
and give the existing `<nav class="topbar-nav">` `id="site-nav"`. Do not duplicate the links; the same `<nav>` becomes the panel on small screens.

A3. CSS, both pages, inside the existing `@media (max-width: 880px)` block (replace `.topbar-nav { display: none; }`):
- `.nav-toggle` shown, styled like `.lang-toggle` (same border, radius, padding, font, hover, light-theme overrides).
- `.topbar-nav` becomes a panel anchored under the topbar, full width with a 16px side gutter, stacked links (min 44px tap height), same background, border, blur and shadow as `.lang-menu`, hidden by default (opacity/pointer-events, as `.lang-menu` does) and shown with `.topbar-nav.open`.
- The underline hover effect (`a::after`) is disabled inside the panel.
- Light theme: mirror the `.lang-menu` light overrides.
Above 880px, `.nav-toggle { display: none; }` and the nav is unchanged.

A4. Platform nav PT fix: `data-pt="Casos práticos"` → `data-pt="Casos de utilização"`.

Commit: `feat(nav): mobile menu on homepage and platform page`

## Part B — Platform layout rebuild

### B1. Page flow
- Remove `overflow: hidden` from `html, body`. `.stage` becomes `min-height: calc(100svh - 64px)` with normal flow; keep `margin-top: 64px`, background, vignette and grain (vignette and grain become `position: fixed` so they cover the scrolling page).
- `.scene` stops being `position: absolute; inset: 0`. It becomes a normal-flow container (max-width 1280px, centred, padding 32px 24px 48px).
- The headline block sits at the top in flow. Remove `white-space: nowrap` from `.headline` so it wraps on narrow screens.

### B2. Layout bands (by width; use container-independent media queries)

**Wide, ≥1100px:** a two-column grid under the headline.
- Left column: `.diagram-wrap`, sized `width: min(100%, calc(100svh - 64px - var(--head-h) - 64px), 720px)` with a floor of `min(100%, 460px)`, `aspect-ratio: 1`. Set `--head-h` from the measured headline block height (ResizeObserver) or approximate with a CSS value; whichever, the wheel must never push the page into a horizontal scroll or overlap the right column.
- Right column (width 340–400px): the conversation panel (eyebrow "Design by conversation", rule, conversation), and below it the **wedge card**.
- The existing intro where the prompt types in the centre and then settles: keep it only in this band. The floater must settle into the real right-column slot, measured with a ref (`getBoundingClientRect` on the slot, recomputed on resize), not into a fixed offset. If that proves fragile, drop the centred phase and type directly in the right column; report which you did.

**Medium, 700–1099px:** single column.
- Headline, then the wheel at `width: min(92vw, 620px)`, then the conversation panel in flow (no centred phase, no slide), then the wedge card.

**Phone, <700px:** single column, no live animation.
- Headline and subtitle.
- **Transcript:** the user prompt and the AI lines rendered as a static list, all visible at once, in the existing conversation styles. No typing, no thinking dots, no timecode, no replay button.
- **Wheel illustration:** the wheel in its finished state (all wedges revealed, compliance frame, centre face), `width: calc(100vw - 32px)`, `max-width: 420px`, `aria-hidden="true"`, no pointer handlers. Arc labels may be too small at this size; that is acceptable because the list below carries the content.
- **Area list:** two groups, headed with the existing entity-ring label (`T.emLabel`) and a new `T.deliveryLabel` (see Part C). Each item is a button showing the wedge label; tapping it expands its card inline below the item (eyebrow + body from `T.tips`), tapping again collapses. One open at a time. Include the AI Co-designer and Compliance frame as two further items in a third short group "Across the platform" (`T.acrossLabel`).

### B3. Wedge card (wide and medium bands)
- Replaces the left side column. Default content: eyebrow `T.cardHintEyebrow` and body `T.cardHintHover` when `matchMedia('(hover: hover)')` matches, otherwise `T.cardHintTap`.
- Hover (on hover devices) or click/tap (all devices) on a wedge, the compliance frame or the centre face sets the selected key; the card shows that tip. On touch, tapping the same wedge again clears it. Keep the existing hover highlight on wedges; add the same highlight for the selected key.
- Wedges get `role="button"`, `tabindex="0"`, an `aria-label` with the wedge label, and Enter/Space select them. The card has `aria-live="polite"`.
- The card only becomes visible once the conversation has finished (reuse `convoDone`), as the left panel did.

### B4. Motion and replay
- `prefers-reduced-motion: reduce`: wide and medium bands render the finished state immediately (as the phone band does for the wheel), with the full conversation shown statically.
- Timecode and replay button: wide band only, positioned inside the stage, not overlapping the wheel or the right column.

### B5. Remove dead code
Remove `.side-column*` CSS and markup, `sideExploreEyebrow` / `sideExploreBody` from all four dictionaries, and any state used only by them. Keep `sideDesignEyebrow`.

Commit 1: `refactor(platform): scrollable page and normal-flow layout`
Commit 2: `feat(platform): wide, medium and phone layouts with wedge card`

## Part C — Platform copy

C1. New dictionary keys (all four languages; write ES and FR and log them in `docs/translation-review.md` under "platform.html rebuild"):

| key | EN | PT |
|---|---|---|
| `cardHintEyebrow` | Explore | Explorar |
| `cardHintHover` | Hover over any section of the model to see what it configures. | Passe o cursor sobre qualquer secção do modelo para ver o que configura. |
| `cardHintTap` | Tap any section of the model to see what it configures. | Toque em qualquer secção do modelo para ver o que configura. |
| `deliveryLabel` | DELIVERY | ENTREGA |
| `acrossLabel` | ACROSS THE PLATFORM | EM TODA A PLATAFORMA |

C2. EN replacements (ES and FR follow the EN meaning; log them):

- `subtitle`: `Define the entity model once — every form, view, record and audit trail derives from it.`
- `tips.lifecycle.body`: `The stages a record moves through and the transitions between them. Configure once and every screen, search and workflow knows where each record is in its journey.`
- `tips.views.body`: `Screens for working with each entity's records — forms, lists, dashboards. Generated from the entity model; you only leave out what a screen doesn't need.`
- `tips.surfaces.body`: `Where the solution reaches people — the Workspace for internal teams, the Portal for citizens and customers, and APIs for other systems. Views come from the model; each surface only chooses the container, what is editable and what is left out. One model, different audiences.`
- `tips.ai-agents.body`: `Attended agents that help a user, delegated agents that act on their behalf, autonomous agents that work the queue. All held to the same rules and the same audit trail as people — and none can clear a human approval step.`
- `tips.actors.body`: `The participants in the process: internal users, external users, system services and AI agents, all the same shape. Each Actor maps to one or more of the organisation's roles, and the model decides what each can see and do.`

C3. PT replacements (full values):

- `subtitle`: `A estrutura de entidades é modelada uma vez — formulários, vistas, documentos e registo de auditoria derivam dela.`
- `userPrompt`: `Cria uma solução de contratação pública em conformidade com as diretivas europeias e as boas práticas.`
- `aiDeploying`: `A colocar no sandbox`
- `tips.ai-center.eyebrow`: `Co-designer de IA`
- `tips.ai-center.body`: `Descreve-se em linguagem natural o que se pretende. O Co-designer transforma a descrição em entidades, ciclos de vida, workflows e superfícies — a solução completa. O utilizador fica na conversa, nunca na configuração.`
- `tips.compliance.body`: `O RGPD, o eIDAS, o MoReq e a ISO 15489 não são funcionalidades acrescentadas no fim. São requisitos transversais aplicados a todas as camadas — classificação de dados, registo de auditoria, prazos de conservação, assinatura eletrónica qualificada e requisitos mínimos de segurança.`
- `tips.structure.body`: `Definem-se as entidades, os campos e as relações entre eles. É a fonte única de verdade de onde deriva tudo o resto — formulários, validações e pesquisa, sem exceção.`
- `tips.lifecycle.body`: `Os estados por que passa cada registo e as transições entre eles. Configurado uma vez, cada ecrã, pesquisa e workflow sabe em que fase se encontra cada registo.`
- `tips.views.body`: `Os ecrãs de trabalho de cada entidade — formulários, listas e dashboards. Gerados a partir do modelo; só se retira o que um ecrã não precisa.`
- `tips.records.body`: `Quando um processo produz algo que tem de ser preservado — uma decisão, um contrato, uma licença — esse documento fica declarado como documento de arquivo, segundo a ISO 15489: da produção e classificação à conservação e eliminação.`
- `tips.actors.body`: `Os intervenientes no processo: utilizadores internos e externos, serviços de sistema e agentes de IA, todos com a mesma estrutura. Cada ator corresponde a um ou mais perfis da organização, e o modelo define o que cada um pode ver e fazer.`
- `tips.surfaces.eyebrow`: `Superfícies`
- `tips.surfaces.body`: `Onde a solução chega a quem a usa — o Workspace para os serviços internos, o Portal para munícipes e clientes, e APIs para outros sistemas. As vistas vêm do modelo; cada superfície escolhe apenas o enquadramento, o que é editável e o que fica de fora. O mesmo modelo, públicos diferentes.`
- `tips.ai-agents.eyebrow`: `Agentes de IA`
- `tips.ai-agents.body`: `Agentes assistidos que apoiam o utilizador, delegados que atuam em seu nome e autónomos que tratam filas de trabalho. Todos sujeitos às mesmas regras e ao mesmo registo de auditoria que as pessoas — e nenhum pode ultrapassar um passo de aprovação humana.`
- `tips.connectors.eyebrow`: `Conectores`
- `tips.connectors.body`: `Onde a plataforma se liga aos restantes sistemas: Sage e M365 de origem, e orquestração através do Power Automate e do n8n. Recebe dados, publica eventos e mantém os sistemas alinhados.`

All other PT keys: keep.

Commit: `content(platform): align wheel tips with the model; pt-PT pass`

## Verification

Serve locally (use a free port; 8080 is taken by Docker). For each viewport below, in EN and PT, check and report pass/fail per line:

| Viewport | Checks |
|---|---|
| 1920×1080 | Two columns; headline visible above the wheel; conversation never overlaps the wheel; card appears after the conversation; hover and click select wedges |
| 1440×900 | Same as above |
| 1366×768 | Same as above; page may scroll, but nothing overlaps; wheel ≥ 460px |
| 1024×768 | Medium band: wheel, then conversation, then card; tap/click selects |
| 820×1180 | Medium band |
| 390×844 | Phone band: transcript, static wheel, area list with one card open at a time; no horizontal scroll; menu button opens and closes the nav |
| 375×812 | Same as 390 |

Also:
- Homepage at 390×844: menu opens, links work, Escape and outside click close it, language menu and nav menu never open together. Light theme too.
- `prefers-reduced-motion: reduce` on platform at 1440×900: finished state, no animation.
- Keyboard: Tab reaches wedges in the medium and wide bands; Enter selects; the card announces.
- Console: no errors on either page in any band.
- Re-run the homepage i18n attribute check (0 malformed) and the PT banned-term scan (all 0).
- `git status -sb` shows only `assets/css/` untracked before pushing.

## Commit plan

1. `feat(nav): mobile menu on homepage and platform page` (include this prompt file)
2. `refactor(platform): scrollable page and normal-flow layout`
3. `feat(platform): wide, medium and phone layouts with wedge card`
4. `content(platform): align wheel tips with the model; pt-PT pass`

Then `git push origin main`, but only if every verification line passed. If anything failed, stop before pushing and report. Report: the verification table, whether the centred intro was kept or dropped (B2), and any band where the wheel floor or label fit had to be adjusted.
