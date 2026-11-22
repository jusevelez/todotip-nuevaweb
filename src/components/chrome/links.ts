/**
 * Contrato de URLs del chrome (Fase 0 / Fase 1).
 * Mismos paths públicos que el header y el footer capturados.
 * No redirigir ni unificar slugs desde aquí.
 */

export type NavLink = { href: string; label: string };
export type ProductLink = NavLink & { description: string; icon: string };

export const LOGO_COLOR = "/wp-content/uploads/2023/07/logo-TodoIP.webp";
export const LOGO_BLANCO = "/wp-content/uploads/2023/07/TODO-IP-PIEZA-LOGOTIPO-FINAL2019-negativo1.webp";

export const WHATSAPP_HEADER =
  "https://api.whatsapp.com/send?phone=573009122820&text=Hola%2C%20ingrese%20por%20el%20link%20WhatsApp%2C%20necesito%20m%C3%A1s%20informaci%C3%B3n";
export const WHATSAPP_FOOTER_TOP =
  "https://api.whatsapp.com/send?phone=573009122820&text=Hola%2C%20ingrese%20por%20el%20bot%C3%B3n%20WhatsApp%2C%20necesito%20m%C3%A1s%20informaci%C3%B3n";
export const WHATSAPP_FOOTER_CONTACT =
  "https://api.whatsapp.com/send?phone=573009122820&text=Hola%2C%20ingrese%20por%20contacto%20WhatsApp%2C%20necesito%20m%C3%A1s%20informaci%C3%B3n";
export const CALENDAR_CITA = "https://calendar.app.google/q5xy95ZTZ9gkaQC56";

export const PRODUCTS_IA: readonly ProductLink[] = [
  {
    href: "/chatbots-con-ia-whatsapp/",
    label: "Chatbots con IA & WhatsApp",
    icon: "💬",
    description: "Automatiza conversaciones, ventas y procesos por chat.",
  },
  {
    href: "/agente-de-voz-con-ia-voicebot/",
    label: "Agente de Voz con IA (Voicebot)",
    icon: "🎙️",
    description: "Tu IA que contesta, gestiona trámites y analiza conversaciones.",
  },
  {
    href: "/lectura-inteligente-de-documentos/",
    label: "Lectura Inteligente de Documentos",
    icon: "📄",
    description: "Extrae datos de imágenes y PDFs para llenar formularios.",
  },
];

export const PRODUCTS_VOZ: readonly ProductLink[] = [
  {
    href: "/pbx-movil/",
    label: "PBX Móvil",
    icon: "📱",
    description: "Tu extensión telefónica empresarial en la Nube.",
  },
  {
    href: "/agente-virtual-ivr/",
    label: "Portal de Autogestión Telefónica",
    icon: "🔀",
    description: "Integra telefonía y datos para respuestas en tiempo real.",
  },
  {
    href: "/telefoniaip/",
    label: "Troncales y Telefonía IP",
    icon: "📞",
    description: "Conectividad empresarial robusta y numeración.",
  },
];

export const FOOTER_TELEFONIA: readonly NavLink[] = [
  { href: "/pbx-movil/", label: "PBX Móvil" },
  { href: "/agente-virtual-ivr/", label: "Agente virtual (IVR Transaccional)" },
  { href: "/telefoniaip/", label: "Telefonía IP" },
];

export const FOOTER_IA: readonly NavLink[] = [
  { href: "/chatbots-con-ia-whatsapp/", label: "Chatbots con IA & WhatsApp" },
  { href: "/agente-de-voz-con-ia-voicebot/", label: "Agente de Voz con IA (Voicebot)" },
  { href: "/lectura-inteligente-de-documentos/", label: "Lectura Inteligente de Documentos" },
];

export const FOOTER_IA_EXTRA: readonly NavLink[] = [
  { href: "/salud/", label: "Soluciones para el Sector Salud" },
  { href: "/chatbots/", label: "Chatbots" },
  { href: "/calificador-leads/", label: "Calificador de Leads" },
];

export const LEGAL_LINKS: readonly NavLink[] = [
  { href: "/aviso-de-privacidad/", label: "Aviso de privacidad" },
  { href: "/softphone/condiciones/", label: "Condiciones de uso del Softphone" },
  { href: "/softphone/privacidad/", label: "Política de privacidad del Softphone" },
];

export const SOCIAL: readonly { href: string; label: string }[] = [
  { href: "https://www.linkedin.com/company/todo-ip/", label: "LinkedIn" },
  { href: "https://www.facebook.com/todoip", label: "Facebook" },
  { href: "https://www.instagram.com/todo_ip/", label: "Instagram" },
  { href: "https://www.youtube.com/@TodoIP", label: "YouTube" },
];
