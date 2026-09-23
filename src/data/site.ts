export const site = {
  name: 'Edunnova',
  tagline: 'Aprender para crecer, innovar para transformar y conectar para avanzar.',
  email: 'contacto@edunnova.com',
  emailSocial: 'rs@edunnova.com.mx',
  phone: '+52 625 126 0777',
  whatsapp: 'https://wa.me/message/IUNKA7QZTZGIN1',
  address: {
    street: 'C. Segunda 855, entre Aldama y Ojinaga',
    area: 'Zona Centro',
    postalCode: '31500',
    city: 'Cd. Cuauhtémoc',
    region: 'Chihuahua',
  },
  mapLink: 'https://maps.app.goo.gl/imL1mHaZ7fLhA92v7',
  mapEmbed: 'https://maps.google.com/maps?q=Edunnova&t=m&z=15&output=embed&iwloc=near',
  stpsRegistry: 'CACR-960912-B66-0005',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61568667095400',
    instagram: 'https://www.instagram.com/edunnova',
    youtube: 'https://www.youtube.com/@Edunnova',
  },
} as const;

export const tel = `tel:${site.phone.replace(/\s/g, '')}`;

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros/', label: 'Nosotros' },
  { href: '/servicios/', label: 'Servicios' },
  { href: '/ami-docente/', label: 'Certificación CONOCER' },
  { href: '/resp-social/', label: 'Resp. social' },
  { href: '/red-edunnova/', label: 'Noticias' },
  { href: '/contacto/', label: 'Contacto' },
];
