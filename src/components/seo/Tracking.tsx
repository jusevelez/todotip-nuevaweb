import { trackingEnabled } from "@/lib/site-env";

// Same tags the live WordPress head loads (Site Kit gtag, GA4, Hotjar).
const SITEKIT_INIT = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}
gtag("set","linker",{"domains":["www.todoip.com"]});
gtag("js", new Date());
gtag("set", "developer_id.dZTNiMT", true);
gtag("config", "GT-55JLXX5H");`;

const GA4_INIT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-D2PT7HZGP2');`;

const HOTJAR = `(function(h,o,t,j,a,r){
h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
h._hjSettings={hjid:6406092,hjsv:6};
a=o.getElementsByTagName('head')[0];
r=o.createElement('script');r.async=1;
r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

const GTM_LANDING = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WPNDKSR');`;

export function WpTrackingHead() {
  if (!trackingEnabled()) return null;
  return (
    <>
      <script id="google_gtagjs-js" src="https://www.googletagmanager.com/gtag/js?id=GT-55JLXX5H" async />
      <script id="google_gtagjs-js-after" dangerouslySetInnerHTML={{ __html: SITEKIT_INIT }} />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-D2PT7HZGP2" />
      <script dangerouslySetInnerHTML={{ __html: GA4_INIT }} />
      <script dangerouslySetInnerHTML={{ __html: HOTJAR }} />
    </>
  );
}

export function LandingTrackingHead() {
  if (!trackingEnabled()) return null;
  return <script dangerouslySetInnerHTML={{ __html: GTM_LANDING }} />;
}

/** GTM noscript fallback present at the top of <body> on the live site. */
export function GtmNoscript() {
  if (!trackingEnabled()) return null;
  return (
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-WPNDKSR"
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
