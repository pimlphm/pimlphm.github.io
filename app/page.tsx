'use client';

/* eslint-disable @next/next/no-img-element -- Shared with the static GitHub Pages build; GIFs must remain animated. */

import { useMemo, useState } from 'react';
import scholarData from '../data/scholar.json';

type PublicationKind = 'Journal' | 'Conference' | 'Thesis';

type PublicationLink = {
  label: string;
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
  topic: string;
  links: PublicationLink[];
};

type ScholarWorkImpact = {
  citations: number;
  href: string;
};

const scholarProfile = scholarData.profile;
const scholarImpactByPublication: Record<string, ScholarWorkImpact> = scholarData.works;

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

const researchFigures = [
  {
    number: '01',
    image: '/research/rotor-rfemnn.png',
    alt: 'Rotor model and physics-informed neural architecture diagram',
    kicker: 'Rotor systems · 2023',
    title: 'Mechanics becomes model structure',
    detail: 'A rotor-dynamics-informed deep network for crack and unbalance detection, identification and localisation.',
    href: 'https://doi.org/10.1016/j.aei.2023.102128',
  },
  {
    number: '02',
    image: '/research/ssl-bearing.png',
    alt: 'Contrastive self-supervised learning workflow for bearing prognostics',
    kicker: 'Bearings · 2024',
    title: 'Learning useful signals without abundant labels',
    detail: 'A contrastive self-supervised workflow that connects pretext learning to downstream prognostics.',
    href: 'https://doi.org/10.1016/j.engappai.2024.109268',
  },
  {
    number: '03',
    image: '/research/robot-inverse-dynamics.png',
    alt: 'Physics-informed inverse-dynamics model for a robotic manipulator',
    kicker: 'Robotics · 2024',
    title: 'Physics guides inverse dynamics',
    detail: 'A structured learning model for inverse dynamics in robotic manipulators.',
    href: 'https://doi.org/10.1016/j.asoc.2024.111877',
  },
  {
    number: '04',
    image: '/research/gated-mamba-noise.png',
    alt: 'Cross-scenario prognostics results under increasing noise',
    kicker: 'Cross-scenario PHM · 2025',
    title: 'Robustness across operating scenarios',
    detail: 'An end-to-end gated state-space architecture evaluated across changing prognostic scenarios.',
    href: 'https://doi.org/10.1016/j.mechatronics.2025.103361',
  },
];

