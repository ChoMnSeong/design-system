/**
 * Menu · ContextMenu · SplitButton 메뉴 (보드 1-03, 1-05).
 * 활성 항목(마우스 오버·키보드 포커스)은 강조색 12% 바탕 + accent 글자.
 */
export const MENU_CSS = `
[data-ds-menu] {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    padding: 6px;
    box-sizing: border-box;
    font-size: 13px;
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    border: var(--ds-surface-overlay-border);
    border-radius: var(--ds-surface-overlay-radius);
    box-shadow: var(--ds-surface-overlay-shadow);
    color: var(--ds-surface-overlay-color);
    outline: none;
}
[data-ds-menu-item] {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 32px;
    padding: 0 10px;
    box-sizing: border-box;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-foreground-primary);
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    outline: none;
}
[data-ds-menu-item][data-tone="danger"] { color: var(--ds-tone-danger-text); }
[data-ds-menu-item][data-tone="success"] { color: var(--ds-tone-success-text); }
[data-ds-menu-item][data-tone="warning"] { color: var(--ds-tone-warning-text); }
[data-ds-menu-item][data-tone="info"] { color: var(--ds-tone-info-text); }
[data-ds-menu-item][data-tone="accent"] { color: var(--ds-tone-accent-text); }
[data-ds-menu-item]:not(:disabled):hover,
[data-ds-menu-item]:not(:disabled):focus-visible,
[data-ds-menu-item][data-open] {
    background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent);
    color: var(--ds-tone-accent-text);
}
[data-ds-menu-item][data-tone="danger"]:not(:disabled):hover,
[data-ds-menu-item][data-tone="danger"]:not(:disabled):focus-visible {
    background: color-mix(in oklab, var(--ds-palette-danger-500) 12%, transparent);
    color: var(--ds-tone-danger-text);
}
[data-ds-menu-item]:disabled {
    color: var(--ds-color-foreground-tertiary);
    cursor: not-allowed;
}
[data-ds-menu-item] > [data-slot="icon"] {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
}
[data-ds-menu-item] > [data-slot="label"] { flex: 1; min-width: 0; }
[data-ds-menu-item] > [data-slot="shortcut"] {
    margin-left: auto;
    font-family: var(--ds-typography-font-family-mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--ds-color-foreground-tertiary);
}
[data-ds-menu-item]:not(:disabled):hover > [data-slot="shortcut"],
[data-ds-menu-item]:not(:disabled):focus-visible > [data-slot="shortcut"] { color: inherit; }
/* 체크·라디오 표시 */
[data-ds-menu-item] > [data-slot="check"] {
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
[data-ds-menu-item][role="menuitemradio"] > [data-slot="check"] { border-radius: 999px; }
[data-ds-menu-item][aria-checked="true"] > [data-slot="check"] {
    background: var(--ds-palette-primary-600);
    border-color: var(--ds-palette-primary-600);
}
[data-ds-menu-item][role="menuitemradio"][aria-checked="true"] > [data-slot="check"] {
    background: transparent;
}
[data-ds-menu-item][role="menuitemradio"][aria-checked="true"] > [data-slot="check"]::after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--ds-palette-primary-600);
}
[data-ds-menu-separator] {
    height: 1px;
    margin: 4px 0;
    background: var(--ds-color-border-subtle);
    flex-shrink: 0;
}
[data-ds-menu-label] {
    padding: 6px 10px 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ds-color-foreground-tertiary);
}
[data-ds-variant="brutalism"] [data-ds-menu] {
    border: 2px solid var(--ds-color-foreground-primary);
    box-shadow: 4px 4px 0 var(--ds-color-foreground-primary);
    border-radius: 0;
}
`.trim()
