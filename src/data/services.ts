import type { ImageMetadata } from 'astro';
import certIll from '../assets/illustrations/concepto-certificacion.png';
import consIll from '../assets/illustrations/concepto-consultoria.png';
import capIll from '../assets/illustrations/concepto-capacitacion.png';
import certPhoto from '../assets/photos/certificacion-grupo.jpg';
import consPhoto from '../assets/photos/consultoria-reunion.jpg';
import capPhoto from '../assets/photos/capacitacion-aula.jpg';

export type Service = {
  id: string;
  title: string;
  /** Palabra que va resaltada en morado dentro del título */
  mark: string;
  short: string;
  long: string;
  href: string;
  illustration: ImageMetadata;
  photo: ImageMetadata;
  photoAlt: string;
  badge?: string;
};

export const services: Service[] = [
  {
    id: 'certificacion',
    title: 'Certificación de Estándares',
    mark: 'CONOCER',
    short: 'Certificamos competencias laborales de personas y equipos con validez oficial (SEP / CONOCER / UACH).',
    long: 'Certificamos competencias laborales con validez oficial a nivel nacional (SEP / CONOCER / UACH), fortaleciendo el perfil profesional de tu equipo con evidencia documentada.',
    href: '/ami-docente/',
    illustration: certIll,
    photo: certPhoto,
    photoAlt: 'Grupo en una sesión de certificación de competencias en Edunnova',
    badge: 'Disponible',
  },
  {
    id: 'capacitacion',
    title: 'Formación y Capacitación',
    mark: 'Empresarial',
    short: 'Cursos con constancia DC-3 ante la STPS, adaptados a los retos reales de tu organización.',
    long: 'Diseñamos e impartimos cursos de capacitación con registro STPS y constancia DC-3, adaptados a los retos reales de tu organización.',
    href: '/servicios/#capacitacion',
    illustration: capIll,
    photo: capPhoto,
    photoAlt: 'Participantes en un aula de capacitación empresarial',
  },
  {
    id: 'consultoria',
    title: 'Consultoría',
    mark: 'Estratégica',
    short: 'Diagnóstico, diseño a la medida y acompañamiento hasta verificar resultados, para empresas, instituciones y gobierno.',
    long: 'Acompañamos a empresas, instituciones educativas y organismos de gobierno en procesos de transformación real: diagnóstico, diseño a la medida y acompañamiento hasta verificar resultados.',
    href: '/servicios/#consultoria',
    illustration: consIll,
    photo: consPhoto,
    photoAlt: 'Reunión de trabajo de consultoría en la sala de juntas de Edunnova',
  },
];
