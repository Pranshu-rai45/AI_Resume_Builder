import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, CheckCircle2, Star, Play,
  FileText, BarChart2, Download, Sparkles, Shield, Clock,
  ChevronDown, ExternalLink, Award, Users, TrendingUp
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

// ─── Data ────────────────────────────────────────────────────────────────────
const features = [
  { icon: Sparkles, title: 'AI-Powered Content', desc: 'Generate professional summaries, experience bullets, and cover letters using Google Gemini AI.', color: 'from-blue-500 to-blue-600' },
  { icon: BarChart2, title: 'ATS Optimization', desc: 'Real-time ATS scoring with keyword analysis, missing keywords detection, and improvement suggestions.', color: 'from-purple-500 to-purple-600' },
  { icon: FileText, title: 'Professional Templates', desc: '5 stunning templates — Modern, Professional, Minimal, Creative, and Corporate.', color: 'from-emerald-500 to-emerald-600' },
  { icon: Download, title: 'Instant PDF Export', desc: 'Download your resume as a perfectly formatted PDF with one click.', color: 'from-amber-500 to-amber-600' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication, encrypted storage, and full data ownership.', color: 'from-rose-500 to-rose-600' },
  { icon: Clock, title: 'Autosave Every 3s', desc: 'Never lose your work. Auto-saves every 3 seconds as you type.', color: 'from-cyan-500 to-cyan-600' },
];

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and fill in your personal details, education, and work experience.' },
  { step: '02', title: 'Let AI Enhance It', desc: 'Use AI to generate compelling summaries, experience descriptions, and achievements.' },
  { step: '03', title: 'Check Your ATS Score', desc: 'Get an instant ATS score with specific improvement recommendations.' },
  { step: '04', title: 'Download & Apply', desc: 'Choose a template, download as PDF, and start applying to your dream jobs.' },
];

const templates = [
  { name: 'Modern', color: '#2563EB', desc: 'Clean lines with bold typography' },
  { name: 'Professional', color: '#7C3AED', desc: 'Traditional layout, modern finish' },
  { name: 'Minimal', color: '#10B981', desc: 'Simple elegance, maximum impact' },
  { name: 'Creative', color: '#F59E0B', desc: 'Stand out with unique design' },
  { name: 'Corporate', color: '#EF4444', desc: 'Executive presence, polished look' },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'Software Engineer at Google', avatar: 'SJ', text: 'I landed my dream job at Google using ResumeAI. The ATS optimization was a game-changer — my score went from 34 to 91!', rating: 5 },
  { name: 'Marcus Chen', role: 'Product Manager at Meta', avatar: 'MC', text: 'The AI-generated content was incredibly professional. It saved me hours of writing and the result was better than anything I could write myself.', rating: 5 },
  { name: 'Priya Sharma', role: 'Data Scientist at Amazon', avatar: 'PS', text: "The templates are stunning and the PDF export is pixel-perfect. I've recommended ResumeAI to my entire team.", rating: 5 },
];

const pricing = [
  {
    name: 'Free', price: '$0', period: 'Forever', color: 'from-slate-600 to-slate-700',
    features: ['3 Resumes', '10 AI Generations/month', '5 Templates', 'ATS Checker', 'PDF Export', 'Email Support'],
    cta: 'Get Started Free', highlight: false
  },
  {
    name: 'Pro', price: '$9', period: '/month', color: 'from-blue-600 to-purple-700',
    features: ['Unlimited Resumes', 'Unlimited AI Generations', 'All Templates', 'Advanced ATS Checker', 'PDF Export & Print', 'Priority Support', 'Custom Colors', 'Cover Letter Generator'],
    cta: 'Start Pro Trial', highlight: true, badge: 'Most Popular'
  },
  {
    name: 'Enterprise', price: '$29', period: '/month', color: 'from-purple-700 to-rose-700',
    features: ['Everything in Pro', 'Team Collaboration', 'Admin Dashboard', 'Analytics & Reports', 'API Access', 'White Label', 'Dedicated Support', 'Custom Integrations'],
    cta: 'Contact Sales', highlight: false
  },
];

