/**
 * 입력 필드 공통 (보드 2-01 ~ 2-05).
 * [data-ds-field] 가 테두리 상자이고 안에 input · 접두/접미 · 버튼이 들어간다.
 *   data-size      xs 24 · sm 28 · md 36 · lg 44
 *   data-variant   outlined · filled · underline · ghost
 *   data-invalid · data-readonly · data-disabled
 * 포커스는 :focus-within 으로 그린다 (강조색 테두리 + 3px 링).
 */
export const FIELD_CSS = `
[data-ds-field] {
    --_fr: var(--ds-radius-md);
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    min-width: 0;
    height: 36px;
    padding: 0 12px;
    font-family: inherit;
    font-size: 14px;
    color: var(--ds-color-foreground-primary);
    border-radius: var(--_fr);
    transition: border-color var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out), box-shadow var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out), background var(--ds-motion-duration-fast);
}
[data-ds-field][data-size="xs"] { height: 24px; padding: 0 8px; font-size: 12px; gap: 6px; --_fr: var(--ds-radius-sm); }
[data-ds-field][data-size="sm"] { height: 28px; padding: 0 10px; font-size: 12px; gap: 6px; --_fr: var(--ds-radius-sm); }
[data-ds-field][data-size="lg"] { height: 44px; padding: 0 14px; font-size: 16px; --_fr: var(--ds-radius-lg); }
[data-ds-field][data-multiline] { height: auto; padding-top: 8px; padding-bottom: 8px; align-items: stretch; }
[data-ds-field][data-full-width] { display: flex; width: 100%; }

[data-ds-field][data-variant="outlined"] {
    background: var(--ds-surface-card-background);
    border: 1px solid var(--ds-color-border-default);
}
[data-ds-field][data-variant="filled"] {
    background: var(--ds-surface-inset-background);
    border: 1px solid transparent;
}
[data-ds-field][data-variant="underline"] {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--ds-color-border-default);
    border-radius: 0;
    padding-left: 2px;
    padding-right: 2px;
}
[data-ds-field][data-variant="ghost"] {
    background: transparent;
    border: 1px solid transparent;
}
[data-ds-field][data-variant="ghost"]:hover:not([data-disabled]) { background: var(--ds-color-background-muted); }

/* focus */
[data-ds-field]:focus-within:not([data-disabled]):not([data-readonly]) {
    border-color: var(--ds-palette-primary-500);
    box-shadow: 0 0 0 3px var(--ds-color-focus-ring);
}
[data-ds-field][data-variant="underline"]:focus-within:not([data-disabled]):not([data-readonly]) {
    box-shadow: none;
    border-bottom: 2px solid var(--ds-palette-primary-500);
}
/* invalid */
[data-ds-field][data-invalid] { border-color: var(--ds-palette-danger-600); }
[data-ds-field][data-variant="underline"][data-invalid] { border-bottom: 2px solid var(--ds-palette-danger-600); }
[data-ds-field][data-invalid]:focus-within { border-color: var(--ds-palette-danger-600); box-shadow: 0 0 0 3px color-mix(in oklab, var(--ds-palette-danger-500) 28%, transparent); }
/* readOnly: 회색 바탕으로 편집 불가를 보인다 */
[data-ds-field][data-readonly] { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-secondary); }
[data-ds-field][data-variant="underline"][data-readonly] { background: transparent; }
[data-ds-field][data-disabled] { opacity: 0.5; cursor: not-allowed; }
[data-ds-field][data-disabled] * { cursor: not-allowed; }

/* 안쪽 요소 */
[data-ds-field] > input,
[data-ds-field] > textarea,
[data-ds-field] [data-slot="control"] {
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: inherit;
}
[data-ds-field] > textarea { resize: none; line-height: 1.5; }
[data-ds-field] > input::placeholder,
[data-ds-field] > textarea::placeholder { color: var(--ds-color-foreground-tertiary); opacity: 1; }
[data-ds-field][data-align="right"] { text-align: right; }
[data-ds-field][data-align="center"] { text-align: center; }
[data-ds-field][data-align="right"] > input,
[data-ds-field][data-align="right"] > textarea { font-variant-numeric: tabular-nums; }
[data-ds-field] [data-slot="adorn"] {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--ds-color-foreground-tertiary);
}
[data-ds-field] [data-slot="count"] {
    flex-shrink: 0;
    font-family: var(--ds-typography-font-family-mono);
    font-size: 12px;
    color: var(--ds-color-foreground-tertiary);
    font-variant-numeric: tabular-nums;
}
[data-ds-field] [data-slot="count"][data-over] { color: var(--ds-tone-danger-text); }
[data-ds-field] [data-slot="action"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 2px;
    margin: 0 -2px;
    border: none;
    border-radius: var(--ds-radius-xs);
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    cursor: pointer;
    line-height: 0;
}
[data-ds-field] [data-slot="action"]:hover { color: var(--ds-color-foreground-primary); background: var(--ds-color-background-muted); }
[data-ds-field] [data-slot="action"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }

/* addon: 테두리 밖에 붙는 고정 문구·버튼 */
[data-ds-field-group] { display: inline-flex; align-items: stretch; min-width: 0; }
[data-ds-field-group][data-full-width] { display: flex; width: 100%; }
[data-ds-field-group] > [data-ds-field] { flex: 1 1 auto; }
[data-ds-field-group] > [data-slot="addon"] {
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    font-size: 13px;
    color: var(--ds-color-foreground-tertiary);
    background: var(--ds-color-background-muted);
    border: 1px solid var(--ds-color-border-default);
    white-space: nowrap;
}
[data-ds-field-group] > [data-slot="addon"]:has(> [data-ds-button]) { padding: 0; border: none; background: transparent; }
[data-ds-field-group] > :first-child:not(:only-child) { border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important; }
[data-ds-field-group] > :last-child:not(:only-child) { border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important; }
[data-ds-field-group] > [data-slot="addon"]:first-child { border-radius: var(--ds-radius-md) 0 0 var(--ds-radius-md); border-right: none; }
[data-ds-field-group] > [data-slot="addon"]:last-child { border-radius: 0 var(--ds-radius-md) var(--ds-radius-md) 0; border-left: none; }
[data-ds-field-group] > [data-slot="addon"] > [data-ds-button] { height: 100%; border-radius: 0 var(--ds-radius-md) var(--ds-radius-md) 0; }
[data-ds-field-group] > [data-slot="addon"]:first-child > [data-ds-button] { border-radius: var(--ds-radius-md) 0 0 var(--ds-radius-md); }
[data-ds-field-group] > [data-ds-field]:not(:first-child) { margin-left: -1px; }
[data-ds-field-group] > [data-slot="addon"]:last-child > [data-ds-button] { margin-left: -1px; }
[data-ds-field-group] [data-ds-field] { border-radius: 0; }
[data-ds-field-group] > [data-ds-field]:first-child { border-radius: var(--_fr) 0 0 var(--_fr); }
[data-ds-field-group] > [data-ds-field]:last-child { border-radius: 0 var(--_fr) var(--_fr) 0; }
[data-ds-field-group] > [data-ds-field]:focus-within { z-index: 1; }

[data-ds-field-spinner] {
    width: 12px;
    height: 12px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: ds-spin 700ms linear infinite;
}

/* ── variant ── */
[data-ds-variant="neumorphism"] [data-ds-field][data-variant="outlined"],
[data-ds-variant="neumorphism"] [data-ds-field][data-variant="filled"] {
    background: var(--ds-surface-inset-background);
    border-color: transparent;
    box-shadow: var(--ds-surface-inset-shadow);
}
[data-ds-variant="brutalism"] [data-ds-field][data-variant="outlined"] {
    border: 2px solid var(--ds-color-foreground-primary);
    border-radius: 0;
}
[data-ds-variant="brutalism"] [data-ds-field]:focus-within:not([data-disabled]) {
    box-shadow: 3px 3px 0 var(--ds-color-foreground-primary);
    border-color: var(--ds-color-foreground-primary);
}
[data-ds-variant="retro"] [data-ds-field][data-variant="outlined"] {
    border: 2px solid var(--ds-palette-primary-300);
}
[data-ds-variant="glassmorphism"] [data-ds-field][data-variant="outlined"] {
    background: rgba(255, 255, 255, 0.55);
    border-color: rgba(255, 255, 255, 0.75);
    box-shadow: inset 0 1px 2px rgba(30, 35, 50, 0.06);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
}
[data-ds-variant="glassmorphism"][data-ds-mode="dark"] [data-ds-field][data-variant="outlined"] {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.14);
}
[data-ds-variant="glassmorphism"] [data-ds-field][data-readonly] { background: rgba(255, 255, 255, 0.25); }
[data-ds-variant="glassmorphism"][data-ds-mode="dark"] [data-ds-field][data-readonly] { background: rgba(255, 255, 255, 0.03); }
`.trim()

