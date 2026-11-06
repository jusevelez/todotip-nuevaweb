/**
 * Form guard for the migrated site.
 *
 * The live forms post to WordPress (admin-ajax.php / Elementor Pro / Piotnet,
 * protected by reCAPTCHA) or to the external telephony portal. None of those
 * backends exist in this Next.js build yet, so a submit is validated in the
 * browser and then blocked with a visible notice. Nothing is sent and no
 * success state is simulated.
 */
export const FORMS_BACKEND_PENDING_MESSAGE =
  "Este formulario aún no está conectado en la versión migrada: no se envió ningún dato. Escríbenos a info@todoip.com o por WhatsApp al +57 300 912 2820.";

function showNotice(form: HTMLFormElement) {
  form.parentElement?.querySelectorAll(".clone-form-notice").forEach((n) => n.remove());
  const notice = document.createElement("div");
  notice.className = "elementor-message elementor-message-danger clone-form-notice";
  notice.setAttribute("role", "alert");
  notice.textContent = FORMS_BACKEND_PENDING_MESSAGE;
  form.insertAdjacentElement("afterend", notice);
}

export function installFormGuard(): () => void {
  const onSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement)) return;
    e.preventDefault();
    e.stopPropagation();
    if (!form.noValidate && !form.reportValidity()) return;
    showNotice(form);
  };
  const onInvalid = (e: Event) => {
    const el = e.target as HTMLInputElement;
    const msg = el?.dataset?.invalidMessage;
    if (msg) el.setCustomValidity(msg);
  };
  const onClear = (e: Event) => {
    const el = e.target as HTMLInputElement;
    if (el && el.dataset && "clearValidity" in el.dataset) el.setCustomValidity("");
  };
  document.addEventListener("submit", onSubmit, true);
  document.addEventListener("invalid", onInvalid, true);
  document.addEventListener("change", onClear, true);
  document.addEventListener("click", onClear, true);
  return () => {
    document.removeEventListener("submit", onSubmit, true);
    document.removeEventListener("invalid", onInvalid, true);
    document.removeEventListener("change", onClear, true);
    document.removeEventListener("click", onClear, true);
  };
}