const faqs = [
  { q: 'Is ResumeAI really free?', a: 'Yes! Our free plan lets you create up to 3 resumes with 10 AI generations per month. No credit card required.' },
  { q: 'How does the ATS score work?', a: 'Our algorithm analyzes your resume for keyword density, formatting, contact information, quantifiable achievements, and more — mirroring how real ATS systems evaluate resumes.' },
  { q: 'Can I download my resume as a PDF?', a: 'Yes! All plans include PDF export. Simply click the Download button in the resume builder to get a perfectly formatted PDF.' },
  { q: 'Which AI model powers the content generation?', a: 'We use Google Gemini 1.5 Flash, one of the fastest and most capable AI models, to generate professional, ATS-optimized resume content.' },
  { q: 'How many templates are available?', a: "We offer 5 professionally designed templates: Modern, Professional, Minimal, Creative, and Corporate. All are ATS-friendly." },
  { q: 'Is my data secure?', a: 'Absolutely. We use JWT authentication, encrypted databases, and never share your data with third parties. You own your data completely.' },
];

// ─── Sub Components ───────────────────────────────────────────────────────────
const Section = ({ id, className = '', children }) => (
  <section id={id} className={`section-padding ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

const SectionHeader = ({ badge, title, subtitle }) => (
  <div className="text-center mb-16">
    {badge && (
      <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
        <Sparkles size={14} />
        {badge}
      </motion.div>
    )}
    <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
        {subtitle}
      </motion.p>
    )}
  </div>
);

// ─── Floating Resume Illustration ────────────────────────────────────────────
const ResumeIllustration = () => (
  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    className="relative"
  >
    <div className="w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10 bg-white relative">
      {/* Resume preview content */}
      <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-700 flex items-end px-4 pb-3">
        <div>
          <div className="w-20 h-2.5 bg-white/80 rounded mb-1.5" />
          <div className="w-14 h-1.5 bg-white/50 rounded" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        {[['Experience', 'w-16'], ['Summary', 'w-20']].map(([label, w]) => (
          <div key={label}>
            <div className={`${w} h-2 bg-blue-500/60 rounded mb-2`} />
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-gray-200 rounded" />
              <div className="w-5/6 h-1.5 bg-gray-200 rounded" />
              <div className="w-4/6 h-1.5 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
        <div>
          <div className="w-12 h-2 bg-blue-500/60 rounded mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {['React', 'Node.js', 'Python', 'AWS', 'Docker'].map(skill => (
              <div key={skill} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{skill}</div>
            ))}
          </div>
        </div>
      </div>
      {/* ATS Score badge */}
      <div className="absolute -top-3 -right-3 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white animate-bounce-gentle">
        <div className="text-center">
          <div className="text-white font-bold text-sm">94</div>
          <div className="text-white/80 text-xs leading-none">ATS</div>
        </div>
      </div>
    </div>
    {/* Floating elements */}
    <motion.div
      animate={{ x: [0, 6, 0], y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      className="absolute -bottom-6 -left-8 glass rounded-xl px-3 py-2 border border-white/15 shadow-xl"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">AI Generated</div>
          <div className="text-xs text-slate-400">Summary ready!</div>
        </div>
      </div>
    </motion.div>
    <motion.div
      animate={{ x: [0, -5, 0], y: [0, 5, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      className="absolute -top-4 -left-10 glass rounded-xl px-3 py-1.5 border border-white/15 shadow-xl"
    >
      <div className="flex items-center gap-1.5 text-emerald-400">
        <CheckCircle2 size={12} />
        <span className="text-xs font-medium">ATS Optimized</span>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
const Landing = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bg-orb w-96 h-96 bg-blue-600 top-1/4 -left-48" style={{ animationDelay: '0s' }} />
          <div className="bg-orb w-80 h-80 bg-purple-700 top-1/3 right-0" style={{ animationDelay: '2s' }} />
          <div className="bg-orb w-64 h-64 bg-cyan-600 bottom-1/4 left-1/3" style={{ animationDelay: '4s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <Zap size={14} className="fill-blue-400" />
                Powered by Google Gemini AI
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                Build Your{' '}
                <span className="gradient-text">Dream Resume</span>
                {' '}with AI
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Generate ATS-friendly, professional resumes in minutes using artificial intelligence. Land more interviews, get your dream job.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={<Zap size={18} />}>
                    Get Started Free
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" icon={<Play size={18} />}>
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                {[
                  { icon: Users, text: '50,000+ resumes created' },
                  { icon: Star, text: '4.9/5 rating' },
                  { icon: Shield, text: 'Free forever plan' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={14} className="text-blue-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <ResumeIllustration />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown size={18} />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-white/6 bg-white/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Resumes Created', icon: FileText },
              { value: '94%', label: 'Avg ATS Score', icon: TrendingUp },
              { value: '10K+', label: 'Jobs Landed', icon: Award },
              { value: '4.9⭐', label: 'User Rating', icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text-blue mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <Section id="features">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <SectionHeader
            badge="Features"
            title="Everything You Need to Land Your Dream Job"
            subtitle="AI-powered tools that transform your career story into an irresistible resume."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/30"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section id="how-it-works" className="bg-white/2">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <SectionHeader
            badge="How It Works"
            title="From Blank Page to Dream Job in 4 Steps"
            subtitle="Our streamlined process gets you from zero to interview-ready in under 30 minutes."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
            {steps.map(({ step, title, desc }, i) => (
              <motion.div key={step} variants={fadeUp} className="relative text-center">
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <span className="text-white font-bold text-lg">{step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── TEMPLATES ── */}
      <Section id="templates">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <SectionHeader
            badge="Templates"
            title="5 Professional Templates"
            subtitle="ATS-optimized, beautifully designed templates to make your resume stand out."
          />
          <div className="flex flex-wrap justify-center gap-4">
            {templates.map(({ name, color, desc }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="w-40 md:w-48 group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-xl border-2 border-white/10 group-hover:border-white/30 overflow-hidden mb-3 transition-all duration-300 shadow-lg group-hover:shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)` }}>
                  <div style={{ background: color }} className="h-12 flex items-center px-3">
                    <div className="space-y-1">
                      <div className="w-16 h-1.5 bg-white/70 rounded" />
                      <div className="w-10 h-1 bg-white/40 rounded" />
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`h-1 bg-white/20 rounded`} style={{ width: `${90 - i * 8}%` }} />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-semibold text-white text-center">{name}</p>
                <p className="text-xs text-slate-500 text-center mt-0.5">{desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} className="text-center mt-10">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Try All Templates Free
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section id="testimonials" className="bg-white/2">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <SectionHeader
            badge="Testimonials"
            title="Loved by Job Seekers Worldwide"
            subtitle="Join thousands who've landed their dream jobs with ResumeAI."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── PRICING ── */}
      <Section id="pricing">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <SectionHeader
            badge="Pricing"
            title="Simple, Transparent Pricing"
            subtitle="Start free. Upgrade when you're ready. No hidden fees."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map(({ name, price, period, color, features: feats, cta, highlight, badge }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className={`relative rounded-2xl p-6 transition-all duration-300 ${
                  highlight
                    ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20'
                    : 'glass border border-white/10'
                }`}
              >
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-xs font-semibold">
                    {badge}
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold gradient-text-blue">{price}</span>
                  <span className="text-slate-400 text-sm">{period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {feats.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button variant={highlight ? 'primary' : 'secondary'} className="w-full">
                    {cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── FAQ ── */}
      <Section id="faq" className="bg-white/2">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <SectionHeader
            badge="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about ResumeAI."
          />
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map(({ q, a }, i) => (
              <motion.div key={i} variants={fadeUp} className="glass rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-white text-sm md:text-base">{q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 flex-shrink-0 ml-3 transition-transform ${openFAQ === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFAQ === i && (
                  <div className="px-5 pb-4">
                    <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Land Your{' '}
              <span className="gradient-text">Dream Job?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join 50,000+ professionals who built their resumes with ResumeAI.
            </p>
            <Link to="/register">
              <Button variant="primary" size="xl">
                Build Your Resume Now — It's Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <p className="text-slate-500 text-sm mt-4">No credit card required. Start in 60 seconds.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap size={14} className="text-white fill-white" />
                </div>
                <span className="font-bold gradient-text-blue">ResumeAI</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Build your dream resume with the power of AI. Land more interviews, get hired faster.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'ATS Checker'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-white mb-3 text-sm">{title}</h4>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-sm">© 2026 ResumeAI. All rights reserved.</p>
            <p className="text-slate-600 text-sm">Built with ❤️ using React, Node.js & Google Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
