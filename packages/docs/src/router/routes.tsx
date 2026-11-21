import type { ComponentType } from 'react'
import { IntroductionPage } from '../pages/IntroductionPage'
import { PalettesPage } from '../pages/PalettesPage'
import { SurfacesPage } from '../pages/SurfacesPage'
import { TypographyPage } from '../pages/TypographyPage'
import { TokensPage } from '../pages/TokensPage'
import { ButtonPage } from '../pages/components/ButtonPage'
import { InputPage } from '../pages/components/InputPage'
import { TextareaPage } from '../pages/components/TextareaPage'
import { CheckboxPage } from '../pages/components/CheckboxPage'
import { RadioPage } from '../pages/components/RadioPage'
import { SwitchPage } from '../pages/components/SwitchPage'
import { TogglePage } from '../pages/components/TogglePage'
import { ComboBoxPage } from '../pages/components/ComboBoxPage'
import { SegmentedControlPage, SliderPage } from '../pages/components/SliderPage'
import { NumberInputPage } from '../pages/components/NumberInputPage'
import { MenuPage } from '../pages/components/MenuPage'
import { DashboardGridPage, MiniChartsPage } from '../pages/components/DashboardPages'
import { GanttPage, ParetoPage, StatusTimelinePage } from '../pages/components/IndustrialPages'
import { AreaChartPage, BarChartPage, CartesianChartPage, GaugePage, LineChartPage, PiePage } from '../pages/components/ChartPages'
import { BreadcrumbPage, NavigationMenuPage, PaginationPage, StepperPage } from '../pages/components/NavPages'
import {
    AccordionPage,
    AppShellPage,
    BoxPage,
    CardPage,
    KpiCardPage,
    TabsPage,
} from '../pages/components/LayoutPages'
import {
    AlertPage,
    CommandPalettePage,
    DialogPage,
    DrawerPage,
    SkeletonPage,
    ToastPage,
    TooltipPage,
} from '../pages/components/FeedbackPages'
import {
    AvatarPage,
    BadgePage,
    DescriptionsPage,
    ProgressPage,
    StatPage,
    TablePage,
    TagPage,
    TimelinePage,
    TreePage,
} from '../pages/components/DisplayPages'
import {
    CalendarPage,
    DatePickerPage,
    FileUploadPage,
    FormFieldPage,
    LabelPage,
    TimePickerPage,
} from '../pages/components/DatePages'
import {
    ButtonGroupPage,
    KbdPage,
    SplitButtonPage,
    ToolbarPage,
} from '../pages/components/ActionPages'
import { ColorPickerPage } from '../pages/components/ColorPickerPage'
import { RatingPage } from '../pages/components/RatingPage'
import { OTPInputPage } from '../pages/components/OTPInputPage'
import { CodeBlockPage } from '../pages/components/CodeBlockPage'
import {
    ImagePage,
} from '../pages/components/MorePages'
import { MarqueePage } from '../pages/components/MarqueePage'
import {
    RadarChartPage,
    RadialChartPage,
} from '../pages/components/ChartsExtraPage'
import { DataTablePage } from '../pages/components/DataTablePage'

export type RouteId =
    | 'introduction'
    | 'palettes'
    | 'surfaces'
    | 'typography'
    | 'tokens'
    | 'c-button'
    | 'c-buttongroup'
    | 'c-splitbutton'
    | 'c-input'
    | 'c-textarea'
    | 'c-label'
    | 'c-checkbox'
    | 'c-radio'
    | 'c-switch'
    | 'c-toggle'
    | 'c-slider'
    | 'c-segmented'
    | 'c-numberinput'
    | 'c-datepicker'
    | 'c-combobox'
    | 'c-card'
    | 'c-box'
    | 'c-divider'
    | 'c-stack'
    | 'c-appshell'
    | 'c-kpicard'
    | 'c-dashboard'
    | 'c-tabs'
    | 'c-table'
    | 'c-accordion'
    | 'c-badge'
    | 'c-tag'
    | 'c-alert'
    | 'c-avatar'
    | 'c-stat'
    | 'c-descriptions'
    | 'c-timeline'
    | 'c-empty'
    | 'c-kbd'
    | 'c-spinner'
    | 'c-skeleton'
    | 'c-progress'
    | 'c-tooltip'
    | 'c-toast'
    | 'c-dialog'
    | 'c-drawer'
    | 'c-menu'
    | 'c-breadcrumb'
    | 'c-pagination'
    | 'c-linechart'
    | 'c-barchart'
    | 'c-cartesian'
    | 'c-pareto'
    | 'c-minicharts'
    | 'c-statustimeline'
    | 'c-gantt'
    | 'c-colorpicker'
    | 'c-fileupload'
    | 'c-timepicker'
    | 'c-rating'
    | 'c-otpinput'
    | 'c-stepper'
    | 'c-codeblock'
    | 'c-hovercard'
    | 'c-image'
    | 'c-toolbar'
    | 'c-scrollarea'
    | 'c-marquee'
    | 'c-formfield'
    | 'c-pie'
    | 'c-gauge'
    | 'c-calendar'
    | 'c-tree'
    | 'c-commandpalette'
    | 'c-navigationmenu'
    | 'c-areachart'
    | 'c-radarchart'
    | 'c-radialchart'
    | 'c-datatable'

