/** Select · ComboBox · MultiSelect · TagInput. */
export const SELECT_CSS = `
[data-ds-select] [data-slot="control"][data-placeholder] { color: var(--ds-color-foreground-tertiary); }
[data-ds-select] [data-slot="value"] { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-ds-select] [data-chevron] { transition: transform var(--ds-motion-duration-fast); }
[data-ds-select] [data-chevron="open"] { transform: rotate(180deg); }
[data-ds-select][data-multiple],
[data-ds-taginput] {
    height: auto;
    min-height: 36px;
    flex-wrap: wrap;
    gap: 4px;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 6px;
}
[data-ds-select][data-multiple][data-size="sm"], [data-ds-taginput][data-size="sm"] { min-height: 28px; padding-top: 2px; padding-bottom: 2px; }
[data-ds-select][data-multiple][data-size="lg"], [data-ds-taginput][data-size="lg"] { min-height: 44px; }
[data-ds-select][data-multiple] [data-slot="control"] { flex: 1 0 40px; height: 24px; min-width: 40px; }

[data-ds-chip] {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 4px 0 8px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 500;
    color: var(--ds-color-foreground-primary);
    background: var(--ds-color-background-muted);
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-sm);
    white-space: nowrap;
    max-width: 100%;
}
[data-ds-chip][data-mono] { font-family: var(--ds-typography-font-family-mono); }
[data-ds-chip][data-more] {
    padding: 0 8px;
    color: var(--ds-tone-accent-text);
    background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent);
    border-color: transparent;
}
[data-ds-chip][data-invalid] { border-color: var(--ds-palette-danger-600); color: var(--ds-tone-danger-text); }
[data-ds-chip] > button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    border-radius: 3px;
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    cursor: pointer;
}
[data-ds-chip] > button:hover { background: color-mix(in oklab, var(--ds-color-foreground-primary) 10%, transparent); color: var(--ds-color-foreground-primary); }

[data-ds-listbox] {
    max-height: 280px;
    overflow-y: auto;
    padding: 6px;
    box-sizing: border-box;
    font-size: 13px;
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    border: var(--ds-surface-overlay-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-surface-overlay-shadow);
    color: var(--ds-color-foreground-primary);
}
[data-ds-option] {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: var(--ds-radius-sm);
    cursor: pointer;
    white-space: nowrap;
}
[data-ds-option][data-active] { background: var(--ds-color-background-muted); }
[data-ds-option][aria-selected="true"] {
    background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent);
    color: var(--ds-tone-accent-text);
    font-weight: 600;
}
[data-ds-option][aria-disabled="true"] { color: var(--ds-color-foreground-tertiary); cursor: not-allowed; }
[data-ds-option][data-create] { color: var(--ds-tone-accent-text); font-weight: 600; }
[data-ds-option] > [data-slot="label"] { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
[data-ds-option] > [data-slot="desc"] {
    margin-left: auto;
    font-family: var(--ds-typography-font-family-mono);
    font-size: 12px;
    color: var(--ds-color-foreground-tertiary);
    font-weight: 400;
}
[data-ds-option] > [data-slot="icon"], [data-ds-option] > [data-slot="tick"] { display: inline-flex; flex-shrink: 0; }
[data-ds-option] > [data-slot="check"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    box-sizing: border-box;
    border: 1.5px solid var(--ds-color-border-strong);
    border-radius: 4px;
    color: #fff;
}
[data-ds-option][aria-selected="true"] > [data-slot="check"] { background: var(--ds-palette-primary-600); border-color: var(--ds-palette-primary-600); }
[data-ds-option] mark { background: none; color: var(--ds-tone-accent-text); font-weight: 700; }
[data-ds-option-group] {
    padding: 8px 10px 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ds-color-foreground-tertiary);
    height: 32px;
    box-sizing: border-box;
}
[data-ds-listbox-empty] {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    font-size: 13px;
    color: var(--ds-color-foreground-tertiary);
}
`.trim()
