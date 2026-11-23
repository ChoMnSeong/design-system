/** Calendar · DatePicker · DateRangePicker · TimePicker. */
export const DATE_CSS = `
[data-ds-calendar] { --_ch: 34px; font-size: 13px; color: var(--ds-color-foreground-primary); }
[data-ds-calendar] [data-slot="months"] { display: flex; gap: 20px; }
[data-ds-calendar] [data-slot="month"] { width: 280px; }
[data-ds-calendar][data-months="1"] [data-slot="month"] { width: 100%; min-width: 260px; }
[data-ds-calendar] [data-slot="head"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 28px;
    padding: 2px 2px 8px;
    font-size: 14px;
    font-weight: 600;
}
[data-ds-calendar] [data-slot="nav"] { display: inline-flex; gap: 2px; }
[data-ds-calendar] [data-slot="navbtn"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-foreground-secondary);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}
[data-ds-calendar] [data-slot="navbtn"][data-text] { padding: 0 8px; }
[data-ds-calendar] [data-slot="navbtn"]:hover { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-primary); }
[data-ds-calendar] [data-slot="navbtn"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }
[data-ds-calendar] [data-slot="grid"] { display: flex; flex-direction: column; gap: 2px; }
[data-ds-calendar] [data-slot="row"] { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px 0; }
[data-ds-calendar] [data-slot="wd"] { text-align: center; font-size: 12px; font-weight: 600; color: var(--ds-color-foreground-tertiary); padding: 4px 0; }
[data-ds-calendar] [data-slot="wd"][data-dow="0"] { color: var(--ds-tone-danger-text); }
[data-ds-calendar] [data-slot="wd"][data-dow="6"] { color: var(--ds-tone-info-text); }
[data-ds-calendar] [data-slot="day"] {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    height: var(--_ch);
    border-radius: var(--ds-radius-sm);
    font-family: var(--ds-typography-font-family-mono);
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    outline: none;
}
[data-ds-calendar] [data-slot="day"][data-empty] { cursor: default; }
[data-ds-calendar] [data-slot="day"]:hover:not([data-disabled]):not([data-selected]) { background: var(--ds-color-background-muted); }
[data-ds-calendar] [data-slot="day"]:focus-visible { box-shadow: inset 0 0 0 2px var(--ds-palette-primary-500); }
[data-ds-calendar] [data-slot="day"][data-holiday] { color: var(--ds-tone-danger-text); }
[data-ds-calendar] [data-slot="day"][data-saturday] { color: var(--ds-tone-info-text); }
[data-ds-calendar] [data-slot="day"][data-outside] { color: var(--ds-color-foreground-tertiary); opacity: 0.6; }
[data-ds-calendar] [data-slot="day"][data-today] > [data-slot="num"] { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }
[data-ds-calendar] [data-slot="day"][data-in-range] {
    border-radius: 0;
    background: color-mix(in oklab, var(--ds-palette-primary-500) 14%, transparent);
    color: var(--ds-tone-accent-text);
}
[data-ds-calendar] [data-slot="day"][data-selected] {
    background: var(--ds-color-accent-background);
    color: var(--ds-color-accent-color);
    font-weight: 700;
    box-shadow: var(--ds-color-accent-shadow);
}
[data-ds-calendar] [data-slot="day"][data-selected] [data-slot="sub"] { color: inherit; }
[data-ds-calendar] [data-slot="day"][data-disabled] { color: var(--ds-color-foreground-tertiary); opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }
[data-ds-calendar] [data-slot="mark"] { position: absolute; bottom: 4px; width: 4px; height: 4px; border-radius: 50%; background: var(--ds-palette-primary-500); }
[data-ds-calendar] [data-slot="day"][data-selected] [data-slot="mark"] { background: currentColor; }
/* 월·분기·연도 */
[data-ds-calendar] [data-slot="cells"] { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; min-width: 240px; }
[data-ds-calendar] [data-slot="cells"][data-cols="2"] { grid-template-columns: repeat(2, 1fr); }
[data-ds-calendar] [data-slot="cell"] {
    height: 40px;
    border: none;
    border-radius: var(--ds-radius-md);
    background: transparent;
    color: var(--ds-color-foreground-primary);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
}
[data-ds-calendar] [data-slot="cell"]:hover:not(:disabled) { background: var(--ds-color-background-muted); }
[data-ds-calendar] [data-slot="cell"][data-selected] { background: var(--ds-color-accent-background); color: var(--ds-color-accent-color); font-weight: 700; }
[data-ds-calendar] [data-slot="cell"]:disabled { opacity: 0.4; cursor: not-allowed; }

/* 팝오버 패널 */
[data-ds-picker-panel] {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    border: var(--ds-surface-overlay-border);
    border-radius: var(--ds-surface-overlay-radius);
    box-shadow: var(--ds-surface-overlay-shadow);
    color: var(--ds-color-foreground-primary);
}
[data-ds-picker-panel] [data-slot="presets"] {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 110px;
    padding-right: 10px;
    border-right: 1px solid var(--ds-color-border-subtle);
}
[data-ds-picker-panel] [data-slot="presets"] > button {
    height: 30px;
    padding: 0 10px;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-foreground-primary);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}
[data-ds-picker-panel] [data-slot="presets"] > button:hover { background: var(--ds-color-background-muted); }
[data-ds-picker-panel] [data-slot="presets"] > button[data-selected] {
    background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent);
    color: var(--ds-tone-accent-text);
    font-weight: 600;
}
[data-ds-picker-trigger] [data-slot="control"] {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
    cursor: pointer;
    font-family: var(--ds-typography-font-family-mono);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    overflow: hidden;
}
[data-ds-picker-trigger] [data-slot="control"]:disabled { cursor: inherit; }
[data-ds-picker-trigger] [data-slot="control"][data-placeholder] { color: var(--ds-color-foreground-tertiary); font-family: inherit; }
[data-ds-picker-trigger] [data-slot="sep"] { color: var(--ds-color-foreground-tertiary); }
[data-ds-picker-trigger]:has([data-slot="control"][aria-expanded="true"]) { border-color: var(--ds-palette-primary-500); box-shadow: 0 0 0 3px var(--ds-color-focus-ring); }

/* 시간 열 */
[data-ds-time-columns] { display: flex; gap: 4px; }
[data-ds-time-columns] [data-slot="col"] {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
    padding: 0 4px;
    scrollbar-width: none;
}
[data-ds-time-columns] [data-slot="col"] + [data-slot="col"] { border-left: 1px solid var(--ds-color-border-subtle); }
[data-ds-time-columns] [data-slot="col"] > button {
    flex-shrink: 0;
    height: 30px;
    min-width: 44px;
    padding: 0 8px;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-foreground-primary);
    font-family: var(--ds-typography-font-family-mono);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
}
[data-ds-time-columns] [data-slot="col"] > button:hover:not(:disabled) { background: var(--ds-color-background-muted); }
[data-ds-time-columns] [data-slot="col"] > button[data-selected] { background: var(--ds-color-accent-background); color: var(--ds-color-accent-color); font-weight: 700; }
[data-ds-time-columns] [data-slot="col"] > button:disabled { opacity: 0.35; cursor: not-allowed; }
`.trim()

