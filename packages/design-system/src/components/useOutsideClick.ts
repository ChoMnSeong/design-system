import { useEffect, useRef, type RefObject } from 'react'

type AnyRef = RefObject<HTMLElement | null>

export const useOutsideClick = (
    refs: AnyRef | AnyRef[],
    onOutside: () => void,
    enabled = true,
) => {
    useEffect(() => {
        if (!enabled) return
        const refList = Array.isArray(refs) ? refs : [refs]
        const handler = (e: MouseEvent | TouchEvent) => {
            if (!(e.target instanceof Node)) {
                onOutside()
                return
            }
            for (const r of refList) {
                if (r.current && r.current.contains(e.target)) return
            }
            onOutside()
        }
        document.addEventListener('mousedown', handler)
        // passive: 바깥 클릭 감지만 하고 기본 동작을 막지 않으므로 터치 스크롤을 지연시키지 않는다.
        document.addEventListener('touchstart', handler, { passive: true })
        return () => {
            document.removeEventListener('mousedown', handler)
            document.removeEventListener('touchstart', handler)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, onOutside])
}

/**
 * 열린 패널을 Esc 로 닫고 포커스를 여는 요소로 돌려준다.
 * 캡처 단계에서 처리하고 전파를 막아, 대화상자 안에 있어도 패널만 닫힌다.
 */
export const useEscapeClose = (enabled: boolean, close: () => void, returnFocus?: AnyRef) => {
    const closeRef = useRef(close)
    closeRef.current = close
    useEffect(() => {
        if (!enabled) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape' || e.defaultPrevented) return
            e.stopPropagation()
            closeRef.current()
            const el = returnFocus?.current as HTMLElement | null | undefined
            const target = el?.matches?.('input, button, [tabindex]') ? el : el?.querySelector?.<HTMLElement>('input, button, [tabindex]:not([tabindex="-1"])')
            target?.focus()
        }
        document.addEventListener('keydown', onKey, true)
        return () => document.removeEventListener('keydown', onKey, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled])
}
