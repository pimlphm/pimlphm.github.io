'use client';

/* eslint-disable @next/next/no-img-element -- Shared with the static GitHub Pages build. */

import { useMemo, useState } from 'react';
import scholarData from '../data/scholar.json';
import publicationData from '../data/publications.generated.json';
import projectData from '../data/projects.generated.json';

type PublicationKind = 'Journal' | 'Conference' | 'Thesis';
type LocalizedText = { en: string; zh: string };

type PublicationLink = {
  label: string | LocalizedText;
  href: string;
  download?: boolean;
};

type Publication = {
  id: string;
  kind: PublicationKind;
  year: number;
  title: string;
  authors: string;
  venue: string;
  topic: LocalizedText;
  links: PublicationLink[];
};

type ResearchProject = {
  id: string;
  year: number;
  displayYear?: string;
  kind: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  tags: LocalizedText;
  image?: string;
  imageAlt?: LocalizedText;
  publicationIds: string[];
  links: Array<{ label: LocalizedText; href: string }>;
};

type ScholarWorkImpact = {
  citations: number;
  href: string;
};

const scholarProfile = scholarData.profile;
const scholarImpactByPublication: Record<string, ScholarWorkImpact> = scholarData.works;
const publications = publicationData as Publication[];
const researchProjects = projectData as ResearchProject[];

const uiCopy = {
    homeAria: 'Weikun Deng — home',
    navigationAria: 'Primary navigation',
    navProjects: 'Projects',
    navPublications: 'Publications',
    navCode: 'Source code',
    navLife: 'Beyond research',
    heroEyebrow: 'Intelligent manufacturing · PHM · Engineering AI',
    heroTitle: 'Engineering intelligence,',
    heroEmphasis: ' grounded in physics.',
    heroIntroBefore: 'I am',
    heroIntroAfter: 'an interdisciplinary researcher whose published work spans physics-informed machine learning, diagnostics, prognostics and intelligent maintenance for complex engineering systems.',
    appointmentBefore: 'Assistant Professor in Intelligent Manufacturing & Systems Engineering at',
    appointmentInstitution: ' City University of Hong Kong (Dongguan)',
    appointmentAfter: ' from 1 September 2026.',
    exploreWork: 'Explore the work',
    browsePublications: 'Browse publications',
    researchProfilesAria: 'Research profiles',
    portraitAria: 'Portrait of Weikun Deng',
    publishedRecord: 'Published work',
    journalArticles: '11 journal articles',
    inventiveWork: 'Granted patents',
    grantedPatents: '4 granted patents',
    researchEyebrow: 'Published research threads',
    researchHeadingOne: 'From physical evidence',
    researchHeadingTwo: 'to engineering decisions.',
    evidenceEyebrow: 'Research project archive · 2017—2026',
    evidenceHeading: 'Projects, year by year.',
    evidenceIntro: 'Scroll through completed research and engineering projects. Published methods, technical cases, figures, papers and code remain connected in one chronological record.',
    projectIndexAria: 'Jump to a project year',
    projectArchiveAria: 'Research projects grouped by year',
    projectSingular: 'project',
    projectPlural: 'projects',
    linkedOutput: 'linked output',
    linkedOutputs: 'linked outputs',
    technicalCase: 'documented case',
    openArticle: 'Open article',
    publicationsEyebrow: 'Publications',
    publicationsHeading: 'The complete public record.',
    publicationsSummary: '11 journal articles · 7 conference contributions · doctoral thesis',
    scholarAria: 'Google Scholar impact snapshot',
    impactSnapshot: 'Impact snapshot',
    synced: 'Synced',
    distinctOutputs: 'distinct published outputs',
    citations: 'Citations',
    hIndex: 'h-index',
    i10Index: 'i10-index',
    filterAria: 'Filter publications',
    searchSr: 'Search publications',
    searchPlaceholder: 'Search title, venue, topic…',
    record: 'record',
    records: 'records',
    citation: 'citation',
    citationsLower: 'citations',
    noRecords: 'No records match that search.',
    rightsNote: 'Scholar counts are a dated snapshot and will change over time. Records are matched by final title and DOI, with duplicate or non-final versions omitted. Full-text buttons point to open or author-shared copies.',
    codeEyebrow: 'Selected source code',
    repository: 'Repository',
    paper: 'Paper',
    pathEyebrow: 'Path',
    pathHeadingOne: 'Across mechanics,',
    pathHeadingTwo: 'sensing and learning.',
    pathIntro: 'A research path built through mechanical systems, experimental monitoring and machine learning across China, France and the United States.',
    recognitionEyebrow: 'Recognition',
    recognitionHeading: 'Selected awards.',
    inventionEyebrow: 'Invention',
    inventionHeading: 'Four granted patents.',
    lifeEyebrow: 'Beyond research',
    lifeHeadingOne: 'Stories, rallies',
    lifeHeadingTwo: 'and open roads.',
    novelLabel: '01 · Novels',
    novelTitle: 'Long-form worlds',
    novelDetail: 'Reading fiction for its characters, structures and ability to make another world feel internally true.',
    badmintonLabel: '02 · Badminton',
    badmintonTitle: 'Precision at speed',
    badmintonDetail: 'A game of timing, fast recovery and finding the angle hidden inside a rally.',
    cyclingLabel: '03 · Cycling',
    cyclingTitle: 'Distance, one turn at a time',
    cyclingDetail: 'Long rides for changing terrain, steady rhythm and the clarity that arrives between destinations.',
    connect: 'Connect',
    footerTagline: 'Engineering intelligence, grounded in physics.',
    footerNote: '© 2026 Weikun Deng · Built as a lightweight, accessible static site.',
} as const;

