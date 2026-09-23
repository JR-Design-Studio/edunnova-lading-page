import { site } from '../data/site';

export const SITE_URL = 'https://edunnova.com.mx';
export const absolute = (path: string) => new URL(path, SITE_URL).toString();

const ORG_ID = `${SITE_URL}/#organizacion`;
export const orgRef = { '@id': ORG_ID };

export function organization(logo: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': ORG_ID,
    name: 'Edunnova',
    alternateName: 'Edunnova Agencia Educativa',
    description:
      'Agencia de desarrollo organizacional y capacitación en Cuauhtémoc, Chihuahua: certificación de competencias CONOCER, capacitación empresarial con registro STPS y consultoría estratégica.',
    slogan: site.tagline,
    url: absolute('/'),
    logo,
    image,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.street}, ${site.address.area}`,
      postalCode: site.address.postalCode,
      addressLocality: 'Cuauhtémoc',
      addressRegion: 'Chihuahua',
      addressCountry: 'MX',
    },
    hasMap: site.mapLink,
    areaServed: { '@type': 'State', name: 'Chihuahua' },
    sameAs: Object.values(site.social),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Inicio', path: '/' }, ...items].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}
