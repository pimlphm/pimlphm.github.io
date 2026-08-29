'use client';

/* eslint-disable @next/next/no-img-element -- Shared with the static GitHub Pages build; GIFs must remain animated. */

import { useEffect, useMemo, useState } from 'react';
import scholarData from '../data/scholar.json';

type Language = 'en' | 'zh';
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

const uiCopy = {
  en: {
    homeAria: 'Weikun Deng — home',
    navigationAria: 'Primary navigation',
    languageAria: 'Choose language',
    english: 'EN',
    chinese: '中文',
    navResearch: 'Research',
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
    evidenceEyebrow: 'Selected visual evidence',
    evidenceHeading: 'Methods you can see.',
    evidenceIntro: 'Figures from published articles reveal the path from engineering mechanism, through representation, to a measurable diagnostic or prognostic result.',
    motionAria: 'Animated engineering studies',
    motionOneLabel: 'Motion study 01',
    motionOneTitle: 'Twin-rotor dynamics',
    motionOneDetail: 'Model motion from the rotor-diagnostics research archive.',
    motionOneAlt: 'Animated twin-rotor finite-element model',
    motionTwoLabel: 'Motion study 02',
    motionTwoTitle: 'Aero-engine mechanisms',
    motionTwoDetail: 'A cutaway view used to communicate past rotor-system studies.',
    motionTwoAlt: 'Animated cutaway of an aero-engine',
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
    codeHeadingOne: 'Implementations',
    codeHeadingTwo: 'linked to the papers.',
    codeIntro: 'Four public repositories sit beside the exact publication they support. Each repository states its scope, inputs and known limitations.',
    codeSummaryAria: 'Repository collection summary',
    publicRepositories: '04 public repositories',
    paperLinks: 'Paper-level links',
    documentedScope: 'Documented scope',
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
  },
  zh: {
    homeAria: '邓炜坤个人主页',
    navigationAria: '主导航',
    languageAria: '选择语言',
    english: 'EN',
    chinese: '中文',
    navResearch: '研究',
    navPublications: '论文成果',
    navCode: '开源代码',
    navLife: '研究之外',
    heroEyebrow: '智能制造 · 故障预测与健康管理 · 工程人工智能',
    heroTitle: '以物理为基，',
    heroEmphasis: '构建工程智能。',
    heroIntroBefore: '我是',
    heroIntroAfter: '一名跨学科研究者。我的已发表工作聚焦物理信息机器学习，以及复杂工程系统的故障诊断、寿命预测与智能运维。',
    appointmentBefore: '自 2026 年 9 月 1 日起任',
    appointmentInstitution: '香港城市大学（东莞）',
    appointmentAfter: '智能制造与系统工程助理教授。',
    exploreWork: '了解研究成果',
    browsePublications: '浏览论文',
    researchProfilesAria: '学术主页',
    portraitAria: '邓炜坤肖像',
    publishedRecord: '已发表成果',
    journalArticles: '11 篇期刊论文',
    inventiveWork: '授权发明',
    grantedPatents: '4 项授权专利',
    researchEyebrow: '已发表研究方向',
    researchHeadingOne: '从物理证据出发，',
    researchHeadingTwo: '走向工程决策。',
    evidenceEyebrow: '代表性成果图示',
    evidenceHeading: '让方法清晰可见。',
    evidenceIntro: '已发表论文中的图示呈现了从工程机理、特征表征到可量化诊断与预测结果的完整路径。',
    motionAria: '工程研究动图',
    motionOneLabel: '动态研究 01',
    motionOneTitle: '双转子动力学',
    motionOneDetail: '来自转子故障诊断研究档案的模型运动展示。',
    motionOneAlt: '双转子有限元模型动画',
    motionTwoLabel: '动态研究 02',
    motionTwoTitle: '航空发动机机理',
    motionTwoDetail: '用于阐释既往转子系统研究的航空发动机剖视动画。',
    motionTwoAlt: '航空发动机剖视动画',
    openArticle: '查看论文',
    publicationsEyebrow: '论文成果',
    publicationsHeading: '完整的公开成果记录。',
    publicationsSummary: '11 篇期刊论文 · 7 篇会议论文 · 1 篇博士论文',
    scholarAria: 'Google Scholar 学术影响力快照',
    impactSnapshot: '学术影响力概览',
    synced: '同步于',
    distinctOutputs: '项经去重的正式发表成果',
    citations: '总引用次数',
    hIndex: 'h-index',
    i10Index: 'i10-index',
    filterAria: '筛选论文成果',
    searchSr: '检索论文成果',
    searchPlaceholder: '检索题目、期刊/会议或研究主题…',
    record: '项成果',
    records: '项成果',
    citation: '次引用',
    citationsLower: '次引用',
    noRecords: '没有符合当前条件的成果。',
    rightsNote: 'Scholar 引用数据为定期同步快照，会随时间变化。成果按最终题名与 DOI 匹配，重复记录及非最终版本不会显示。论文题名与期刊名称保留原始出版语言；全文链接指向开放获取版本或作者共享版本。',
    codeEyebrow: '代表性开源代码',
    codeHeadingOne: '代码实现',
    codeHeadingTwo: '与论文逐项对应。',
    codeIntro: '四个公开代码仓库分别对应其支撑的论文，并说明适用范围、输入与已知限制。',
    codeSummaryAria: '代码仓库概览',
    publicRepositories: '04 个公开仓库',
    paperLinks: '论文逐项链接',
    documentedScope: '适用范围已说明',
    repository: '代码仓库',
    paper: '对应论文',
    pathEyebrow: '经历',
    pathHeadingOne: '贯通机械、感知',
    pathHeadingTwo: '与机器学习。',
    pathIntro: '在中国、法国和美国的学习与研究经历中，逐步形成了融合机械系统、实验监测和机器学习的研究路径。',
    recognitionEyebrow: '荣誉',
    recognitionHeading: '代表性奖项。',
    inventionEyebrow: '发明',
    inventionHeading: '四项授权专利。',
    lifeEyebrow: '研究之外',
    lifeHeadingOne: '小说、挥拍',
    lifeHeadingTwo: '与骑行远方。',
    novelLabel: '01 · 小说',
    novelTitle: '在长篇世界中漫游',
    novelDetail: '阅读小说，体会人物、结构，以及一个虚构世界如何建立自洽而真实的秩序。',
    badmintonLabel: '02 · 羽毛球',
    badmintonTitle: '速度中的精准',
    badmintonDetail: '在快速回位、时机判断与多拍对抗中，寻找隐藏的角度。',
    cyclingLabel: '03 · 骑行',
    cyclingTitle: '一圈一圈，走向远方',
    cyclingDetail: '长距离骑行让我感受地形变化、稳定节奏，以及两地之间逐渐清晰的思绪。',
    connect: '联系与主页',
    footerTagline: '立足物理机理的工程智能。',
    footerNote: '© 2026 邓炜坤 · 轻量、无障碍的静态学术主页。',
  },
} as const;

