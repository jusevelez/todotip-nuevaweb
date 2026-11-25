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
 *
 * Home contact ("Schedule consultation") POSTs to `/api/contact/` after
 * Cloudflare Turnstile siteverify on the server.
 */
import {
  CONTACT_ENDPOINT,
  HOME_CONTACT_FORM_NAME,
  TURNSTILE_CONTACT_ACTION,
  TURNSTILE_SITEKEY,
} from "@/lib/turnstile-public";

export const FORMS_BACKEND_PENDING_MESSAGE =
  "Este formulario aún no está conectado en la versión migrada: no se envió ningún dato. Escríbenos a info@todoip.com o por WhatsApp al +57 300 912 2820.";

export const CONTACT_TURNSTILE_REQUIRED_MESSAGE = "Completa la verificación antes de enviar.";
export const CONTACT_TURNSTILE_FORBIDDEN_MESSAGE = "No pudimos verificar el envío. Inténtalo de nuevo.";
export const CONTACT_TURNSTILE_ERROR_MESSAGE = "No se pudo enviar el formulario. Inténtalo de nuevo.";

export const TELEFONIA_LOGIN_ORIGIN = "https://telefonia.todoip.com";
export const TELEFONIA_LOGIN_PATH = "/_autenticacion/login.php";

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

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

export function isHomeContactForm(form: HTMLFormElement): boolean {
  return form.getAttribute("name") === HOME_CONTACT_FORM_NAME;
}

function showNotice(form: HTMLFormElement, text: string, kind: "danger" | "success") {
  form.parentElement?.querySelectorAll(".clone-form-notice").forEach((n) => n.remove());
  const notice = document.createElement("div");
  notice.className = `tdp-message tdp-message-${kind} clone-form-notice`;
  notice.setAttribute("role", "alert");
  notice.textContent = text;
  form.insertAdjacentElement("afterend", notice);
}

function ensureTurnstileContainer(form: HTMLFormElement): HTMLElement | null {
  const existing = form.querySelector<HTMLElement>(".cf-turnstile");
  if (existing) return existing;
  const recaptcha = form.querySelector<HTMLElement>(".tdp-g-recaptcha, .g-recaptcha");
  if (!recaptcha) return null;
  recaptcha.className = "cf-turnstile";
  recaptcha.removeAttribute("data-type");
  recaptcha.removeAttribute("data-theme");
  recaptcha.removeAttribute("data-size");
  recaptcha.setAttribute("data-sitekey", TURNSTILE_SITEKEY);
  recaptcha.setAttribute("data-action", TURNSTILE_CONTACT_ACTION);
  recaptcha.replaceChildren();
  return recaptcha;
}

function loadTurnstileScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const done = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile missing"));
    };
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT}"]`);
    if (existing) {
      if (window.turnstile) {
        done();
        return;
      }
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener("error", () => reject(new Error("turnstile script")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", done, { once: true });
    script.addEventListener("error", () => reject(new Error("turnstile script")), { once: true });
    document.head.appendChild(script);
  });
}

function readTurnstileToken(form: HTMLFormElement): string {
  const input = form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
  return input?.value?.trim() ?? "";
}

export function installFormGuard(): () => void {
  const widgets = new Map<HTMLFormElement, string>();
  let cancelled = false;

  const mountContactWidgets = () => {
    const forms = [...document.querySelectorAll("form")].filter(
      (el): el is HTMLFormElement => el instanceof HTMLFormElement && isHomeContactForm(el),
    );
    if (forms.length === 0) return;
    void loadTurnstileScript()
      .then((turnstile) => {
        if (cancelled) return;
        for (const form of forms) {
          if (widgets.has(form)) continue;
          const container = ensureTurnstileContainer(form);
          if (!container) continue;
          const widgetId = turnstile.render(container, {
            sitekey: TURNSTILE_SITEKEY,
            action: TURNSTILE_CONTACT_ACTION,
          });
          widgets.set(form, widgetId);
        }
      })
      .catch(() => {
        /* Widget failed to load; submit still hits the server gate. */
      });
  };

  const resetWidget = (form: HTMLFormElement) => {
    const id = widgets.get(form);
    if (!id || !window.turnstile) return;
    window.turnstile.reset(id);
  };

  const submitContact = async (form: HTMLFormElement) => {
    const token = readTurnstileToken(form);
    if (!token) {
      showNotice(form, CONTACT_TURNSTILE_REQUIRED_MESSAGE, "danger");
      return;
    }
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        showNotice(form, data?.message || "Recibimos tu solicitud.", "success");
        form.reset();
      } else if (res.status === 403) {
        showNotice(form, CONTACT_TURNSTILE_FORBIDDEN_MESSAGE, "danger");
      } else {
        showNotice(form, CONTACT_TURNSTILE_ERROR_MESSAGE, "danger");
      }
    } catch {
      showNotice(form, CONTACT_TURNSTILE_ERROR_MESSAGE, "danger");
    } finally {
      resetWidget(form);
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  const onSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement)) return;
    if (isTelephonyPortalLogin(form)) return;
    e.preventDefault();
    e.stopPropagation();
    if (!form.noValidate && !form.reportValidity()) return;
    if (isHomeContactForm(form)) {
      void submitContact(form);
      return;
    }
    showNotice(form, FORMS_BACKEND_PENDING_MESSAGE, "danger");
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
  mountContactWidgets();
  return () => {
    cancelled = true;
    document.removeEventListener("submit", onSubmit, true);
    document.removeEventListener("invalid", onInvalid, true);
    document.removeEventListener("change", onClear, true);
    document.removeEventListener("click", onClear, true);
    const api = window.turnstile;
    if (api) {
      for (const id of widgets.values()) {
        try {
          api.remove(id);
        } catch {
          /* ignore */
        }
      }
    }
    widgets.clear();
  };
}
