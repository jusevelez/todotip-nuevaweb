/**
 * Form guard for the migrated site.
 *
 * Contact / Tdp Pro / Piotnet forms still post to WordPress backends that are
 * not in this Next.js build, so those submits are validated in the browser and
 * then blocked with a visible notice. Nothing is sent and no success state is
 * simulated.
 *
 * Acceso Clientes on `/reportes-telefonia/` is the exception: it must POST
 * natively to the telephony portal, same as the original WordPress page.
 */
export const FORMS_BACKEND_PENDING_MESSAGE =
  "Este formulario aún no está conectado en la versión migrada: no se envió ningún dato. Escríbenos a info@todoip.com o por WhatsApp al +57 300 912 2820.";

export const TELEFONIA_LOGIN_ORIGIN = "https://telefonia.todoip.com";
export const TELEFONIA_LOGIN_PATH = "/_autenticacion/login.php";

export function isTelephonyPortalLogin(form: HTMLFormElement): boolean {
  const raw = form.getAttribute("action");
  if (!raw) return false;
  try {
    const url = new URL(raw, "https://www.todoip.com");
    return url.origin === TELEFONIA_LOGIN_ORIGIN && url.pathname === TELEFONIA_LOGIN_PATH;
  } catch {
    return false;
  }
}

function showNotice(form: HTMLFormElement) {
  form.parentElement?.querySelectorAll(".clone-form-notice").forEach((n) => n.remove());
  const notice = document.createElement("div");
  notice.className = "tdp-message tdp-message-danger clone-form-notice";
  notice.setAttribute("role", "alert");
  notice.textContent = FORMS_BACKEND_PENDING_MESSAGE;
  form.insertAdjacentElement("afterend", notice);
}

export function installFormGuard(): () => void {
  const onSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement)) return;
    if (isTelephonyPortalLogin(form)) return;
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
