import Script from 'next/script'

export default function Analytics() {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return null
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CMRL4DM9JP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CMRL4DM9JP');
        `}
      </Script>
    </>
  )
}
