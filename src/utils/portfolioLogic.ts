import type {
  CertificationItem,
  CompetencyItem,
  ExperienceItem,
  ProjectItem,
} from '../data/portfolioData';

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

export function filterProjectsByCategory(
  projects: ProjectItem[],
  category: string,
  searchQuery = ''
): ProjectItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return projects.filter((project) => {
    const matchesCategory =
      category === 'All' || project.category.toLowerCase() === category.toLowerCase();
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.summary.toLowerCase().includes(normalizedQuery) ||
      project.stack.some((tech) => tech.toLowerCase().includes(normalizedQuery))
    );
  });
}

export function filterCompetenciesByCategory(
  competencies: CompetencyItem[],
  category: string
): CompetencyItem[] {
  if (category === 'All') return competencies;
  return competencies.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
}

export function filterExperiencesByCategory(
  experiences: ExperienceItem[],
  category: string
): ExperienceItem[] {
  if (category === 'All') return experiences;
  return experiences.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
}

export function filterCertifications(
  certifications: CertificationItem[],
  query: string
): CertificationItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return certifications;
  return certifications.filter(
    (cert) =>
      cert.title.toLowerCase().includes(q) ||
      cert.issuer.toLowerCase().includes(q) ||
      cert.category.toLowerCase().includes(q) ||
      cert.credentialId.toLowerCase().includes(q) ||
      cert.verifiedSkills.some((s) => s.toLowerCase().includes(q))
  );
}

export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedSubject = input.subject.trim();
  const trimmedMessage = input.message.trim();

  if (!trimmedName) {
    errors.name = 'Nama lengkap wajib diisi.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Nama minimal terdiri dari 2 karakter.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Alamat email wajib diisi.';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Masukkan format alamat email yang valid.';
  }

  if (!trimmedSubject) {
    errors.subject = 'Subjek pesan wajib diisi.';
  }

  if (!trimmedMessage) {
    errors.message = 'Isi pesan tidak boleh kosong.';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Pesan minimal terdiri dari 10 karakter agar jelas.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getMarqueeDurationSeconds(speed: 'slow' | 'normal' | 'fast'): number {
  switch (speed) {
    case 'slow':
      return 38;
    case 'fast':
      return 16;
    case 'normal':
    default:
      return 26;
  }
}

/**
 * Smooth cinematic easing curve (easeInOutCubic) for programmatic navigation scrolling.
 */
export function easeInOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

export function interpolateScrollY(
  startY: number,
  targetY: number,
  progress: number
): number {
  const eased = easeInOutCubic(progress);
  return startY + (targetY - startY) * eased;
}

