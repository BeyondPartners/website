import Footer from '@/components/footer/Footer'
import PrimaryNavbar from '@/components/navbar/PrimaryNavbar'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { isValidLocale } from '@/lib/i18n/config'
import { getSiteUrl } from '@/lib/site-url'
import getMarkDownData from '@/utils/getMarkDownData'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export async function generateMetadata() {
  const base = getSiteUrl()
  return {
    title: "Conditions Générales d'Abonnement Candi",
    description:
      "Conditions Générales d'Abonnement de Candi, l'assistant IA de préparation des candidatures aux marchés publics de maîtrise d'œuvre.",
    alternates: {
      canonical: `${base}/fr/candi/cga`,
    },
  }
}

export default async function CandiCga({ params }) {
  const { locale: raw } = await params
  const locale = isValidLocale(raw) ? raw : 'fr'
  const dict = getDictionary(locale)
  const pages = getMarkDownData('content/candi-cga/')

  return (
    <>
      <PrimaryNavbar locale={locale} dict={dict} />
      <main>
        <section className="relative overflow-hidden pt-[160px] pb-150 max-md:pt-150">
          <div className="absolute -top-[800px] right-0 left-0 h-full w-full bg-[url('/images/core-gradient.png')] bg-[length:600px_1000px] bg-center bg-no-repeat opacity-70 md:hidden"></div>
          <div className="relative container !max-w-[800px]">
            <div className="absolute top-20 left-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 max-md:hidden">
              <div className="bg-primary-200/20 h-[442px] w-[442px] rounded-full blur-[145px]"></div>
              <div className="bg-primary-200/25 -ml-[170px] h-[442px] w-[442px] rounded-full blur-[145px]"></div>
              <div className="bg-primary-200/20 -ml-[170px] h-[442px] w-[442px] rounded-full blur-[145px]"></div>
            </div>

            <div className="mx-auto mb-14 max-w-[650px] text-center max-md:mb-10">
              <h2 className="mb-3 leading-[1.33]">Conditions Générales d&apos;Abonnement — Candi</h2>
              <p className="text-tagline-2">
                <Link href={`/${locale}`} className="text-secondary hover:underline">
                  {dict.legalPage.backHome}
                </Link>
              </p>
            </div>

            <div className="legalContent">
              {pages.map((item) => (
                <div key={item.slug}>
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}
