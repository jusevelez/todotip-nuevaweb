import ProductFaq from "@/components/faq/ProductFaq";
import { softphonePage } from "@/lib/softphone-pages";
import Footer988867 from "@/generated/wp/templates/Footer988867";
import Header6979 from "@/generated/wp/templates/Header6979";
import IdEgeiroWhfab from "@/generated/wp/templates/IdEgeiroWhfab";
import Popup1670 from "@/generated/wp/templates/Popup1670";
import Popup9913 from "@/generated/wp/templates/Popup9913";
import SkipLink from "@/generated/wp/templates/SkipLink";
import styles from "./softphone-legal.module.css";

/**
 * Same shell as the captured privacy notice: skip link, header, a single
 * 1000px text-editor section, footer, popups and the WhatsApp button.
 * The legal HTML is inserted unchanged.
 */
export default function SoftphoneLegalPage({ path }: { path: string }) {
  const page = softphonePage(path);
  if (!page) return null;
  return (
    <>
      <SkipLink path={path} />
      <Header6979 path={path} />
      <main id="content" className="site-main post-990284 page type-page status-publish hentry">
        <div className="page-content">
          <div data-tdp-type="page" data-tdp-id="990284" className="tdp tdp-990284" data-tdp-post-type="page">
            <section
              className="tdp-section tdp-top-section tdp-element tdp-element-3e3133dd tdp-section-boxed tdp-section-height-default tdp-section-height-default"
              data-id="3e3133dd"
              data-element_type="section"
              data-e-type="section"
            >
              <div className="tdp-container tdp-column-gap-default">
                <div
                  className="tdp-column tdp-col-100 tdp-top-column tdp-element tdp-element-434cffe5"
                  data-id="434cffe5"
                  data-element_type="column"
                  data-e-type="column"
                >
                  <div className="tdp-widget-wrap tdp-element-populated">
                    <div
                      className="tdp-element tdp-element-6ef74327 tdp-widget tdp-widget-text-editor"
                      data-id="6ef74327"
                      data-element_type="widget"
                      data-e-type="widget"
                      data-widget_type="text-editor.default"
                    >
                      <div className={styles.contenido} dangerouslySetInnerHTML={{ __html: page.html }} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <ProductFaq path={path} />
      <Footer988867 path={path} />
      <Popup9913 path={path} />
      <Popup1670 path={path} />
      <IdEgeiroWhfab path={path} />
      <div className="pafe-break-point" data-pafe-break-point-md="767" data-pafe-break-point-lg="1024" data-pafe-ajax-url="/wp-admin/admin-ajax.php" />
      <div data-pafe-form-builder-tinymce-upload="/assets/plugins/piotnet-addons-for-tdp-pro/inc/tinymce/tinymce-upload.php" />
      <div data-pafe-plugin-url="/assets/plugins" />
    </>
  );
}
