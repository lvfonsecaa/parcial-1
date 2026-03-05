import Link from 'next/link'
import { getDictionary } from './dictionaries'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <main style={{ padding: 24 }}>
      <h1>{dict.welcome}</h1>
      <p>{dict.hello}</p>
    </main>
  )
}