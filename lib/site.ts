// Single source of truth for site-wide values.
// TODO: replace every placeholder below with real values before launch.

export const site = {
  name: "Amaras Tour",
  url: "https://amarastour.com",
  phone: "+374 99 250 525",
  whatsapp: "37499250525",
  telegram: "amaras_tour_armenia",
  instagram: "amarastourarmenia",
  email: "amarastour.am@gmail.com",
  // Photo beside the text on the About page; editable in /admin.
  aboutImage: "/images/noravank.jpg",
};

export type SiteInfo = typeof site;
export type Links = ReturnType<typeof buildLinks>;

export function buildLinks(s: SiteInfo) {
  return {
    whatsapp: `https://wa.me/${s.whatsapp}`,
    telegram: `https://t.me/${s.telegram}`,
    instagram: `https://instagram.com/${s.instagram}`,
    phone: `tel:${s.phone.replace(/\s/g, "")}`,
    email: `mailto:${s.email}`,
  };
}
