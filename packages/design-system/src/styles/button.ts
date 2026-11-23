/**
 * Button 스타일 레이어.
 *
 * Button 은 hover/active, 유리 테두리(::after), 반사광(::before), 링크 화살표(::after)처럼
 * 인라인 style 로는 표현할 수 없는 것이 많아 스타일을 전부 여기로 옮겼다.
 * 컴포넌트는 [data-ds-button] 과 data-appearance / data-tone / data-size / data-shape 만 붙인다.
 * 인라인 style 을 쓰지 않으므로 InteractionStyles 와 달리 !important 가 필요 없다.
 *
 * 톤 변수
 *   --ds-tone-<tone>-text   soft·outline·ghost·link 글자색 (라이트 700, 다크 300 단계)
 *   --ds-tone-<tone>-solid  solid 배경
 *   --ds-tone-<tone>-on     solid 위 글자색
 * 모드 요소([data-ds-mode]) 자체에 선언해서, 상속으로 가장 가까운 Provider 의 모드를 따른다.
 */

const TONES = [
    ['accent', 'primary'],
    ['success', 'success'],
    ['warning', 'warning'],
    ['danger', 'danger'],
    ['info', 'info'],
] as const

const toneVars = (textStep: number) =>
    [
        ...TONES.map(
            ([tone, palette]) =>
                `--ds-tone-${tone}-text: var(--ds-palette-${palette}-${textStep});` +
                ` --ds-tone-${tone}-solid: var(--ds-palette-${palette}-${tone === 'warning' ? 700 : 600});` +
                ` --ds-tone-${tone}-on: #fff;`,
        ),
    ].join('\n    ')

const toneClass = (tone: string) => `[data-ds-button][data-tone="${tone}"] {
    --_c: var(--ds-tone-${tone}-text);
    --_cs: var(--ds-tone-${tone}-solid);
    --_on: var(--ds-tone-${tone}-on);
}`

const GLASS = '[data-ds-variant="glassmorphism"]'
const GLASS_DARK = '[data-ds-variant="glassmorphism"][data-ds-mode="dark"]'
const NOT_LINK = ':not([data-appearance="link"])'
const ENABLED = ':not(:disabled)'

/** 무색 유리 배경. 다크는 흰 광택을 줄여 회색 판처럼 보이지 않게 한다. */
const glassFill = (lo: number, hi: number) =>
    `linear-gradient(-75deg, rgba(255,255,255,${lo}), rgba(255,255,255,${hi}), rgba(255,255,255,${lo}))`
const accentFill = (a: number, b: number) =>
    `linear-gradient(-75deg, color-mix(in oklab, var(--ds-palette-primary-700) ${a}%, transparent), color-mix(in oklab, var(--ds-palette-primary-600) ${b}%, transparent), color-mix(in oklab, var(--ds-palette-primary-700) ${a}%, transparent))`

const ICON_ARROW =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E\")"
const ICON_EXTERNAL =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 17 17 7M8 7h9v9'/%3E%3C/svg%3E\")"

