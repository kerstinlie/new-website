import { defineType, defineField } from 'sanity';

/**
 * Ersetzt ein Elementor-Formular-Widget (PDF-/Video-/Calendly-Anfrage oder
 * einfaches Kontaktformular). Erfasst Name/E-Mail/Firma ueber ein natives
 * Netlify-Formular. Nach dem Absenden entweder Weiterleitung zum
 * hinterlegten Ziel (PDF, YouTube-Replay, Calendly-Termin - genau wie im
 * WordPress-Original per "redirect_to") oder Anzeige der Original-
 * Erfolgsmeldung, falls keine Weiterleitung hinterlegt war.
 */
export default defineType({
  name: 'gatedForm',
  title: 'Formular',
  type: 'object',
  fields: [
    defineField({ name: 'buttonText', title: 'Button-Text', type: 'string' }),
    defineField({ name: 'redirectUrl', title: 'Ziel nach Absenden (PDF/Video/Link)', type: 'url' }),
    defineField({ name: 'successMessage', title: 'Erfolgsmeldung (falls kein Ziel-Link)', type: 'text' }),
    defineField({ name: 'notifyEmail', title: 'Benachrichtigung an', type: 'string' }),
    defineField({
      name: 'formGroup',
      title: 'Formular-Gruppe',
      type: 'string',
      options: {
        list: [
          { title: 'PDF-Download', value: 'pdf-download' },
          { title: 'Webinar/Termin', value: 'webinar-replay' },
          { title: 'Kontaktanfrage', value: 'contact-request' },
        ],
      },
    }),
  ],
  preview: {
    select: { redirectUrl: 'redirectUrl', successMessage: 'successMessage' },
    prepare({ redirectUrl, successMessage }) {
      return { title: `Formular -> ${redirectUrl || successMessage || '(kein Ziel hinterlegt)'}` };
    },
  },
});
