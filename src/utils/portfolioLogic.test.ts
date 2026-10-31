import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CERTIFICATION_DATA,
  COMPETENCIES_DATA,
  EXPERIENCE_DATA,
  PROJECTS_DATA,
} from '../data/portfolioData';
import {
  easeInOutCubic,
  filterCertifications,
  filterCompetenciesByCategory,
  filterExperiencesByCategory,
  filterProjectsByCategory,
  getMarqueeDurationSeconds,
  interpolateScrollY,
  validateContactForm,
} from './portfolioLogic';

test('filterProjectsByCategory returns all projects when All is selected', () => {
  const all = filterProjectsByCategory(PROJECTS_DATA, 'All');
  assert.equal(all.length, PROJECTS_DATA.length);
});

test('filterProjectsByCategory filters by category and search query', () => {
  const webSys = filterProjectsByCategory(PROJECTS_DATA, 'Web & Systems');
  assert.equal(webSys.length, 2);

  const searched = filterProjectsByCategory(PROJECTS_DATA, 'All', 'Monitoring');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'proj-01');
});

test('filterCompetenciesByCategory filters competencies accurately', () => {
  const all = filterCompetenciesByCategory(COMPETENCIES_DATA, 'All');
  assert.equal(all.length, COMPETENCIES_DATA.length);

  const analytical = filterCompetenciesByCategory(
    COMPETENCIES_DATA,
    'Analytical & Research'
  );
  assert.equal(analytical.length, 2);
});

test('filterExperiencesByCategory filters experiences accurately', () => {
  const all = filterExperiencesByCategory(EXPERIENCE_DATA, 'All');
  assert.equal(all.length, 5);

  const primary = filterExperiencesByCategory(
    EXPERIENCE_DATA,
    'Primary Healthcare'
  );
  assert.equal(primary.length, 1);
  assert.equal(primary[0].id, 'exp-01');

  const academic = filterExperiencesByCategory(
    EXPERIENCE_DATA,
    'Academic & Clinical'
  );
  assert.equal(academic.length, 4);
});

test('filterCertifications searches by title, issuer, or credential ID', () => {
  const byId = filterCertifications(CERTIFICATION_DATA, 'PL.02.03/FXV/2819/2026');
  assert.equal(byId.length, 1);
  assert.equal(byId[0].id, 'cert-01');

  const empty = filterCertifications(CERTIFICATION_DATA, 'nonexistent-credential-xyz');
  assert.equal(empty.length, 0);
});

test('validateContactForm rejects empty or invalid inputs and accepts valid input', () => {
  const invalid = validateContactForm({
    name: '',
    email: 'not-an-email',
    subject: '',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Budi Santoso',
    email: 'budi@institusi.id',
    subject: 'Kolaborasi Proyek Sistem Informasi',
    message: 'Halo Mahesa, kami tertarik berdiskusi mengenai pengembangan portal evaluasi.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('getMarqueeDurationSeconds returns expected seconds for each speed preset', () => {
  assert.equal(getMarqueeDurationSeconds('slow'), 38);
  assert.equal(getMarqueeDurationSeconds('normal'), 26);
  assert.equal(getMarqueeDurationSeconds('fast'), 16);
});

test('easeInOutCubic and interpolateScrollY calculate smooth scroll trajectory', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(easeInOutCubic(1), 1);
  assert.equal(interpolateScrollY(0, 1000, 0), 0);
  assert.equal(interpolateScrollY(0, 1000, 0.5), 500);
  assert.equal(interpolateScrollY(0, 1000, 1), 1000);
});

