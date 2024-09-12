import type { NextPage } from 'next'
import Head from 'next/head'
import QuickBudgetCalculator from '../components/QuickBudgetCalculator'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen p-4">
      <Head>
        <title>Quick Budget Calculator</title>
        <meta name="description" content="A simple budget calculator for Notion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <QuickBudgetCalculator />
      </main>
    </div>
  )
}

export default Home