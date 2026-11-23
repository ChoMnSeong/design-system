/** Slider · SegmentedControl. */
const TONES = ['accent', 'success', 'warning', 'danger', 'info', 'neutral']
export const MISC_CSS = `
[data-ds-slider] {
    --_c: var(--ds-palette-primary-600);
    position: relative;
    display: flex;
    align-items: center;
    min-width: 120px;
    height: 20px;
    box-sizing: border-box;
}
${TONES.map((t) => `[data-ds-slider][data-tone="${t}"] { --_c: var(--ds-tone-${t}-solid); }`).join('\n')}
[data-ds-slider][data-has-marks] { margin-bottom: 18px; }
[data-ds-slider] [data-slot="track"] {
    position: relative;
    flex: 1;
    height: 4px;
    border-radius: 999px;
    background: var(--ds-color-border-default);
}
[data-ds-slider] [data-slot="fill"] { position: absolute; top: 0; bottom: 0; border-radius: inherit; background: var(--_c); }
[data-ds-slider] [data-slot="thumb"] {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--_c);
    box-shadow: 0 1px 3px rgba(26, 24, 29, 0.25);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
}
[data-ds-slider] [data-slot="mark"] {
    position: absolute;
    top: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--ds-color-foreground-tertiary);
    transform: translate(-50%, -50%);
}
[data-ds-slider] [data-slot="mark"][data-on] { background: #fff; }
[data-ds-slider] [data-slot="mark-label"] {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: var(--ds-color-foreground-tertiary);
    font-family: var(--ds-typography-font-family-mono);
    white-space: nowrap;
}
[data-ds-slider] [data-slot="tooltip"] {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-foreground-primary);
    color: var(--ds-color-background-muted);
    font-size: 12px;
    font-weight: 600;
    font-family: var(--ds-typography-font-family-mono);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--ds-motion-duration-fast);
}
[data-ds-slider] [data-slot="tooltip"][data-show="always"],
[data-ds-slider] [data-slot="thumb"][data-active] [data-slot="tooltip"] { opacity: 1; }
[data-ds-slider] > input[type="range"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    pointer-events: none;
    z-index: 2;
    -webkit-appearance: none;
    appearance: none;
}
[data-ds-slider] > input[type="range"]::-webkit-slider-thumb { pointer-events: auto; width: 20px; height: 20px; -webkit-appearance: none; cursor: grab; }
[data-ds-slider] > input[type="range"]::-moz-range-thumb { pointer-events: auto; width: 20px; height: 20px; cursor: grab; }
[data-ds-slider]:not([data-has-range]) > input[type="range"]:only-of-type { pointer-events: auto; }
[data-ds-slider]:has(> input:focus-visible) [data-slot="thumb"][data-active] { box-shadow: 0 0 0 4px var(--ds-color-focus-ring); }
[data-ds-slider][data-disabled] { opacity: 0.5; }
[data-ds-slider][data-disabled] > input { cursor: not-allowed; }
/* 세로 */
[data-ds-slider][data-orientation="vertical"] { flex-direction: column; width: 20px; min-width: 0; height: 160px; }
[data-ds-slider][data-orientation="vertical"] [data-slot="track"] { width: 4px; height: auto; flex: 1; }
[data-ds-slider][data-orientation="vertical"] [data-slot="fill"] { left: 0; right: 0; top: auto; }
[data-ds-slider][data-orientation="vertical"] [data-slot="thumb"],
[data-ds-slider][data-orientation="vertical"] [data-slot="mark"] { left: 50%; top: auto; transform: translate(-50%, 50%); }
[data-ds-slider][data-orientation="vertical"] [data-slot="mark-label"] { top: 50%; left: 12px; transform: translateY(-50%); }
[data-ds-slider][data-orientation="vertical"] [data-slot="tooltip"] { bottom: 50%; left: calc(100% + 8px); transform: translateY(50%); }
[data-ds-slider][data-orientation="vertical"] > input[type="range"] { writing-mode: vertical-lr; direction: rtl; }

/* SegmentedControl */
[data-ds-segmented] {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 3px;
    box-sizing: border-box;
    background: color-mix(in oklab, var(--ds-color-foreground-primary) 7%, var(--ds-surface-card-background));
    border: 1px solid color-mix(in oklab, var(--ds-color-foreground-primary) 6%, transparent);
    border-radius: var(--ds-radius-lg);
}
[data-ds-segmented][data-full-width] { display: flex; width: 100%; }
[data-ds-segmented][data-full-width] > button { flex: 1 1 0; }
[data-ds-segmented] > button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 28px;
    min-width: 52px;
    padding: 0 14px;
    border: none;
    border-radius: var(--ds-radius-md);
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background var(--ds-motion-duration-fast), color var(--ds-motion-duration-fast), box-shadow var(--ds-motion-duration-fast);
}
[data-ds-segmented][data-size="xs"] { padding: 2px; }
[data-ds-segmented][data-size="xs"] > button { height: 20px; min-width: 36px; padding: 0 8px; font-size: 12px; }
[data-ds-segmented][data-size="sm"] { padding: 2px; }
[data-ds-segmented][data-size="sm"] > button { height: 22px; min-width: 44px; padding: 0 10px; font-size: 12px; }
[data-ds-segmented][data-size="lg"] > button { height: 36px; padding: 0 18px; font-size: 14px; }
[data-ds-segmented] > button:hover:not(:disabled) { color: var(--ds-color-foreground-primary); }
[data-ds-segmented] > button[aria-checked="true"] {
    background: var(--ds-surface-card-background);
    color: var(--ds-color-foreground-primary);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(26, 24, 29, 0.14), 0 0 0 1px color-mix(in oklab, var(--ds-color-foreground-primary) 8%, transparent);
}
[data-ds-mode="dark"] [data-ds-segmented] > button[aria-checked="true"] {
    background: color-mix(in oklab, var(--ds-color-foreground-primary) 18%, var(--ds-surface-card-background));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
[data-ds-segmented] > button:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }
[data-ds-segmented] > button:disabled { opacity: 0.45; cursor: not-allowed; }
[data-ds-variant="neumorphism"] [data-ds-segmented] { background: var(--ds-surface-inset-background); border-color: transparent; box-shadow: var(--ds-surface-inset-shadow); }
[data-ds-variant="neumorphism"] [data-ds-segmented] > button[aria-checked="true"] { box-shadow: var(--ds-surface-card-shadow); }
[data-ds-variant="brutalism"] [data-ds-segmented] { border: 2px solid var(--ds-color-foreground-primary); border-radius: 0; background: var(--ds-surface-card-background); }
[data-ds-variant="brutalism"] [data-ds-segmented] > button { border-radius: 0; }
[data-ds-variant="brutalism"] [data-ds-segmented] > button[aria-checked="true"] { background: var(--ds-color-foreground-primary); color: var(--ds-surface-card-background); box-shadow: none; }
[data-ds-variant="glassmorphism"] [data-ds-segmented] { background: rgba(255,255,255,0.35); border-color: rgba(255,255,255,0.6); }
[data-ds-variant="glassmorphism"][data-ds-mode="dark"] [data-ds-segmented] { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
[data-ds-variant="glassmorphism"] [data-ds-segmented] > button[aria-checked="true"] {
    background: linear-gradient(-75deg, rgba(255,255,255,0.35), rgba(255,255,255,0.78), rgba(255,255,255,0.35));
    box-shadow: 0 2px 3px -1px rgba(0,0,0,0.25), inset 0 -1px 1px rgba(255,255,255,0.7), 0 0 0 1px rgba(0,0,0,0.08);
}
[data-ds-variant="glassmorphism"][data-ds-mode="dark"] [data-ds-segmented] > button[aria-checked="true"] {
    background: linear-gradient(-75deg, rgba(255,255,255,0.1), rgba(255,255,255,0.24), rgba(255,255,255,0.1));
    box-shadow: 0 2px 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.12);
}
`.trim()
