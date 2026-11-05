import { useState, type FormEvent, type ReactNode } from 'react';
import { Check, Loader2, MapPin, Mail, MessageCircle, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BUSINESS } from '@/lib/business';
import { useLocation } from '@/lib/router';

type Topic = 'general' | 'retail' | 'wholesale';

const TOPIC_OPTIONS: { value: Topic; label: string }[] = [
  { value: 'retail', label: 'Retail order or product question' },
  { value: 'wholesale', label: 'Wholesale and bulk quotation' },
  { value: 'general', label: 'General enquiry' },
];

interface FormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;
type SubmitStatus = 'idle' | 'submitting' | 'sent' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM: FormValues = { name: '', email: '', phone: '', message: '' };

function parseTopic(search: string): Topic {
  const requested = new URLSearchParams(search).get('topic');
  return requested === 'retail' || requested === 'wholesale' ? requested : 'general';
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Please tell us your name.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.message.trim()) errors.message = 'Please write a short message.';
  else if (values.message.trim().length > 2000) errors.message = 'Please keep your message under 2,000 characters.';
  return errors;
}

export default function ContactPage() {
  const { search } = useLocation();
  const [topic, setTopic] = useState<Topic>(() => parseTopic(search));
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus('submitting');
    const { error } = await supabase.from('contact_messages').insert({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
      topic,
    });

    if (error) {
      setStatus('error');
      return;
    }
    setValues(EMPTY_FORM);
    setStatus('sent');
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:px-8 lg:py-24">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">Contact</p>
        <h1 className="mt-3 font-display text-5xl text-espresso-900">Let us talk spices.</h1>
        <p className="mt-5 max-w-lg text-lg text-espresso-600">
          Questions about an order, a product or bulk supply? Send us a message and our team will reply within one
          business day.
        </p>

        {status === 'sent' ? (
          <div role="status" className="mt-10 flex flex-col items-start gap-5 rounded-3xl bg-leaf-50 p-8 ring-1 ring-leaf-200">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf-700 text-white">
              <Check className="h-6 w-6" />
            </span>
            <h2 className="font-display text-2xl text-leaf-900">Thank you, your message is on its way.</h2>
            <p className="text-leaf-900">We will reply to the email address you gave us.</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="rounded-full bg-leaf-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-leaf-700"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-5 rounded-3xl bg-white p-6 ring-1 ring-espresso-200/70 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <input
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className={inputClass(!!errors.name)}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className={inputClass(!!errors.email)}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone (optional)">
                <input
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className={inputClass(false)}
                />
              </Field>
              <Field label="What is this about?">
                <select
                  value={topic}
                  onChange={(event) => setTopic(event.target.value as Topic)}
                  className={inputClass(false)}
                >
                  {TOPIC_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Message" error={errors.message}>
              <textarea
                rows={6}
                value={values.message}
                onChange={(event) => updateField('message', event.target.value)}
                className={`${inputClass(!!errors.message)} resize-y`}
              />
            </Field>

            {status === 'error' && (
              <p role="alert" className="rounded-2xl bg-paprika-50 px-4 py-3 text-sm font-medium text-paprika-900">
                We could not send your message. Please try again, or contact us directly using the details beside this form.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-espresso-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-espresso-700 disabled:cursor-wait disabled:opacity-70"
            >
              {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === 'submitting' ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </section>

      <aside className="flex flex-col gap-6 lg:pt-16">
        <div className="rounded-3xl bg-espresso-900 p-8 text-white">
          <h2 className="font-display text-2xl">Business details</h2>
          <ul className="mt-6 flex flex-col gap-5 text-sm text-espresso-100">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-300" />
              {BUSINESS.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-saffron-300" />
              <a href={`tel:${BUSINESS.phone.replace(/\s/g, '')}`} className="hover:text-white">{BUSINESS.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-saffron-300" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">{BUSINESS.email}</a>
            </li>
          </ul>
        </div>
        <a
          href={`https://wa.me/${BUSINESS.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-3xl bg-white p-6 ring-1 ring-espresso-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-espresso-900/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-700 text-white">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold text-espresso-900">Chat on WhatsApp</span>
            <span className="block text-sm text-espresso-600">Quick questions answered during business hours.</span>
          </span>
        </a>
      </aside>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-2xl border bg-espresso-50 px-4 py-3 text-sm text-espresso-900 placeholder:text-espresso-400 transition focus:bg-white focus:outline-none focus:ring-4 ${
    hasError
      ? 'border-paprika-500 focus:ring-paprika-100'
      : 'border-espresso-200 focus:border-saffron-500 focus:ring-saffron-100'
  }`;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-espresso-800">{label}</span>
      {children}
      {error && <span className="text-sm text-paprika-700">{error}</span>}
    </label>
  );
}