/** FileUpload */
export const UPLOAD_CSS = `
[data-ds-upload] { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
[data-ds-upload] [data-slot="drop"] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 120px;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    border: 1.5px dashed var(--ds-color-border-strong);
    border-radius: var(--ds-radius-lg);
    background: var(--ds-surface-inset-background);
    color: var(--ds-color-foreground-primary);
    cursor: pointer;
    transition: border-color var(--ds-motion-duration-fast), background var(--ds-motion-duration-fast);
}
[data-ds-upload] [data-slot="drop"] b { font-size: 14px; font-weight: 600; }
[data-ds-upload] [data-slot="drop"] u { color: var(--ds-tone-accent-text); }
[data-ds-upload] [data-slot="drop"]:hover:not([data-disabled]),
[data-ds-upload] [data-slot="drop"][data-over] {
    border-color: var(--ds-palette-primary-500);
    background: color-mix(in oklab, var(--ds-palette-primary-500) 7%, var(--ds-surface-inset-background));
}
[data-ds-upload] [data-slot="drop"][data-over] { border-style: solid; }
[data-ds-upload] [data-slot="drop"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 2px; }
[data-ds-upload] [data-slot="drop"][data-invalid] { border-color: var(--ds-palette-danger-600); }
[data-ds-upload] [data-slot="drop"][data-disabled] { opacity: 0.5; cursor: not-allowed; }
[data-ds-upload] [data-slot="icon"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent);
    color: var(--ds-tone-accent-text);
}
[data-ds-upload] [data-slot="hint"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-upload] [data-slot="button-row"] { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
[data-ds-upload] [data-slot="list"] { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
[data-ds-upload] [data-slot="item"] {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-md);
    background: var(--ds-surface-card-background);
    font-size: 13px;
}
[data-ds-upload] [data-slot="item"][data-status="error"] { border-color: color-mix(in oklab, var(--ds-palette-danger-600) 45%, transparent); }
[data-ds-upload] [data-slot="ext"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: var(--ds-radius-sm);
    background: var(--ds-tone-neutral-solid);
    color: var(--ds-tone-neutral-on);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.02em;
}
${['accent', 'success', 'danger', 'info'].map((t) => `[data-ds-upload] [data-slot="ext"][data-tone="${t}"] { background: var(--ds-tone-${t}-solid); color: var(--ds-tone-${t}-on); }`).join('\n')}
[data-ds-upload] [data-slot="thumb"] { width: 36px; height: 36px; flex-shrink: 0; object-fit: cover; border-radius: var(--ds-radius-sm); }
[data-ds-upload] [data-slot="meta"] { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
[data-ds-upload] [data-slot="meta"] b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-ds-upload] [data-slot="sub"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-upload] [data-slot="err"] { font-size: 12px; color: var(--ds-tone-danger-text); }
[data-ds-upload] [data-slot="bar"] { height: 4px; border-radius: 999px; background: var(--ds-color-border-subtle); overflow: hidden; }
[data-ds-upload] [data-slot="bar"] > span { display: block; height: 100%; background: var(--ds-palette-primary-600); transition: width 200ms; }
[data-ds-upload] [data-slot="pct"] { font-family: var(--ds-typography-font-family-mono); font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-upload] [data-slot="done"] {
    padding: 2px 8px;
    border-radius: var(--ds-radius-sm);
    font-size: 12px;
    font-weight: 600;
    color: var(--ds-tone-success-text);
    background: color-mix(in oklab, var(--ds-palette-success-500) 14%, transparent);
}
[data-ds-upload] [data-slot="remove"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    cursor: pointer;
}
[data-ds-upload] [data-slot="remove"]:hover { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-primary); }
[data-ds-upload] [data-slot="remove"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); }
`.trim()