const publicationKindLabels: Record<Language, Record<'All' | PublicationKind, string>> = {
  en: { All: 'All', Journal: 'Journal', Conference: 'Conference', Thesis: 'Thesis' },
  zh: { All: '全部', Journal: '期刊论文', Conference: '会议论文', Thesis: '学位论文' },
};

const publicationLinkLabels: Record<Language, Record<string, string>> = {
  en: {},
  zh: {
    Publisher: '出版页面',
    Manuscript: '作者手稿',
    'Full text': '全文下载',
    Code: '代码',
    Article: '论文页面',
    'Open record': '公开记录',
    Programme: '会议日程',
    'Author copy': '作者版本',
    Proceedings: '会议论文集',
    'Thesis & PDF': '学位论文与 PDF',
  },
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

const chineseResearchThreads: Record<string, { title: string; detail: string }> = {
  '01': {
    title: '物理信息智能',
    detail: '以方程、机理与工程结构塑造学习架构。',
  },
  '02': {
    title: '故障诊断与寿命预测',
    detail: '面向旋转机械、电池及复杂监测系统开展健康状态评估。',
  },
  '03': {
    title: '少标签条件下的学习',
    detail: '针对稀疏、含噪及分布变化工况研究自监督学习与迁移学习。',
  },
};

const chineseResearchFigures: Record<string, { alt: string; kicker: string; title: string; detail: string }> = {
  '01': {
    alt: '转子模型与物理信息神经网络架构图',
    kicker: '转子系统 · 2023',
    title: '将力学机理转化为模型结构',
    detail: '面向轴裂纹与不平衡故障检测、识别和定位的转子动力学信息深度网络。',
  },
  '02': {
    alt: '轴承寿命预测的对比自监督学习流程',
    kicker: '轴承 · 2024',
    title: '在少标签条件下学习有效信号',
    detail: '将预任务学习与下游寿命预测相连接的对比自监督流程。',
  },
  '03': {
    alt: '机器人机械臂物理信息逆动力学模型',
    kicker: '机器人 · 2024',
    title: '以物理机理引导逆动力学',
    detail: '用于机器人机械臂逆动力学建模的结构化学习方法。',
  },
  '04': {
    alt: '噪声增强条件下的跨场景寿命预测结果',
    kicker: '跨场景 PHM · 2025',
    title: '适应多种运行场景',
    detail: '在变化的寿命预测场景中评估端到端门控状态空间架构。',
  },
};

const chinesePublicationTopics: Record<string, string> = {
  j11: '维护作用 · 可解释算子',
  j8: '健康指标 · 多部件系统',
  j7: '物理信息迁移学习 · 电池',
  j9: '状态空间模型 · 跨场景寿命预测',
  j6: '原位传感 · 结构健康监测',
  j4: '物理信息学习 · 电池剩余寿命',
  j5: '对比自监督学习 · 少标签',
  j3: '逆动力学 · 机器人',
  j2: '转子动力学 · 故障诊断',
  j1: '综述 · 物理信息机器学习',
  j10: '高速轴系 · 工况识别',
  c7: '凸性感知学习 · 可靠性预测',
  c6: '维护影响 · 可解释学习',
  c5: '物理信息学习 · 电池',
  c4: '少样本学习 · 转子故障',
  c3: '自监督学习 · 轴承剩余寿命',
  c2: '自监督学习 · 稀疏与噪声数据',
  c1: '时间卷积 · 轴承退化',
  thesis: '物理信息学习 · 自监督学习 · 故障预测与健康管理',
};

const chineseCodeProjects: Record<string, { tag: string; description: string }> = {
  'RFEMNN rotor diagnostics': {
    tag: '转子故障诊断',
    description: 'Advanced Engineering Informatics 论文所述转子动力学信息模型的整理复现代码。',
  },
  'PIML benchmark architecture': {
    tag: '电池寿命预测',
    description: '电池剩余寿命框架及其基准架构的配套代码。',
  },
  'Physics-informed TCN': {
    tag: '轴承寿命预测',
    description: '用于轴承寿命预测的轻量级物理信息时间卷积实现。',
  },
  'Machinery PHM tutorial': {
    tag: '学习资源',
    description: '面向机械装备故障预测与健康管理的实践型笔记本与示例集合。',
  },
};

const chineseCareer: Record<string, { role: string; place: string }> = {
  '2024—2026': { role: '研究助理', place: 'UTTOP / Université de Toulouse · 法国' },
  '2023—2024': { role: '访问研究员', place: 'University of Central Florida · 美国' },
  '2021—2024': { role: '工业工程博士', place: 'Toulouse INP, Université de Toulouse · 法国' },
  '2020—2021': { role: '诊断系统研发工程师', place: '浙江清华柔性电子技术研究院 · 中国' },
  '2017—2020': { role: '航空宇航推进理论与工程硕士', place: '西北工业大学 · 中国' },
  '2013—2017': { role: '飞行器动力工程学士', place: '西北工业大学 · 中国' },
};

const chineseAchievements: Record<string, { label: string; title: string }> = {
  'Chinese Government Award for Outstanding Self-financed Students Abroad': {
    label: '2023 · 奖项',
    title: '国家优秀自费留学生奖学金',
  },
  'IFAC World Congress Best Application Paper Prize Finalist': {
    label: '2023 · 荣誉',
    title: 'IFAC 世界大会最佳应用论文奖入围',
  },
  'PHME Doctoral Symposium Second Prize': {
    label: '2022 · 奖项',
    title: 'PHME 博士生论坛二等奖',
  },
};

const chinesePatents: Record<string, string> = {
  'CN202111014328.5': '轴系装配状态监测装置',
  'CN201710230773.2': '航空发动机转子早期积液故障识别方法',
  'CN201710230765.8': '基于故障基因的转子结构动力学反向设计方法',
  'CN201710230772.8': '航空发动机结构故障智能诊断方法',
};

const scholarMonthNumbers: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

function formatScholarDate(value: string, language: Language) {
  if (language === 'en') return value;
  const match = value.match(/^(\d{1,2})\s+([A-Z][a-z]{2})\s+(\d{4})$/);
  if (!match) return value;
  const [, day, monthName, year] = match;
  const month = scholarMonthNumbers[monthName];
  return month ? `${year} 年 ${month} 月 ${Number(day)} 日` : value;
}

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

export default function Home({ language }: { language: Language }) {
  const [filter, setFilter] = useState<'All' | PublicationKind>('All');
  const [query, setQuery] = useState('');
  const [sectionHash, setSectionHash] = useState('');
  const t = uiCopy[language];

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    const syncHash = () => setSectionHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [language]);

  const visiblePublications = useMemo(() => {
    const term = query.trim().toLowerCase();
    return publications.filter((publication) => {
      const matchesKind = filter === 'All' || publication.kind === filter;
      const haystack = `${publication.title} ${publication.authors} ${publication.venue} ${publication.topic} ${chinesePublicationTopics[publication.id] ?? ''}`.toLowerCase();
      return matchesKind && (!term || haystack.includes(term));
    });
  }, [filter, query]);

  return (
    <main data-language={language} lang={language === 'zh' ? 'zh-CN' : 'en'}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={t.homeAria}>
          <span className="wordmark-mark">WD</span>
          <span>Weikun Deng</span>
        </a>
        <nav className="nav-links" aria-label={t.navigationAria}>
          <a href="#work">{t.navResearch}</a>
          <a href="#publications">{t.navPublications}</a>
          <a href="#code">{t.navCode}</a>
          <a href="#life">{t.navLife}</a>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label={t.languageAria} role="group">
            <a aria-current={language === 'en' ? 'page' : undefined} className={language === 'en' ? 'active' : ''} href={`/${sectionHash}`} hrefLang="en" lang="en">{t.english}</a>
            <span aria-hidden="true">/</span>
            <a aria-current={language === 'zh' ? 'page' : undefined} className={language === 'zh' ? 'active' : ''} href={`/zh/${sectionHash}`} hrefLang="zh-CN" lang="zh-CN">{t.chinese}</a>
          </div>
          <ExternalLink className="nav-cta" href="https://github.com/pimlphm">GitHub</ExternalLink>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> {t.heroEyebrow}</p>
          <h1>{t.heroTitle}<em>{t.heroEmphasis}</em></h1>
          <p className="hero-intro">
            {t.heroIntroBefore}{language === 'zh' ? '' : ' '}<strong>{language === 'zh' ? '邓炜坤（Weikun DENG）' : 'Weikun DENG 邓炜坤'}</strong>{language === 'zh' ? '，' : ', '}{t.heroIntroAfter}
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
            <a className="button button-primary" href="#work">{t.exploreWork} <span>↓</span></a>
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
          <div className="portrait-frame"><img src="/images/weikun-deng.jpg" alt={language === 'zh' ? '邓炜坤' : 'Weikun Deng'} /></div>
          <div className="signal-card signal-card-top"><span>{t.publishedRecord}</span><strong>{t.journalArticles}</strong></div>
          <div className="signal-card signal-card-bottom"><span>{t.inventiveWork}</span><strong>{t.grantedPatents}</strong></div>
        </div>
      </section>

      <section className="research-strip" id="work">
        <div className="strip-heading">
          <p className="eyebrow"><span /> {t.researchEyebrow}</p>
          <h2>{t.researchHeadingOne}<br />{t.researchHeadingTwo}</h2>
        </div>
        <div className="thread-grid">
          {researchThreads.map((thread) => {
            const translated = language === 'zh' ? chineseResearchThreads[thread.index] : undefined;
            return (
              <article className="thread-card" key={thread.index}>
                <span className="thread-index">{thread.index}</span>
                <h3>{translated?.title ?? thread.title}</h3>
                <p>{translated?.detail ?? thread.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="evidence-section">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> {t.evidenceEyebrow}</p><h2>{t.evidenceHeading}</h2></div>
          <p>{t.evidenceIntro}</p>
        </div>
        <div className="motion-grid" aria-label={t.motionAria}>
          <a className="motion-card" href="https://doi.org/10.1016/j.aei.2023.102128" target="_blank" rel="noreferrer">
            <div className="motion-visual"><img src="/research/twin-rotor.gif" alt={t.motionOneAlt} loading="lazy" /></div>
            <div><span>{t.motionOneLabel}</span><h3>{t.motionOneTitle}</h3><p>{t.motionOneDetail}</p></div>
          </a>
          <a className="motion-card" href="https://theses.hal.science/tel-04845497v1" target="_blank" rel="noreferrer">
            <div className="motion-visual"><img src="/research/aero-engine-cutaway.gif" alt={t.motionTwoAlt} loading="lazy" /></div>
            <div><span>{t.motionTwoLabel}</span><h3>{t.motionTwoTitle}</h3><p>{t.motionTwoDetail}</p></div>
          </a>
        </div>
        <div className="evidence-grid">
          {researchFigures.map((figure) => {
            const translated = language === 'zh' ? chineseResearchFigures[figure.number] : undefined;
            return (
              <article className="evidence-card" key={figure.number}>
                <a className="evidence-image" href={figure.href} target="_blank" rel="noreferrer">
                  <img src={figure.image} alt={translated?.alt ?? figure.alt} loading="lazy" />
                  <span className="scan-line" aria-hidden="true" />
                  <span className="figure-number">{figure.number}</span>
                </a>
                <div className="evidence-copy">
                  <p>{translated?.kicker ?? figure.kicker}</p><h3>{translated?.title ?? figure.title}</h3><span>{translated?.detail ?? figure.detail}</span>
                  <ExternalLink href={figure.href}>{t.openArticle}</ExternalLink>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="publications-section" id="publications">
        <div className="section-heading publications-heading">
          <div><p className="eyebrow"><span /> {t.publicationsEyebrow}</p><h2>{t.publicationsHeading}</h2></div>
          <p>{t.publicationsSummary}</p>
        </div>

        <div className="scholar-impact" aria-label={`${t.scholarAria}${language === 'zh' ? '，' : ', '}${formatScholarDate(scholarProfile.synced, language)}`}>
          <a className="scholar-impact-source" href={scholarProfile.href} target="_blank" rel="noreferrer">
            <span>Google Scholar</span>
            <strong>{t.impactSnapshot}</strong>
            <small>{t.synced} {formatScholarDate(scholarProfile.synced, language)} · {scholarProfile.distinctOutputs} {t.distinctOutputs}</small>
          </a>
          <div className="scholar-metric"><strong>{scholarProfile.citations}</strong><span>{t.citations}</span></div>
          <div className="scholar-metric"><strong>{scholarProfile.hIndex}</strong><span>{t.hIndex}</span></div>
          <div className="scholar-metric"><strong>{scholarProfile.i10Index}</strong><span>{t.i10Index}</span></div>
        </div>

        <div className="publication-tools">
          <div className="filter-group" aria-label={t.filterAria}>
            {(['All', 'Journal', 'Conference', 'Thesis'] as const).map((option) => (
              <button aria-pressed={filter === option} className={filter === option ? 'filter-button active' : 'filter-button'} key={option} onClick={() => setFilter(option)} type="button">{publicationKindLabels[language][option]}</button>
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
              <div className="publication-meta"><span>{publication.year}</span><span>{publicationKindLabels[language][publication.kind]}</span></div>
              <div className="publication-main">
                <p className="publication-topic">{language === 'zh' ? chinesePublicationTopics[publication.id] ?? publication.topic : publication.topic}</p>
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
                  <a href={link.href} key={`${publication.id}-${link.label}`} target="_blank" rel="noreferrer" download={link.download || undefined}>{publicationLinkLabels[language][link.label] ?? link.label} <span aria-hidden="true">↗</span></a>
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
          <h2>{t.codeHeadingOne}<br />{t.codeHeadingTwo}</h2>
          <p>{t.codeIntro}</p>
          <div className="code-facts" aria-label={t.codeSummaryAria}>
            <span>{t.publicRepositories}</span><span>{t.paperLinks}</span><span>{t.documentedScope}</span>
          </div>
        </div>
        <div className="code-grid">
          {codeProjects.map((project, index) => {
            const translated = language === 'zh' ? chineseCodeProjects[project.title] : undefined;
            return (
              <article className="code-card" key={project.title}>
                <div className="code-card-top"><span>{translated?.tag ?? project.tag}</span><span>0{index + 1}</span></div>
                <h3>{project.title}</h3><p>{translated?.description ?? project.description}</p>
                <div className="code-links"><ExternalLink href={project.repo}>{t.repository}</ExternalLink><ExternalLink href={project.paper}>{t.paper}</ExternalLink></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="path-section" id="path">
        <div className="section-heading path-heading">
          <div><p className="eyebrow"><span /> {t.pathEyebrow}</p><h2>{t.pathHeadingOne}<br />{t.pathHeadingTwo}</h2></div>
          <p>{t.pathIntro}</p>
        </div>
        <div className="timeline">
          {career.map((item) => {
            const translated = language === 'zh' ? chineseCareer[item.year] : undefined;
            return (
              <article className="timeline-row" key={`${item.year}-${item.role}`}>
                <span className="timeline-year">{item.year}</span><div><h3>{translated?.role ?? item.role}</h3><p>{translated?.place ?? item.place}</p></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="recognition-section">
        <div className="recognition-column">
          <p className="eyebrow"><span /> {t.recognitionEyebrow}</p><h2>{t.recognitionHeading}</h2>
          <div className="achievement-list">
            {achievements.map((achievement) => {
              const translated = language === 'zh' ? chineseAchievements[achievement.title] : undefined;
              return <article key={achievement.title}><p>{translated?.label ?? achievement.label}</p><h3>{translated?.title ?? achievement.title}</h3></article>;
            })}
          </div>
        </div>
        <div className="recognition-column patent-column">
          <p className="eyebrow"><span /> {t.inventionEyebrow}</p><h2>{t.inventionHeading}</h2>
          <div className="patent-list">
            {patents.map(([number, title]) => <article key={number}><span>{number}</span><p>{language === 'zh' ? chinesePatents[number] ?? title : title}</p></article>)}
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