const publicationKindLabels: Record<'All' | PublicationKind, string> = {
  All: 'All',
  Journal: 'Journal',
  Conference: 'Conference',
  Thesis: 'Thesis',
};

const researchThreads = [
  {
    index: '01',
    title: 'Physics-informed intelligence',
    detail: 'Learning architectures shaped by equations, mechanisms and engineering structure.',
  },
  {
    index: '02',
    title: 'Diagnostics & prognostics',
    detail: 'Health assessment for rotating machinery, batteries and complex monitored systems.',
  },
  {
    index: '03',
    title: 'Learning with scarce labels',
    detail: 'Self-supervised and transfer learning for sparse, noisy and shifting conditions.',
  },
];

const codeProjects = [
  {
    tag: 'Rotor diagnostics',
    title: 'RFEMNN rotor diagnostics',
    description: 'Curated reproduction code for the rotor-dynamics-informed model reported in Advanced Engineering Informatics.',
    paper: 'https://doi.org/10.1016/j.aei.2023.102128',
    repo: 'https://github.com/pimlphm/rfemnn-rotor-diagnostics',
  },
  {
    tag: 'Battery prognostics',
    title: 'PIML benchmark architecture',
    description: 'Code accompanying the battery RUL framework and its associated benchmark architecture.',
    paper: 'https://doi.org/10.1016/j.apenergy.2025.125314',
    repo: 'https://github.com/pimlphm/PIML-benchmark-architecture',
  },
  {
    tag: 'Bearing prognostics',
    title: 'Physics-informed TCN',
    description: 'A lightweight temporal convolution implementation for physics-informed bearing prognostics.',
    paper: 'https://doi.org/10.36001/phme.2022.v7i1.3365',
    repo: 'https://github.com/pimlphm/Physics-informed-machine-learning-based-on-TCN',
  },
  {
    tag: 'Learning resource',
    title: 'Machinery PHM tutorial',
    description: 'A practical collection of notebooks and examples for machinery prognostics and health management.',
    paper: 'https://doi.org/10.1016/j.mechatronics.2025.103297',
    repo: 'https://github.com/pimlphm/machinery-phm-tutorial',
  },
];

