// Preguntas frecuentes por producto (FAQ / GEO).
// Fuente: «Preguntas frecuentes por producto — TodoIP», respuestas de Carlos Julio Domínguez
// (15 nov 2026). Texto del cliente; solo se recortaron las respuestas de más de 150 palabras
// y se reformularon las preguntas escritas como instrucción interna. La 167 (política interna
// sobre promesas comerciales) no se publica.
// `n`: número de la pregunta en el documento de CJ (solo referencia interna; en la página se
// numera de 1 a N por página). `discrepancy`: nota de revisión; sus números son los de la página. Se muestra como etiqueta solo en preview, nunca en producción.

export type FaqBlock = string | { ul: string[] } | { ol: string[] };
export type FaqItem = { n: number; q: string; a: FaqBlock[]; discrepancy?: string };
export type FaqGroup = { title: string; items: FaqItem[] };
export type ProductFaq = { product: string; groups: FaqGroup[] };

export const faqByPath: Record<string, ProductFaq> = {
  "/chatbots-con-ia-whatsapp/": {
    "product": "Chatbots con IA & WhatsApp",
    "groups": [
      {
        "title": "Qué es y para quién",
        "items": [
          {
            "n": 1,
            "q": "¿Qué es el chatbot / agente de IA de TodoIP para WhatsApp y qué problema resuelve?",
            "a": [
              "Es una solución de automatización empresarial con o sin Inteligencia Artificial que atiende consultas y ejecuta procesos en WhatsApp 24/7. Resuelve los cuellos de botella operativos y comerciales derivados de altos volúmenes de mensajes de WhatsApp, evitando la pérdida de leads, chats comerciales o de cualquier requerimiento, atención de casos de soporte (tickets) y mejorando la experiencia del cliente."
            ]
          },
          {
            "n": 2,
            "q": "¿En qué se diferencia de un bot de menú numérico («marque 1 para ventas»)?",
            "a": [
              "A diferencia de los menús numéricos rígidos, nuestro agente utiliza IA para entender el lenguaje natural (texto y audio) y el contexto de la conversación. Esto permite resolver procesos complejos y transaccionales sin forzar al usuario a seguir rutas largas predefinidas."
            ]
          },
          {
            "n": 3,
            "q": "¿Para qué tipo de empresa está pensado (volumen diario, tamaño de equipo, tipo de operación)?",
            "a": [
              "Está diseñado para empresas con alto volumen de interacciones diarias, como clínicas, call centers, agencias de viaje, cobranzas y concesionarios. Ideal para equipos comerciales y de servicio al cliente que requieren escalar su operación sin aumentar proporcionalmente el personal."
            ]
          },
          {
            "n": 4,
            "q": "¿Cuál es el volumen mínimo de conversaciones diarias a partir del cual tiene sentido contratarlo?",
            "a": [
              "Por confirmar con el área comercial de TodoIP según el caso de uso y la complejidad de la automatización requerida. Pero normalmente que supere unos cien (100) chats diarios o unos 2.000 al mes."
            ]
          },
          {
            "n": 5,
            "q": "¿Para quién no es una buena opción?",
            "a": [
              "No es recomendable para negocios unipersonales, emprendimientos de bajo volumen o empresas que solo requieren chat informal sin conexión a bases de datos o sistemas internos para lograr automatizaciones que funcionen 24/7."
            ]
          },
          {
            "n": 6,
            "q": "¿El mismo producto cubre Instagram y Facebook Messenger, o son módulos aparte?",
            "a": [
              "Nos enfocamos únicamente en integraciones con WhatsApp Business API, donde tenemos múltiples desarrollos e integraciones con diferentes plataformas."
            ]
          }
        ]
      },
      {
        "title": "Capacidades del agente",
        "items": [
          {
            "n": 7,
            "q": "¿El agente entiende lenguaje natural con errores ortográficos y frases coloquiales colombianas?",
            "a": [
              "Sí, gracias a la Inteligencia Artificial, el agente comprende lenguaje natural, modismos locales y errores ortográficos comunes, adaptándose a la forma real en que escriben los clientes colombianos o de la región que sea, la solución es totalmente adaptable por idioma."
            ]
          },
          {
            "n": 8,
            "q": "¿Procesa notas de voz (audios) de WhatsApp? ¿Cómo responde después (texto, audio o ambos)?",
            "a": [
              "Sí, el agente entiende y procesa audios enviados por los usuarios. El formato de respuesta (texto o audio) dependerá de la configuración específica solicitada por la empresa."
            ]
          },
          {
            "n": 9,
            "q": "¿Puede ejecutar procesos transaccionales (agendar, consultar saldo, generar link de pago, crear ticket) o solo responde preguntas informativas?",
            "a": [
              "Sí, es un bot transaccional. Puede agendar citas, consultar saldos, generar cotizaciones y entregar links de pago mediante integraciones con los sistemas del cliente (CRM, ERP o pasarelas de pago)."
            ]
          },
          {
            "n": 10,
            "q": "¿Existe análisis de sentimiento / «termómetro emocional»? ¿Qué hace cuando detecta frustración o enojo?",
            "a": [
              "Sí, contamos con un desarrollo nativo de análisis de sentimiento que evalúa las emociones tanto en texto como en notas de voz. Cuando el sistema detecta frustración, enojo o palabras críticas, genera alertas en tiempo real para tomar acciones inmediatas, como escalar el caso prioritariamente a un supervisor. Además, funciona como una herramienta de auditoría automatizada: mide el rendimiento y trato de los asesores humanos en el 100% de las interacciones, eliminando la necesidad de leer chats manualmente y ahorrando cientos de horas operativas."
            ]
          },
          {
            "n": 11,
            "q": "¿Soporta múltiples conversaciones simultáneas? ¿Hay límite práctico de chats concurrentes?",
            "a": [
              "Sí, soporta miles de conversaciones simultáneas sin degradación del servicio. El límite está dado por la infraestructura en la nube y los tiers de WhatsApp Business API, escalables según la necesidad."
            ]
          },
          {
            "n": 12,
            "q": "¿Cómo funciona el chat multiagente (distribución por áreas o grupos de trabajo)?",
            "a": [
              "Centraliza un único número de WhatsApp y distribuye las conversaciones entrantes a diferentes áreas o asesores humanos según reglas de negocio, habilidades o disponibilidad."
            ]
          },
          {
            "n": 13,
            "q": "¿Se conservan historial de chats y archivos enviados para auditoría? ¿Por cuánto tiempo y quién puede exportarlos?",
            "a": [
              "Sí, se conserva el historial para auditoría y trazabilidad. Los tiempos de retención y roles de exportación varían según el plan contratado. Por confirmar con el área comercial de TodoIP."
            ]
          },
          {
            "n": 14,
            "q": "¿Qué reportes recibe el cliente (diarios, en tiempo real, métricas concretas)?",
            "a": [
              "El cliente cuenta con acceso a un dashboard interactivo en tiempo real para monitorear las métricas operativas clave: volumen total de conversaciones, tiempos de espera, tiempos medios de atención (TMO) y rendimiento individual por asesor o área. Adicionalmente, generamos reportes gerenciales semanales consolidados para facilitar el análisis de tendencias, evaluar el cumplimiento de los niveles de servicio (SLA) y agilizar la toma de decisiones estratégicas."
            ]
          },
          {
            "n": 15,
            "q": "¿El agente puede prospectar y calificar leads de forma automática? ¿Con qué criterios se configuran?",
            "a": [
              "Sí, funciona como un calificador de leads (con o sin IA) que perfila a los prospectos provenientes de pauta digital antes de enviarlos a los asesores. Los criterios se configuran a la medida del negocio (presupuesto, interés, tiempos)."
            ]
          }
        ]
      },
      {
        "title": "Flujos de atención",
        "items": [
          {
            "n": 16,
            "q": "¿Cómo se ve un flujo típico de atención 24/7: desde el primer mensaje hasta el cierre o el desborde a humano?",
            "a": [
              "El flujo comienza cuando el cliente escribe y el sistema perfila su intención (mediante comprensión de lenguaje natural con IA o a través de preguntas guiadas si se usa el módulo estándar). Luego, el agente virtual interactúa con los sistemas de la empresa para resolver el trámite de forma automática. Si el requerimiento es complejo, realiza un desborde inteligente transfiriendo el chat con todo el historial a un asesor humano disponible. Si el contacto ocurre fuera del horario laboral, el bot informa los horarios de atención humana, captura la información clave y genera un ticket o lead automático para que el equipo retome el caso a primera hora del siguiente día hábil."
            ]
          },
          {
            "n": 17,
            "q": "¿Cómo se configura el desborde inteligente a un asesor humano y qué contexto recibe el asesor?",
            "a": [
              "Se configura a través de reglas de negocio personalizadas, enrutamiento por áreas o de forma automática cuando la IA identifica un requerimiento complejo que exige intervención humana. Durante la transferencia, el asesor recibe el historial completo de la conversación y los datos ya perfilados para evitar que el cliente repita información. Esta entrega inmediata de contexto no solo mejora la experiencia del usuario, sino que acelera el cierre del ticket y optimiza estratégicamente el consumo de mensajes, reduciendo los costos de facturación mensual asociados al modelo de cobro por conversaciones de Meta (WhatsApp Business API)."
            ]
          },
          {
            "n": 18,
            "q": "¿El cliente final permanece en el mismo chat / número oficial durante el handoff a humano?",
            "a": [
              "Sí, la transición es totalmente transparente. El cliente siempre interactúa sobre el mismo número oficial de WhatsApp de la empresa."
            ]
          },
          {
            "n": 19,
            "q": "¿Se pueden definir horarios de atención humana distintos a los del bot? ¿El bot sigue atendiendo fuera de horario?",
            "a": [
              "Sí, el sistema garantiza continuidad operativa 24/7. Fuera del horario de los asesores, el agente virtual asume el control: resuelve consultas frecuentes, califica leads y registra las solicitudes en cola o directamente en el CRM para su gestión a primera hora del siguiente día hábil. Adicionalmente, nuestra plataforma cuenta con una función nativa avanzada que permite configurar horarios de atención diferenciados por área o departamento; por ejemplo, puede establecer un horario de oficina estándar para Ventas y un horario extendido independiente para Soporte Técnico, adaptando el enrutamiento a la estructura real de su empresa."
            ]
          },
          {
            "n": 20,
            "q": "¿Se pueden enviar plantillas / mensajes proactivos (recordatorios, campañas) además de respuestas entrantes? ¿Dependen de la API de WhatsApp Business?",
            "a": [
              "Sí, permite envíos masivos y notificaciones proactivas (recordatorios, cobros). Esta función depende y está regulada por las políticas y plantillas oficiales de WhatsApp Business API."
            ]
          }
        ]
      },
      {
        "title": "Integraciones",
        "items": [
          {
            "n": 21,
            "q": "¿Con qué CRM/ERP se integra de forma nativa o ya probada (HubSpot, Zoho, Salesforce u otros)?",
            "a": [
              "Contamos con integraciones probadas y listas para usar con los principales CRM del mercado, como HubSpot, Zoho y Salesforce. Además, gracias a nuestra arquitectura abierta, podemos integrarnos con cualquier ERP, CRM, software médico (HIS) o sistema propietario de cualquier sector económico. El único requisito técnico para conectar su plataforma es que cuente con servicios web o una API REST documentada, lo que nos permite automatizar flujos de datos en tiempo real según las necesidades exactas de su negocio."
            ]
          },
          {
            "n": 22,
            "q": "¿Se puede conectar a sistemas internos propios del cliente vía API? ¿Qué se requiere del lado del cliente?",
            "a": [
              "Sí. Requiere que el sistema interno del cliente cuente con servicios web o APIs REST disponibles y documentadas para realizar el intercambio de datos."
            ]
          },
          {
            "n": 23,
            "q": "¿Cómo se integra con Google Calendar / Outlook u otros sistemas de agenda?",
            "a": [
              "Se integra conectando el agente a las APIs de Google Calendar o Microsoft Outlook, permitiendo consultar disponibilidad y separar espacios en tiempo real directamente desde el chat."
            ]
          },
          {
            "n": 24,
            "q": "¿Qué pasarelas de pago se han integrado (Wompi, Mercado Pago u otras)? ¿La generación del link es nativa o vía integración?",
            "a": [
              "La generación de links de cobro se realiza de forma dinámica vía integración API, garantizando los más altos estándares de seguridad bancaria. Contamos con integraciones probadas con pasarelas líderes como Wompi y Mercado Pago, permitiendo que el cliente pague de forma ágil sin romper la experiencia del chat. Adicionalmente, para el mercado corporativo e institucional en Colombia, tenemos integraciones avanzadas con pasarelas de alto tráfico como Tu Compra (utilizada por grandes empresas de servicios públicos como Emcali). En estos flujos, nuestra plataforma va más allá del recaudo: a través de nuestras APIs, automatizamos el descargo contable en tiempo real directamente en sistemas ERP y financieros robustos como CG1, cerrando el ciclo de cobranza de principio a fin sin intervención manual."
            ]
          },
          {
            "n": 25,
            "q": "¿Usa WhatsApp Business API oficial? ¿TodoIP gestiona el número / cuenta Meta Business o el cliente trae la suya?",
            "a": [
              "Sí, operamos exclusivamente con WhatsApp Business API oficial. TodoIP asesora en el proceso, operando sobre el Meta Business Manager del cliente para garantizar la propiedad de sus activos."
            ]
          },
          {
            "n": 26,
            "q": "¿El chatbot puede operar sobre el mismo número móvil del PBX Móvil de TodoIP?",
            "a": [
              "Sí. Gracias a nuestros casi 20 años de trayectoria como proveedores nativos de telefonía IP, ofrecemos una verdadera unificación omnicanal. Esto nos permite integrar el canal de voz (PBX Cloud) y el canal de texto (WhatsApp Business API) exactamente sobre el mismo número fijo o móvil empresarial. Esta convergencia tecnológica simplifica radicalmente la experiencia del usuario, ya que clientes y proveedores solo deben guardar un contacto en su smartphone para llamar o chatear. A nivel corporativo, esto garantiza que sus llamadas salientes mantengan el mismo identificador oficial (Caller ID), dispara la recordación de marca y centraliza todo el seguimiento de conversión de su pauta publicitaria en un único canal institucional."
            ]
          }
        ]
      },
      {
        "title": "Requisitos e implementación",
        "items": [
          {
            "n": 27,
            "q": "¿Qué debe tener listo el cliente antes de iniciar (número WhatsApp, acceso a CRM, catálogo, flujos, equipo humano)?",
            "a": [
              "Para un despliegue exitoso, el cliente requiere definir los procesos operativos que desea automatizar y los sistemas a integrar. A nivel técnico, necesita su Meta Business Manager verificado (si no cuenta con uno, TodoIP brinda asesoría y acompañamiento integral durante todo el proceso) y un número telefónico libre de la aplicación estándar de WhatsApp.",
              "Aquí radica nuestra mayor ventaja competitiva: No dependemos de SIM cards físicas. Proveemos de inmediato números en la nube de alta disponibilidad (operador Tigo UNE) que soportan múltiples llamadas telefónicas simultáneas. Esto elimina el principal fallo del 90% de las integraciones de WhatsApp API en el mercado (donde la llamada de voz se cae o suena no disponible cuando el cliente final intenta marcar al número del chat), garantizando así una experiencia de cliente (CX) impecable, profesional y 100% omnicanal."
            ]
          },
          {
            "n": 28,
            "q": "¿Cuáles son las etapas típicas de implementación y puesta en marcha?",
            "a": [
              "Levantamiento de requerimientos, diseño de flujos y entrenamiento de IA, integración con sistemas, pruebas (QA), capacitación al equipo y salida a producción (Go-Live)."
            ]
          },
          {
            "n": 29,
            "q": "¿Cuánto tarda una implementación estándar frente a una con integraciones profundas?",
            "a": [
              "Nuestro modelo de despliegue destaca por su agilidad operativa. Una implementación estándar (con flujos predefinidos y sin conexiones a terceros) suele salir a producción en un promedio de 2 días hábiles. Por su parte, una implementación con integraciones profundas (CRM, ERP, software médico o pasarelas de pago) toma aproximadamente 2 semanas. Estos tiempos de ejecución son altamente efectivos siempre y cuando el cliente tenga sus flujos de atención claramente documentados y las conexiones API (endpoints) de sus sistemas internos estén desarrolladas y totalmente operativas."
            ]
          },
          {
            "n": 30,
            "q": "¿Quién configura los flujos y el conocimiento del bot: TodoIP, el cliente o ambos?",
            "a": [
              "TodoIP realiza la configuración inicial y el entrenamiento profundo, trabajando en conjunto con el cliente para validar el conocimiento y las reglas del negocio."
            ]
          },
          {
            "n": 31,
            "q": "¿El cliente puede editar respuestas / flujos después del go-live sin depender siempre de TodoIP?",
            "a": [
              "Sí, el cliente cuenta con autonomía para actualizar respuestas y módulos de uso frecuente. Sin embargo, para garantizar la estabilidad operativa y la seguridad del ecosistema, los flujos estructurales y las conexiones API profundas son administrados exclusivamente por TodoIP.",
              "Es aquí donde resalta nuestro principal diferenciador en el mercado: operamos bajo un modelo de Soporte Administrado Ágil. Cualquier modificación avanzada puede ser solicitada de inmediato a través de nuestros canales oficiales (WhatsApp, teléfono o correo corporativo). Nuestro equipo técnico ejecuta estos ajustes en tiempo récord, asegurando que su plataforma evolucione rápidamente sin requerir esfuerzo técnico ni desgaste por parte de su equipo."
            ]
          }
        ]
      },
      {
        "title": "Precio y modelo comercial",
        "items": [
          {
            "n": 32,
            "q": "¿Cuál es el modelo de cobro (mensualidad, por conversación, por usuario asesor, implementación + mensualidad, otro)?",
            "a": [
              "Nuestro modelo comercial es transparente y altamente competitivo: se basa exclusivamente en una suscripción mensual que cubre el licenciamiento y el uso continuo de la plataforma. Nuestro mayor diferenciador económico en el mercado es que no cobramos costos de setup ni tarifas por implementación o configuración inicial. Además, para proteger el flujo de caja del cliente, la facturación de la mensualidad se activa única y exclusivamente cuando la solución ha sido entregada a satisfacción, probada y se encuentra 100% operativa en producción (Go-Live)."
            ]
          },
          {
            "n": 33,
            "q": "¿Qué está incluido en el plan base y qué se cotiza aparte (integraciones, canales extra, volumen, soporte premium)?",
            "a": [
              "Nuestro plan base ofrece licenciamiento integral, lo que significa que todas las funcionalidades de la plataforma están incluidas sin restricciones. Nuestro modelo escala únicamente por el volumen de uso operativo:",
              {
                "ul": [
                  "Volumen de Mensajes: Inicias con un paquete mensual adaptado a tu operación (chats entrantes y envío de plantillas proactivas). Si superas el límite, pagas una tarifa plana por cada mensaje adicional consumido.",
                  "Consumo de IA: El plan base incluye una capacidad robusta de tokens. Los tokens adicionales requeridos por picos de operación se facturan bajo un modelo flexible (on-demand).",
                  "Soporte Premium Universal: No cobramos niveles o pólizas de soporte. El Soporte Técnico Premium de alta prioridad está 100% incluido para todos nuestros clientes, sin importar el valor de su factura mensual."
                ]
              }
            ],
            "discrepancy": "Dice que «todas las funcionalidades están incluidas sin restricciones», pero otras respuestas apuntan a lo contrario: la 13 dice que la retención y exportación del historial «varían según el plan contratado» (es decir, hay planes con funciones distintas); la 32 dice que el cobro es «exclusivamente» una suscripción mensual, mientras esta misma respuesta cobra aparte los mensajes y tokens adicionales; y en telefonía (pregunta 14 de PBX Móvil y 16 de Telefonía IP) la integración con WhatsApp, la IA y los conectores a CRM se cobran como adicionales. Confirmar con CJ qué incluye realmente el plan base."
          },
          {
            "n": 34,
            "q": "¿Hay costos de Meta / WhatsApp Business API aparte de la tarifa de TodoIP?",
            "a": [
              "No los hay, para simplificar su gestión administrativa, TodoIP unifica toda la facturación. Los costos oficiales por conversación de Meta (WhatsApp Business API) ya están cubiertos e integrados dentro de su tarifa mensual, de acuerdo con el volumen de mensajes incluido en su plan. Si su operación escala y supera este paquete base, el consumo adicional simplemente se liquida de forma transparente en su misma factura de TodoIP.",
              "Este modelo representa una gran ventaja corporativa: elimina la necesidad de inscribir tarjetas de crédito internacionales directamente en Meta, mitiga la exposición a la fluctuación del dólar y centraliza toda su inversión omnicanal en una única factura electrónica colombiana, facilitando enormemente sus procesos contables y deducciones tributarias."
            ]
          },
          {
            "n": 35,
            "q": "¿Existe un mínimo contractual o permanencia?",
            "a": [
              "Sí, manejamos un acuerdo de permanencia inicial que parte desde los seis (6) meses, el cual se ajusta según el nivel de integración y la complejidad técnica de cada proyecto. Al ser una solución corporativa, formalizamos esta alianza tecnológica mediante un contrato estándar bajo la normativa colombiana. Este tiempo mínimo nos permite garantizar la configuración óptima de la infraestructura dedicada, el acompañamiento en la curva de adopción por parte de su equipo y la medición real del Retorno de Inversión (ROI) operativo de la herramienta."
            ]
          }
        ]
      },
      {
        "title": "Limitaciones y paso a un asesor",
        "items": [
          {
            "n": 36,
            "q": "¿Qué tipos de consultas o trámites el bot no debe resolver y debe pasar siempre a humano?",
            "a": [
              "Trámites que requieran análisis crítico, negociaciones comerciales complejas (ej. acuerdos de pago especiales) o contención emocional profunda que exijan el criterio de un asesor."
            ]
          },
          {
            "n": 37,
            "q": "¿Qué pasa si el CRM o la pasarela de pagos no responde? ¿Hay modo degradado?",
            "a": [
              "Si el sistema externo de un cliente cae, el agente informa amablemente al usuario sobre la intermitencia o transfiere la solicitud a un humano para que tome los datos manualmente."
            ]
          },
          {
            "n": 38,
            "q": "¿Hay límites de longitud de audio, tamaño de archivo o idiomas soportados?",
            "a": [
              "Sí. Más que restricciones técnicas, la plataforma permite establecer políticas configurables de uso eficiente (como limitar audios de larga duración o archivos de gran peso). Estas reglas se parametrizan para garantizar que el bot responda de forma ágil y, al mismo tiempo, proteger el presupuesto de su empresa frente a costos innecesarios de procesamiento de datos. En cuanto al idioma, nuestra tecnología es multilingüe y se adapta a las necesidades de su mercado. El único factor geográfico crítico a definir desde el inicio es el país de operación principal, ya que las tarifas oficiales de Meta (WhatsApp Business API) varían según la región del usuario final."
            ]
          }
        ]
      },
      {
        "title": "Privacidad, seguridad y cumplimiento",
        "items": [
          {
            "n": 39,
            "q": "¿Dónde se alojan los datos de las conversaciones (país / proveedor de nube)?",
            "a": [
              "Nuestra infraestructura opera bajo un modelo Multi-Cloud de alta disponibilidad, alojado en centros de datos de proveedores Tier 1 (clase mundial), incluyendo Amazon Web Services (AWS), donde gestionamos el almacenamiento principal y encriptado de las conversaciones.",
              "Para garantizar la máxima continuidad operativa de nuestros clientes, contamos con una arquitectura distribuida en tres nubes independientes. Esto nos permite ejecutar réplicas de bases de datos en tiempo real y mantener políticas de Disaster Recovery (recuperación ante desastres) que previenen cualquier caída del servicio. Por estrictos protocolos de ciberseguridad corporativa, mantenemos reserva sobre la topología exacta de las nubes de respaldo, asegurando así un entorno blindado contra vulnerabilidades externas."
            ]
          },
          {
            "n": 40,
            "q": "¿Cómo se gestiona el tratamiento de datos personales y Habeas Data en Colombia con este producto?",
            "a": [
              "El bot se configura para solicitar y registrar la aceptación explícita de las políticas de tratamiento de datos (Habeas Data) del cliente antes de iniciar procesos transaccionales o de perfilamiento."
            ]
          },
          {
            "n": 41,
            "q": "¿El cliente puede solicitar borrado o exportación de conversaciones?",
            "a": [
              "Sí, el cliente es dueño de su información y puede gestionar políticas de retención y borrado conforme a las normativas vigentes."
            ],
            "discrepancy": "Dice que el cliente puede gestionar la retención y el borrado de sus conversaciones, pero la pregunta 8 del Portal de Autogestión dice que ni el administrador ni ningún otro perfil puede borrar registros ni eliminar grabaciones, y la 16 de PBX Móvil fija la retención de grabaciones en 6 meses. Además, la Ley 1581 (Habeas Data) le da al titular el derecho a pedir la supresión de sus datos. Confirmar con CJ cómo se atiende una solicitud de borrado en chat y en telefonía."
          },
          {
            "n": 42,
            "q": "¿Qué medidas de seguridad aplican al acceso de asesores (roles, 2FA, auditoría de acceso)?",
            "a": [
              "La plataforma opera bajo estrictos estándares de seguridad corporativa. Implementamos Control de Acceso Basado en Roles (RBAC) para restringir los permisos según el perfil del usuario, respaldado por logs de auditoría que registran la trazabilidad de cualquier cambio realizado en los módulos críticos. Además, el panel multiagente cuenta con un control de concurrencia de sesión única (seguridad de grado bancario): si un asesor inicia sesión en un nuevo dispositivo, el sistema cierra automáticamente cualquier otra sesión activa con esas credenciales. Esto previene la suplantación interna y garantiza total confiabilidad sobre la identidad de quien gestiona las conversaciones y los datos sensibles de sus clientes."
            ]
          }
        ]
      },
      {
        "title": "Soporte y resultados",
        "items": [
          {
            "n": 43,
            "q": "¿Qué canales y horarios de soporte ofrece TodoIP para este producto?",
            "a": [
              "Nuestro soporte técnico opera bajo un modelo omnicanal de alta prioridad, respaldado por un sistema de tickets (CRM) interno que garantiza la trazabilidad y resolución de cada requerimiento. Los canales oficiales son correo electrónico (con escalamiento automático a la jefatura técnica), WhatsApp y líneas telefónicas. Para los clientes de nuestra Telefonía IP habilitamos la extensión exclusiva 611, que conecta de inmediato con la mesa de ayuda.",
              "Nuestros Acuerdos de Nivel de Servicio (SLA) se dividen en:",
              {
                "ul": [
                  "Soporte Estándar: Lunes a viernes de 8:00 a.m. a 5:00 p.m. (jornada continua) para requerimientos operativos, dudas, ajustes y cambios de configuración.",
                  "Soporte de Contingencia: Protocolo de guardia fuera del horario hábil. Ante fallas críticas que detengan la operación, el cliente reporta el caso por correo y, tras validar la severidad, nuestro equipo interviene de inmediato para restablecer la continuidad del negocio."
                ]
              }
            ]
          },
          {
            "n": 44,
            "q": "¿Qué resultados medibles han visto los clientes?",
            "a": [
              "Nuestros casos de éxito más robustos se concentran en el sector salud (Clínicas e IPS), donde hemos validado una reducción superior al 50% en la carga operativa manual gracias a la automatización integral de procesos repetitivos (autoagendamiento, cancelación y confirmación de citas).",
              "Nuestra plataforma garantiza una operación 24/7 ininterrumpida, lo que ha resultado estratégico para que las empresas se adapten a la reducción legal de la jornada laboral en Colombia (transición a 42 horas semanales) sin necesidad de incrementar sus costos operativos o disparar los gastos de nómina. Lejos de reemplazar al personal, esta automatización permite absorber grandes volúmenes de demanda de forma eficiente y reasignar al equipo humano hacia tareas de mayor valor agregado (como la atención de casos complejos, retención de clientes o la humanización del servicio presencial)."
            ]
          },
          {
            "n": 45,
            "q": "¿Qué instituciones de salud usan las soluciones de TodoIP?",
            "a": [
              "Nuestro mayor respaldo es la adopción de nuestra tecnología en más de 50 instituciones líderes del sector salud en Colombia, entre ellas:",
              {
                "ul": [
                  "Clínicas y Hospitales de Alta Complejidad: Clínica de Occidente, Fundación Hospital San José de Buga y Hospital Francisco de Paula Santander.",
                  "Redes Ambulatorias y EPS: Sura (IPS Vivir), Nueva EPS (Medicips, Nordvital, Angiografía de Occidente), Sanitas (Echeverry & Castro Grupo Dental, Occi Dental), además de sedes especializadas para el Magisterio, Compensar y SOS.",
                  "Alta Especialidad y Centros Diagnósticos: Hemato Oncólogos, Unicancer, Endocirujanos, Clínica de la Visión, Clínica Oftalmológica de Palmira, Imágenes Diagnósticas San José, Cenvalle, Clinimagenes y Digimage.",
                  "Operación Remota Centralizada: Sucre (IPS Salud a Tu Lado, IPS Divina Misericordia, Clínica Las Peñitas), Caldas (Hospital de Pácora), Cauca (IPS Nueva Popayán, Bios IPS, Quilisalud E.S.E. en Santander de Quilichao), Nariño (Ambulancias San José, Sursalud), Norte de Santander (Clínica San Diego, Nordvital) y Santander (Ceroc)."
                ]
              }
            ]
          }
        ]
      },
      {
        "title": "Uso en salud: clínicas, IPS y hospitales",
        "items": [
          {
            "n": 46,
            "q": "¿Cómo ayuda el agente de WhatsApp a una clínica o IPS con alto volumen de mensajes diarios?",
            "a": [
              "Transforma la experiencia del paciente y reduce los cuellos de botella operativos mediante una automatización 24/7. El agente absorbe volúmenes masivos de consultas repetitivas, gestiona el autoagendamiento y envía recordatorios proactivos, lo que disminuye radicalmente las filas virtuales y libera al personal administrativo para tareas de mayor valor."
            ]
          },
          {
            "n": 47,
            "q": "¿Puede agendar, cancelar y reprogramar citas sincronizado con el software médico o la agenda de la clínica?",
            "a": [
              "Sí, es una solución 100% transaccional. Mediante integración API, el agente sincroniza en tiempo real con el software médico (HIS) o la agenda de la institución, permitiendo al paciente agendar, cancelar o reprogramar citas de forma autónoma sin intervención humana."
            ]
          },
          {
            "n": 48,
            "q": "¿Con qué softwares médicos / HIS / agendas se ha integrado en la práctica?",
            "a": [
              "Gracias a nuestra arquitectura abierta, nos integramos vía API REST con los principales sistemas de información hospitalaria (HIS), herramientas de agendamiento (como Google Calendar y Microsoft Outlook) y plataformas desarrolladas a la medida. A nivel local en Colombia, contamos con integraciones consolidadas y probadas con softwares especializados de alto uso, como el sistema SIIS (Sistema Integral de Información en Salud), ampliamente implementado en múltiples entidades prestadoras. Nuestra plataforma tecnológica está diseñada para ser completamente interoperable: podemos conectar nuestro motor conversacional y PBX con cualquier ERP, CRM o software médico del sector, el único requerimiento técnico es que el sistema del cliente cuente con conectividad API disponible para intercambiar datos en tiempo real."
            ]
          },
          {
            "n": 49,
            "q": "¿Cómo funcionan los recordatorios de cita y la recuperación de cupos cuando el paciente cancela?",
            "a": [
              "El sistema envía plantillas proactivas oficiales (aprobadas por Meta) recordando la cita. Si el paciente cancela desde el chat, la integración con su software médico libera el espacio en tiempo real, permitiendo ofrecer ese cupo de inmediato a pacientes en lista de espera y combatiendo el ausentismo médico (no-show)."
            ]
          },
          {
            "n": 50,
            "q": "¿Puede cotizar servicios particulares (ej. resonancia, laboratorios) y entregar el valor en el chat?",
            "a": [
              "Sí, nuestro agente virtual permite cotizar servicios particulares 24/7 de forma inmediata, acelerando el cierre comercial. Esta funcionalidad es 100% transaccional y se ejecuta mediante integración API para extraer los valores tarifarios actualizados directamente desde el ERP, HIS o sistema de facturación de la clínica. Alternativamente, para operaciones sin conexión API disponible, ofrecemos la capacidad de cargar una matriz de precios vía Excel directamente a nuestro sistema, desde donde la clínica puede gestionar y actualizar tarifas individuales para procedimientos, laboratorios, medicamentos o cualquier servicio particular."
            ]
          },
          {
            "n": 51,
            "q": "¿Puede entregar resultados médicos por WhatsApp tras validar identidad? ¿Cómo se valida (foto de cédula u otro)?",
            "a": [
              "Sí, la entrega segura de resultados se realiza exigiendo protocolos de validación de identidad. Dependiendo del flujo definido con la clínica, se puede exigir el envío de la foto del documento (procesada automáticamente con nuestro módulo OCR de Lectura Inteligente) o el cruce de datos variables para entregar un enlace seguro y tokenizado al paciente."
            ]
          },
          {
            "n": 52,
            "q": "¿Se pueden cobrar cuotas moderadoras o copagos dentro del chat? ¿Con qué pasarela?",
            "a": [
              "Sí, el recaudo se ejecuta de forma dinámica para agilizar los procesos de admisión. Generamos links de pago vía integración con pasarelas corporativas como Wompi o Mercado Pago, facilitando que el paciente pague su cuota moderadora o copago directamente desde el chat antes de asistir a su cita. Adicionalmente, contamos con integración profunda con Tu Compra, una pasarela altamente reconocida y utilizada por instituciones líderes en Colombia. A través de nuestras APIs, esta integración va más allá de la transacción: conectamos directamente con el software financiero del cliente para ejecutar todo el proceso de descargo contable de forma automática, cerrando el ciclo de caja sin intervención humana."
            ]
          },
          {
            "n": 53,
            "q": "¿Cómo se relaciona este chatbot con el cumplimiento de la Resolución 256 (encuestas de satisfacción)? ¿Es nativo del bot, del PBX/IVR o de ambos?",
            "a": [
              "TodoIP apoya el cumplimiento normativo (Resolución 256) parametrizando encuestas de satisfacción automatizadas al finalizar la atención. Esta funcionalidad analítica es una capacidad nativa que podemos desplegar tanto en los flujos escritos del chatbot en WhatsApp como en los canales de voz (PBX/IVR/Voicebot)."
            ]
          },
          {
            "n": 54,
            "q": "¿Qué precauciones de datos sensibles de salud aplica TodoIP? ¿Almacenan historias clínicas o solo metadatos de agendamiento?",
            "a": [
              "Operamos bajo estrictos protocolos de ciberseguridad y cumplimiento de la Ley de Habeas Data en Colombia. TodoIP actúa exclusivamente como un canal de tránsito transaccional en la nube; no almacenamos historias clínicas. Los datos médicos sensibles residen únicamente en los servidores (HIS) del cliente, limitándonos a procesar metadatos operativos y de agendamiento."
            ]
          },
          {
            "n": 55,
            "q": "¿Para qué tipo de institución de salud no es adecuado (consultorio unipersonal, bajo volumen)?",
            "a": [
              "Nuestra plataforma no está diseñada para consultorios unipersonales o entidades con un flujo de comunicación incipiente. Para garantizar un Retorno de Inversión (ROI) óptimo, recomendamos la adopción de nuestras soluciones a instituciones que gestionen un volumen de contacto activo, partiendo de un aproximado de 50 interacciones diarias (sean conversaciones de WhatsApp o llamadas telefónicas). Para clínicas o centros médicos de menor tamaño que aún no cuentan con un software médico que permita integraciones API complejas, TodoIP ofrece alternativas ágiles y de rápida implementación, como nuestro módulo Multichat/Multiagente (para centralizar WhatsApp) o el PBX Móvil en la nube (para centralizar llamadas sobre el mismo identificador), asegurando profesionalismo y orden operativo desde el primer día."
            ]
          }
        ]
      },
      {
        "title": "Uso en cobranzas y gestión de cartera",
        "items": [
          {
            "n": 56,
            "q": "¿Cómo funciona la cobranza / gestión de cartera por WhatsApp con el agente de TodoIP?",
            "a": [
              "Optimiza la recuperación de cartera mediante una operación omnicanal automatizada. El sistema ejecuta notificaciones proactivas de cobro y ofrece un chatbot transaccional donde el deudor puede consultar su estado de cuenta, negociar acuerdos de pago y cancelar 24/7, sin fricciones ni necesidad de hablar con un gestor."
            ]
          },
          {
            "n": 57,
            "q": "¿Consulta saldos, intereses y mora en tiempo real desde el core / ERP / CRM del cliente?",
            "a": [
              "Sí, la consulta se realiza estrictamente en tiempo real mediante integración API con el core financiero, ERP o CRM de la casa de cobranza, garantizando que el deudor visualice su saldo exacto con los intereses moratorios liquidados al día."
            ]
          },
          {
            "n": 58,
            "q": "¿Cómo valida la identidad del deudor antes de entregar información financiera sensible?",
            "a": [
              "Implementamos barreras de seguridad. El sistema verifica que el número de WhatsApp coincida con las bases de datos y, como segundo factor, solicita validación de datos sensibles (como el número de cédula, fecha de nacimiento o NIT) antes de revelar cualquier información financiera amparada por el Habeas Data."
            ]
          },
          {
            "n": 59,
            "q": "¿Genera links de pago dinámicos en el mismo chat? ¿Cuáles pasarelas están disponibles?",
            "a": [
              "Sí, genera enlaces de recaudo personalizados vía integración corporativa con pasarelas líderes como Wompi, Mercado Pago o Tu Compra. Esto no solo facilita el recaudo instantáneo, sino que permite, vía API, ejecutar el descargo contable automatizado en los sistemas del cliente."
            ]
          },
          {
            "n": 60,
            "q": "¿Soporta llamadas de voz nativas de WhatsApp (WhatsApp Voice) para gestión de cobro? ¿Es capacidad nativa o integración?",
            "a": [
              "Sí, y este es uno de nuestros mayores diferenciadores técnicos. A través de nuestra integración nativa por protocolo SIP, los deudores pueden realizar llamadas desde el botón oficial de WhatsApp Voice, y estas ingresan directamente a nuestra PBX Cloud para ser distribuidas, monitoreadas y grabadas como en un Call Center tradicional."
            ]
          },
          {
            "n": 61,
            "q": "¿Cómo funciona el desborde a gestor humano cuando el deudor pide refinanciación o acuerdo especial?",
            "a": [
              "Mediante enrutamiento inteligente. Si el deudor solicita una condición de refinanciación que la IA no tiene autorizada gestionar, el sistema transfiere la sesión inmediatamente a un gestor de cartera humano, entregándole el contexto total de la conversación y el perfilamiento financiero para agilizar el cierre del acuerdo."
            ]
          },
          {
            "n": 62,
            "q": "¿Se pueden enviar notificaciones masivas de cobro sin que Meta / WhatsApp bloquee el número? ¿Qué buenas prácticas recomienda TodoIP?",
            "a": [
              "Sí, utilizando plantillas oficiales aprobadas por Meta. TodoIP brinda acompañamiento estratégico recomendando buenas prácticas operativas: envíos graduales escalonados, correcta depuración de bases de datos y habilitación de botones de opt-out (desuscripción) para proteger la calificación de calidad (Quality Rating) de su línea oficial."
            ]
          },
          {
            "n": 63,
            "q": "¿Para qué perfiles de cartera está pensado (volumen de deudores, conversaciones/día) y para quién no?",
            "a": [
              "Ideal para entidades financieras, retailers, servicios públicos y agencias de cobranza masiva con carteras en etapa temprana o preventiva (alto volumen de morosos). No es adecuado para la recuperación de cartera B2B de alto ticket y bajísimo volumen que requiere negociaciones artesanales o estrictamente legales presenciales."
            ]
          },
          {
            "n": 64,
            "q": "¿Qué resultados se logran en recuperación de cartera?",
            "a": [
              "El éxito de la herramienta se mide a través de la tasa de contención automática. Dependiendo de la madurez y etapa de la cartera (preventiva, administrativa o castigada), nuestra tecnología con Inteligencia Artificial logra resolver de forma 100% autónoma hasta un 73% de los casos. Esto incluye consultas de saldo, acuerdos de pago y descargas de comprobantes. El porcentaje restante, correspondiente a negociaciones complejas, quejas o casos de refinanciación atípicos, es derivado inmediatamente de forma inteligente a un agente humano, quien recibe todo el contexto de la conversación previa para cerrar la negociación sin fricción para el deudor."
            ]
          }
        ]
      },
      {
        "title": "Uso en turismo: agencias y hoteles",
        "items": [
          {
            "n": 65,
            "q": "¿Qué hace el agente de WhatsApp para una agencia de viajes o hotel con alto volumen de consultas?",
            "a": [
              "Actúa como un perfilador de leads y motor de ventas 24/7. Califica instantáneamente el tráfico masivo generado por pauta digital, responde preguntas frecuentes y entrega disponibilidad, asegurando que los asesores humanos inviertan su tiempo solo en cerrar clientes con intención de compra real."
            ]
          },
          {
            "n": 66,
            "q": "¿Consulta disponibilidad en motor de reservas o PMS en tiempo real? ¿Qué sistemas se han conectado?",
            "a": [
              "Sí, gracias a nuestra arquitectura abierta, el agente virtual consulta inventarios, disponibilidad y tarifas dinámicas en tiempo real. Mediante integración API REST, podemos conectar nuestro ecosistema con cualquier motor de reservas o PMS (Property Management System) que el hotel o agencia tenga implementado, siempre y cuando cuente con servicios web disponibles para el intercambio de datos. Esta automatización operativa es ideal y altamente recomendada para agencias de viaje y cadenas hoteleras que manejan un alto volumen diario de interacciones y buscan acelerar su tasa de conversión sin depender de consultas manuales."
            ]
          },
          {
            "n": 67,
            "q": "¿Cómo califica prospectos (visa, presupuesto, fechas, número de viajeros) antes de pasarlos a un asesor?",
            "a": [
              "Mediante flujos conversacionales guiados o procesamiento con IA, el agente captura y valida variables críticas de calificación (fechas de viaje, presupuesto, número de pasajeros o posesión de visa). Si el prospecto no cumple con los criterios comerciales, el bot ofrece opciones automatizadas, pero solo desborda al asesor a los leads calificados."
            ]
          },
          {
            "n": 68,
            "q": "¿Puede cerrar una reserva y cobrar dentro del mismo chat?",
            "a": [
              "Sí, si la infraestructura tecnológica de la agencia o cadena hotelera lo permite (integración API de su motor y de pasarela de pago), el sistema puede ejecutar transacciones End-to-End, concretando la reserva y generando el voucher sin intervención humana."
            ]
          },
          {
            "n": 69,
            "q": "¿Cómo funcionan las llamadas internacionales vía WhatsApp Voice para prospectos en el exterior?",
            "a": [
              "Es un beneficio comercial invaluable para captar turismo extranjero. El prospecto internacional hace clic en llamar desde WhatsApp y, sin incurrir en cobros de larga distancia, la llamada ingresa directamente a la central PBX Cloud en Colombia, permitiendo al equipo de ventas atender al instante."
            ]
          },
          {
            "n": 70,
            "q": "¿Cómo se centraliza el número oficial para que varios asesores atiendan sin usar WhatsApp personal?",
            "a": [
              "El ecosistema unifica toda la operación sobre una única línea certificada de WhatsApp Business API. Toda la fuerza de ventas atiende de forma simultánea (multiagente) desde sus computadores a través de un panel de control corporativo, erradicando el uso inseguro de equipos móviles personales."
            ]
          },
          {
            "n": 71,
            "q": "¿Qué pasa con el historial si un asesor se va de la empresa? ¿Los datos quedan en la cuenta de la empresa?",
            "a": [
              "La propiedad de la data está 100% protegida. Todo el historial de chats, acuerdos, bases de datos de viajeros y audios reside de manera centralizada en la plataforma corporativa de la empresa, evitando fugas de información comercial ante la rotación de personal."
            ]
          },
          {
            "n": 72,
            "q": "¿Para qué tipo de operación turística es ideal y para cuál no (agencia pequeña de bajo volumen vs operación con pauta digital masiva)?",
            "a": [
              "Es el aliado tecnológico ideal para agencias consolidadas y cadenas hoteleras con alto volumen de consultas o campañas masivas de pauta digital. No es recomendable para agentes turísticos freelance independientes o agencias de bajo tráfico que aún pueden manejar toda su operación de manera manual."
            ]
          }
        ]
      }
    ]
  },
  "/agente-de-voz-con-ia-voicebot/": {
    "product": "Agente de Voz con IA (Voicebot)",
    "groups": [
      {
        "title": "Qué es y para quién",
        "items": [
          {
            "n": 73,
            "q": "¿Qué es el Agente de Voz con IA (Voicebot) de TodoIP y qué problema resuelve?",
            "a": [
              "Es un operador telefónico virtual impulsado por Inteligencia Artificial capaz de mantener conversaciones de voz fluidas y naturales. Resuelve radicalmente las llamadas perdidas, lleva los tiempos de espera a cero y permite absorber altos picos operacionales en un Call Center sin necesidad de contratar personal temporal."
            ]
          },
          {
            "n": 74,
            "q": "¿El producto contesta llamadas de forma autónoma, analiza llamadas de agentes humanos, o ambas cosas?",
            "a": [
              "Soporta ambas modalidades de grado corporativo. Funciona como un operador autónomo de primera línea (resolviendo trámites en tiempo real por voz) o como una potente herramienta de auditoría automatizada (Speech Analytics), transcribiendo y evaluando la gestión de sus asesores humanos."
            ]
          },
          {
            "n": 75,
            "q": "¿Para qué tipo de operación telefónica está pensado (call center, clínicas, cobranzas, retail) y con qué volumen de llamadas?",
            "a": [
              "Está diseñado para operaciones telefónicas transaccionales de alto impacto: Call Centers de retail, carteras masivas de cobranza, agendamiento de citas en clínicas y atención corporativa B2C. Para dimensionar el volumen mínimo de licenciamiento operativo, por favor confirmar con el área comercial de TodoIP."
            ]
          },
          {
            "n": 76,
            "q": "¿Para quién no es recomendable?",
            "a": [
              "No es recomendable para PYMES con un tráfico telefónico mínimo, ni para consultorías especializadas (ventas técnicas complejas, psicología, legal corporativo) donde el valor del servicio depende estrictamente de un análisis cognitivo y empático de alta personalización humana."
            ]
          }
        ]
      },
      {
        "title": "Capacidades",
        "items": [
          {
            "n": 77,
            "q": "¿Transcribe y analiza el 100 % de las llamadas en tiempo real? ¿Qué latencia típica tiene el análisis?",
            "a": [
              "Sí, su capacidad de procesamiento en la nube permite transcribir y ejecutar análisis profundo sobre el 100% de las llamadas cursadas. Por confirmar con el área comercial de TodoIP los datos exactos de latencia de red (ms) asociados a la arquitectura del cliente."
            ]
          },
          {
            "n": 78,
            "q": "¿Qué hace el análisis de sentimientos en la práctica (alertas, scoring, reportes)?",
            "a": [
              "En la práctica, evalúa las variaciones tonales y semánticas para perfilar la emoción del cliente. Esto dispara alertas a supervisores ante usuarios frustrados, automatiza las matrices de calificación (QA scoring) de los agentes y genera reportes gerenciales de satisfacción (Sentiment Analysis) sin escuchas manuales."
            ]
          },
          {
            "n": 79,
            "q": "¿Cómo funciona la detección de palabras clave (competencia, intención de compra, quejas)?",
            "a": [
              "El sistema permite parametrizar diccionarios específicos (nombres de competidores, amenazas legales, señales fuertes de compra). Al detectarlas en el audio en vivo, el sistema etiqueta automáticamente la llamada (Tags) o lanza insights de alerta en el CRM corporativo."
            ]
          },
          {
            "n": 80,
            "q": "¿Puede verificar cumplimiento de guiones / cláusulas legales obligatorias en llamadas de venta o cobranza?",
            "a": [
              "Sí, es una robusta herramienta de Compliance (Cumplimiento normativo). La IA verifica y certifica si el asesor humano enunció los guiones obligatorios, los avisos legales (como la política de tratamiento de datos o condiciones financieras), mitigando así riesgos jurídicos para la empresa."
            ]
          },
          {
            "n": 81,
            "q": "¿Puede el voicebot atender y resolver trámites (consultar saldo, direccionar, confirmar cita) sin agente humano?",
            "a": [
              "Absolutamente. A diferencia de un simple IVR, el Voicebot es transaccional: mediante integración API, consulta las bases de datos de la empresa, validando identidades para informar saldos exactos, separar fechas de agenda o radicar tickets complejos de forma autónoma."
            ]
          },
          {
            "n": 82,
            "q": "¿Se integra con la PBX / telefonía IP existente del cliente (Asterisk, Cisco, Grandstream, etc.) sin reemplazarla?",
            "a": [
              "Sí, opera bajo un principio de arquitectura abierta. Gracias a la conectividad estándar mediante Troncales SIP, el Voicebot se integra armónicamente como una extensión o módulo inteligente adicional a infraestructuras PBX preexistentes (Asterisk, Cisco, Avaya, Grandstream) sin forzar un reemplazo tecnológico."
            ]
          }
        ]
      },
      {
        "title": "Uso por sector",
        "items": [
          {
            "n": 83,
            "q": "En salud: ¿cómo funciona el triaje por voz, la auditoría de protocolos y el análisis de empatía? ¿Qué está disponible hoy vs en roadmap?",
            "a": [
              "El enfoque principal implementado es la eficiencia administrativa (agendamiento/confirmación telefónica autónoma) y la auditoría de empatía para el control de calidad (QA) de los agentes. Capacidades de triaje clínico diagnóstico por IA requieren validación técnica avanzada; por confirmar estado de disponibilidad (Roadmap) con el área comercial de TodoIP."
            ]
          },
          {
            "n": 84,
            "q": "En retail / ventas: ¿cómo se usan las llamadas exitosas para entrenar o generar guiones?",
            "a": [
              "El análisis de voz permite extraer los patrones lingüísticos y tácticas de negociación presentes en los cierres de venta exitosos de los mejores agentes comerciales (Top Performers). Esta analítica de datos se utiliza para perfeccionar los guiones corporativos y reducir el tiempo de entrenamiento de nuevos ingresos."
            ]
          },
          {
            "n": 85,
            "q": "En cobranzas / finanzas: ¿hay detección de fraude o de riesgo de fuga (churn) por voz? ¿Cómo se activa la retención?",
            "a": [
              "El análisis semántico detecta de forma proactiva el riesgo de fuga (Churn) si el cliente manifiesta repetida frustración o intenciones de desafiliación, permitiendo enrutar prioritariamente la llamada al departamento de retención. Funciones de prevención de fraude mediante biometría de voz, por confirmar con el área comercial de TodoIP."
            ]
          },
          {
            "n": 86,
            "q": "¿El voicebot participa en encuestas de Resolución 256 al final de la llamada?",
            "a": [
              "Sí. Finalizada la atención primaria, la llamada telefónica puede direccionarse de manera automatizada al flujo del Voicebot para ejecutar la encuesta conversacional, consolidando la información requerida por la Resolución 256 del Ministerio de Salud colombiano de manera inmediata."
            ]
          }
        ]
      },
      {
        "title": "Integraciones e implementación",
        "items": [
          {
            "n": 87,
            "q": "¿Qué infraestructura telefónica necesita el cliente para desplegar el Voicebot?",
            "a": [
              "El requisito técnico básico es contar con una planta telefónica PBX IP que soporte integraciones estándar por protocolo SIP Trunking. De forma alternativa, el cliente puede migrar su numeración operativa y utilizar la PBX Cloud nativa de TodoIP para una implementación totalmente fluida."
            ]
          },
          {
            "n": 88,
            "q": "¿Se integra con CRM para registrar insights de cada llamada?",
            "a": [
              "Sí, gracias al uso de APIs REST, el modelo transfiere automáticamente datos estructurados (transcripciones completas, resúmenes generados por la IA, análisis de sentimiento y tags) directamente a las herramientas y CRMs de la empresa, unificando la vista 360 del cliente."
            ]
          },
          {
            "n": 89,
            "q": "¿Cuáles son las etapas de implementación y el tiempo típico hasta producción?",
            "a": [
              "El despliegue (Onboarding) incluye ingeniería de requerimientos, integración API, diseño de flujos conversacionales, entrenamiento de los modelos acústicos locales y fase de aseguramiento de calidad (QA). Los tiempos exactos hasta la salida a producción, por confirmar con el área comercial de TodoIP según la magnitud técnica."
            ]
          }
        ]
      },
      {
        "title": "Precio, limitaciones, privacidad y soporte",
        "items": [
          {
            "n": 90,
            "q": "¿Cuál es el modelo de cobro del Voicebot (por minuto, por llamada analizada, mensualidad, otro)?",
            "a": [
              "Nuestro modelo corporativo SaaS (Software as a Service) se estructura típicamente como un híbrido entre licenciamiento mensual de la plataforma y cobro por consumo (volumetría de minutos procesados por la IA). Por confirmar los planes tarifarios escalables vigentes con el área comercial de TodoIP."
            ]
          },
          {
            "n": 91,
            "q": "¿Qué limitaciones tiene (idiomas, acentos, ruido, llamadas cortadas, canales solo PSTN vs VoIP)?",
            "a": [
              "El Voicebot está optimizado para español latino neutro y regional. En entornos de alto ruido de fondo (como terminales de transporte) o si la señal de la red celular del usuario sufre caídas (llamadas cortadas), la precisión del reconocimiento de voz (ASR) puede verse afectada temporalmente. A nivel de infraestructura, la plataforma opera exclusivamente sobre tecnología VoIP (Troncales SIP), por lo que si el cliente posee telefonía analógica tradicional (PSTN) debe migrar a tecnología 100% Sip."
            ]
          },
          {
            "n": 92,
            "q": "¿Dónde se almacenan grabaciones y transcripciones? ¿Quién tiene acceso?",
            "a": [
              "Todas las grabaciones y sus respectivas transcripciones estructuradas se alojan de forma segura en la nube de TodoIP. El acceso a esta información está estrictamente controlado , garantizando que únicamente el personal autorizado de su empresa (supervisores, área de calidad o gerencia) pueda consultar, auditar o exportar los datos."
            ]
          },
          {
            "n": 93,
            "q": "¿Cómo se gestiona consentimiento de grabación / tratamiento de datos en llamadas?",
            "a": [
              "Para garantizar el cumplimiento absoluto de la Ley de Habeas Data en Colombia (Ley 1581 de 2012), la plataforma parametriza la reproducción obligatoria de un aviso legal de privacidad y consentimiento al inicio de cada interacción de voz (\"Esta llamada será grabada y monitoreada para fines de calidad...\"). El sistema registra de manera auditable que el usuario escuchó el mensaje y aceptó continuar con la atención, mitigando cualquier riesgo sancionatorio para la institución."
            ]
          },
          {
            "n": 94,
            "q": "¿Qué soporte y SLA aplican?",
            "a": [
              "Operamos bajo un Acuerdo de Nivel de Servicio (SLA) corporativo de alta disponibilidad. Nuestro servicio de soporte técnico Premium es omnicanal (ticket interno, correo con escalamiento a jefatura, WhatsApp y central PBX directa). Contamos con protocolos de contingencia inmediatos para eventos críticos que impacten la continuidad del negocio y atención estándar de lunes a viernes en horario continuo (8:00 a.m. a 5:00 p.m.) para requerimientos operativos, sin cobros ocultos por pólizas de soporte."
            ]
          },
          {
            "n": 95,
            "q": "¿Qué resultados se logran con el Voicebot?",
            "a": [
              "Nuestras implementaciones de Voicebot logran el 100% de la transcripción y auditoría automática de las llamadas cursadas (Speech Analytics), eliminando el sesgo del muestreo manual aleatorio. Para casos específicos sobre porcentajes de mejora en tasas de conversión comercial o reducción medible del riesgo jurídico por omisión de guiones, por favor confirmar con el área comercial de TodoIP los casos de éxito consolidados en su sector."
            ]
          }
        ]
      }
    ]
  },
  "/lectura-inteligente-de-documentos/": {
    "product": "Lectura Inteligente de Documentos",
    "groups": [
      {
        "title": "Qué es y para quién",
        "items": [
          {
            "n": 96,
            "q": "¿Qué es la Lectura Inteligente de Documentos de TodoIP y qué problema elimina?",
            "a": [
              "Es un potente motor de Reconocimiento Óptico de Caracteres (OCR) impulsado por Inteligencia Artificial. Resuelve uno de los mayores cuellos de botella operativos en la atención al cliente: la digitación manual y repetitiva de datos.",
              "El sistema extrae en tiempo real la información clave de imágenes o archivos enviados por los usuarios y la inyecta directamente en los sistemas de la empresa. Esto elimina por completo los errores de digitación y reduce los tiempos de registro a cero. Nuestros módulos activos más exitosos son:",
              {
                "ul": [
                  "Registro de Usuarios/Pacientes: Extrae datos de documentos para poblar automáticamente CRMs, sistemas de salud o ERP, sin que el cliente deba responder múltiples preguntas.",
                  "Lectura de Órdenes Médicas: Extrae de la orden enviada por chat el código CUPS o el nombre exacto del servicio, para emitir cotizaciones automáticas o agendar el procedimiento de inmediato."
                ]
              }
            ]
          },
          {
            "n": 97,
            "q": "¿Funciona solo dentro de WhatsApp o también por otros canales o cargas masivas?",
            "a": [
              "Actualmente, ofrecemos esta solución implementada y optimizada exclusivamente como una integración nativa para WhatsApp."
            ]
          },
          {
            "n": 98,
            "q": "¿Para qué operaciones de alto volumen está pensada y para cuáles no?",
            "a": [
              "La plataforma está diseñada con una arquitectura altamente escalable capaz de procesar volúmenes masivos de datos. Al estar conectada directamente vía API con WhatsApp y los sistemas del cliente, el límite de procesamiento lo define el flujo de la propia entidad. Es el aliado estratégico ideal para áreas de admisiones en clínicas y operaciones con alta población asignada (como instituciones con contratos robustos con EPS). No es un producto pensado para operaciones freelance, consultorios independientes o negocios incipientes donde el bajo volumen de recepción de documentos físicos o digitales no justifique una inversión formal en integración tecnológica."
            ]
          }
        ]
      },
      {
        "title": "Capacidades",
        "items": [
          {
            "n": 99,
            "q": "¿Qué tipos de documento puede leer (cédula, pasaporte, factura, orden médica, PDF, tarjeta de presentación, recibos)?",
            "a": [
              "El motor está entrenado para procesar documentos de alta demanda transaccional, incluyendo documentos de identidad colombianos (Cédula de Ciudadanía), pasaportes, órdenes médicas impresas, facturas comerciales, recibos de viáticos, tarjetas de presentación corporativas y formularios estructurados en formato imagen o PDF."
            ]
          },
          {
            "n": 100,
            "q": "¿Extrae campos estructurados hacia el sistema del cliente? ¿Con qué precisión típica se mide?",
            "a": [
              "Sí, extrae variables estructuradas exactas (Nombres, Número de Documento, Fechas, Códigos de Autorización o Valores Financieros) en formato JSON, listas para ser interpretadas por los sistemas del cliente. En documentos estandarizados (como la cédula colombiana), la precisión del reconocimiento supera ampliamente el 95%, dependiendo siempre de que las condiciones de captura (iluminación y enfoque fotográfico) sean óptimas."
            ]
          },
          {
            "n": 101,
            "q": "¿También entiende notas de voz y extrae variables de la solicitud?",
            "a": [
              "Absolutamente. Más allá de la lectura de imágenes, nuestra Inteligencia Artificial procesa notas de voz enviadas a través de WhatsApp, ejecuta un análisis semántico del audio y extrae variables críticas (fechas solicitadas, números de referencia o intenciones de compra) estructurándolas para continuar automáticamente un flujo conversacional o radicar un ticket en el CRM."
            ]
          },
          {
            "n": 102,
            "q": "¿Valida o cruza la información extraída contra bases de datos del cliente (identidad, disponibilidad, inconsistencias)?",
            "a": [
              "Sí. La lectura es el primer paso de un flujo inteligente. Una vez el motor OCR extrae el número de identificación de una imagen, TodoIP puede enviar esa variable, vía integración API, al core de negocio del cliente para cruzar bases de datos, validar el estado de la afiliación (ej. cruces con bases EPS/ADRES), confirmar citas previas o rechazar el trámite en caso de detectar inconsistencias normativas."
            ]
          },
          {
            "n": 103,
            "q": "¿La sincronización a ERP/CRM/Excel/sistema interno es en tiempo real? ¿Nativa o vía integración?",
            "a": [
              "La sincronización ocurre estrictamente en tiempo real (milisegundos tras la extracción). La transferencia de la data extraída hacia el ERP, CRM o HIS del cliente se ejecuta de manera automatizada mediante integraciones a la medida utilizando arquitecturas modernas de conectividad por API REST o Webhooks."
            ]
          }
        ]
      },
      {
        "title": "Uso por sector",
        "items": [
          {
            "n": 104,
            "q": "En salud: ¿cómo se usa para lectura de órdenes médicas, registro de pacientes con foto de cédula y agendamiento?",
            "a": [
              "Revoluciona el proceso de admisión en las IPS. El paciente envía una fotografía o PDF de su documento de identidad y de la orden médica a través de WhatsApp. El sistema lee y extrae los datos biográficos para crear la ficha en el HIS (eliminando errores de digitación) y captura los códigos CUPS o autorizaciones de la orden para que el bot ofrezca las fechas de agenda disponibles, cerrando un agendamiento sin interacción humana."
            ]
          },
          {
            "n": 105,
            "q": "En hotelería / turismo: ¿cómo funciona el check-in anticipado con foto de documento y cruce con PMS?",
            "a": [
              "Automatiza el engorroso proceso de recepción (Front Desk). Horas antes de su llegada, el huésped envía por WhatsApp la foto de su pasaporte o cédula. El OCR extrae los datos, los inyecta directamente en el Property Management System (PMS) del hotel, y ejecuta el cruce de identidad con la reserva confirmada, agilizando la entrega de la habitación sin demoras operativas."
            ]
          },
          {
            "n": 106,
            "q": "En ventas / campo: ¿cómo digitaliza tarjetas de presentación, bitácoras por audio y reportes de gastos?",
            "a": [
              "Optimiza la gestión de las fuerzas comerciales en campo. El vendedor envía a su WhatsApp corporativo la foto de una tarjeta de presentación y la IA crea el lead en el CRM. Para legalización de viáticos, el empleado toma foto de los recibos de almuerzo o combustible, el sistema extrae los valores y NIT, y los consolida automáticamente en el software contable de la empresa."
            ]
          }
        ]
      },
      {
        "title": "Integraciones, precio, límites y privacidad",
        "items": [
          {
            "n": 107,
            "q": "¿Con qué sistemas se ha integrado (CRM, PMS, software médico, ERP)?",
            "a": [
              "La solución de Lectura Inteligente está desarrollada bajo un esquema de conectividad universal API-First. En la práctica clínica en Colombia, se ha desplegado integrándose con sistemas de información hospitalaria como SIIS, y posee capacidad total para integrarse con CRM líderes (Salesforce, HubSpot), ERP financieros y sistemas hoteleros (PMS), siempre que el proveedor del software permita la recepción de datos vía servicios web."
            ]
          },
          {
            "n": 108,
            "q": "¿Qué calidad de imagen / formato se requiere para una extracción confiable?",
            "a": [
              "La IA requiere insumos legibles. Se deben enviar imágenes nítidas, bien enfocadas, sin recortes en los bordes del documento, con iluminación adecuada y sin excesivos reflejos de luz (flash). Soporta formatos de imagen convencionales (JPG, PNG) y documentos escaneados en PDF. Fotografías borrosas o documentos severamente dañados mermarán la tasa de extracción exitosa."
            ]
          },
          {
            "n": 109,
            "q": "¿Cuál es el modelo de cobro (por documento, mensualidad, paquete con chatbot)?",
            "a": [
              "Para facilitar la adopción tecnológica y proteger el flujo de caja, no cobramos setup ni precios de implementación. Nuestro modelo corporativo se licencia mediante una suscripción mensual que engloba el uso del módulo de Lectura Inteligente y el bot conversacional, escalando financieramente de acuerdo al paquete mensual o volumetría de procesamiento requerida por su operación."
            ]
          },
          {
            "n": 110,
            "q": "¿Qué documentos o idiomas no soporta hoy?",
            "a": [
              "La IA de TodoIP está enfocada primordialmente en procesar español y formatos de documentos estándar del mercado latinoamericano. Actualmente, el sistema no está diseñado para decodificar caracteres asiáticos, cirílicos o árabe, ni para extraer información precisa de manuscritos o historias clínicas en cursiva médica ininteligible, debido a la falta de estandarización en la caligrafía humana."
            ]
          },
          {
            "n": 111,
            "q": "¿Dónde se procesan y almacenan las imágenes de documentos de identidad? ¿Se borran automáticamente?",
            "a": [
              "El procesamiento de imágenes y la extracción mediante OCR se ejecutan en servidores de alta seguridad alojados en la nube de TodoIP. Para garantizar el estricto cumplimiento normativo, no almacenamos un repositorio permanente de las fotos de los documentos (cédulas o pasaportes). Las imágenes operan bajo un principio de transitoriedad: una vez el motor de IA extrae la información y la transfiere exitosamente al sistema (ERP/HIS) del cliente, los archivos de imagen se purgan automáticamente de nuestros servidores, eliminando el riesgo de fuga de datos."
            ]
          },
          {
            "n": 112,
            "q": "¿Qué medidas de privacidad aplican a datos de cédula / pasaporte?",
            "a": [
              "Operamos bajo un marco de privacidad estructurado alineado con la Ley de Protección de Datos Personales (Habeas Data). Las imágenes de los documentos (cédulas y pasaportes) nunca son accedidas ni visualizadas por personal humano de TodoIP; su procesamiento es 100% algorítmico (Machine Learning) dentro de un entorno de tenencia aislada (Tenant). Toda la transmisión de datos, desde WhatsApp hacia TodoIP y luego hacia el sistema del cliente, se ejecuta bajo protocolos criptográficos fuertes (TLS/SSL)."
            ]
          },
          {
            "n": 113,
            "q": "¿Qué resultados se logran con la Lectura Inteligente de Documentos?",
            "a": [
              "La implementación de la Lectura Inteligente de Documentos en el sector salud (como en procesos de registro de pacientes y transcripción de órdenes médicas vía WhatsApp) reduce radicalmente los tiempos operativos. Las instituciones que migran de la digitación manual al procesamiento OCR automatizado eliminan por completo el error de factor humano en la captura de datos estructurados. Esto reduce el tiempo de registro a cero y mitiga las tasas de abandono en flujos conversacionales, permitiendo absorber mayores volúmenes de solicitudes sin incrementar el personal administrativo. Para porcentajes específicos de retorno de inversión por institución, por favor consultar con nuestro equipo comercial los casos de éxito consolidados."
            ]
          }
        ]
      }
    ]
  },
  "/pbx-movil/": {
    "product": "PBX Móvil",
    "groups": [
      {
        "title": "Qué es y para quién",
        "items": [
          {
            "n": 114,
            "q": "¿Qué es el PBX Móvil de TodoIP y qué problema resuelve frente a una línea fija o un celular personal?",
            "a": [
              "El PBX Móvil es una solución de telefonía corporativa en la nube que virtualiza números celulares. Resuelve la falta de flexibilidad de las líneas fijas tradicionales (que atan a los asesores a un escritorio) y elimina los graves riesgos operativos de usar celulares personales (pérdida de llamadas si el asesor está ocupado, fuga de datos corporativos y cero trazabilidad). Convierte un número móvil en una centralita inteligente capaz de recibir múltiples llamadas simultáneas, grabar conversaciones y enrutar inteligentemente el tráfico hacia cualquier dispositivo."
            ]
          },
          {
            "n": 115,
            "q": "¿Para qué tipo de empresa es ideal (equipos distribuidos, alto volumen de llamadas, un solo número memorable)?",
            "a": [
              "Es ideal para empresas que buscan centralizar toda su comunicación (voz y WhatsApp) bajo un único número memorable de alta contactabilidad. Es el aliado perfecto para operaciones con equipos comerciales distribuidos geográficamente (home office o ventas en campo) y operaciones logísticas o de salud con un alto volumen de tráfico telefónico que requieren desborde de llamadas inteligente sin depender de líneas terrestres."
            ]
          },
          {
            "n": 116,
            "q": "¿Para quién no es la mejor opción?",
            "a": [
              "No es recomendable para negocios o microempresas con volúmenes de llamadas muy bajos (donde una línea celular estándar aún cubre sus necesidades sin fricciones operativas), ni para corporaciones que operan estrictamente en zonas sin cobertura de internet (Wi-Fi o 4G/5G), ya que el modelo PBX Móvil requiere conexión de datos para funcionar de manera óptima en la nube."
            ]
          }
        ]
      },
      {
        "title": "Capacidades",
        "items": [
          {
            "n": 117,
            "q": "¿Cuántas llamadas simultáneas soporta un mismo número?",
            "a": [
              "Gracias a la arquitectura de TodoIP sobre tecnología de Troncales SIP, el PBX Móvil soporta concurrencia escalable. El límite de \"hasta 20 canales concurrentes\" (llamadas simultáneas) es nuestro tope estándar para operaciones regulares y previene la saturación de los números móviles. Para requerimientos superiores (Call Centers de alto tráfico), se evalúa la factibilidad técnica de habilitar una volumetría mayor."
            ]
          },
          {
            "n": 118,
            "q": "¿Requiere SIM física? ¿Cómo opera «en la nube»?",
            "a": [
              "No requiere tarjeta SIM física (es un número virtualizado o DID móvil). A través de acuerdos corporativos de TodoIP (con operadores como Tigo UNE), la línea reside completamente en nuestros servidores de Nube. Las llamadas se enrutan vía internet hacia la centralita virtual (PBX) del cliente y se entregan a los asesores mediante una aplicación telefónica (Softphone) instalada en sus computadores, tabletas o smartphones."
            ]
          },
          {
            "n": 119,
            "q": "¿Incluye grabación de llamadas y reportes en tiempo real?",
            "a": [
              "Sí. Toda interacción de voz en el PBX Móvil recibe el tratamiento de un Call Center avanzado. Las llamadas entrantes y salientes quedan grabadas en la nube y el administrador cuenta con un panel (Dashboard) que muestra métricas en tiempo real (volumen de llamadas, tiempos de respuesta, abandono) para auditoría y toma de decisiones."
            ]
          },
          {
            "n": 120,
            "q": "¿Permite mensaje de bienvenida personalizado e IVR / enrutamiento a extensiones o asesores?",
            "a": [
              "Absolutamente. La plataforma cuenta con un IVR (Respuesta de Voz Interactiva) completo. Cuando un cliente llama al número móvil corporativo, puede escuchar un saludo institucional profesional y un menú de opciones (ej. \"Marque 1 para Ventas, 2 para Soporte\"). El sistema enruta automáticamente la llamada a la extensión del agente disponible correspondiente."
            ]
          },
          {
            "n": 121,
            "q": "¿Cómo funciona la protección / identificación CallerID frente a marcación como spam?",
            "a": [
              "Al operar a través de numeración oficial corporativa provista directamente por los operadores de telecomunicaciones (como Tigo UNE), y no mediante \"bolsas de minutos\" genéricas, se mitiga el riesgo de que la línea corporativa sea filtrada o bloqueada masivamente por aplicaciones de terceros o bloqueadores de Spam de los smartphones de los usuarios, asegurando altas tasas de contactabilidad."
            ]
          },
          {
            "n": 122,
            "q": "¿Se integra con WhatsApp (chatbots u otras herramientas) sobre el mismo número?",
            "a": [
              "Sí, es nuestra funcionalidad estrella. TodoIP es especialista en la convergencia omnicanal. Ese mismo número DID Móvil del PBX se activa oficialmente ante Meta (WhatsApp Business API) para desplegar sus chatbots, enviar notificaciones masivas y gestionar chats multiagente. El cliente guarda un solo número: si lo marca, ingresa al PBX de voz; si le escribe, lo atiende el agente virtual."
            ]
          },
          {
            "n": 123,
            "q": "¿Los asesores pueden atender desde el celular estando fuera de la oficina?",
            "a": [
              "Sí. La flexibilidad es absoluta. El asesor instala en su smartphone personal una aplicación (Softphone) y recibe o realiza llamadas institucionales a través de datos o Wi-Fi. Las llamadas salen presentando el identificador (CallerID) de la empresa, y al finalizar su jornada (SLA), el asesor cierra sesión, garantizando el respeto al derecho de desconexión laboral en Colombia."
            ]
          }
        ]
      },
      {
        "title": "Requisitos, implementación y precio",
        "items": [
          {
            "n": 124,
            "q": "¿Qué se necesita para portar o activar un número móvil empresarial con TodoIP?",
            "a": [
              "Para activar un número móvil nuevo (DID Móvil) con TodoIP, el proceso es inmediato tras la firma del acuerdo comercial y la recolección de los documentos corporativos estándar. En cuanto a la portabilidad (traer un número celular de la empresa), la tecnología actual contratada con el operador Tigo UNE no soporta este procedimiento, por lo cual únicamente entregamos y activamos los números móviles de la base que ya tenemos previamente contratada y aprovisionada."
            ]
          },
          {
            "n": 125,
            "q": "¿Cuáles son los pasos de implementación típicos?",
            "a": [
              "El Onboarding estándar incluye:",
              {
                "ol": [
                  "Auditoría Técnica: Revisión de la conectividad y topología del cliente.",
                  "Activación de Líneas: Asignación del número móvil (DID) y configuración de las extensiones de usuario.",
                  "Diseño de Flujos: Programación del IVR, mensajes de bienvenida y reglas de enrutamiento y horarios.",
                  "Despliegue y Capacitación: Instalación de aplicativos (Softphones) y entrenamiento al administrador. El paso a producción se realiza en un promedio de 2 a 5 días hábiles, siempre y cuando la documentación comercial y técnica esté completa."
                ]
              }
            ]
          },
          {
            "n": 126,
            "q": "¿Cuál es el modelo de cobro (mensualidad por número, por extensión, por minutos)?",
            "a": [
              "El PBX Móvil se estructura como un servicio SaaS (Software as a Service). El modelo tarifario contempla una suscripción mensual que cubre el arrendamiento de la infraestructura PBX Cloud y las extensiones. Adicionalmente, se puede manejar un cargo por el alquiler del DID móvil y los consumos (minutos salientes) que superen las bolsas de tráfico incluidas en el plan corporativo. Por confirmar con el área comercial de TodoIP los planes específicos vigentes."
            ]
          },
          {
            "n": 127,
            "q": "¿Qué está incluido y qué se cobra aparte (grabaciones, minutos, WhatsApp, reportes)?",
            "a": [
              "Nuestros planes corporativos de PBX Móvil incluyen todas las funcionalidades de centralita: configuración del IVR, enrutamiento, reportes estadísticos, soporte técnico prioritario y almacenamiento base para grabaciones. La integración con WhatsApp Business API, la automatización con Inteligencia Artificial (Voicebot/Chatbot) y consumos extraordinarios de tráfico o almacenamiento masivo se estructuran como licenciamientos adicionales según los requerimientos del cliente."
            ]
          }
        ]
      },
      {
        "title": "Limitaciones, privacidad, soporte y resultados",
        "items": [
          {
            "n": 128,
            "q": "¿Qué limitaciones tiene (cobertura, calidad de voz, dependencia de internet del asesor, portabilidad)?",
            "a": [
              "La principal limitante técnica es la dependencia de conectividad. Al ser un servicio VoIP sobre internet, la calidad de la llamada y la mitigación de interrupciones (jitter) dependen exclusivamente de que el asesor comercial cuente con una conexión a internet estable y de banda ancha (Wi-Fi de calidad o redes 4G/5G corporativas robustas) en el momento de la atención."
            ]
          },
          {
            "n": 129,
            "q": "¿Por cuánto tiempo se conservan las grabaciones y quién las administra?",
            "a": [
              "Las grabaciones telefónicas se alojan en la nube bajo los más altos estándares de encriptación y se conservan habitualmente por un periodo de retención de seis (6) meses. TodoIP ofrece un panel administrativo y el cliente, mediante Control de Acceso Basado en Roles (RBAC), es el único facultado para escucharlas, gestionarlas o descargarlas masivamente a sus servidores locales."
            ]
          },
          {
            "n": 130,
            "q": "¿Qué soporte técnico aplica (canales, horarios, tiempos de respuesta)?",
            "a": [
              "TodoIP opera bajo un modelo de Soporte Técnico Administrado de Nivel Enterprise. Las incidencias (solicitudes operativas o cambios en el flujo de llamadas) se atienden de lunes a viernes en horario continuo (8:00 a.m. - 5:00 p.m.) a través de los canales oficiales (WhatsApp, tickets, central PBX). Para emergencias de caída de infraestructura que interrumpan la continuidad del negocio, aplica nuestro protocolo de contingencia de alta criticidad fuera del horario estándar, validado mediante reporte oficial por correo corporativo."
            ]
          },
          {
            "n": 131,
            "q": "¿Qué resultados han obtenido los clientes con el PBX Móvil?",
            "a": [
              "Nuestros clientes corporativos reportan un aumento drástico en las tasas de contactabilidad y una reducción a cero de las llamadas pérdidas por ocupación de la línea. Para fuerzas de ventas distribuidas geográficamente o equipos de trabajo remoto (Home Office), el PBX Móvil ha permitido centralizar el 100% de la gestión comercial bajo un esquema auditable, recuperando el control gerencial sobre las promesas de venta y los tiempos de atención que antes se perdían en dispositivos personales."
            ]
          }
        ]
      }
    ]
  },
  "/telefoniaip/": {
    "product": "Telefonía IP y Troncales",
    "groups": [
      {
        "title": "Troncales y Telefonía IP: qué es y para quién",
        "items": [
          {
            "n": 141,
            "q": "¿Qué incluye la oferta de Troncales y Telefonía IP de TodoIP?",
            "a": [
              "Es una solución integral de telecomunicaciones de nivel corporativo. Incluye el aprovisionamiento de Troncales SIP (canales de voz a través de internet), numeración oficial (móvil, fija o internacional), infraestructura de PBX Cloud alojada en centros de datos de alta disponibilidad, bolsa de minutos para tráfico saliente y funcionalidades avanzadas de Call Center (grabación, IVR, enrutamiento inteligente)."
            ]
          },
          {
            "n": 142,
            "q": "¿Se ofrece en la nube, con servidor físico, o ambas modalidades?",
            "a": [
              "Nuestro núcleo es una arquitectura 100% nativa en la nube, con escalabilidad, redundancia y acceso global. Ofrecemos tres esquemas de despliegue:",
              {
                "ul": [
                  "Arquitectura 100% Cloud: Operación, extensiones y PBX en nuestra nube. Ideal para operaciones distribuidas, multisede y trabajo remoto.",
                  "Integración Híbrida (Troncales SIP a PBX local): Conectamos nuestras troncales a la planta física del cliente (Asterisk, Cisco, Avaya), protegiendo su inversión. Permite que todas las llamadas salientes muestren un único número PBX Móvil, evitando que se marquen como SPAM (recomendado para cobranza), y enrutar ese número a celulares de respaldo si la red local se cae.",
                  "Implementación Local (On-Premise): Instalamos un servidor físico con Linux y Asterisk. Es indispensable cuando el operador (Claro, Tigo UNE, Movistar, entre otros) entrega las troncales SIP solo de forma local, o cuando una sede concentra muchas extensiones con alto tráfico interno, que así no depende de internet."
                ]
              }
            ]
          },
          {
            "n": 143,
            "q": "¿Para qué tamaños de operación / call centers está pensada?",
            "a": [
              "Nuestra infraestructura está diseñada con alta escalabilidad (elástica). Atendemos desde corporaciones medianas con múltiples sedes administrativas, hasta operaciones críticas de Call Centers de alto volumen (BPO, clínicas, cobranzas) que manejan picos masivos de cientos de llamadas concurrentes."
            ]
          },
          {
            "n": 144,
            "q": "¿Para quién no es adecuada?",
            "a": [
              "No es financieramente eficiente ni operativamente necesaria para microempresas, comercios de barrio o profesionales independientes que apenas manejan un bajo volumen telefónico y pueden operar perfectamente con una o dos líneas celulares tradicionales sin requerir funciones de centralita, grabación o métricas."
            ]
          }
        ]
      },
      {
        "title": "Capacidades",
        "items": [
          {
            "n": 145,
            "q": "¿Qué tipos de numeración gestiona (móviles, fijos locales, internacionales, extensiones)?",
            "a": [
              "Proveemos y gestionamos un espectro completo de numeración corporativa, estructurada para garantizar alta disponibilidad y estricto cumplimiento normativo:",
              {
                "ul": [
                  "Numeración Celular (DID Móvil): Proveemos números móviles corporativos alojados 100% en la nube. Esta numeración es totalmente legal y cumple con las normativas de telecomunicaciones del país, respaldada por nuestra contratación directa y oficial con el operador Tigo UNE.",
                  "Números Fijos Locales: Cobertura de numeración fija en las principales ciudades de Colombia para consolidar la presencia corporativa regional de su empresa.",
                  "Numeración Virtual Internacional (DIDs extranjeros): Líneas internacionales estratégicas para empresas con operaciones transfronterizas, permitiendo brindar atención global sin necesidad de desplegar infraestructura física en el exterior.",
                  "Extensiones Virtuales: Gestión de numeración interna ilimitada, permitiendo unificar y escalar la comunicación de toda su fuerza de ventas o equipo de trabajo, sin importar su ubicación geográfica."
                ]
              }
            ]
          },
          {
            "n": 146,
            "q": "¿Soporta comunicaciones unificadas (voz + mensajería) en una sola plataforma?",
            "a": [
              "Sí, somos pioneros en la unificación omnicanal. A través de la API oficial de WhatsApp (WhatsApp Business API), logramos que la numeración telefónica de su empresa sea exactamente la misma para voz y texto. El sistema permite integrar el tráfico telefónico SIP de su PBX con las conversaciones de chat de WhatsApp, centralizando toda la atención en un ecosistema cohesivo."
            ]
          },
          {
            "n": 147,
            "q": "¿Los usuarios pueden llamar y recibir desde cualquier dispositivo con internet?",
            "a": [
              "Absolutamente. La descentralización del trabajo es total. Los agentes y ejecutivos pueden conectarse a su extensión corporativa desde teléfonos IP de escritorio, aplicaciones móviles (Softphones) instaladas en sus celulares personales, o directamente desde sus computadores mediante tecnología WebRTC, dependiendo únicamente de una conexión estable a internet para emitir llamadas con el identificador (CallerID) de la empresa."
            ]
          },
          {
            "n": 148,
            "q": "¿Incluye grabación de llamadas, estadísticas y monitoreo en tiempo real?",
            "a": [
              "Sí, opera con capacidades de Contact Center avanzado. El 100% de las llamadas entrantes y salientes son grabadas y almacenadas de forma segura en la nube. Los supervisores cuentan con Dashboards interactivos para monitorear métricas críticas en tiempo real (Nivel de Servicio, Tasa de Abandono, TMO) y realizar escuchas silenciosas (Spy Mode) para auditoría de calidad."
            ]
          },
          {
            "n": 149,
            "q": "¿Cómo funciona la aceptación telefónica de política de tratamiento de datos (Habeas Data)?",
            "a": [
              "Garantizamos el cumplimiento normativo en Colombia (Ley 1581 de 2012) mediante parametrización obligatoria en el IVR. Antes de que la llamada sea enrutada hacia un asesor humano o agente de IA, el sistema reproduce un audio oficial solicitando el consentimiento del usuario para la grabación y el tratamiento de sus datos. El registro de esta aceptación queda grabado y es completamente auditable ante entidades regulatorias."
            ]
          },
          {
            "n": 150,
            "q": "¿Se integra con CRM? ¿Cuáles?",
            "a": [
              "Sí. Nuestra arquitectura PBX Cloud posee conectividad de grado empresarial mediante API REST y Webhooks. Se integra fluidamente con CRMs líderes del mercado (Salesforce, HubSpot, Zendesk), ERPs corporativos y sistemas de información médica (HIS). Esta conexión bidireccional permite automatizar la creación de tickets, adjuntar grabaciones de audio directamente en el perfil del cliente y ejecutar despliegue de información en pantalla (Screen Pop-up) cuando ingresa la llamada."
            ]
          },
          {
            "n": 151,
            "q": "¿Se puede conectar sobre una PBX existente (Asterisk, Cisco, Grandstream) sin reemplazar equipos?",
            "a": [
              "Sí, nuestro modelo de Integración Híbrida/Cloud está diseñado exactamente para este propósito. Mediante el aprovisionamiento de Troncales SIP o configuraciones Gateway, TodoIP se conecta a su planta telefónica física preexistente (Asterisk, Cisco, Avaya, Grandstream), inyectándole capacidad en la nube sin forzar el descarte o reemplazo de su infraestructura actual."
            ]
          },
          {
            "n": 152,
            "q": "¿Cómo se relaciona con el cumplimiento de Resolución 256 en instituciones de salud (encuesta post-llamada / reporte PISIS-SISPRO)?",
            "a": [
              "Nuestra PBX y Agente de Voz (Voicebot) garantizan el cumplimiento normativo exigido por el Ministerio de Salud. Al finalizar la atención, el sistema transfiere al paciente automáticamente al módulo de IVR o Voicebot para ejecutar la encuesta de satisfacción (Resolución 256). Los datos recopilados se consolidan en formatos estructurados, listos para ser importados o reportados en los repositorios oficiales PISIS-SISPRO sin reprocesos manuales."
            ]
          }
        ]
      },
      {
        "title": "Requisitos, implementación y precio",
        "items": [
          {
            "n": 153,
            "q": "¿Qué infraestructura o conectividad necesita el cliente?",
            "a": [
              "Para nuestro servicio 100% en la nube o modelo híbrido, el único requerimiento es contar con una conexión a internet de banda ancha estable (Fibra Óptica preferiblemente). Para las extensiones, se requieren dispositivos compatibles: computadores con Softphone, smartphones (con plan de datos/Wi-Fi) o teléfonos IP físicos estándar de mercado. Si se requiere una modalidad On-Premise local, proveemos el servidor físico directamente."
            ]
          },
          {
            "n": 154,
            "q": "¿Cuáles son las etapas típicas de implementación y tiempos reales observados?",
            "a": [
              "El Onboarding incluye:",
              {
                "ol": [
                  "Auditoría Técnica y definición de numeración.",
                  "Configuración de PBX (Flujos de IVR, horarios y desvíos).",
                  "Despliegue y Pruebas SIP.",
                  "Capacitación en Portal de Autogestión. El tiempo a producción varía según la escala, promediando de 2 a 5 días hábiles para requerimientos de mediana complejidad."
                ]
              }
            ]
          },
          {
            "n": 155,
            "q": "¿Cuál es el modelo de cobro (troncales, extensiones, minutos, nube vs on-premise)?",
            "a": [
              "Operamos bajo suscripciones corporativas mensuales. El cobro suele estructurarse por paquetes que incluyen la PBX Cloud, bolsas de minutos y el número de canales o extensiones habilitadas. El modelo On-Premise lo manejamos con el mismo esquema, todo para dar facilidad al cliente. En ninguno de los dos modelos cobramos un setup o configuración, tampoco pedimos adelantos, solo se solicita firma de contrato del servicio y el primer mes lo pagan una vez el servicio esté entregado y 100% operativo. Para estructurar un paquete acorde al consumo específico de su operación, por favor contactar al equipo comercial de TodoIP."
            ]
          },
          {
            "n": 156,
            "q": "¿Qué está incluido vs add-ons (grabación, IVR, call center, integraciones)?",
            "a": [
              "El licenciamiento básico de PBX de TodoIP incluye las funcionalidades estándar corporativas: IVR, enrutamiento, buzones, panel de autogestión y un umbral de grabación de llamadas. Las automatizaciones impulsadas por Inteligencia Artificial (Agente de Voz/Voicebot), la integración omnicanal profunda (WhatsApp Business API) y almacenamientos masivos o conectores API complejos para CRMs, se configuran como licenciamientos o add-ons adicionales al servicio."
            ]
          }
        ]
      },
      {
        "title": "Limitaciones, privacidad, soporte y resultados",
        "items": [
          {
            "n": 157,
            "q": "¿Qué limitaciones técnicas o de escala debe conocer el cliente?",
            "a": [
              "Históricamente, la principal limitación de la PBX Cloud dependía exclusivamente del ancho de banda local. Sin embargo, con los despliegues tecnológicos actuales, esta limitante ha quedado prácticamente erradicada. TodoIP gestiona las extensiones remotas utilizando protocolos y códecs de voz de altísima compresión. Esto permite mantener una llamada corporativa fluida con consumos simétricos inferiores a los 100 kbps, viables incluso desde un plan de datos celular básico.",
              "Hoy en día es operativamente más fácil y seguro enrutar una llamada por internet hacia nuestra PBX (con métricas y grabación) que depender de la cobertura tradicional intermitente de su operador móvil celular, la cual es limitada en zonas rurales."
            ]
          },
          {
            "n": 158,
            "q": "¿Dónde se alojan las grabaciones y cómo se controla el acceso?",
            "a": [
              "Las grabaciones se alojan en la infraestructura global segura de Amazon Web Services (AWS). El acceso es rigurosamente protegido mediante el Portal de Autogestión, donde aplica un Control de Acceso Basado en Roles (RBAC), impidiendo que personal no autorizado (o perfiles base) descargue o elimine información."
            ]
          },
          {
            "n": 159,
            "q": "¿Qué canales y horarios de soporte técnico aplica (incluyendo fallas de servicio)?",
            "a": [
              "Soporte Técnico Premium en horario hábil (lunes a viernes, 8:00 a.m. a 5:00 p.m.) a través del portal de tickets, correo corporativo, central PBX y WhatsApp oficial. Para caídas masivas de servicio (incidentes de criticidad absoluta que detengan el core de negocio), aplica atención bajo protocolo de contingencia y escalamiento fuera de este horario."
            ]
          },
          {
            "n": 160,
            "q": "¿Qué empresas usan la telefonía IP de TodoIP?",
            "a": [
              "Nuestra arquitectura de telefonía en la nube está validada por operaciones críticas en múltiples sectores del país, desde corporaciones con decenas de extensiones hasta telefonía masiva para grandes casas de cobranza. Entre las instituciones y marcas que respaldamos:",
              {
                "ul": [
                  "Sector Salud y Redes Clínicas: Hospital Francisco de Paula Santander, Fundación Hospital San José de Buga, Clínica de Occidente y operadores de alta demanda telefónica en redes EPS.",
                  "Retail Farmacéutico: Droguerías Villacolombia y Drogas con Descuento.",
                  "Inmobiliario, Financiero y Cobranzas: Unisa Inmobiliaria, Multibienes, FianzaCrédito S.A., casas de cobranza en Bogotá y Electrojaponesa en el Valle del Cauca.",
                  "Retail y Comercio General: Plásticos Rimax, Organización Hércules, Centros Comerciales Único, Almacenes Artemisa, Supertiendas Cañaveral y Adiela de Lombana.",
                  "Automotriz: Massy Motors y Almotores.",
                  "Coworking y Servicios B2B: Yoffice en Cali."
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "/agente-virtual-ivr/": {
    "product": "Portal de Autogestión Telefónica",
    "groups": [
      {
        "title": "Qué es, cómo funciona y para quién",
        "items": [
          {
            "n": 132,
            "q": "¿Qué es exactamente el Portal de Autogestión Telefónica de TodoIP?",
            "a": [
              "Es un panel de control gerencial (Dashboard) alojado en la nube que otorga autonomía total a los administradores de TI o coordinadores de Call Center. Funciona como el centro de mando de su ecosistema de comunicaciones, permitiendo visualizar y auditar la infraestructura de telefonía corporativa en tiempo real desde cualquier navegador web."
            ]
          },
          {
            "n": 133,
            "q": "¿Qué permite hacer al cliente sin intervención de TodoIP (altas de extensiones, horarios, reportes, IVR, usuarios)?",
            "a": [
              "Para garantizar la estabilidad, escalabilidad y la correcta arquitectura de la plataforma, por políticas de seguridad corporativa de TodoIP, el cliente final tiene autonomía exclusiva para acceder y auditar los reportes estadísticos y grabaciones en tiempo real a través del panel web. El resto de las configuraciones estructurales (altas/bajas de extensiones, enrutamiento, horarios o modificaciones del IVR) son gestionadas de forma ágil y segura por nuestro equipo de ingeniería. Para realizar cualquier cambio operativo, el cliente únicamente debe enviar una solicitud a nuestro correo electrónico de soporte técnico, asegurando así un despliegue sin riesgos ni disrupciones en la continuidad de su servicio."
            ]
          },
          {
            "n": 134,
            "q": "¿Cómo integra la telefonía con los datos de la empresa para dar respuestas en tiempo real?",
            "a": [
              "Mediante el uso de Webhooks y APIs REST. En la práctica, cuando una llamada ingresa, el portal permite que la PBX consulte en milisegundos las bases de datos externas del cliente (CRM, ERP o HIS). Esto permite, por ejemplo, que el sistema identifique el número de teléfono del cliente (CallerID), consulte su estado en el CRM, y enrute la llamada inteligentemente al último agente que lo atendió, o que el IVR le dicte un saldo dinámico sin necesidad de un operador humano."
            ]
          },
          {
            "n": 135,
            "q": "¿Es un producto aparte, un módulo del PBX / Telefonía IP, o el panel de administración de ambos?",
            "a": [
              "No es un producto aislado ni requiere un licenciamiento independiente; es el módulo nativo de administración unificada que viene integrado por defecto en nuestro ecosistema de PBX Cloud y Telefonía IP corporativa."
            ]
          },
          {
            "n": 136,
            "q": "¿Para quién está pensado y para quién no?",
            "a": [
              "El Portal de Autogestión Telefónica está diseñado estratégicamente para directores de TI (CTOs), gerentes de operaciones y supervisores de Call Center que requieren control granular, agilidad para ejecutar cambios de enrutamiento ante contingencias y acceso inmediato a la data operativa sin depender de mesas de ayuda. Por el contrario, no está pensado, ni es necesario para microempresas o negocios con bajo tráfico telefónico que no ameritan ni justifican operativamente una gestión avanzada o una auditoría constante de llamadas."
            ]
          },
          {
            "n": 137,
            "q": "¿Cuáles son los requisitos técnicos y el proceso de onboarding?",
            "a": [
              "Al ser una plataforma 100% Cloud (arquitectura web), el único requisito técnico es contar con un navegador moderno y conexión a internet. El proceso de Onboarding ocurre inmediatamente después del despliegue de la PBX: entregamos credenciales de acceso seguro y realizamos sesiones de transferencia de conocimiento (capacitación técnica) para que el administrador de la empresa domine la herramienta desde el día uno."
            ]
          },
          {
            "n": 138,
            "q": "¿Cuál es el modelo de precio?",
            "a": [
              "El acceso al Portal de Autogestión está 100% incluido dentro de la suscripción mensual del servicio de PBX Cloud / Telefonía IP, bajo nuestro modelo SaaS (Software as a Service). No genera cobros adicionales por cantidad de ingresos al portal ni por la extracción de reportes estadísticos."
            ]
          },
          {
            "n": 139,
            "q": "¿Qué limitaciones, roles de seguridad y opciones de auditoría tiene?",
            "a": [
              "El portal opera bajo un estricto Control de Acceso Basado en Roles (RBAC). Por ejemplo, un usuario con perfil de supervisor o administrador tiene los permisos necesarios para auditar y escuchar las grabaciones de todo su equipo de trabajo. Si la operación lo requiere, también se pueden crear accesos limitados para los agentes o comerciales; en este caso, se les asigna un perfil con privilegios mínimos donde únicamente podrán ingresar a visualizar y retomar las grabaciones de sus propias llamadas. A nivel de seguridad y protección de la data, puede estar tranquilo: ni el usuario administrador ni los perfiles de menor privilegio tienen autorización o permisos habilitados en el sistema para borrar registros o eliminar grabaciones."
            ]
          },
          {
            "n": 140,
            "q": "¿Qué soporte tiene el portal y qué resultados aporta?",
            "a": [
              "El Portal de Autogestión cuenta con el respaldo total de nuestro Soporte Técnico corporativo. A nivel de resultados operativos, la adopción de este portal por parte de las instituciones reduce drásticamente los Tiempos de Resolución de problemas (SLA). Los administradores ya no dependen de terceros para analizar contingencias; pueden ingresar de forma autónoma e inmediata a visualizar los indicadores de llamadas perdidas o a buscar grabaciones críticas de eventos específicos (filtrando por fecha exacta o número telefónico). Además, a nivel de continuidad de negocio, garantizamos operaciones ininterrumpidas, ya que la plataforma está construida sobre una arquitectura altamente estable (sistema operativo Linux y motor telefónico nativo Asterisk)."
            ]
          }
        ]
      }
    ]
  },
  "/": {
    "product": "TodoIP",
    "groups": [
      {
        "title": "Sobre TodoIP",
        "items": [
          {
            "n": 161,
            "q": "¿Qué es TodoIP?",
            "a": [
              "TodoIP es un proveedor corporativo colombiano con casi 20 años de experiencia que automatiza procesos operativos mediante la integración omnicanal, sumando módulos de Inteligencia Artificial (chat conversacional, Voicebots y Lectura OCR de documentos), aplicados sobre ecosistemas de Telefonía IP (en la nube o servidores físicos) y WhatsApp Business con API oficial."
            ]
          },
          {
            "n": 162,
            "q": "¿En qué ciudades / países opera y desde dónde da soporte?",
            "a": [
              "Nuestra arquitectura 100% en la nube nos permite implementar Telefonía IP, PBX y automatización omnicanal en cualquier ciudad de Colombia y en cualquier país del mundo. En Colombia tenemos casos de éxito en Valle del Cauca, Cauca, Nariño, Santander, Norte de Santander, Caldas y Sucre. Toda la operación, el desarrollo técnico y el soporte de ingeniería se gestionan desde nuestra sede matriz en Cali.",
              "En Colombia, TodoIP tiene dos ventajas competitivas:",
              {
                "ol": [
                  "Numeración Oficial e Inmediata: Gracias a un contrato corporativo directo con Tigo UNE, entregamos números móviles oficiales en Colombia para activación inmediata.",
                  "Economía de Escala en Meta: Colombia posee la segunda mejor tarifa de mensajería a nivel mundial para WhatsApp Business API. Esto, sumado a la altísima adopción de WhatsApp en el país, permite aplicar nuestras soluciones en todos los sectores con un Retorno de Inversión (ROI) altamente eficiente."
                ]
              }
            ]
          },
          {
            "n": 163,
            "q": "¿Los productos de IA y los de telefonía se venden por separado o como ecosistema integrado?",
            "a": [
              "Ambos. Aunque nuestro mayor diferenciador de mercado es ofrecer el ecosistema unificado (voz, texto e IA conectados en un solo proveedor omnicanal), los productos están diseñados de forma modular, permitiendo al cliente licenciar las capacidades que necesita, desde una troncal telefónica aislada hasta un chatbot transaccional con OCR por separado."
            ]
          },
          {
            "n": 164,
            "q": "¿Existe un orden recomendado de adopción (ej. PBX → chatbot → voicebot → lectura de documentos)?",
            "a": [
              "Recomendamos una adopción escalonada. El pilar fundamental suele ser establecer una arquitectura robusta (PBX Cloud o un número centralizado) y estabilizar la atención vía WhatsApp con un Bot transaccional inicial. A partir de esa madurez tecnológica, se integran módulos complejos (Lectura OCR para agendamiento o Voicebot para volumen alto de llamadas), según el dolor operativo más crítico de la institución."
            ]
          },
          {
            "n": 165,
            "q": "¿Cuáles son los canales oficiales de contacto comercial y de soporte (WhatsApp, teléfono, correo)?",
            "a": [
              "Para garantizar una atención centralizada y un escalamiento eficiente, TodoIP dispone de los siguientes canales oficiales:",
              {
                "ul": [
                  "Voz y WhatsApp Oficial: Nuestra línea principal es 300 912 2820 (aplica tanto para llamadas de voz como para WhatsApp). También contamos con el PBX (602) 524 4008.",
                  "Correos Corporativos: Soporte técnico: soporte@todoip.com. Gestión comercial: comercial@todoip.com.",
                  "Soporte Técnico Especializado: Lunes a viernes de 8:00 a.m. a 5:00 p.m.",
                  "Atención Comercial Ininterrumpida: Las 24 horas del día. Fuera del horario de oficina, nuestros Agentes de IA (Chat Conversacional y Voicebot) atienden y agendan inmediatamente las solicitudes de nuevos prospectos comerciales.",
                  "Redes Sociales y Comunidad: Subimos constantemente videos sobre nuestros productos, novedades y casos de uso. Síguenos a través de nuestro hub oficial: https://linktr.ee/todoip"
                ]
              }
            ]
          },
          {
            "n": 166,
            "q": "¿TodoIP tiene alianzas o certificaciones?",
            "a": [
              "TodoIP es un aliado tecnológico oficial certificado por Meta como Meta Business Partner, lo que avala nuestra experiencia e infraestructura para operar soluciones complejas sobre WhatsApp Business API. Adicionalmente, somos integradores oficiales de tecnología de clase mundial (como Amazon Web Services) y contamos con alianzas corporativas directas para interconexión SIP con operadores líderes en Colombia, como Tigo UNE (bajo contrato corporativo exclusivo)."
            ]
          }
        ]
      }
    ]
  }
};