export const BUTTON_CSS = `
[data-ds-mode] {
    ${toneVars(700)}
    --ds-tone-neutral-text: var(--ds-palette-neutral-700);
    --ds-tone-neutral-solid: var(--ds-palette-neutral-800);
    --ds-tone-neutral-on: var(--ds-palette-neutral-50);
}
[data-ds-mode="dark"] {
    ${toneVars(300)}
    --ds-tone-neutral-text: var(--ds-palette-neutral-300);
    --ds-tone-neutral-solid: var(--ds-palette-neutral-200);
    --ds-tone-neutral-on: var(--ds-palette-neutral-900);
}

[data-ds-button] {
    --_bw: 1px;
    --_bdc: transparent;
    --_sh: none;
    --_ctl: transparent;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;
    height: 36px;
    padding: 0 14px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    text-decoration: none;
    color: var(--_c);
    background: transparent;
    border: var(--_bw) solid transparent;
    --_r: var(--ds-radius-md);
    border-radius: var(--_r);
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    transition:
        background var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out),
        border-color var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out),
        color var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out),
        box-shadow var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out),
        filter var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out),
        transform 100ms var(--ds-motion-easing-ease-out);
}
${['accent', 'neutral', 'success', 'warning', 'danger', 'info'].map(toneClass).join('\n')}

/* ── appearance ─────────────────────────────── */
[data-ds-button][data-appearance="solid"] {
    background: var(--_cs);
    color: var(--_on);
    border-color: var(--_bdc);
    box-shadow: var(--_sh);
}
/* 주 버튼은 variant 가 정한 accent 처리(그라디언트·테두리·그림자)를 그대로 쓴다. */
[data-ds-button][data-appearance="solid"][data-tone="accent"] {
    background: var(--ds-color-accent-background);
    color: var(--ds-color-accent-color);
    border: var(--ds-color-accent-border);
    box-shadow: var(--ds-color-accent-shadow);
}
[data-ds-button][data-appearance="soft"] {
    background: color-mix(in oklab, var(--_cs) 14%, transparent);
    border-color: var(--_bdc);
    box-shadow: var(--_sh);
}
[data-ds-button][data-appearance="outline"] {
    background: var(--_ctl);
    border-color: var(--_olc, color-mix(in oklab, var(--_cs) 45%, transparent));
    box-shadow: var(--_sh);
}
[data-ds-button][data-tone="neutral"][data-appearance="outline"] {
    --_olc: var(--ds-color-border-default);
}
[data-ds-button][data-appearance="link"] {
    height: auto;
    padding: 0 2px;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
}

/* ── hover / active ─────────────────────────── */
[data-ds-button][data-appearance="solid"]${ENABLED}:hover {
    background: color-mix(in oklab, var(--_cs) 86%, #000);
}
[data-ds-button][data-appearance="solid"][data-tone="accent"]${ENABLED}:hover {
    background: var(--ds-color-accent-hover-background);
}
[data-ds-button][data-appearance="solid"][data-tone="accent"]${ENABLED}:active {
    background: var(--ds-color-accent-active-background);
}
[data-ds-button][data-appearance="soft"]${ENABLED}:hover {
    background: color-mix(in oklab, var(--_cs) 22%, transparent);
}
[data-ds-button][data-appearance="outline"]${ENABLED}:hover,
[data-ds-button][data-appearance="ghost"]${ENABLED}:hover {
    background: color-mix(in oklab, var(--_cs) 9%, transparent);
}
[data-ds-button]${NOT_LINK}${ENABLED}:active {
    transform: translateY(1px);
    filter: brightness(0.92);
}
[data-ds-button][data-appearance="link"]${ENABLED}:hover {
    text-decoration-thickness: 2px;
}

/* ── link 스타일 ────────────────────────────── */
[data-ds-button][data-link-style="hover"] { text-decoration: none; }
[data-ds-button][data-link-style="hover"]${ENABLED}:hover { text-decoration: underline; }
[data-ds-button][data-link-style="arrow"],
[data-ds-button][data-link-style="external"] {
    text-decoration: none;
    gap: 4px;
}
[data-ds-button][data-link-style="arrow"]::after,
[data-ds-button][data-link-style="external"]::after {
    content: "";
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    background: currentColor;
    -webkit-mask: var(--_ico) center / contain no-repeat;
    mask: var(--_ico) center / contain no-repeat;
    transition: transform 150ms var(--ds-motion-easing-ease-out);
}
[data-ds-button][data-link-style="arrow"] { --_ico: ${ICON_ARROW}; }
[data-ds-button][data-link-style="external"] { --_ico: ${ICON_EXTERNAL}; }
[data-ds-button][data-link-style="arrow"]${ENABLED}:hover::after { transform: translateX(3px); }
[data-ds-button][data-link-style="external"]${ENABLED}:hover::after { transform: translate(2px, -2px); }

/* ── size ───────────────────────────────────── */
[data-ds-button][data-size="xs"] { height: 24px; padding: 0 8px; font-size: 12px; gap: 4px; --_r: var(--ds-radius-sm); }
[data-ds-button][data-size="sm"] { height: 28px; padding: 0 10px; font-size: 12px; --_r: var(--ds-radius-sm); }
[data-ds-button][data-size="lg"] { height: 44px; padding: 0 18px; font-size: 16px; --_r: var(--ds-radius-lg); }
[data-ds-button][data-appearance="link"] { height: auto; padding: 0 2px; }

/* ── shape ──────────────────────────────────── */
[data-ds-button][data-shape="pill"] { --_r: var(--ds-radius-full); }
[data-ds-button][data-icon-only] { width: 36px; padding: 0; }
[data-ds-button][data-icon-only][data-size="xs"] { width: 24px; }
[data-ds-button][data-icon-only][data-size="sm"] { width: 28px; }
[data-ds-button][data-icon-only][data-size="lg"] { width: 44px; }
[data-ds-button][data-full-width] { width: 100%; }

/* ── ButtonGroup ────────────────────────────── */
[data-ds-button-group] { display: inline-flex; align-items: center; flex-wrap: wrap; }
[data-ds-button-group][data-orientation="vertical"] { flex-direction: column; align-items: stretch; flex-wrap: nowrap; }
[data-ds-button-group][data-full-width] { display: flex; width: 100%; }
[data-ds-button-group][data-full-width] > [data-ds-button] { flex: 1 1 0; }
[data-ds-button-group][data-attached] { flex-wrap: nowrap; }
[data-ds-button-group][data-attached] > [data-ds-button] { border-radius: 0; }
[data-ds-button-group][data-attached] > [data-ds-button]:hover,
[data-ds-button-group][data-attached] > [data-ds-button]:focus-visible { z-index: 1; }
[data-ds-button-group][data-attached][data-orientation="horizontal"] > [data-ds-button]:not(:first-child) { margin-left: calc(var(--_bw) * -1); }
[data-ds-button-group][data-attached][data-orientation="horizontal"] > [data-ds-button]:first-child { border-radius: var(--_r) 0 0 var(--_r); }
[data-ds-button-group][data-attached][data-orientation="horizontal"] > [data-ds-button]:last-child { border-radius: 0 var(--_r) var(--_r) 0; }
[data-ds-button-group][data-attached][data-orientation="horizontal"] > [data-ds-button]:only-child { border-radius: var(--_r); }
[data-ds-button-group][data-attached][data-orientation="vertical"] > [data-ds-button]:not(:first-child) { margin-top: calc(var(--_bw) * -1); }
[data-ds-button-group][data-attached][data-orientation="vertical"] > [data-ds-button]:first-child { border-radius: var(--_r) var(--_r) 0 0; }
[data-ds-button-group][data-attached][data-orientation="vertical"] > [data-ds-button]:last-child { border-radius: 0 0 var(--_r) var(--_r); }
/* 붙은 solid·soft 사이에는 글자색 기반의 옅은 구분선 */
[data-ds-button-group][data-attached][data-orientation="horizontal"] > [data-ds-button][data-appearance="solid"]:not(:first-child),
[data-ds-button-group][data-attached][data-orientation="horizontal"] > [data-ds-button][data-appearance="soft"]:not(:first-child) {
    border-left: 1px solid color-mix(in oklab, currentColor 30%, transparent);
}

/* ── 상태 ───────────────────────────────────── */
[data-ds-button][aria-pressed="true"] {
    background: color-mix(in oklab, var(--ds-palette-primary-500) 14%, transparent);
    color: var(--ds-tone-accent-text);
    border-color: color-mix(in oklab, var(--ds-palette-primary-500) 55%, transparent);
}
/* [data-appearance] 를 붙여 solid accent(속성 3개)보다 우선순위를 높인다 */
/* Toggle: ghost 는 눌려도 테두리 없이, soft + 의미 톤은 눌리면 그 톤 solid (예: 알람 켜짐) */
[data-ds-button][data-appearance="ghost"][aria-pressed="true"] { border-color: transparent; }
[data-ds-button][data-appearance="ghost"][data-tone="neutral"][data-icon-only][aria-pressed="true"] {
    background: color-mix(in oklab, var(--ds-color-foreground-primary) 10%, transparent);
    color: var(--ds-color-foreground-primary);
}
[data-ds-button][data-appearance="soft"][aria-pressed="true"]:not([data-tone="neutral"]):not([data-tone="accent"]) {
    background: var(--_cs);
    color: var(--_on);
    border-color: transparent;
}
${GLASS} [data-ds-button][data-appearance="soft"][aria-pressed="true"]:not([data-tone="neutral"]):not([data-tone="accent"]) {
    background: linear-gradient(-75deg, color-mix(in oklab, var(--_cs) 70%, transparent), color-mix(in oklab, var(--_cs) 82%, transparent), color-mix(in oklab, var(--_cs) 70%, transparent));
    color: var(--_on);
}

[data-ds-button][data-appearance]:disabled {
    cursor: not-allowed;
    background: var(--ds-color-background-muted);
    color: var(--ds-color-foreground-tertiary);
    border-color: transparent;
    box-shadow: none;
    filter: none;
    transform: none;
}
[data-ds-button][data-appearance="ghost"]:disabled,
[data-ds-button][data-appearance="link"]:disabled {
    background: transparent;
}
/* 로딩은 진행 중인 동작이라 색을 지우지 않는다. 비활성처럼 보이면 실패로 오해한다. */
[data-ds-button][aria-busy="true"]:disabled {
    cursor: progress;
}
[data-ds-button][data-appearance="solid"][data-tone="accent"][aria-busy="true"]:disabled {
    background: var(--ds-color-accent-background);
    color: var(--ds-color-accent-color);
    opacity: 0.85;
}

[data-ds-button-spinner] {
    width: 12px;
    height: 12px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: ds-spin 700ms linear infinite;
}
[data-ds-button-icon] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
[data-ds-button-badge] {
    position: absolute;
    top: -7px;
    right: -7px;
    z-index: 2;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    box-sizing: border-box;
    border-radius: 999px;
    background: var(--ds-palette-danger-600);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
}
[data-ds-button] kbd {
    margin-left: 2px;
    font-weight: 600;
}

/* ── variant: 뉴모피즘 ──────────────────────── */
[data-ds-variant="neumorphism"] [data-ds-button] {
    --_sh: var(--ds-surface-card-shadow);
    --_ctl: var(--ds-surface-card-background);
}
[data-ds-variant="neumorphism"] [data-ds-button]${NOT_LINK}${ENABLED}:active {
    box-shadow: var(--ds-surface-inset-shadow);
    transform: none;
    filter: none;
}

/* ── variant: 브루탈리즘 ────────────────────── */
[data-ds-variant="brutalism"] [data-ds-button] {
    --_bw: 2px;
    --_bdc: var(--ds-color-foreground-primary);
    --_olc: var(--ds-color-foreground-primary);
    --_sh: 3px 3px 0 var(--ds-color-foreground-primary);
    --_ctl: var(--ds-surface-card-background);
}
[data-ds-variant="brutalism"] [data-ds-button]${NOT_LINK}${ENABLED}:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 var(--ds-color-foreground-primary);
    filter: none;
}

/* ── variant: 레트로 ────────────────────────── */
[data-ds-variant="retro"] [data-ds-button] {
    --_bw: 2px;
    --_sh: 0 3px 0 rgba(26, 24, 29, 0.25);
}

/* ── variant: 글래스모피즘 ──────────────────────
   유리는 무색이고 톤은 글자색으로만 드러낸다.
   주 버튼(solid accent)만 애플 prominent 처럼 강조색으로 유리를 채우고 흰 글자를 쓴다. */
${GLASS} [data-ds-button]${NOT_LINK} {
    --_rim: rgba(0, 0, 0, 0.5);
    isolation: isolate;
    color: var(--ds-color-foreground-primary);
    border-color: transparent;
    background: ${glassFill(0.05, 0.22)};
    box-shadow:
        inset 0 2px 2px rgba(0, 0, 0, 0.05),
        inset 0 -2px 2px rgba(255, 255, 255, 0.5),
        0 4px 2px -2px rgba(0, 0, 0, 0.2),
        inset 0 0 2px 4px rgba(255, 255, 255, 0.18);
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
}
/* 테두리: 원뿔 그라디언트로 위·아래 모서리에만 진한 림을 둔다 */
${GLASS} [data-ds-button]${NOT_LINK}::after {
    content: "";
    position: absolute;
    inset: -0.5px;
    border-radius: inherit;
    padding: 1px;
    pointer-events: none;
    z-index: 1;
    background:
        conic-gradient(from -75deg at 50% 50%, var(--_rim), transparent 5% 40%, var(--_rim) 50%, transparent 60% 95%, var(--_rim)),
        linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
/* 반사광: 위쪽 부드러운 하이라이트 (사선 띠는 작은 버튼에서 얼룩처럼 보여 쓰지 않는다) */
${GLASS} [data-ds-button]${NOT_LINK}::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
    mix-blend-mode: screen;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0) 55%);
}
${GLASS} [data-ds-button]${NOT_LINK}${ENABLED}:hover::before {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 60%);
}
${GLASS} [data-ds-button]${NOT_LINK}${ENABLED}:active {
    transform: scale(0.975);
    filter: none;
    box-shadow:
        inset 0 2px 2px rgba(0, 0, 0, 0.05),
        inset 0 -2px 2px rgba(255, 255, 255, 0.5),
        0 2px 2px -2px rgba(0, 0, 0, 0.2),
        inset 0 4px 1px rgba(0, 0, 0, 0.12);
}
${GLASS} [data-ds-button]${NOT_LINK}${ENABLED}:active::before {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 50%);
}
${GLASS} [data-ds-button][data-appearance="solid"],
${GLASS} [data-ds-button][data-appearance="soft"],
${GLASS} [data-ds-button][data-appearance="outline"] {
    color: var(--_c);
}
${GLASS} [data-ds-button][data-appearance="solid"]${ENABLED}:hover,
${GLASS} [data-ds-button][data-appearance="soft"]${ENABLED}:hover,
${GLASS} [data-ds-button][data-appearance="outline"]${ENABLED}:hover {
    background: ${glassFill(0.1, 0.32)};
}
${GLASS} [data-ds-button][data-appearance="ghost"] {
    color: var(--_c);
    background: transparent;
    box-shadow: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
}
${GLASS} [data-ds-button][data-appearance="ghost"]::before,
${GLASS} [data-ds-button][data-appearance="ghost"]::after {
    display: none;
}
${GLASS} [data-ds-button][data-appearance="ghost"]${ENABLED}:hover {
    background: rgba(255, 255, 255, 0.18);
}
${GLASS} [data-ds-button][aria-pressed="true"] {
    color: var(--ds-tone-accent-text);
    background: ${glassFill(0.05, 0.22)};
}
${GLASS} [data-ds-button]${NOT_LINK}:disabled {
    --_rim: rgba(0, 0, 0, 0.25);
    color: var(--ds-color-foreground-tertiary);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: none;
}
${GLASS} [data-ds-button]${NOT_LINK}:disabled::before {
    display: none;
}

/* 주 버튼 = prominent */
${GLASS} [data-ds-button][data-appearance="solid"][data-tone="accent"] {
    --_rim: color-mix(in oklab, var(--ds-palette-primary-900) 75%, transparent);
    color: #fff;
    text-shadow: 0 1px 1px rgba(40, 10, 70, 0.3);
    background: ${accentFill(80, 86)};
}
${GLASS} [data-ds-button][data-appearance="solid"][data-tone="accent"]::before {
    opacity: 0.6;
}
${GLASS} [data-ds-button][data-appearance="solid"][data-tone="accent"]${ENABLED}:hover {
    background: ${accentFill(88, 94)};
}
${GLASS} [data-ds-button][data-appearance="solid"][data-tone="accent"]${ENABLED}:active {
    background: linear-gradient(-75deg, color-mix(in oklab, var(--ds-palette-primary-800) 90%, transparent), color-mix(in oklab, var(--ds-palette-primary-700) 94%, transparent), color-mix(in oklab, var(--ds-palette-primary-800) 90%, transparent));
}
${GLASS} [data-ds-button][data-appearance="solid"][data-tone="accent"][aria-busy="true"]:disabled {
    color: #fff;
    background: ${accentFill(72, 78)};
    opacity: 1;
}

/* 다크: 흰 광택을 줄인다 */
${GLASS_DARK} [data-ds-button]${NOT_LINK} {
    --_rim: rgba(0, 0, 0, 0.6);
    background: ${glassFill(0.02, 0.09)};
    box-shadow:
        inset 0 2px 2px rgba(0, 0, 0, 0.2),
        inset 0 -1px 1px rgba(255, 255, 255, 0.22),
        0 4px 4px -2px rgba(0, 0, 0, 0.45),
        inset 0 0 2px 3px rgba(255, 255, 255, 0.05);
}
${GLASS_DARK} [data-ds-button]${NOT_LINK}::after {
    background:
        conic-gradient(from -75deg at 50% 50%, var(--_rim), transparent 5% 40%, var(--_rim) 50%, transparent 60% 95%, var(--_rim)),
        linear-gradient(rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.28));
}
${GLASS_DARK} [data-ds-button]${NOT_LINK}::before {
    opacity: 0.35;
}
${GLASS_DARK} [data-ds-button][data-appearance="ghost"] {
    background: transparent;
    box-shadow: none;
}
${GLASS_DARK} [data-ds-button][data-appearance="ghost"]${ENABLED}:hover {
    background: rgba(255, 255, 255, 0.08);
}
${GLASS_DARK} [data-ds-button][data-appearance="solid"]${ENABLED}:hover,
${GLASS_DARK} [data-ds-button][data-appearance="soft"]${ENABLED}:hover,
${GLASS_DARK} [data-ds-button][data-appearance="outline"]${ENABLED}:hover {
    background: ${glassFill(0.05, 0.16)};
}
${GLASS_DARK} [data-ds-button][aria-pressed="true"] {
    background: ${glassFill(0.02, 0.09)};
}
${GLASS_DARK} [data-ds-button]${NOT_LINK}:disabled {
    background: rgba(255, 255, 255, 0.04);
}
${GLASS} [data-ds-button][data-appearance="solid"][data-tone="accent"]:disabled:not([aria-busy="true"]) {
    --_rim: rgba(0, 0, 0, 0.25);
    color: var(--ds-color-foreground-tertiary);
    text-shadow: none;
    background: rgba(255, 255, 255, 0.12);
}
${GLASS_DARK} [data-ds-button][data-appearance="solid"][data-tone="accent"]:not(:disabled) {
    --_rim: rgba(255, 255, 255, 0.35);
    background: linear-gradient(-75deg, color-mix(in oklab, var(--ds-palette-primary-700) 78%, transparent), color-mix(in oklab, var(--ds-palette-primary-600) 84%, transparent), color-mix(in oklab, var(--ds-palette-primary-700) 78%, transparent));
}

@media (prefers-reduced-transparency: reduce) {
    ${GLASS} [data-ds-button] {
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
    }
}
`.trim()
