import { Card, RadialChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const RADIAL_DATA = [
    { label: '액션', value: 85 },
    { label: '로맨스', value: 70 },
    { label: '판타지', value: 100 },
    { label: 'SF', value: 49 },
    { label: '일상', value: 62 },
]

export const RadialChartPage = () => (
    <>
        <PageHeader
            title="RadialChart"
            description="여러 진행률을 동심원으로. primary 단색 톤 + hover 툴팁. showInlineLabels / showGrid / cap / centerValue 옵션."
        />

        <ComponentPreview
            title="기본: hover 시 값 확인"
            description="ring 위에 마우스를 올리면 정확한 값이 툴팁으로. legend도 동기화."
            code={`<RadialChart data={data} />`}
        >
            <Card>
                <RadialChart data={RADIAL_DATA} />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="중앙 요약 + 그리드"
            description="showGrid 켜면 회색 트랙이 자동으로 사라지고 dashed 동심원 + 12 spoke가 노출."
            code={`<RadialChart
    data={data}
    showGrid
    centerValue="73%"
    centerLabel="평균"
/>`}
        >
            <Card>
                <RadialChart
                    data={RADIAL_DATA}
                    showGrid
                    centerValue="73%"
                    centerLabel="평균"
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="호 위 라벨 (showInlineLabels)"
            description="라벨이 항상 가로로 표시되어 어떤 각도든 읽기 편함. 두꺼운 ring(thickness ≥ 18) 권장."
            code={`<RadialChart
    data={data}
    showInlineLabels
    thickness={20}
    gap={4}
/>`}
        >
            <Card>
                <RadialChart
                    data={RADIAL_DATA}
                    showInlineLabels
                    thickness={20}
                    gap={4}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="호 끝 모양 (cap)"
            description="rounded(기본) vs sharp. 데이터 의미에 따라 선택."
            code={`<RadialChart data={data} cap="rounded" />
<RadialChart data={data} cap="sharp" />`}
        >
            <Card>
                <RadialChart data={RADIAL_DATA} cap="rounded" />
            </Card>
            <Card>
                <RadialChart data={RADIAL_DATA} cap="sharp" />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="그리드 + sharp + 중앙"
            description="레퍼런스에서 본 스타일. grid 위에 sharp 캡 ring + 중앙 텍스트."
            code={`<RadialChart
    data={data}
    showGrid
    cap="sharp"
    centerValue="73%"
    centerLabel="달성률"
/>`}
        >
            <Card>
                <RadialChart
                    data={RADIAL_DATA}
                    showGrid
                    cap="sharp"
                    centerValue="73%"
                    centerLabel="달성률"
                />
            </Card>
        </ComponentPreview>
    </>
)
