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
          <div data-elementor-type="wp-page" data-elementor-id="990284" className="elementor elementor-990284" data-elementor-post-type="page">
            <section
              className="elementor-section elementor-top-section elementor-element elementor-element-3e3133dd elementor-section-boxed elementor-section-height-default elementor-section-height-default"
              data-id="3e3133dd"
              data-element_type="section"
              data-e-type="section"
            >
              <div className="elementor-container elementor-column-gap-default">
                <div
                  className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-434cffe5"
                  data-id="434cffe5"
                  data-element_type="column"
                  data-e-type="column"
                >
                  <div className="elementor-widget-wrap elementor-element-populated">
                    <div
                      className="elementor-element elementor-element-6ef74327 elementor-widget elementor-widget-text-editor"
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
      <div data-pafe-form-builder-tinymce-upload="/wp-content/plugins/piotnet-addons-for-elementor-pro/inc/tinymce/tinymce-upload.php" />
      <div data-pafe-plugin-url="/wp-content/plugins" />
    </>
  );
}
