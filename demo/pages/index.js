import { usePlausible } from '../next-plausible/index.esm'
import tailwindConfig from '../tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import Clickable from '../components/Clickable'
import EventLog from '../components/EventLog'
import Head from 'next/head'

export async function getStaticProps() {
  const fullConfig = resolveConfig(tailwindConfig)
  return {
    props: {
      colors: fullConfig.theme.colors,
    },
  }
}

export default function Demo({ colors, domain }) {
  const plausible = usePlausible()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark text-copy">
      <Head>
        <meta name="theme-color" content={colors.background.light} />
      </Head>
      <header className="bg-background-light w-full">
        <div className="mx-auto flex items-center justify-center p-4 lg:px-12 max-w-screen-xl">
          <h1 className="text-xl flex-grow w-full flex items-center gap-2">
            <img className="w-8 h-8" src="/next-plausible.png" alt="" />{' '}
            Next-Plausible
          </h1>
          <Clickable href="https://github.com/4lejandrito/next-plausible">
            GitHub
          </Clickable>
        </div>
      </header>
      <main className="flex-grow max-w-screen-xl p-4 lg:p-12 flex flex-col lg:flex-row items-center lg:justify-center gap-4 lg:gap-12">
        <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-8 text-center lg:text-left">
          <h2 className="text-xl lg:text-6xl font-medium pt-4 lg:pt-0">
            Simple integration for{' '}
            <Clickable href="https://nextjs.org">Next.js</Clickable> and{' '}
            <Clickable href="https://plausible.io">
              Plausible Analytics
            </Clickable>
          </h2>
          <p className="text-copy-muted lg:text-xl max-w-prose">
            Track any{' '}
            <Clickable href="https://github.com/4lejandrito/next-plausible">
              outbound link
            </Clickable>
            , <Clickable href="dummy.txt">file download</Clickable> or{' '}
            <Clickable
              onClick={() =>
                plausible('Custom Event', { props: { source: 'copy' } })
              }
            >
              custom event
            </Clickable>{' '}
            in your site.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 w-full">
            <Clickable
              className="w-full lg:w-auto flex items-center justify-center font-medium cursor-pointer rounded text-inverse-copy bg-inverse-background hover:bg-inverse-highlight text-center px-4 py-2"
              href="https://github.com/4lejandrito/next-plausible"
            >
              Get started at GitHub
            </Clickable>
            <Clickable
              className="w-full lg:w-auto flex items-center justify-center font-medium cursor-pointer rounded bg-primary-background hover:bg-primary-highlight text-center px-4 py-2"
              href={`https://plausible.io/${domain}`}
            >
              Open Plausible's dashboard for this page
            </Clickable>
          </div>
        </div>
        <EventLog colors={colors} />
      </main>
      <footer className="p-4 bg-background-light w-full text-center">
        Made with ❤️ by{' '}
        <Clickable href="https://4lejandrito.dev">4lejandrito</Clickable>
      </footer>
    </div>
  )
}
