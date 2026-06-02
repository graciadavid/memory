'use client'
import Script from 'next/script'

export default function GAAnalytics() {
 return (
   <>
     <Script
       src="https://www.googletagmanager.com/gtag/js?id=G-536316125"
       strategy="afterInteractive"
     />
     <Script id="google-analytics" strategy="afterInteractive">
       {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-536316125');
       `}
     </Script>
   </>
 )
}