const career = [
  { year: '2024—2026', role: 'Research Associate', place: 'UTTOP / Université de Toulouse · France' },
  { year: '2023—2024', role: 'Visiting Researcher', place: 'University of Central Florida · USA' },
  { year: '2021—2024', role: 'PhD · Industrial Engineering', place: 'Toulouse INP, Université de Toulouse · France' },
  { year: '2020—2021', role: 'Diagnostic Systems R&D Engineer', place: 'Zhejiang Tsinghua Institute of Flexible Electronics Technology · China' },
  { year: '2017—2020', role: 'MEng · Aero-propulsion Theory & Engineering', place: 'Northwestern Polytechnical University · China' },
  { year: '2013—2017', role: 'BEng · Aircraft Power Engineering', place: 'Northwestern Polytechnical University · China' },
];

const achievements = [
  { label: '2023 · Award', title: 'Chinese Government Award for Outstanding Self-financed Students Abroad' },
  { label: '2023 · Recognition', title: 'IFAC World Congress Best Application Paper Prize Finalist' },
  { label: '2022 · Award', title: 'PHME Doctoral Symposium Second Prize' },
];

const patents = [
  ['CN202111014328.5', 'Axle-system fit monitoring device'],
  ['CN201710230773.2', 'Early fluid-accumulation fault identification for aircraft-engine rotors'],
  ['CN201710230765.8', 'Fault-gene-based reverse design for rotor structural dynamics'],
  ['CN201710230772.8', 'Intelligent diagnosis of aero-engine structural faults'],
];

function NameHighlighted({ authors }: { authors: string }) {
  const parts = authors.split('Weikun Deng');
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 && <strong>Weikun Deng</strong>}
          {part}
        </span>
      ))}
    </>
  );
}

function ExternalLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function publicationLinkLabel(link: PublicationLink) {
  return typeof link.label === 'string' ? link.label : link.label.en;
}

