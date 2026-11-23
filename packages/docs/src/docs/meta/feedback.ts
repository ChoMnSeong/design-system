import type { DocMetaMap } from '../types'
import AlertUsage from '../usage/AlertUsage?raw'
import ProgressUsage from '../usage/ProgressUsage?raw'
import SkeletonUsage from '../usage/SkeletonUsage?raw'
import ToastUsage from '../usage/ToastUsage?raw'

export const feedbackMeta: DocMetaMap = {
    'c-alert': {
        components: ['Alert'],
        usage: AlertUsage,
        a11y: [
            'tone 이 danger · warning 이면 role="alert" 로 바로 읽히고, 그 밖에는 role="status" 입니다. role 을 직접 주면 그 값을 씁니다.',
            '앞 아이콘은 aria-hidden 이라 의미는 title · 본문 글자로 전달하세요.',
            'closable 또는 onClose 가 있으면 "닫기" 라벨의 <button> 이 붙습니다.',
        ],
    },
    'c-progress': {
        components: ['Progress'],
        usage: ProgressUsage,
        a11y: [
            'role="progressbar" 에 aria-valuemin(0) · aria-valuemax(max) · aria-valuenow 를 달고, formatValue 결과를 aria-valuetext 로 읽습니다.',
            'indeterminate 면 aria-valuenow 를 빼고 aria-valuetext 를 "진행 중" 으로 둡니다.',
            '무엇의 진행인지는 aria-label 로 알려 주세요. 원형 그림과 target 표시는 aria-hidden 입니다.',
        ],
    },
    'c-skeleton': {
        components: ['Skeleton', 'Spinner', 'Empty'],
        usage: SkeletonUsage,
        a11y: [
            'Skeleton 은 aria-hidden 이라 읽히지 않습니다. 대신 Skeleton.Table · Skeleton.Card 는 role="status" 와 "표 불러오는 중" · "카드 불러오는 중" 라벨을 가집니다.',
            'Spinner 는 role="status" 이고 label(기본 "불러오는 중")을 aria-label 로 씁니다. overlay 면 바깥이 role="status" · aria-live="polite" 가 되고 label 이 글자로 보입니다.',
            'Empty 는 preset="error" 일 때 role="alert" 로 읽히고, 아이콘은 aria-hidden 입니다.',
        ],
    },
    'c-toast': {
        components: ['ToastProvider'],
        usage: ToastUsage,
        composition: `
ToastProvider           placement · max
└── 앱                  안쪽 어디서든 useToast()
    └── toast({ … })    → document.body 의 알림 목록에 쌓임`,
        compositionNote: 'ToastProvider 는 앱 바깥에 한 번 둡니다. useToast 는 Provider 밖에서 부르면 오류를 냅니다.',
        a11y: [
            '토스트 목록은 "알림" 라벨의 <ol> 입니다. danger · warning 토스트는 role="alert" · aria-live="assertive", 그 밖은 role="status" · aria-live="polite" 로 읽힙니다.',
            '토스트가 떠도 포커스는 옮기지 않습니다. 닫기 버튼은 "알림 닫기" 라벨을 가지고, action 버튼은 누르면 onClick 뒤 토스트를 닫습니다.',
            '기본 4초 뒤 저절로 닫힙니다. 알림 위에 마우스가 있거나 포커스가 안에 있는 동안은 모든 알림의 시간이 멈추고(진행 막대도 멈춤), 벗어나면 남은 시간만큼 이어집니다(pauseOnHover, 기본 켜짐). 꼭 봐야 하는 내용은 persistent 로 남겨 두세요.',
        ],
        functions: [
            {
                name: 'useToast',
                signature: '() => { toast, success, error, warning, info, update, dismiss, promise }',
                description: 'ToastProvider 안에서 토스트 API 를 꺼냅니다. toast 자체도 toast.success(…) 처럼 같은 메서드를 가집니다.',
            },
            {
                name: 'toast',
                signature: '(opts: ToastOptions) => string',
                description: '토스트를 띄우고 id 를 돌려줍니다. 같은 id 로 다시 부르면 새로 쌓지 않고 바꿉니다.',
            },
            {
                name: 'success · error · warning · info',
                signature: "(opts: Omit<ToastOptions, 'tone'>) => string",
                description: 'tone 을 정해 둔 줄임 함수입니다. error 는 tone="danger" 입니다.',
            },
            {
                name: 'update',
                signature: '(id: string, opts: Partial<ToastOptions>) => void',
                description: '떠 있는 토스트의 내용을 바꾸고 닫힘 타이머를 다시 잽니다.',
            },
            {
                name: 'dismiss',
                signature: '(id?: string) => void',
                description: 'id 토스트를 닫습니다. id 를 빼면 모두 닫습니다.',
            },
            {
                name: 'promise',
                signature: '<R>(p: Promise<R>, msgs: { loading, success, error }) => Promise<R>',
                description: 'loading 토스트를 띄웠다가 성공이면 success, 실패면 남아 있는 error 토스트로 바꿉니다. success · error 는 결과를 받는 함수여도 됩니다.',
            },
        ],
    },
}
