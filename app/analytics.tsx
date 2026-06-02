'use client'
import Script from 'next/script'

export default function GAAnalytics() {
  return (
    <>
      {/* Google Analytics GA4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CMRL4DM9JP"
        strategy="afterInteractive"
      />
      {/* Google Ads */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17906499710"
        strategy="afterInteractive"
      />
      <Script id="google-tags" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CMRL4DM9JP');
          gtag('config', 'AW-17906499710');
        `}
      </Script>
    </>
  )
}
