import { Camera, Mail, MapPin, Phone, Users } from "lucide-react";
import { navItems } from "@/data/site";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[var(--color-charcoal)] py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="font-heading text-xl font-semibold">OJRK Samiti</h3>
          <p className="mt-3 text-sm leading-7 text-white/75">
            Orai Jankipur Radhi Kayasth Samiti is dedicated to preserving culture, serving society, and nurturing spiritual connection.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-[var(--color-gold)]">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="inline-flex items-center gap-2">
              <MapPin size={15} />
              Orai Jankipur,Bihar India
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone size={15} />
              +91 7061468001
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail size={15} />
              contact@ojrksamiti.org
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">Social</h4>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white/80 transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              aria-label="Instagram"
            >
              <Camera size={17} />
            </a>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white/80 transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              aria-label="Facebook"
            >
              <Users size={17} />
            </a>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-white/65">
        © {new Date().getFullYear()} Orai Jankipur Radhi Kayasth Samiti. All rights reserved.
      </p>
    </footer>
  );
}