export type RouteGroup =
    | 'foundation'
    | 'form'
    | 'layout'
    | 'container'
    | 'display'
    | 'feedback'
    | 'overlay'
    | 'navigation'
    | 'data'

export type RouteMeta = {
    id: RouteId
    label: string
    page: ComponentType
    description?: string
    group: RouteGroup
}

export const routes: RouteMeta[] = [
    { id: 'introduction', label: 'Introduction', group: 'foundation', page: IntroductionPage },
    { id: 'palettes', label: 'Palettes', group: 'foundation', page: PalettesPage },
    { id: 'surfaces', label: 'Surfaces', group: 'foundation', page: SurfacesPage },
    { id: 'typography', label: 'Typography', group: 'foundation', page: TypographyPage },
    { id: 'tokens', label: 'Tokens', group: 'foundation', page: TokensPage },

    { id: 'c-button', label: 'Button', group: 'form', page: ButtonPage },
    { id: 'c-buttongroup', label: 'ButtonGroup', group: 'form', page: ButtonGroupPage },
    { id: 'c-splitbutton', label: 'SplitButton', group: 'form', page: SplitButtonPage },
    { id: 'c-input', label: 'Input', group: 'form', page: InputPage },
    { id: 'c-textarea', label: 'Textarea', group: 'form', page: TextareaPage },
    { id: 'c-label', label: 'Label', group: 'form', page: LabelPage },
    { id: 'c-checkbox', label: 'Checkbox', group: 'form', page: CheckboxPage },
    { id: 'c-radio', label: 'Radio', group: 'form', page: RadioPage },
    { id: 'c-switch', label: 'Switch', group: 'form', page: SwitchPage },
    { id: 'c-toggle', label: 'Toggle', group: 'form', page: TogglePage },
    { id: 'c-slider', label: 'Slider', group: 'form', page: SliderPage },
    { id: 'c-segmented', label: 'SegmentedControl', group: 'form', page: SegmentedControlPage },
    { id: 'c-numberinput', label: 'NumberInput', group: 'form', page: NumberInputPage },
    { id: 'c-datepicker', label: 'DatePicker', group: 'form', page: DatePickerPage },
    { id: 'c-combobox', label: 'Select · ComboBox', group: 'form', page: ComboBoxPage },
    { id: 'c-colorpicker', label: 'ColorPicker', group: 'form', page: ColorPickerPage },
    { id: 'c-timepicker', label: 'TimePicker', group: 'form', page: TimePickerPage },
    { id: 'c-fileupload', label: 'FileUpload', group: 'form', page: FileUploadPage },
    { id: 'c-rating', label: 'Rating', group: 'form', page: RatingPage },
    { id: 'c-otpinput', label: 'OTPInput', group: 'form', page: OTPInputPage },
    { id: 'c-formfield', label: 'FormField', group: 'form', page: FormFieldPage },

    { id: 'c-appshell', label: 'AppShell · PageHeader · FilterBar', group: 'layout', page: AppShellPage },
    { id: 'c-toolbar', label: 'Toolbar', group: 'layout', page: ToolbarPage },

    { id: 'c-card', label: 'Card', group: 'container', page: CardPage },
    { id: 'c-dashboard', label: 'DashboardGrid · Card 슬롯', group: 'container', page: DashboardGridPage },
    { id: 'c-kpicard', label: 'KpiCard · StatusCard', group: 'container', page: KpiCardPage },
    { id: 'c-box', label: 'Box · Stack · Grid · Divider', group: 'container', page: BoxPage },
    { id: 'c-tabs', label: 'Tabs', group: 'container', page: TabsPage },
    { id: 'c-accordion', label: 'Accordion', group: 'container', page: AccordionPage },
    { id: 'c-table', label: 'Table', group: 'container', page: TablePage },

    { id: 'c-badge', label: 'Badge', group: 'display', page: BadgePage },
    { id: 'c-tag', label: 'Tag', group: 'display', page: TagPage },
    { id: 'c-alert', label: 'Alert', group: 'display', page: AlertPage },
    { id: 'c-avatar', label: 'Avatar', group: 'display', page: AvatarPage },
    { id: 'c-stat', label: 'Stat', group: 'display', page: StatPage },
    { id: 'c-descriptions', label: 'Descriptions', group: 'display', page: DescriptionsPage },
    { id: 'c-timeline', label: 'Timeline', group: 'display', page: TimelinePage },
    { id: 'c-kbd', label: 'Kbd', group: 'display', page: KbdPage },
    { id: 'c-codeblock', label: 'CodeBlock', group: 'display', page: CodeBlockPage },
    { id: 'c-image', label: 'Image', group: 'display', page: ImagePage },
    { id: 'c-marquee', label: 'Marquee', group: 'display', page: MarqueePage },

    { id: 'c-skeleton', label: 'Skeleton · Spinner · Empty', group: 'feedback', page: SkeletonPage },
    { id: 'c-progress', label: 'Progress', group: 'feedback', page: ProgressPage },
    { id: 'c-tooltip', label: 'Popover · Tooltip · HoverCard', group: 'feedback', page: TooltipPage },
    { id: 'c-toast', label: 'Toast', group: 'feedback', page: ToastPage },

    { id: 'c-dialog', label: 'Dialog', group: 'overlay', page: DialogPage },
    { id: 'c-drawer', label: 'Drawer', group: 'overlay', page: DrawerPage },
    { id: 'c-menu', label: 'Menu', group: 'overlay', page: MenuPage },
    { id: 'c-commandpalette', label: 'CommandPalette', group: 'overlay', page: CommandPalettePage },

    { id: 'c-breadcrumb', label: 'Breadcrumb', group: 'navigation', page: BreadcrumbPage },
    { id: 'c-pagination', label: 'Pagination', group: 'navigation', page: PaginationPage },
    { id: 'c-stepper', label: 'Stepper', group: 'navigation', page: StepperPage },
    { id: 'c-tree', label: 'Tree', group: 'navigation', page: TreePage },
    { id: 'c-navigationmenu', label: 'NavigationMenu', group: 'navigation', page: NavigationMenuPage },

    { id: 'c-linechart', label: 'LineChart', group: 'data', page: LineChartPage },
    { id: 'c-barchart', label: 'BarChart', group: 'data', page: BarChartPage },
    { id: 'c-cartesian', label: 'CartesianChart', group: 'data', page: CartesianChartPage },
    { id: 'c-minicharts', label: '대시보드 소형 차트', group: 'data', page: MiniChartsPage },
    { id: 'c-pareto', label: 'Pareto · Control', group: 'data', page: ParetoPage },
    { id: 'c-statustimeline', label: 'StatusTimeline · Bullet', group: 'data', page: StatusTimelinePage },
    { id: 'c-gantt', label: 'Gantt · Heatmap · Waterfall', group: 'data', page: GanttPage },
    { id: 'c-pie', label: 'Pie/Donut', group: 'data', page: PiePage },
    { id: 'c-gauge', label: 'Gauge', group: 'data', page: GaugePage },
    { id: 'c-calendar', label: 'Calendar', group: 'data', page: CalendarPage },
    { id: 'c-areachart', label: 'AreaChart', group: 'data', page: AreaChartPage },
    { id: 'c-radarchart', label: 'RadarChart', group: 'data', page: RadarChartPage },
    { id: 'c-radialchart', label: 'RadialChart', group: 'data', page: RadialChartPage },
    { id: 'c-datatable', label: 'DataTable', group: 'data', page: DataTablePage },
]

export const routeMap: Record<RouteId, RouteMeta> = routes.reduce(
    (acc, r) => ({ ...acc, [r.id]: r }),
    {} as Record<RouteId, RouteMeta>,
)

export const isRouteId = (value: string): value is RouteId =>
    value in routeMap

export const groupOrder: RouteGroup[] = [
    'foundation',
    'form',
    'layout',
    'container',
    'display',
    'feedback',
    'overlay',
    'navigation',
    'data',
]

export const groupLabels: Record<RouteGroup, string> = {
    foundation: 'Foundation',
    form: 'Form',
    layout: 'Layout',
    container: 'Container',
    display: 'Display',
    feedback: 'Feedback',
    overlay: 'Overlay',
    navigation: 'Navigation',
    data: 'Data',
}
