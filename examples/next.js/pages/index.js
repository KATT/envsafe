import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { browserEnv } from '../utils/browserEnv';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome
        </h1>

        <code>Public evironment: {<pre>{JSON.stringify(browserEnv, null, 4)}</pre>}</code>


        <p>Visit <a href="/api/hello">/api/hello</a> to see the server env vars</p>
      </main>
    </div>
  )
}
