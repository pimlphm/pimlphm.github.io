import type { Metadata } from 'next';
import Home from '../home';

export const metadata: Metadata = {
  title: '邓炜坤 | 工程智能与物理信息机器学习',
  description: '邓炜坤的学术主页：物理信息机器学习、故障诊断、寿命预测与智能运维。',
  alternates: {
    canonical: '/zh/',
    languages: {
      en: '/',
      'zh-CN': '/zh/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/zh/',
    title: '邓炜坤 | 工程智能与物理信息机器学习',
    description: '物理信息机器学习、故障诊断、寿命预测与智能运维。',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: '邓炜坤——以物理为基，构建工程智能。' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '邓炜坤 | 工程智能与物理信息机器学习',
    description: '物理信息机器学习、故障诊断、寿命预测与智能运维。',
    images: ['/og.jpg'],
  },
};

export default function ChinesePage() {
  return <Home language="zh" />;
}
