import { Leaf, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from '@/components/Link';
import { BUSINESS } from '@/lib/business';

const SHOP_LINKS = [
  { label: 'All spices', to: '/shop' },
  { label: 'Whole spices', to: '/shop?category=Whole%20Spices' },
  { label: 'Ground spices', to: '/shop?category=Ground%20Spices' },
  { label: 'Blends', to: '/shop?category=Blends' },
];

const COMPANY_LINKS = [
  { label: 'Our story', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Wholesale enquiries', to: '/contact?topic=wholesale' },
  { label: 'Your cart', to: '/cart' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-espresso-900 text-espresso-200">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron-500 text-espresso-900">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-[0.18em] text-white">ORIGRAN</span>
          </div>
          <p className="max-w-xs text-sm">
            Stone-ground, carefully sourced spices for home kitchens, restaurants and retailers.
          </p>
        </div>

        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />

        <div className="flex flex-col gap-4 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-300">Get in touch</h3>
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-300" />
            <span>{BUSINESS.address}</span>
          </p>
          <p className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-saffron-300" />
            <a href={`tel:${BUSINESS.phone.replace(/\s/g, '')}`} className="transition hover:text-white">
              {BUSINESS.phone}
            </a>
          </p>
          <p className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-saffron-300" />
            <a href={`mailto:${BUSINESS.email}`} className="transition hover:text-white">
              {BUSINESS.email}
            </a>
          </p>
          <a
            href={`https://wa.me/${BUSINESS.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-espresso-600 px-4 py-2 font-medium text-white transition hover:border-saffron-300 hover:text-saffron-200"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-espresso-700">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-espresso-300 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          <p>Freshly ground. Carefully packed.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-300">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
