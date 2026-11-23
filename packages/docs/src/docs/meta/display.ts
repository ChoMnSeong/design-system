import type { DocMetaMap } from '../types'
import BadgeUsage from '../usage/BadgeUsage?raw'
import TagUsage from '../usage/TagUsage?raw'
import AvatarUsage from '../usage/AvatarUsage?raw'
import StatUsage from '../usage/StatUsage?raw'
import KbdUsage from '../usage/KbdUsage?raw'
import CodeBlockUsage from '../usage/CodeBlockUsage?raw'
import ImageUsage from '../usage/ImageUsage?raw'
import MarqueeUsage from '../usage/MarqueeUsage?raw'

export const displayMeta: DocMetaMap = {
    'c-badge': {
        components: ['Badge'],
        usage: BadgeUsage,
        a11y: [
            '<span> 으로 그리는 표시 요소라 포커스를 받지 않습니다.',
            'dot · icon 은 aria-hidden 이라 읽히지 않습니다. 상태는 tone 색만이 아니라 글자로도 적으세요.',
            'max 를 넘는 숫자는 화면과 같이 "99+" 로 읽힙니다.',
        ],
    },
    'c-tag': {
        components: ['Tag'],
        usage: TagUsage,
        a11y: [
            'onClick 이 있으면 role="button" 과 tabIndex=0 이 붙어 Tab 으로 잡히고 Enter · Space 로 눌립니다.',
            '눌러 쓰는 칩에 selected 를 주면 aria-pressed 로 켜짐 상태를 알립니다.',
            '닫기 버튼은 <button> 이고 closeLabel(없으면 "{글자} 삭제")을 aria-label 로 씁니다. children 이 문자열이 아니면 closeLabel 을 꼭 주세요.',
            'icon 은 aria-hidden 입니다.',
        ],
    },
    'c-avatar': {
        components: ['Avatar', 'AvatarGroup', 'StatusIndicator'],
        usage: AvatarUsage,
        composition: `
AvatarGroup             max · spacing · size
├── Avatar              size 를 따로 주지 않으면 그룹 값
├── Avatar
└── (+N)                max 를 넘으면 자동으로 붙는 "외 N명" 아바타`,
        compositionNote: 'Avatar · StatusIndicator 는 혼자서도 씁니다. AvatarGroup 은 자식 Avatar 를 겹쳐 나열하고 size 를 내려 줍니다.',
        a11y: [
            'Avatar 는 role="img" 이고 alt(없으면 name)에 접속 상태를 붙여 "김도윤, 온라인" 처럼 aria-label 로 읽습니다. 안쪽 이미지 · 이니셜 · 상태 점은 읽히지 않습니다.',
            'alt 와 name 이 모두 없으면 이름 없는 이미지가 되므로 둘 중 하나는 주세요.',
            'AvatarGroup 은 role="group" 이고, 넘친 수는 "외 N명" 으로 읽힙니다.',
            'StatusIndicator 의 점은 aria-hidden 이라 label 글자만 읽힙니다. 색만으로 상태를 알리지 않도록 label 을 주세요.',
        ],
    },
    'c-stat': {
        components: ['Stat'],
        usage: StatUsage,
        a11y: [
            'target 을 주면 달성률 막대가 role="progressbar"(aria-label "목표 달성률", aria-valuenow)로 그려집니다.',
            'icon 과 sparkline 은 aria-hidden 이라 읽히지 않습니다. 추세가 중요하면 helper 글자로 적으세요.',
            'loading 중에는 aria-busy 가 붙고 값 자리에 스켈레톤이 나옵니다.',
        ],
    },
    'c-kbd': {
        components: ['Kbd'],
        usage: KbdUsage,
        a11y: [
            '<kbd> 요소로 그리고 translate="no" 로 자동 번역에서 뺍니다.',
            'keys 로 조합을 주면 바깥 <span> 에 "Ctrl + K" 같은 aria-label 을 달고 낱개 키와 "+" 는 aria-hidden 으로 숨깁니다.',
        ],
    },
    'c-codeblock': {
        components: ['CodeBlock'],
        usage: CodeBlockUsage,
        a11y: [
            '<pre><code> 로 그려 코드가 공백 그대로 읽힙니다. 줄 번호는 aria-hidden 이라 읽히지 않습니다.',
            '복사 버튼은 <button> 이고 글자가 "Copy" 에서 복사 뒤 "Copied" 로 바뀝니다.',
        ],
    },
    'c-image': {
        components: ['Image'],
        usage: ImageUsage,
        a11y: [
            'alt 를 <img> 에 그대로 넘깁니다. 정보가 있는 이미지는 alt 를 꼭 주고, 꾸밈용이면 alt="" 를 주세요.',
            'preview 면 이미지 상자가 role="button" · tabIndex=0 이 되어 "{alt} 크게 보기" 로 읽히고 Enter · Space 로 엽니다.',
            '크게 보기는 role="dialog" · aria-modal 이고 Esc 나 배경 클릭으로 닫힙니다.',
            '불러오기에 실패하면 대신 그리는 상자에 alt 가 aria-label 로 붙습니다.',
        ],
    },
    'c-marquee': {
        components: ['Marquee'],
        usage: MarqueeUsage,
        a11y: [
            '끊김 없이 흐르도록 내용을 여러 벌 복제하지만 첫 벌만 읽히고 나머지는 aria-hidden 입니다.',
            'pauseOnHover 는 마우스를 올릴 때만 멈춥니다. 중요한 안내는 흐르는 글자에만 두지 말고 다른 곳에도 보여 주세요.',
            'DesignSystemProvider 안에서는 사용자의 "동작 줄이기" 설정이 켜져 있으면 전역 스타일이 애니메이션을 사실상 멈춥니다.',
        ],
    },
}
