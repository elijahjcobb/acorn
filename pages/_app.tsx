import { Inter, Space_Grotesk, Roboto_Mono } from '@next/font/google'
import Head from 'next/head';
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })
const space = Space_Grotesk({ subsets: ['latin'] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<style jsx global>{`
      :root {
        --font: ${inter.style.fontFamily};
        --font-mono: ${robotoMono.style.fontFamily};
        --font-title: ${space.style.fontFamily};
      }
    `}</style>
			<Head>
				<title>acorn</title>
				<link rel="icon" type="image/svg" href="/icon.svg" />
			</Head>
			<div>
				<Component {...pageProps} />
			</div>
		</>
	);
}