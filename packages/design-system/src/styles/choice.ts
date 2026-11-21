/** Checkbox · Radio · Switch (보드 2-04). 네이티브 input 에 appearance:none 을 입혀 키보드·폼 동작을 그대로 쓴다. */
const TONES = ['success', 'warning', 'danger', 'info', 'neutral']
export const CHOICE_CSS = `
[data-ds-checkbox], [data-ds-radio] {
    --_s: 16px;
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    flex-shrink: 0;
    width: var(--_s);
    height: var(--_s);
    box-sizing: border-box;
    display: inline-grid;
    place-content: center;
    border: 1.5px solid var(--ds-color-foreground-tertiary);
    background: var(--ds-surface-card-background);
    cursor: pointer;
    transition: background var(--ds-motion-duration-fast), border-color var(--ds-motion-duration-fast);
    --_on: var(--ds-palette-primary-600);
}
[data-ds-checkbox] { border-radius: 4px; }
[data-ds-radio] { border-radius: 50%; }
[data-ds-checkbox][data-size="xs"], [data-ds-radio][data-size="xs"] { --_s: 12px; }
[data-ds-checkbox][data-size="sm"], [data-ds-radio][data-size="sm"] { --_s: 14px; }
[data-ds-checkbox][data-size="lg"], [data-ds-radio][data-size="lg"] { --_s: 20px; }
${TONES.map((t) => `[data-ds-checkbox][data-tone="${t}"], [data-ds-switch][data-tone="${t}"] { --_on: var(--ds-tone-${t}-solid); }`).join('\n')}
[data-ds-checkbox]:checked, [data-ds-checkbox][data-indeterminate] { background: var(--_on); border-color: var(--_on); }
[data-ds-checkbox]:checked::after {
    content: "";
    width: calc(var(--_s) * 0.3);
    height: calc(var(--_s) * 0.56);
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: translateY(-1px) rotate(45deg);
}
[data-ds-checkbox][data-indeterminate]::after { content: ""; width: calc(var(--_s) * 0.5); height: 2px; background: #fff; transform: none; border: none; }
[data-ds-radio]:checked { border-color: var(--_on); }
[data-ds-radio]:checked::after { content: ""; width: calc(var(--_s) * 0.44); height: calc(var(--_s) * 0.44); border-radius: 50%; background: var(--_on); }
[data-ds-checkbox]:disabled, [data-ds-radio]:disabled { opacity: 0.45; cursor: not-allowed; }
[data-ds-checkbox]:focus-visible, [data-ds-radio]:focus-visible, [data-ds-switch]:focus-visible {
    outline: 2px solid var(--ds-palette-primary-500);
    outline-offset: 2px;
}

[data-ds-choice] {
    display: inline-flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    line-height: 1.4;
    color: var(--ds-color-foreground-primary);
    cursor: pointer;
    user-select: none;
}
[data-ds-choice][data-size="xs"], [data-ds-choice][data-size="sm"] { font-size: 13px; gap: 6px; }
[data-ds-choice] > input { margin-top: calc((1.4em - var(--_s)) / 2); }
[data-ds-choice][data-switch] { align-items: center; font-size: 13px; }
[data-ds-choice][data-switch] > input { margin-top: 0; }
[data-ds-choice] [data-slot="desc"] { display: block; margin-top: 2px; font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-choice][data-disabled] { color: var(--ds-color-foreground-tertiary); cursor: not-allowed; }

[data-ds-choice-group] { display: flex; flex-direction: column; gap: 8px; }
[data-ds-choice-group][data-direction="row"] { flex-direction: row; flex-wrap: wrap; gap: 8px 16px; }
[data-ds-choice-group][data-indent] { padding-left: 24px; }

/* card 형 */
[data-ds-choice-group][data-appearance="card"] { gap: 8px; }
[data-ds-choice][data-appearance="card"] {
    flex: 1 1 0;
    min-width: 0;
    gap: 10px;
    padding: 12px 14px;
    border-radius: var(--ds-radius-md);
    border: 1px solid var(--ds-color-border-default);
    background: var(--ds-surface-card-background);
    font-size: 13px;
}
[data-ds-choice][data-appearance="card"][data-checked] {
    border: 2px solid var(--ds-palette-primary-500);
    padding: 11px 13px;
    background: color-mix(in oklab, var(--ds-palette-primary-500) 7%, var(--ds-surface-card-background));
}
[data-ds-choice][data-appearance="card"] b { font-weight: 600; }
/* button 형: 동그라미는 숨기고 붙은 버튼처럼 */
[data-ds-choice-group][data-appearance="button"] { gap: 0; flex-wrap: nowrap; }
[data-ds-choice][data-appearance="button"] {
    position: relative;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ds-tone-neutral-text);
    border: 1px solid var(--ds-color-border-default);
    background: var(--ds-surface-card-background);
}
[data-ds-choice][data-appearance="button"][data-size="sm"] { height: 28px; padding: 0 10px; font-size: 12px; }
[data-ds-choice][data-appearance="button"][data-size="xs"] { height: 24px; padding: 0 8px; font-size: 12px; }
[data-ds-choice][data-appearance="button"][data-size="lg"] { height: 44px; padding: 0 18px; font-size: 16px; }
[data-ds-choice][data-appearance="button"]:not(:first-child) { margin-left: -1px; }
[data-ds-choice][data-appearance="button"]:first-child { border-radius: var(--ds-radius-md) 0 0 var(--ds-radius-md); }
[data-ds-choice][data-appearance="button"]:last-child { border-radius: 0 var(--ds-radius-md) var(--ds-radius-md) 0; }
[data-ds-choice][data-appearance="button"] > input { position: absolute; opacity: 0; width: 100%; height: 100%; margin: 0; inset: 0; cursor: pointer; }
[data-ds-choice][data-appearance="button"]:hover:not([data-disabled]) { background: var(--ds-color-background-muted); }
[data-ds-choice][data-appearance="button"][data-checked] {
    z-index: 1;
    color: var(--ds-tone-accent-text);
    background: color-mix(in oklab, var(--ds-palette-primary-500) 14%, var(--ds-surface-card-background));
    border-color: color-mix(in oklab, var(--ds-palette-primary-500) 55%, transparent);
}
[data-ds-choice][data-appearance="button"]:has(> input:focus-visible) { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 2px; z-index: 2; }

/* Switch */
[data-ds-switch] {
    --_w: 36px;
    --_h: 20px;
    --_on: var(--ds-palette-primary-600);
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    flex-shrink: 0;
    position: relative;
    width: var(--_w);
    height: var(--_h);
    border-radius: 999px;
    border: none;
    background: var(--ds-color-border-default);
    cursor: pointer;
    transition: background var(--ds-motion-duration-fast);
}
[data-ds-switch]::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(var(--_h) - 4px);
    height: calc(var(--_h) - 4px);
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(26, 24, 29, 0.3);
    transition: transform var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-out);
}
[data-ds-switch]:checked { background: var(--_on); }
[data-ds-switch]:checked::before { transform: translateX(calc(var(--_w) - var(--_h))); }
[data-ds-switch][data-size="xs"] { --_w: 24px; --_h: 14px; }
[data-ds-switch][data-size="sm"] { --_w: 28px; --_h: 16px; }
[data-ds-switch][data-size="lg"] { --_w: 44px; --_h: 24px; }
[data-ds-switch]:disabled { opacity: 0.45; cursor: not-allowed; }
[data-ds-switch-loading] { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 20px; color: var(--ds-color-foreground-tertiary); }
[data-ds-switch-loading][data-size="xs"] { width: 24px; }
[data-ds-switch-loading][data-size="sm"] { width: 28px; }
[data-ds-switch-loading][data-size="lg"] { width: 44px; }

/* variant */
[data-ds-variant="brutalism"] [data-ds-checkbox], [data-ds-variant="brutalism"] [data-ds-radio] { border: 2px solid var(--ds-color-foreground-primary); }
[data-ds-variant="brutalism"] [data-ds-checkbox] { border-radius: 0; }
[data-ds-variant="brutalism"] [data-ds-switch] { outline: 2px solid var(--ds-color-foreground-primary); outline-offset: -2px; }
[data-ds-variant="brutalism"] [data-ds-switch]::before { box-shadow: none; border: 2px solid var(--ds-color-foreground-primary); box-sizing: border-box; }
[data-ds-variant="neumorphism"] [data-ds-switch]:not(:checked) { background: var(--ds-surface-inset-background); box-shadow: var(--ds-surface-inset-shadow); }
[data-ds-variant="glassmorphism"] [data-ds-switch]::before { background: linear-gradient(-75deg, rgba(255,255,255,0.7), #fff, rgba(255,255,255,0.7)); box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 -1px 1px rgba(0,0,0,0.08); }
[data-ds-variant="glassmorphism"] [data-ds-checkbox]:not(:checked):not([data-indeterminate]),
[data-ds-variant="glassmorphism"] [data-ds-radio] { background: rgba(255,255,255,0.45); }
[data-ds-variant="glassmorphism"][data-ds-mode="dark"] [data-ds-checkbox]:not(:checked):not([data-indeterminate]),
[data-ds-variant="glassmorphism"][data-ds-mode="dark"] [data-ds-radio] { background: rgba(255,255,255,0.06); }
`.trim()
