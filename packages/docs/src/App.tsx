import { DesignSystemProvider } from '@ensnif/design-system'
import { Layout } from './layout/Layout'
import { useRouter } from './router/useRouter'
import { routeMap } from './router/routes'
import { DocContext } from './docs/DocContext'
import { docMeta } from './docs/meta'
import { DocOutro } from './components/DocParts'

export const App = () => {
    const { route, setRoute } = useRouter()
    const meta = routeMap[route]
    const Page = meta.page

    return (
        <DesignSystemProvider
            palette="lavender"
            variant="minimal"
            mode="light"
            applyTo="root"
        >
            <Layout route={route} onNavigate={setRoute}>
                <DocContext.Provider value={docMeta[route] ?? null}>
                    <Page />
                    <DocOutro />
                </DocContext.Provider>
            </Layout>
        </DesignSystemProvider>
    )
}