const publications: Publication[] = [
  {
    id: 'j11',
    kind: 'Journal',
    year: 2026,
    title: 'Cross scenarios interpretable quantification of maintenance action effects on system health via liquid Kolmogorov–Arnold operator based framework',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Phuc Do, Kamal Medjaher',
    venue: 'Reliability Engineering & System Safety, 112898',
    topic: 'Maintenance effects · Interpretable operators',
    links: [{ label: 'Publisher', href: 'https://doi.org/10.1016/j.ress.2026.112898' }],
  },
  {
    id: 'j8',
    kind: 'Journal',
    year: 2026,
    title: 'Interpretable Health Indicators Construction Under Complex Scenarios for Comprehensive Multi-Component System Monitoring',
    authors: 'Duc An Nguyen, Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher',
    venue: 'ASCE-ASME Journal of Risk and Uncertainty in Engineering Systems, Part B',
    topic: 'Health indicators · Multi-component systems',
    links: [{ label: 'Publisher', href: 'https://doi.org/10.1115/1.4071056' }],
  },
  {
    id: 'j7',
    kind: 'Journal',
    year: 2026,
    title: 'Physics-informed transfer learning by embedding physics into activation functions: an application in battery health management',
    authors: 'Hung Le, Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher, Christian Gogu, Dazhong Wu',
    venue: 'Applied Energy 406, 127161',
    topic: 'Physics-informed transfer learning · Batteries',
    links: [{ label: 'Publisher', href: 'https://doi.org/10.1016/j.apenergy.2025.127161' }],
  },
  {
    id: 'j9',
    kind: 'Journal',
    year: 2025,
    title: 'E2E Gated-Mamba for cross-scenarios prognostics',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Christian Gogu, Kamal Medjaher, Jérôme Morio',
    venue: 'Mechatronics 111, 103361',
    topic: 'State-space models · Cross-scenario prognostics',
    links: [
      { label: 'Publisher', href: 'https://doi.org/10.1016/j.mechatronics.2025.103361' },
      { label: 'Manuscript', href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5101343' },
    ],
  },
  {
    id: 'j6',
    kind: 'Journal',
    year: 2025,
    title: 'In-situ piezoelectric sensors for structural health monitoring with machine learning integration',
    authors: 'Rogers K. Langat, Weikun Deng, Emmanuel De Luycker, Arthur Cantarel, Micky Rakotondrabe',
    venue: 'Mechatronics 106, 103297',
    topic: 'In-situ sensing · Structural health monitoring',
    links: [
      { label: 'Publisher', href: 'https://doi.org/10.1016/j.mechatronics.2025.103297' },
      { label: 'Full text', href: 'https://drive.google.com/uc?export=download&id=1jBoTiWSnwfM4fQdLhUBzCPcJ2bxOTmiF', download: true },
    ],
  },
  {
    id: 'j4',
    kind: 'Journal',
    year: 2025,
    title: 'A Generic Physics-Informed Machine Learning Framework for Battery Remaining Useful Life Prediction Using Small Early-Stage Lifecycle Data',
    authors: 'Weikun Deng, Hung Le, Christian Gogu, Khanh T. P. Nguyen, Kamal Medjaher, Jérôme Morio, Dazhong Wu',
    venue: 'Applied Energy 384, 125314',
    topic: 'Physics-informed learning · Battery RUL',
    links: [
      { label: 'Publisher', href: 'https://doi.org/10.1016/j.apenergy.2025.125314' },
      { label: 'Full text', href: 'https://drive.google.com/uc?export=download&id=1PWbZrgvd4PgEuJhENpm72pMw30nVdsem', download: true },
      { label: 'Code', href: 'https://github.com/pimlphm/PIML-benchmark-architecture' },
    ],
  },
  {
    id: 'j5',
    kind: 'Journal',
    year: 2024,
    title: 'Enhancing Prognostics for Sparse Labeled Data Using Advanced Contrastive Self-Supervised Learning with Downstream Integration',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher, Christian Gogu, Jérôme Morio',
    venue: 'Engineering Applications of Artificial Intelligence 138, 109268',
    topic: 'Contrastive self-supervision · Sparse labels',
    links: [{ label: 'Publisher', href: 'https://doi.org/10.1016/j.engappai.2024.109268' }],
  },
  {
    id: 'j3',
    kind: 'Journal',
    year: 2024,
    title: 'Physics-informed machine learning model for inverse dynamics in robotic manipulators',
    authors: 'Weikun Deng, Fabio Ardiani, Khanh T. P. Nguyen, Mourad Benoussaad, Kamal Medjaher',
    venue: 'Applied Soft Computing 163, 111877',
    topic: 'Inverse dynamics · Robotics',
    links: [{ label: 'Publisher', href: 'https://doi.org/10.1016/j.asoc.2024.111877' }],
  },
  {
    id: 'j2',
    kind: 'Journal',
    year: 2023,
    title: 'Rotor dynamics informed deep learning for detection, identification, and localization of shaft crack and unbalance defects',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher, Christian Gogu, Jérôme Morio',
    venue: 'Advanced Engineering Informatics 58, 102128',
    topic: 'Rotor dynamics · Fault diagnosis',
    links: [
      { label: 'Publisher', href: 'https://doi.org/10.1016/j.aei.2023.102128' },
      { label: 'Code', href: 'https://github.com/pimlphm/rfemnn-rotor-diagnostics' },
    ],
  },
  {
    id: 'j1',
    kind: 'Journal',
    year: 2023,
    title: 'Physics-informed machine learning in prognostics and health management: State of the art and challenges',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher, Christian Gogu, Jérôme Morio',
    venue: 'Applied Mathematical Modelling 124, 325–352',
    topic: 'Review · Physics-informed machine learning',
    links: [{ label: 'Publisher', href: 'https://doi.org/10.1016/j.apm.2023.07.011' }],
  },
  {
    id: 'j10',
    kind: 'Journal',
    year: 2023,
    title: 'Running Condition Identification of High-speed Shaft Based on Shaft-end-data Driven LSTM-CNN',
    authors: 'Yi Cong, Jianjun Du, Jixiong Yin, Haibin Zhu, Weikun Deng, Baoliang Bai, Congyi Fu',
    venue: 'Journal of Mechanical Engineering 59(1), 131–140',
    topic: 'High-speed shafts · Condition identification',
    links: [
      { label: 'Article', href: 'https://qikan.cmes.org/jxgcxb/EN/10.3901/JME.2023.01.131' },
      { label: 'Full text', href: 'https://qikan.cmes.org/jxgcxb/EN/PDF/10.3901/JME.2023.01.131', download: true },
    ],
  },
  {
    id: 'c7',
    kind: 'Conference',
    year: 2025,
    title: 'Towards convexity-aware physics-informed machine learning: A framework for reliable prognostics',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher',
    venue: 'Technological Systems, Sustainability and Safety Conference (TS3), Paris',
    topic: 'Convexity-aware learning · Prognostics',
    links: [{ label: 'Open record', href: 'https://hal.science/hal-05384813' }],
  },
  {
    id: 'c6',
    kind: 'Conference',
    year: 2025,
    title: 'Interpretable Maintenance Impact Quantification Using JEPA-KAN with Self-Supervised Contrastive Learning: An Aircraft Case Study',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Phuc Do, Kamal Medjaher',
    venue: 'MIMAR 2025',
    topic: 'Maintenance impact · Interpretable learning',
    links: [
      { label: 'Programme', href: 'https://easychair.org/smart-program/MIMAR2025/2025-07-08.html' },
      { label: 'Author copy', href: 'https://drive.google.com/uc?export=download&id=1M9pUarQUPyLVTQImCNUBev-z8-gT1MbV', download: true },
    ],
  },
  {
    id: 'c5',
    kind: 'Conference',
    year: 2024,
    title: 'A Novel PIML Architecture with Innovative Learning Paradigm Applied in Battery Prognostics',
    authors: 'Weikun Deng, Hung Le, Dazhong Wu, Khanh T. P. Nguyen, Christian Gogu, Jérôme Morio, Kamal Medjaher',
    venue: 'CoDIT 2024',
    topic: 'Physics-informed learning · Batteries',
    links: [
      { label: 'Publisher', href: 'https://doi.org/10.1109/CoDIT62066.2024.10708278' },
      { label: 'Code', href: 'https://github.com/pimlphm/PIML-benchmark-architecture' },
    ],
  },
  {
    id: 'c4',
    kind: 'Conference',
    year: 2023,
    title: 'A Few-Shot Learning Framework for Rotor Unbalance and Shaft Crack Fault Diagnostic Based on Physics-Informed Neural Network',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Christian Gogu, Jérôme Morio, Kamal Medjaher',
    venue: 'Structural Health Monitoring 2023',
    topic: 'Few-shot learning · Rotor faults',
    links: [
      { label: 'Proceedings', href: 'https://doi.org/10.12783/shm2023/36985' },
      { label: 'Full text', href: 'https://dpi-proceedings.com/index.php/shm2023/article/download/36985/35560', download: true },
    ],
  },
  {
    id: 'c3',
    kind: 'Conference',
    year: 2023,
    title: 'Bearings RUL prediction based on contrastive self-supervised learning',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher, Christian Gogu, Jérôme Morio',
    venue: 'IFAC-PapersOnLine, 11906–11911',
    topic: 'Self-supervision · Bearing RUL',
    links: [
      { label: 'Publisher', href: 'https://doi.org/10.1016/j.ifacol.2023.10.604' },
      { label: 'Full text', href: 'https://drive.google.com/uc?export=download&id=1bPJJV6abv1gsP8BxUMYZc1XfPLl3H-8j', download: true },
    ],
  },
  {
    id: 'c2',
    kind: 'Conference',
    year: 2022,
    title: 'Physics Informed Self Supervised Learning for Fault Diagnostics and Prognostics in the Context of Sparse and Noisy Data',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Kamal Medjaher',
    venue: 'PHM Society European Conference 7(1), 574–576',
    topic: 'Self-supervision · Sparse and noisy data',
    links: [
      { label: 'Proceedings', href: 'https://doi.org/10.36001/phme.2022.v7i1.3298' },
      { label: 'Full text', href: 'https://drive.google.com/uc?export=download&id=1OKtikNifO667AD0fQggxjhSUVrhzpn1n', download: true },
    ],
  },
  {
    id: 'c1',
    kind: 'Conference',
    year: 2022,
    title: 'Physics-informed lightweight temporal convolution networks for fault prognostics associated to bearing stiffness degradation',
    authors: 'Weikun Deng, Khanh T. P. Nguyen, Christian Gogu, Jérôme Morio, Kamal Medjaher',
    venue: 'PHM Society European Conference 7(1), 118–125',
    topic: 'Temporal convolution · Bearing degradation',
    links: [
      { label: 'Proceedings', href: 'https://doi.org/10.36001/phme.2022.v7i1.3365' },
      { label: 'Full text', href: 'https://drive.google.com/uc?export=download&id=1QFrCa-tmHDd4mNYcOwKXwXYJ-jrBY1hS', download: true },
      { label: 'Code', href: 'https://github.com/pimlphm/Physics-informed-machine-learning-based-on-TCN' },
    ],
  },
  {
    id: 'thesis',
    kind: 'Thesis',
    year: 2024,
    title: 'Improving diagnostics and prognostics in sparse data and scarce knowledge conditions by physics-informed and self-supervised machine learning',
    authors: 'Weikun Deng',
    venue: 'Doctoral thesis · Toulouse INP, Université de Toulouse',
    topic: 'Physics-informed learning · Self-supervision · PHM',
    links: [{ label: 'Thesis & PDF', href: 'https://theses.hal.science/tel-04845497v1' }],
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

export default function Home() {
  const [filter, setFilter] = useState<'All' | PublicationKind>('All');
  const [query, setQuery] = useState('');

  const visiblePublications = useMemo(() => {
    const term = query.trim().toLowerCase();
    return publications.filter((publication) => {
      const matchesKind = filter === 'All' || publication.kind === filter;
      const haystack = `${publication.title} ${publication.authors} ${publication.venue} ${publication.topic}`.toLowerCase();
      return matchesKind && (!term || haystack.includes(term));
    });
  }, [filter, query]);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Weikun Deng — home">
          <span className="wordmark-mark">WD</span>
          <span>Weikun Deng</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#work">Research</a>
          <a href="#publications">Publications</a>
          <a href="#code">Source code</a>
          <a href="#life">Beyond research</a>
        </nav>
        <ExternalLink className="nav-cta" href="https://github.com/pimlphm">GitHub</ExternalLink>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Intelligent manufacturing · PHM · Engineering AI</p>
          <h1>Engineering intelligence,<em> grounded in physics.</em></h1>
          <p className="hero-intro">
            I am <strong>Weikun DENG 邓炜坤</strong>, an interdisciplinary researcher whose
            published work spans physics-informed machine learning, diagnostics,
            prognostics and intelligent maintenance for complex engineering systems.
          </p>
          <div className="appointment-note">
            <span className="appointment-date">01 · 09 · 2026</span>
            <p>
              Assistant Professor in Intelligent Manufacturing &amp; Systems Engineering at
              <strong> City University of Hong Kong (Dongguan)</strong> from 1 September 2026.
            </p>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore the work <span>↓</span></a>
            <a className="button button-ghost" href="#publications">Browse publications</a>
          </div>
          <div className="profile-links" aria-label="Research profiles">
            <ExternalLink href="https://scholar.google.com/citations?user=mTYJRFwAAAAJ&hl=en">Google Scholar</ExternalLink>
            <ExternalLink href="https://dblp.org/pid/363/0767.html">DBLP</ExternalLink>
            <ExternalLink href="https://www.scopus.com/authid/detail.uri?authorId=58529504100">Scopus</ExternalLink>
          </div>
        </div>

        <div className="portrait-stage" aria-label="Portrait of Weikun Deng">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="portrait-frame"><img src="/images/weikun-deng.jpg" alt="Weikun Deng" /></div>
          <div className="signal-card signal-card-top"><span>Published record</span><strong>11 journal articles</strong></div>
          <div className="signal-card signal-card-bottom"><span>Inventive work</span><strong>4 granted patents</strong></div>
        </div>
      </section>

      <section className="research-strip" id="work">
        <div className="strip-heading">
          <p className="eyebrow"><span /> Published research threads</p>
          <h2>From physical evidence<br />to engineering decisions.</h2>
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

      <section className="evidence-section">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> Selected visual evidence</p><h2>Methods you can see.</h2></div>
          <p>Figures from published articles reveal the path from engineering mechanism, through representation, to a measurable diagnostic or prognostic result.</p>
        </div>
        <div className="motion-grid" aria-label="Animated engineering studies">
          <a className="motion-card" href="https://doi.org/10.1016/j.aei.2023.102128" target="_blank" rel="noreferrer">
            <div className="motion-visual"><img src="/research/twin-rotor.gif" alt="Animated twin-rotor finite-element model" loading="lazy" /></div>
            <div><span>Motion study 01</span><h3>Twin-rotor dynamics</h3><p>Model motion from the rotor-diagnostics research archive.</p></div>
          </a>
          <a className="motion-card" href="https://theses.hal.science/tel-04845497v1" target="_blank" rel="noreferrer">
            <div className="motion-visual"><img src="/research/aero-engine-cutaway.gif" alt="Animated cutaway of an aero-engine" loading="lazy" /></div>
            <div><span>Motion study 02</span><h3>Aero-engine mechanisms</h3><p>A cutaway view used to communicate past rotor-system studies.</p></div>
          </a>
        </div>
        <div className="evidence-grid">
          {researchFigures.map((figure) => (
            <article className="evidence-card" key={figure.number}>
              <a className="evidence-image" href={figure.href} target="_blank" rel="noreferrer">
                <img src={figure.image} alt={figure.alt} loading="lazy" />
                <span className="scan-line" aria-hidden="true" />
                <span className="figure-number">{figure.number}</span>
              </a>
              <div className="evidence-copy">
                <p>{figure.kicker}</p><h3>{figure.title}</h3><span>{figure.detail}</span>
                <ExternalLink href={figure.href}>Open article</ExternalLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="publications-section" id="publications">
        <div className="section-heading publications-heading">
          <div><p className="eyebrow"><span /> Publications</p><h2>The complete public record.</h2></div>
          <p>11 journal articles · 7 conference contributions · doctoral thesis</p>
        </div>

        <div className="scholar-impact" aria-label={`Google Scholar impact snapshot, ${scholarProfile.synced}`}>
          <a className="scholar-impact-source" href={scholarProfile.href} target="_blank" rel="noreferrer">
            <span>Google Scholar</span>
            <strong>Impact snapshot</strong>
            <small>Synced {scholarProfile.synced} · {scholarProfile.distinctOutputs} distinct published outputs</small>
          </a>
          <div className="scholar-metric"><strong>{scholarProfile.citations}</strong><span>Citations</span></div>
          <div className="scholar-metric"><strong>{scholarProfile.hIndex}</strong><span>h-index</span></div>
          <div className="scholar-metric"><strong>{scholarProfile.i10Index}</strong><span>i10-index</span></div>
        </div>

        <div className="publication-tools">
          <div className="filter-group" aria-label="Filter publications">
            {(['All', 'Journal', 'Conference', 'Thesis'] as const).map((option) => (
              <button className={filter === option ? 'filter-button active' : 'filter-button'} key={option} onClick={() => setFilter(option)} type="button">{option}</button>
            ))}
          </div>
          <label className="search-box">
            <span className="sr-only">Search publications</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, venue, topic…" type="search" />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>

        <div className="publication-count" aria-live="polite">{visiblePublications.length} {visiblePublications.length === 1 ? 'record' : 'records'}</div>
        <div className="publication-list">
          {visiblePublications.map((publication) => {
            const scholarImpact = scholarImpactByPublication[publication.id];
            return (
            <article className="publication-row" key={publication.id}>
              <div className="publication-meta"><span>{publication.year}</span><span>{publication.kind}</span></div>
              <div className="publication-main">
                <p className="publication-topic">{publication.topic}</p>
                <h3>{publication.title}</h3>
                <p className="authors"><NameHighlighted authors={publication.authors} /></p>
                <p className="venue">{publication.venue}</p>
              </div>
              <div className="publication-links">
                {scholarImpact && (
                  <a className="publication-impact" href={scholarImpact.href} target="_blank" rel="noreferrer">
                    <strong>{scholarImpact.citations}</strong>
                    <span>{scholarImpact.citations === 1 ? 'citation' : 'citations'} · Scholar ↗</span>
                  </a>
                )}
                {publication.links.map((link) => (
                  <a href={link.href} key={`${publication.id}-${link.label}`} target="_blank" rel="noreferrer" download={link.download || undefined}>{link.label} <span aria-hidden="true">↗</span></a>
                ))}
              </div>
            </article>
            );
          })}
          {visiblePublications.length === 0 && <p className="empty-state">No records match that search.</p>}
        </div>
        <p className="rights-note">Scholar counts are a dated snapshot and will change over time. Records are matched by final title and DOI, with duplicate or non-final versions omitted. Full-text buttons point to open or author-shared copies.</p>
      </section>

      <section className="code-section" id="code">
        <div className="code-orbit" aria-hidden="true">
          <span className="code-node node-a" /><span className="code-node node-b" /><span className="code-node node-c" /><span className="code-center">&lt;/&gt;</span>
        </div>
        <div className="section-heading code-heading">
          <p className="eyebrow"><span /> Selected source code</p>
          <h2>Implementations<br />linked to the papers.</h2>
          <p>Four public repositories sit beside the exact publication they support. Each repository states its scope, inputs and known limitations.</p>
          <div className="code-facts" aria-label="Repository collection summary">
            <span>04 public repositories</span><span>Paper-level links</span><span>Documented scope</span>
          </div>
        </div>
        <div className="code-grid">
          {codeProjects.map((project, index) => (
            <article className="code-card" key={project.title}>
              <div className="code-card-top"><span>{project.tag}</span><span>0{index + 1}</span></div>
              <h3>{project.title}</h3><p>{project.description}</p>
              <div className="code-links"><ExternalLink href={project.repo}>Repository</ExternalLink><ExternalLink href={project.paper}>Paper</ExternalLink></div>
            </article>
          ))}
        </div>
      </section>

      <section className="path-section" id="path">
        <div className="section-heading path-heading">
          <div><p className="eyebrow"><span /> Path</p><h2>Across mechanics,<br />sensing and learning.</h2></div>
          <p>A research path built through mechanical systems, experimental monitoring and machine learning across China, France and the United States.</p>
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
          <p className="eyebrow"><span /> Recognition</p><h2>Selected awards.</h2>
          <div className="achievement-list">
            {achievements.map((achievement) => <article key={achievement.title}><p>{achievement.label}</p><h3>{achievement.title}</h3></article>)}
          </div>
        </div>
        <div className="recognition-column patent-column">
          <p className="eyebrow"><span /> Invention</p><h2>Four granted patents.</h2>
          <div className="patent-list">
            {patents.map(([number, title]) => <article key={number}><span>{number}</span><p>{title}</p></article>)}
          </div>
        </div>
      </section>

      <section className="life-section" id="life">
        <div className="section-heading life-heading"><p className="eyebrow"><span /> Beyond research</p><h2>Stories, rallies<br />and open roads.</h2></div>
        <div className="hobby-grid">
          <article className="hobby-card novel-card">
            <div className="hobby-visual books" aria-hidden="true"><span /><span /><span /><span /></div>
            <div><span className="hobby-index">01 · Novels</span><h3>Long-form worlds</h3><p>Reading fiction for its characters, structures and ability to make another world feel internally true.</p></div>
          </article>
          <article className="hobby-card badminton-card">
            <div className="hobby-visual shuttle-stage" aria-hidden="true"><span className="shuttle-head" /><span className="shuttle-feather feather-one" /><span className="shuttle-feather feather-two" /><span className="shuttle-feather feather-three" /></div>
            <div><span className="hobby-index">02 · Badminton</span><h3>Precision at speed</h3><p>A game of timing, fast recovery and finding the angle hidden inside a rally.</p></div>
          </article>
          <article className="hobby-card cycling-card">
            <div className="hobby-visual bicycle" aria-hidden="true"><span className="wheel wheel-left" /><span className="wheel wheel-right" /><span className="bike-frame" /><span className="bike-line" /></div>
            <div><span className="hobby-index">03 · Cycling</span><h3>Distance, one turn at a time</h3><p>Long rides for changing terrain, steady rhythm and the clarity that arrives between destinations.</p></div>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div><p className="eyebrow"><span /> Connect</p><h2>Weikun DENG <em>邓炜坤</em></h2><p>Engineering intelligence, grounded in physics.</p></div>
        <div className="footer-links">
          <ExternalLink href="https://github.com/pimlphm">GitHub</ExternalLink>
          <ExternalLink href="https://scholar.google.com/citations?user=mTYJRFwAAAAJ&hl=en">Scholar</ExternalLink>
          <ExternalLink href="https://www.researchgate.net/profile/Weikun-Deng">ResearchGate</ExternalLink>
          <ExternalLink href="https://www.scopus.com/authid/detail.uri?authorId=58529504100">Scopus</ExternalLink>
        </div>
        <p className="footer-note">© 2026 Weikun Deng · Built as a lightweight, accessible static site.</p>
      </footer>
    </main>
  );
}
