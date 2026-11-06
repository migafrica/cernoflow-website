# Prompt — Logo to top, Local government, expanded About (all outstanding items)

Date: 2026-11-06 · Author: Miguel Silva (with Claude) · Repo: cernoflow-website · Branch: main

## Mandatory read steps

1. `git status -sb`, `git log --oneline -1`. Expect `main` level with `origin/main` at `284e655`; only `assets/css/` and this file untracked. Otherwise stop and report.
2. Read in `index.html`: the topbar wordmark markup, `#section-customers` (Who it's for), the use-case tiles, the comparison table header cells, and `#section-about`. Read `platform.html`'s `.wordmark-link` and `assets/js/nav.js`.

## Step 1 — Logo returns to top

On `index.html`, wrap the topbar wordmark in a link matching `platform.html`'s `wordmark-link` (same class, `href="./index.html"`, `aria-label="CernoFlow home"`), with no visual change. In `nav.js`, when a `.wordmark-link` is clicked and the visitor is already on the homepage, prevent navigation, scroll to the top (smooth, or instant under `prefers-reduced-motion`), clear any `#hash` with `history.replaceState`, and close the mobile menu if open. On `platform.html` keep the existing behaviour (go to the homepage, landing at the top).

Commit: `content(nav): logo returns to top`

## Step 2 — Local government instead of municipalities

"Autarquias" covers municipalities and parishes, so EN says "Local government". In `index.html`:
- Who it's for H3 `Municipalities.` → EN `Local government.` · PT unchanged `Autarquias.` · ES `Administración local.` · FR unchanged.
- Tile categories `Municipalities · Licensing` → EN `Local government · Licensing`; `Municipalities · Citizen service` → EN `Local government · Citizen service`. PT unchanged; ES `Administración local · Licencias` / `Administración local · Atención ciudadana`; FR unchanged.
- Table header `Built for SMEs, municipalities and their partners` → EN `Built for SMEs, local government and their partners` · PT unchanged · ES `Pensado para pymes, administración local y sus socios` · FR unchanged.
- Leave "more than sixty municipalities" in the About text as it is (a factual count).
Check the tile category labels still fit on one line at all widths.

Commit: `content: local government instead of municipalities`

## Step 3 — Expanded About section

Replace the About section's single paragraph with two `lead-italic` paragraphs, each its own `.i18n` element with `data-en`, `data-pt`, `data-es`, `data-fr` and inner text equal to `data-en`. Same styles as now, normal paragraph spacing between them, same max-width. Keep the kicker, section id and `data-section="about"` unchanged.

EN and PT below are final. Write ES (es-ES) and FR (fr-FR) yourself, using masculine forms for the founder as before, and log both paragraphs in `docs/translation-review.md` under "About expanded (2026-11-06)". Use straight double-quote delimiters; escape `&` as `&amp;`.

### Paragraph 1

EN:
`CernoFlow's founder has spent more than twenty years automating and improving the processes organisations can't afford to get wrong. In local government, that meant the work that revolves around land and property: rezoning, building permits, inspections, capital works projects, public events, health inspections, waste management (transporters and disposal operators), procurement and much more — every case tied to a place on the map, through integrations with GIS platforms such as ArcGIS Server and GeoServer. It also meant portals that brought external users into the process: homeowners requesting services and viewing their municipal bills, architects submitting building plans, construction firms delivering capital works, and citizens in general. Alongside that came professional services firms running global mobility, immigration and relocation programmes, and trade unions and bargaining councils. Along the way came the design of a case management platform used by more than sixty municipalities.`

PT:
`O fundador do CernoFlow dedica-se há mais de vinte anos a automatizar e melhorar os processos que as organizações não podem falhar. Na administração local, isso significou o trabalho que gira em torno do território e dos imóveis: alterações de uso do solo, licenciamento de obras, fiscalizações, empreitadas de obras públicas, eventos públicos, inspeções sanitárias, gestão de resíduos (transportadores e operadores de tratamento), contratação pública e muito mais — cada processo associado a um local no mapa, através de integrações com plataformas SIG como o ArcGIS Server e o GeoServer. Significou também portais que trouxeram utilizadores externos para dentro do processo: proprietários que fazem pedidos e consultam as suas faturas municipais, gabinetes de arquitetura que submetem projetos, empresas de construção que executam empreitadas e os munícipes em geral. A par disso, trabalhou com empresas de serviços profissionais em programas de mobilidade internacional, imigração e apoio à relocalização, e com sindicatos e conselhos de negociação coletiva. Pelo caminho, concebeu uma plataforma de gestão de processos utilizada por mais de sessenta autarquias.`

### Paragraph 2

EN:
`That work showed, the hard way, where existing tools fall short: processes rebuilt for every new screen, audit trails pieced together after the fact, and rules that lived in people's heads instead of the system. CernoFlow is the platform that work called for: define the work once, govern it everywhere, and keep the proof as you go.`

PT:
`Esse trabalho mostrou, da forma mais difícil, onde as ferramentas existentes ficam aquém: processos refeitos a cada novo ecrã, registos de auditoria montados depois do facto e regras que viviam na cabeça das pessoas em vez de estarem no sistema. O CernoFlow é a plataforma que esse trabalho pedia: definir o trabalho uma vez, aplicar as regras em todo o lado e guardar a prova à medida que se avança.`

## Verification

- Guards in `index.html` after: `data-en="Municipalities.` 0; `Municipalities · ` 0; `municipalities and their partners` 0; `wordmark-link` ≥ 1; `ArcGIS Server` ≥ 2 (EN data + inner text); `#section-about` contains exactly two `.i18n` paragraphs.
- i18n attribute check: 0 malformed (excluding the `i18n.js` script tag). PT banned-term scan from `2026-11-06-pt-pt-pass.md`: all 0.
- At 1440, 980 and 390px in EN and PT: both paragraphs visible (the reveal script must not hide them), readable line length, spacing consistent with neighbouring sections, no horizontal scroll.
- Logo: on the homepage at 1440 and 390px, clicking the logo after scrolling returns to the top, clears the hash and closes the mobile menu; on the platform page it goes to the homepage top.
- Console: no errors.
- `git status -sb`: only `assets/css/` untracked after committing.

## Commit and push

Step 3 commit: `content: expand About with land, property, GIS and portal experience`. Include this prompt file in the Step 1 commit.

Push to `origin/main` only if every check passes; otherwise stop and report. Report the guard table and the ES/FR strings written.
