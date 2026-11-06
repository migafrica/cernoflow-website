# Prompt — Follow-ups from the claims run, and an About section

Date: 2026-11-06 · Author: Miguel Silva (with Claude) · Repo: cernoflow-website · Branch: main
Follows: `2026-11-06-honest-claims-audiences-burger.md` (pushed; `origin/main` at `3577e4e`).

## Mandatory read steps

1. `git status -sb`, `git log --oneline -1`. Expect level with `origin/main` at `3577e4e`; only `assets/css/` and this file untracked. Otherwise stop.
2. Read in `index.html`: the paragraph beginning `Add a field to an entity`, the paragraph beginning `A Sage or M365 implementer`, `#section-why` heading and `.diff-closer`, the `IMPLEMENTER` label in the Who it's for graphic, `.usecase .uc-category` CSS, section K (`Brand close`) and the section before it, and every `section[id]` plus the topbar height.
3. Read `assets/js/i18n.js` to see when translations apply relative to page load.

## Rules

As before: every changed string gets `data-en/pt/es/fr` with inner text = EN; EN and PT below are final; write ES and FR and log them in `docs/translation-review.md` under "Follow-ups (2026-11-06)". Surgical edits, each unique.

## Step 1 — Remaining claims

1a. Paragraph beginning `Add a field to an entity`:
- EN: `Add a field to an entity and it appears everywhere the entity does — forms, lists, audit views, sealed records and mobile. The Studio Co-designer can add it for you, and the change itself is recorded as a governed event.`
- PT: `Quando acrescenta um campo a uma entidade, ele passa a aparecer em todo o lado onde a entidade aparece — formulários, listas, vistas de auditoria, documentos selados e telemóvel. O Co-designer do Studio pode acrescentá-lo por si, e a própria alteração fica registada como um evento auditável.`

1b. Paragraph beginning `A Sage or M365 implementer can stand up`:
- EN: `An ERP or Microsoft 365 implementer can stand up a governed client solution in days — not the months a Pega or Appian engagement would take. The platform handles the plumbing; you keep the domain conversation with the client.`
- PT: `Um implementador de ERP ou de Microsoft 365 pode pôr a funcionar uma solução governada para um cliente em dias — não nos meses que um projeto Pega ou Appian exigiria. A plataforma trata da parte técnica; a conversa de negócio com o cliente continua a ser sua.`

1c. Leave the Starting Points tip in `platform.html` unchanged: "form, API endpoint or integration" describes how a record enters, not a third-party integration.

Commit: `content: remove remaining vendor and integration wording`

## Step 2 — Pricing language without prices

2a. `#section-why` H2 `Enterprise-grade governance, priced for SMEs.`:
- EN `Enterprise-grade governance, sized for SMEs.` · PT `Governação de nível empresarial, à medida das PME.`

2b. `.diff-closer` tail span (keep the leading space):
- EN ` — built for the organisations that need governance but can't justify the platforms made for large enterprises.`
- PT ` — pensada para as organizações que precisam de governação, mas não justificam as plataformas feitas para grandes empresas.`

Commit: `content: drop price wording from Why CernoFlow`

## Step 3 — Small fixes

3a. Who it's for graphic: label `IMPLEMENTER` → EN `PARTNER` · PT `PARCEIRO` · ES `SOCIO` · FR `PARTENAIRE`. Check it still fits its position at desktop.

3b. `.usecase .uc-category`: `font-size: 11px`, `color: var(--ink-2)` (and the light-theme equivalent if one exists). Keep the rest.

3c. Anchor landing: every `section[id]` gets `scroll-margin-top` = topbar height + 16px. In `assets/js/i18n.js` (or `nav.js`, whichever runs after translations apply), if `location.hash` matches an element, scroll it into view again once translations are applied and once `document.fonts.ready` resolves, without smooth scrolling and only on initial load. Verify: from `platform.html`, the "Why CernoFlow" and "Who it's for" nav links land the section heading within 120px of the top in EN and PT, 12 runs each.

Commit: `fix: readable tile labels, partner graphic label, reliable anchor landing`

## Step 4 — About section

Add a new section immediately before section K (`Brand close`), using the existing section and container classes of a plain text section (match `#section-why`'s head block: kicker, H2-free, lead paragraph). `id="section-about"`, comment `<!-- ——— About ——— -->`. Not in the nav.

- Kicker: EN `About us` · PT `Quem somos`
- Paragraph (`lead-italic` style, max-width as other leads):
  - EN: `CernoFlow's founder has spent more than twenty years automating and improving the processes organisations can't afford to get wrong: in local government, in professional services firms running global mobility programmes, and in trade unions and bargaining councils. Along the way came the design of a case management platform used by more than sixty municipalities. That work showed, the hard way, where existing tools fall short: processes rebuilt for every new screen, audit trails pieced together after the fact, and rules that lived in people's heads instead of the system. CernoFlow is the platform that work called for: define the work once, govern it everywhere, and keep the proof as you go.`
  - PT: `O fundador do CernoFlow dedica-se há mais de vinte anos a automatizar e melhorar os processos que as organizações não podem falhar: na administração local, em empresas de serviços profissionais com programas de mobilidade internacional e em sindicatos e conselhos de negociação coletiva. Pelo caminho, concebeu uma plataforma de gestão de processos utilizada por mais de sessenta autarquias. Esse trabalho mostrou, da forma mais difícil, onde as ferramentas existentes ficam aquém: processos refeitos a cada novo ecrã, registos de auditoria montados depois do facto e regras que viviam na cabeça das pessoas em vez de estarem no sistema. O CernoFlow é a plataforma que esse trabalho pedia: definir o trabalho uma vez, aplicar as regras em todo o lado e guardar a prova à medida que se avança.`

Check at 1440, 980 and 390px in EN and PT: readable width, consistent spacing with neighbouring sections, no horizontal scroll.

Commit: `content: add About section`

## Verification and push

- Guards after, in `index.html`: `mobile, integrations` 0; `A Sage or M365 implementer` 0; `priced for SMEs` 0; `priced and timed` 0; `data-en="IMPLEMENTER"` 0; `section-about` ≥ 1.
- i18n attribute check: 0 malformed (excluding the script tag). PT banned-term scan: all 0.
- Anchor landing check from 3c passes.
- Console: no errors.
- `git status -sb`: only `assets/css/` untracked.

Include this prompt file in the first commit. Push to `origin/main` only if every check passes; otherwise stop and report. Report the guard table, the anchor-landing results, and the ES/FR strings written.