export default function Home() {
  const [filter, setFilter] = useState<'All' | PublicationKind>('All');
  const [query, setQuery] = useState('');
  const t = uiCopy;

  const visiblePublications = useMemo(() => {
    const term = query.trim().toLowerCase();
    return publications.filter((publication) => {
      const matchesKind = filter === 'All' || publication.kind === filter;
      const haystack = `${publication.title} ${publication.authors} ${publication.venue} ${publication.topic.en}`.toLowerCase();
      return matchesKind && (!term || haystack.includes(term));
    });
  }, [filter, query]);

  const publicationCounts = useMemo(() => ({
    Journal: publications.filter((publication) => publication.kind === 'Journal').length,
    Conference: publications.filter((publication) => publication.kind === 'Conference').length,
    Thesis: publications.filter((publication) => publication.kind === 'Thesis').length,
  }), []);
  const publicationSummary = `${publicationCounts.Journal} journal articles · ${publicationCounts.Conference} conference contributions · ${publicationCounts.Thesis} doctoral thesis`;
  const projectYears = useMemo(() => [...new Set(researchProjects.map((project) => project.year))].sort((a, b) => b - a), []);
  const publicationById = useMemo(() => new Map(publications.map((publication) => [publication.id, publication])), []);

  return (
    <main lang="en">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={t.homeAria}>
          <span className="wordmark-mark">WD</span>
          <span>Weikun Deng</span>
        </a>
        <nav className="nav-links" aria-label={t.navigationAria}>
          <a href="#projects">{t.navProjects}</a>
          <a href="#publications">{t.navPublications}</a>
          <a href="#code">{t.navCode}</a>
          <a href="#life">{t.navLife}</a>
        </nav>
        <ExternalLink className="nav-cta" href="https://github.com/pimlphm">GitHub</ExternalLink>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> {t.heroEyebrow}</p>
          <h1>{t.heroTitle}<em>{t.heroEmphasis}</em></h1>
          <p className="hero-intro">
            {t.heroIntroBefore} <strong>Weikun DENG 邓炜坤</strong>, {t.heroIntroAfter}
          </p>
          <div className="appointment-note">
            <span className="appointment-date">01 · 09 · 2026</span>
            <p>
              {t.appointmentBefore}
              <strong>{t.appointmentInstitution}</strong>
              {t.appointmentAfter}
            </p>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">{t.exploreWork} <span>↓</span></a>
            <a className="button button-ghost" href="#publications">{t.browsePublications}</a>
          </div>
          <div className="profile-links" aria-label={t.researchProfilesAria}>
            <ExternalLink href="https://scholar.google.com/citations?user=mTYJRFwAAAAJ&hl=en">Google Scholar</ExternalLink>
            <ExternalLink href="https://dblp.org/pid/363/0767.html">DBLP</ExternalLink>
            <ExternalLink href="https://www.scopus.com/authid/detail.uri?authorId=58529504100">Scopus</ExternalLink>
          </div>
        </div>

        <div className="portrait-stage" aria-label={t.portraitAria}>
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="portrait-frame"><img src="/images/weikun-deng.jpg" alt="Weikun Deng" /></div>
          <div className="signal-card signal-card-top"><span>{t.publishedRecord}</span><strong>{publicationCounts.Journal} journal articles</strong></div>
          <div className="signal-card signal-card-bottom"><span>{t.inventiveWork}</span><strong>{t.grantedPatents}</strong></div>
        </div>
      </section>

      <section className="research-strip" id="work">
        <div className="strip-heading">
          <p className="eyebrow"><span /> {t.researchEyebrow}</p>
          <h2>{t.researchHeadingOne}<br />{t.researchHeadingTwo}</h2>
        </div>
        <div className="thread-grid">
          {researchThreads.map((thread) => (
            <article className="thread-card" key={thread.index}>
              <span className="thread-index">{thread.index}</span>
              <h3>{thread.title}</h3>
              <p>{thread.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="evidence-section project-section" id="projects">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> {t.evidenceEyebrow}</p><h2>{t.evidenceHeading}</h2></div>
          <p>{t.evidenceIntro}</p>
        </div>
        <nav className="project-year-index" aria-label={t.projectIndexAria}>
          {projectYears.map((year) => <a key={year} href={`#projects-${year}`}>{year}</a>)}
        </nav>
        <div className="project-archive" aria-label={t.projectArchiveAria}>
          {projectYears.map((year) => {
            const yearProjects = researchProjects.filter((project) => project.year === year);
            return (
              <section className="project-year" id={`projects-${year}`} key={year}>
                <header className="project-year-marker">
                  <strong>{year}</strong>
                  <span>{yearProjects.length} {yearProjects.length === 1 ? t.projectSingular : t.projectPlural}</span>
                </header>
                <div className="project-list">
                  {yearProjects.map((project) => {
                    const linkedOutputCount = project.publicationIds.filter((id) => publicationById.has(id)).length;
                    const projectCitations = project.publicationIds.reduce((sum, id) => sum + (scholarImpactByPublication[id]?.citations ?? 0), 0);
                    return (
                      <article className="project-card" key={project.id}>
                        <div className={`project-media${project.image ? ' has-image' : ''}`}>
                          {project.image ? (
                            <img src={project.image} alt={project.imageAlt?.en ?? project.title.en} loading="lazy" />
                          ) : (
                            <div className="project-signal" aria-hidden="true">
                              <span /><span /><span /><span /><strong>{project.displayYear ?? project.year}</strong>
                            </div>
                          )}
                          <span className="project-year-badge">{project.displayYear ?? project.year}</span>
                        </div>
                        <div className="project-copy">
                          <p className="project-kind">{project.kind.en}</p>
                          <h3>{project.title.en}</h3>
                          <p className="project-summary">{project.summary.en}</p>
                          <p className="project-tags">{project.tags.en}</p>
                          <div className="project-impact">
                            <span>{linkedOutputCount > 0 ? `${linkedOutputCount} ${linkedOutputCount === 1 ? t.linkedOutput : t.linkedOutputs}` : `1 ${t.technicalCase}`}</span>
                            {projectCitations > 0 && <span>{projectCitations} {projectCitations === 1 ? t.citation : t.citationsLower}</span>}
                          </div>
                          {project.links.length > 0 && (
                            <div className="project-links">
                              {project.links.map((link) => <ExternalLink href={link.href} key={`${project.id}-${link.href}`}>{link.label.en}</ExternalLink>)}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="publications-section" id="publications">
        <div className="section-heading publications-heading">
          <div><p className="eyebrow"><span /> {t.publicationsEyebrow}</p><h2>{t.publicationsHeading}</h2></div>
          <p>{publicationSummary}</p>
        </div>

        <div className="scholar-impact" aria-label={`${t.scholarAria}, ${scholarProfile.synced}`}>
          <a className="scholar-impact-source" href={scholarProfile.href} target="_blank" rel="noreferrer">
            <span>Google Scholar</span>
            <strong>{t.impactSnapshot}</strong>
            <small>{t.synced} {scholarProfile.synced} · {scholarProfile.distinctOutputs} {t.distinctOutputs}</small>
          </a>
          <div className="scholar-metric"><strong>{scholarProfile.citations}</strong><span>{t.citations}</span></div>
          <div className="scholar-metric"><strong>{scholarProfile.hIndex}</strong><span>{t.hIndex}</span></div>
          <div className="scholar-metric"><strong>{scholarProfile.i10Index}</strong><span>{t.i10Index}</span></div>
        </div>

        <div className="publication-tools">
          <div className="filter-group" aria-label={t.filterAria}>
            {(['All', 'Journal', 'Conference', 'Thesis'] as const).map((option) => (
              <button aria-pressed={filter === option} className={filter === option ? 'filter-button active' : 'filter-button'} key={option} onClick={() => setFilter(option)} type="button">{publicationKindLabels[option]}</button>
            ))}
          </div>
          <label className="search-box">
            <span className="sr-only">{t.searchSr}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} type="search" />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>

        <div className="publication-count" aria-live="polite">{visiblePublications.length} {visiblePublications.length === 1 ? t.record : t.records}</div>
        <div className="publication-list">
          {visiblePublications.map((publication) => {
            const scholarImpact = scholarImpactByPublication[publication.id];
            return (
            <article className="publication-row" key={publication.id}>
              <div className="publication-meta"><span>{publication.year}</span><span>{publicationKindLabels[publication.kind]}</span></div>
              <div className="publication-main">
                <p className="publication-topic">{publication.topic.en}</p>
                <h3>{publication.title}</h3>
                <p className="authors"><NameHighlighted authors={publication.authors} /></p>
                <p className="venue">{publication.venue}</p>
              </div>
              <div className="publication-links">
                {scholarImpact && (
                  <a className="publication-impact" href={scholarImpact.href} target="_blank" rel="noreferrer">
                    <strong>{scholarImpact.citations}</strong>
                    <span>{scholarImpact.citations === 1 ? t.citation : t.citationsLower} · Scholar ↗</span>
                  </a>
                )}
                {publication.links.map((link) => (
                  <a href={link.href} key={`${publication.id}-${link.href}`} target="_blank" rel="noreferrer" download={link.download || undefined}>{publicationLinkLabel(link)} <span aria-hidden="true">↗</span></a>
                ))}
              </div>
            </article>
            );
          })}
          {visiblePublications.length === 0 && <p className="empty-state">{t.noRecords}</p>}
        </div>
        <p className="rights-note">{t.rightsNote}</p>
      </section>

      <section className="code-section" id="code">
        <div className="code-orbit" aria-hidden="true">
          <span className="code-node node-a" /><span className="code-node node-b" /><span className="code-node node-c" /><span className="code-center">&lt;/&gt;</span>
        </div>
        <div className="section-heading code-heading">
          <p className="eyebrow"><span /> {t.codeEyebrow}</p>
        </div>
        <div className="code-grid">
          {codeProjects.map((project, index) => (
            <article className="code-card" key={project.title}>
              <div className="code-card-top"><span>{project.tag}</span><span>0{index + 1}</span></div>
              <h3>{project.title}</h3><p>{project.description}</p>
              <div className="code-links"><ExternalLink href={project.repo}>{t.repository}</ExternalLink><ExternalLink href={project.paper}>{t.paper}</ExternalLink></div>
            </article>
          ))}
        </div>
      </section>

      <section className="path-section" id="path">
        <div className="section-heading path-heading">
          <div><p className="eyebrow"><span /> {t.pathEyebrow}</p><h2>{t.pathHeadingOne}<br />{t.pathHeadingTwo}</h2></div>
          <p>{t.pathIntro}</p>
        </div>
        <div className="timeline">
          {career.map((item) => (
            <article className="timeline-row" key={`${item.year}-${item.role}`}>
              <span className="timeline-year">{item.year}</span><div><h3>{item.role}</h3><p>{item.place}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="recognition-section">
        <div className="recognition-column">
          <p className="eyebrow"><span /> {t.recognitionEyebrow}</p><h2>{t.recognitionHeading}</h2>
          <div className="achievement-list">
            {achievements.map((achievement) => <article key={achievement.title}><p>{achievement.label}</p><h3>{achievement.title}</h3></article>)}
          </div>
        </div>
        <div className="recognition-column patent-column">
          <p className="eyebrow"><span /> {t.inventionEyebrow}</p><h2>{t.inventionHeading}</h2>
          <div className="patent-list">
            {patents.map(([number, title]) => <article key={number}><span>{number}</span><p>{title}</p></article>)}
          </div>
        </div>
      </section>

      <section className="life-section" id="life">
        <div className="section-heading life-heading"><p className="eyebrow"><span /> {t.lifeEyebrow}</p><h2>{t.lifeHeadingOne}<br />{t.lifeHeadingTwo}</h2></div>
        <div className="hobby-grid">
          <article className="hobby-card novel-card">
            <div className="hobby-visual books" aria-hidden="true"><span /><span /><span /><span /></div>
            <div><span className="hobby-index">{t.novelLabel}</span><h3>{t.novelTitle}</h3><p>{t.novelDetail}</p></div>
          </article>
          <article className="hobby-card badminton-card">
            <div className="hobby-visual shuttle-stage" aria-hidden="true"><span className="shuttle-head" /><span className="shuttle-feather feather-one" /><span className="shuttle-feather feather-two" /><span className="shuttle-feather feather-three" /></div>
            <div><span className="hobby-index">{t.badmintonLabel}</span><h3>{t.badmintonTitle}</h3><p>{t.badmintonDetail}</p></div>
          </article>
          <article className="hobby-card cycling-card">
            <div className="hobby-visual bicycle" aria-hidden="true"><span className="wheel wheel-left" /><span className="wheel wheel-right" /><span className="bike-frame" /><span className="bike-line" /></div>
            <div><span className="hobby-index">{t.cyclingLabel}</span><h3>{t.cyclingTitle}</h3><p>{t.cyclingDetail}</p></div>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div><p className="eyebrow"><span /> {t.connect}</p><h2>Weikun DENG <em>邓炜坤</em></h2><p>{t.footerTagline}</p></div>
        <div className="footer-links">
          <a href="mailto:wekun.deng@cityu-dg.edu.cn">Email · wekun.deng@cityu-dg.edu.cn <span aria-hidden="true">↗</span></a>
          <ExternalLink href="https://github.com/pimlphm">GitHub</ExternalLink>
          <ExternalLink href="https://scholar.google.com/citations?user=mTYJRFwAAAAJ&hl=en">Scholar</ExternalLink>
          <ExternalLink href="https://www.researchgate.net/profile/Weikun-Deng">ResearchGate</ExternalLink>
          <ExternalLink href="https://www.scopus.com/authid/detail.uri?authorId=58529504100">Scopus</ExternalLink>
        </div>
        <p className="footer-note">{t.footerNote}</p>
      </footer>
    </main>
  );
}