/** Label · FormField · Form (보드 3-04) */
export const FORM_CSS = `
[data-ds-label] {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--ds-color-foreground-secondary);
}
[data-ds-label][data-size="md"] { font-size: 14px; }
[data-ds-label] [data-slot="req"] { color: var(--ds-tone-danger-text); margin-left: 2px; }
[data-ds-label] [data-slot="opt"] { margin-left: 4px; font-weight: 400; color: var(--ds-color-foreground-tertiary); }
[data-ds-label] [data-slot="tip"] { display: inline-flex; margin-left: 4px; color: var(--ds-color-foreground-tertiary); cursor: help; border-radius: 50%; }
[data-ds-label] [data-slot="tip"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }
[data-ds-sr-only] { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

[data-ds-form-field] { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
[data-ds-form-field] [data-slot="label"] { display: flex; flex-direction: column; gap: 2px; }
[data-ds-form-field] [data-slot="desc"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-form-field] [data-slot="body"] { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
[data-ds-form-field] [data-slot="body"] > [data-ds-field],
[data-ds-form-field] [data-slot="body"] > [data-ds-field-group] { width: 100%; display: flex; }
[data-ds-form-field] [data-slot="hint"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-form-field] [data-slot="error"] { font-size: 12px; font-weight: 500; color: var(--ds-tone-danger-text); }
[data-ds-form-field][data-layout="horizontal"] { display: grid; grid-template-columns: var(--_lw, 120px) minmax(0, 1fr); align-items: start; gap: 4px 12px; }
[data-ds-form-field][data-layout="horizontal"] [data-slot="label"] { min-height: 36px; justify-content: center; }
[data-ds-form-field][data-layout="horizontal"] [data-slot="label"][data-align="right"] { align-items: flex-end; text-align: right; }
[data-ds-form-field][data-layout="horizontal"] [data-ds-label] { font-size: 13px; }
[data-ds-form-field][data-layout="inline"] { flex-direction: row; align-items: center; gap: 8px; }
[data-ds-form-field][data-layout="inline"] [data-slot="body"] { flex-direction: row; align-items: center; }
[data-ds-form-field][data-layout="inline"] [data-slot="body"] > [data-ds-field] { width: auto; }

[data-ds-form] > fieldset { display: grid; gap: 16px 20px; margin: 0; padding: 0; border: none; min-width: 0; }
[data-ds-form][data-layout="inline"] > fieldset { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
/* 읽기 전용 조회 화면: 테두리를 걷어 값만 읽히게 */
[data-ds-form][data-readonly] [data-ds-field] {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
    color: var(--ds-color-foreground-primary);
    pointer-events: none;
    text-align: left;
}
[data-ds-form][data-readonly] [data-ds-field] input { text-align: left; }
[data-ds-form][data-readonly] [data-ds-field] [data-slot="action"],
[data-ds-form][data-readonly] [data-ds-field] [data-chevron],
[data-ds-form][data-readonly] [data-ds-field] [data-ds-numberinput] button { display: none; }
`.trim()
