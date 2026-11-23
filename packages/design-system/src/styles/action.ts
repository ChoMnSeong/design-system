/** Kbd · Toolbar. */
export const ACTION_CSS = `
[data-ds-kbd] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 20px;
    min-width: 20px;
    padding: 0 6px;
    font-family: var(--ds-typography-font-family-mono);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    color: var(--ds-color-foreground-secondary);
    background: var(--ds-surface-card-background);
    border: 1px solid var(--ds-color-border-default);
    border-bottom-width: 2px;
    border-radius: var(--ds-radius-xs);
    white-space: nowrap;
}
[data-ds-kbd][data-size="xs"] { height: 18px; min-width: 18px; padding: 0 5px; font-size: 11px; }
[data-ds-kbd][data-size="md"] { height: 24px; min-width: 24px; padding: 0 7px; }
[data-ds-kbd-combo] { display: inline-flex; align-items: center; gap: 4px; }
[data-ds-kbd-combo] > [data-slot="plus"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-variant="brutalism"] [data-ds-kbd] { border: 2px solid var(--ds-color-foreground-primary); border-radius: 0; }
[data-ds-variant="glassmorphism"] [data-ds-kbd] { background: rgba(255, 255, 255, 0.35); border-color: rgba(255, 255, 255, 0.6); }
[data-ds-variant="glassmorphism"][data-ds-mode="dark"] [data-ds-kbd] { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.16); }

[data-ds-toolbar] {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 4px;
    box-sizing: border-box;
    min-width: 0;
    background: var(--ds-surface-inset-background);
    border: var(--ds-surface-inset-border);
    border-radius: var(--ds-radius-md);
}
[data-ds-toolbar][data-density="compact"] {
    padding: 2px 4px;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--ds-color-border-subtle);
    border-radius: 0;
}
[data-ds-toolbar][data-density="comfortable"] { padding: 6px 8px; gap: 4px; }
[data-ds-toolbar][data-overflow="wrap"] { flex-wrap: wrap; }
[data-ds-toolbar][data-overflow="scroll"] { overflow-x: auto; scrollbar-width: thin; }
[data-ds-toolbar][data-overflow="scroll"] > *,
[data-ds-toolbar][data-overflow="menu"] > * { flex-shrink: 0; }
[data-ds-toolbar][data-overflow="menu"] { overflow: hidden; }
[data-ds-toolbar][data-sticky] {
    position: sticky;
    top: 0;
    z-index: var(--ds-z-index-sticky, 10);
    background: var(--ds-surface-panel-background);
    -webkit-backdrop-filter: var(--ds-surface-panel-backdrop-filter);
    backdrop-filter: var(--ds-surface-panel-backdrop-filter);
}
[data-ds-toolbar-group] { display: inline-flex; align-items: center; gap: 2px; }
[data-ds-toolbar-separator] {
    width: 1px;
    align-self: stretch;
    margin: 4px 2px;
    background: var(--ds-color-border-default);
    flex-shrink: 0;
}
[data-ds-toolbar][data-density="compact"] [data-ds-toolbar-separator] { align-self: center; height: 14px; margin: 0 4px; }
[data-ds-toolbar-spacer] { flex: 1 1 auto; }
[data-ds-toolbar] > [data-ds-toolbar-overflow] { margin-left: auto; }
`.trim()
