'use client';

/* eslint-disable @next/next/no-img-element -- Shared with the static GitHub Pages build. */

import { useMemo, useState } from 'react';
import publicationData from '../data/publications.generated.json';
import projectData from '../data/projects.generated.json';
import codeData from '../data/code-projects.json';
import Pyrenees from './pyrenees';
import { useScholar } from './use-scholar';

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

type CodeProject = {
  id: string;
  category: string;
  tag: string;
  title: string;
  description: string;
  access: 'public' | 'private';
  status: string;
  repo: string;
  paper?: string;
  demo?: string;
};

const publications = publicationData as Publication[];
const researchProjects = projectData as ResearchProject[];
const codeRepositories = codeData as CodeProject[];
const codeCategories = ['All', ...new Set(codeRepositories.map((project) => project.category))];

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
  const scholar = useScholar();
  const [filter, setFilter] = useState<'All' | PublicationKind>('All');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [codeCategory, setCodeCategory] = useState('All');
  const codeProjects = codeRepositories.filter((project) => codeCategory === 'All' || project.category === codeCategory);
  const matchingPublications = useMemo(() => {
    const term = query.trim().toLowerCase();
    return publications.filter((publication) =>
      (filter === 'All' || publication.kind === filter) &&
      (!term || `${publication.title} ${publication.authors} ${publication.venue} ${publication.topic.en} ${publication.year}`.toLowerCase().includes(term))
    ).sort((a, b) => b.year - a.year);
  }, [filter, query]);
  const isSearching = filter !== 'All' || query.trim().length > 0;
  const visiblePublications = showAll || isSearching ? matchingPublications : matchingPublications.slice(0, 6);
  const publicationYears = [...new Set(visiblePublications.map((publication) => publication.year))];
  const projectYears = [...new Set(researchProjects.map((project) => project.year))].sort((a, b) => b - a);

  return (
    <main lang="en" className="academic-home">
      <a className="skip-link" href="#publications">Skip to publications</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Weikun Deng — academic homepage">Weikun Deng</a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#publications">Publications</a>
          <a href="#pyrenees">Lab</a>
          <a href="#projects">Projects</a>
          <a href="#code">Code</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="profile" id="top" aria-labelledby="profile-name">
        <div className="profile-copy">
          <h1 id="profile-name">Weikun Deng <span lang="zh">邓炜坤</span></h1>
          <p className="affiliation"><strong>Assistant Professor</strong><br />Intelligent Manufacturing and Systems Engineering<br />City University of Hong Kong (Dongguan)</p>
          <a className="email" href="mailto:wekun.deng@cityu-dg.edu.cn">wekun.deng@cityu-dg.edu.cn</a>
          <div className="profile-links" aria-label="Research profiles">
            <ExternalLink href={scholar.profile.href}>Google Scholar</ExternalLink>
            <ExternalLink href="https://github.com/pimlphm">GitHub</ExternalLink>
            <ExternalLink href="https://dblp.org/pid/363/0767.html">DBLP</ExternalLink>
          </div>
        </div>
        <div className="portrait-frame"><img src="/images/weikun-deng-lanterns.jpg" alt="Weikun Deng" width="180" height="180" /></div>
      </section>

      <section className="about-section" id="work" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <p>I joined City University of Hong Kong (Dongguan) on 1 September 2026. Previously, I was a Research Associate at UTTOP / Université de Toulouse. I received my PhD in Industrial Engineering from Toulouse INP, Université de Toulouse, in 2024.</p>
        <p>My research focuses on physics-informed machine learning, condition monitoring and maintenance of engineering systems.</p>
        <p className="research-interests"><strong>Research interests:</strong> physics-informed learning; diagnostics and prognostics; self-supervised and transfer learning; system resilience.</p>
      </section>

      <section className="publications-section" id="publications" aria-labelledby="publications-title">
        <h2 id="publications-title">Publications</h2>
        <div className="scholar-summary" aria-label="Google Scholar citation metrics">
          <ExternalLink href={scholar.profile.href}>Google Scholar</ExternalLink>
          <span><strong>{scholar.profile.citations}</strong> citations</span>
          <span>h-index <strong>{scholar.profile.hIndex}</strong></span>
          <span>i10-index <strong>{scholar.profile.i10Index}</strong></span>
          <span className="verified">Verified {scholar.profile.synced}</span>
        </div>
        {scholar.refresh?.outcome === 'unavailable' && <p className="sync-note">The latest Scholar check was unavailable; these are the last verified counts.</p>}
        <div className="publication-tools">
          <div className="filter-group" role="group" aria-label="Filter publications">
            {(['All', 'Journal', 'Conference', 'Thesis'] as const).map((option) => (
              <button aria-pressed={filter === option} className={filter === option ? 'filter-button active' : 'filter-button'} key={option} onClick={() => setFilter(option)} type="button">{option}</button>
            ))}
          </div>
          <label className="search-box">
            <span className="sr-only">Search all publications</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all publications…" type="search" />
          </label>
        </div>
        <p className="publication-count" aria-live="polite">{isSearching ? `${matchingPublications.length} matching publications` : showAll ? `All ${publications.length} publications` : `Recent publications · ${visiblePublications.length} of ${publications.length}`}</p>
        <div className="publication-list" id="publication-list">
          {publicationYears.map((year) => (
            <section className="publication-year" key={year} aria-labelledby={`publication-year-${year}`}>
              <h3 id={`publication-year-${year}`}>{year}</h3>
              <ul className="paper-list">
                {visiblePublications.filter((publication) => publication.year === year).map((publication) => {
                  const impact = scholar.works[publication.id];
                  return (
                    <li className="publication-row" key={publication.id}>
                      <h4>{publication.title}</h4>
                      <p className="authors"><NameHighlighted authors={publication.authors} /></p>
                      <p className="venue">{publication.venue}</p>
                      <div className="publication-links">
                        {publication.links.map((link) => (
                          <a href={link.href} key={`${publication.id}-${link.href}`} target="_blank" rel="noreferrer" download={link.download || undefined}>{publicationLinkLabel(link)}</a>
                        ))}
                        {impact && <a className="citation-link" href={impact.href} target="_blank" rel="noreferrer">{impact.citations} {impact.citations === 1 ? 'citation' : 'citations'}</a>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {visiblePublications.length === 0 && <p className="empty-state">No publications match your search.</p>}
        </div>
        {!isSearching && publications.length > 6 && (
          <button className="archive-toggle" type="button" aria-expanded={showAll} aria-controls="publication-list" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show recent publications' : `Show all ${publications.length} publications`}
          </button>
        )}
        <details className="publication-notes">
          <summary>About this list and citation updates</summary>
          <p>Records are matched by final title and DOI, with duplicate versions omitted. Full-text links point to open or author-shared copies. Google Scholar counts are checked weekly on Mondays (UTC+8); the verification date above identifies the saved data.</p>
        </details>
      </section>

      <Pyrenees />

      <section className="archive-section" id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">Research projects</h2>
        <p>Liquid neural networks and interpretable operators, maintenance-effect assessment, satellite knowledge distillation, and earlier engineering work.</p>
        <details className="archive-disclosure">
          <summary>Browse {researchProjects.length} projects by year</summary>
          <div className="project-archive">
            {projectYears.map((year) => (
              <section className="project-year" id={`projects-${year}`} key={year}>
                <h3>{year}</h3>
                {researchProjects.filter((project) => project.year === year).map((project) => (
                  <details className="project-entry" key={project.id}>
                    <summary>{project.title.en}</summary>
                    <div className="project-detail">
                      {project.image && <img src={project.image} alt={project.imageAlt?.en ?? project.title.en} loading="lazy" />}
                      <div>
                        <p>{project.summary.en}</p>
                        <p className="muted">{project.kind.en} · {project.displayYear ?? project.year}</p>
                        <div className="inline-links">
                          {project.links.map((link) => <ExternalLink href={link.href} key={`${project.id}-${link.href}`}>{link.label.en}</ExternalLink>)}
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </section>
            ))}
          </div>
        </details>
      </section>

      <section className="code-section" id="code" aria-labelledby="code-title">
        <h2 id="code-title">Code</h2>
        <p>Paper-specific code is linked above. Additional repositories and demonstrations are listed below.</p>
        <details className="archive-disclosure">
          <summary>Selected source code · {codeRepositories.length} repositories</summary>
          <div className="code-filters filter-group" role="group" aria-label="Filter source code by research area">
            {codeCategories.map((category) => <button className="filter-button" type="button" key={category} aria-pressed={codeCategory === category} onClick={() => setCodeCategory(category)}>{category}</button>)}
          </div>
          <p className="muted" aria-live="polite">{codeProjects.length} repositories</p>
          <ul className="repository-list">
            {codeProjects.map((project) => (
              <li key={project.id}>
                <h3><ExternalLink href={project.repo}>{project.title}</ExternalLink>{project.access === 'private' && <span className="private-label">Private</span>}</h3>
                <p>{project.description}</p>
                <p className="muted">{project.status}</p>
                <div className="inline-links">
                  {project.demo && <ExternalLink href={project.demo}>Interactive demo</ExternalLink>}
                  {project.paper && <ExternalLink href={project.paper}>Paper</ExternalLink>}
                </div>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="background-section" id="path" aria-labelledby="background-title">
        <h2 id="background-title">Background</h2>
        <details className="archive-disclosure">
          <summary>Education and experience</summary>
          <dl className="career-list">
            {career.map((item) => <div key={`${item.year}-${item.role}`}><dt>{item.year}</dt><dd><strong>{item.role}</strong><br />{item.place}</dd></div>)}
          </dl>
        </details>
        <details className="archive-disclosure">
          <summary>Awards and patents</summary>
          <h3>Awards</h3>
          <ul>{achievements.map((item) => <li key={item.title}>{item.title} <span className="muted">({item.label.split(' · ')[0]})</span></li>)}</ul>
          <h3>Granted patents</h3>
          <ul>{patents.map(([number, title]) => <li key={number}>{title} <span className="muted">({number})</span></li>)}</ul>
        </details>
      </section>

      <footer className="site-footer" id="contact">
        <h2>Contact</h2>
        <p><a href="mailto:wekun.deng@cityu-dg.edu.cn">wekun.deng@cityu-dg.edu.cn</a><br />City University of Hong Kong (Dongguan)</p>
        <div className="inline-links">
          <ExternalLink href="https://www.researchgate.net/profile/Weikun-Deng">ResearchGate</ExternalLink>
          <ExternalLink href="https://www.scopus.com/authid/detail.uri?authorId=58529504100">Scopus</ExternalLink>
        </div>
        <p id="life"><strong>Outside research:</strong> I enjoy novels, badminton and cycling.</p>
        <p className="copyright">© 2026 Weikun Deng</p>
      </footer>
    </main>
  );
}
