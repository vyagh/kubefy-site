import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Box, Zap, Server, 
  Copy, Check, Github, ArrowRight, Star 
} from 'lucide-react';
import '../index.css';

// ============================================================================
// DATA
// ============================================================================

const DIRECTIVE_MAPPING = [
  { dockerfile: 'FROM node:18-alpine', k8s: 'node:18-alpine', k8sField: 'spec.containers[].image' },
  { dockerfile: 'EXPOSE 3000', k8s: '3000', k8sField: 'spec.containers[].ports[].containerPort' },
  { dockerfile: 'ENV NODE_ENV=production', k8s: 'NODE_ENV: production', k8sField: 'spec.containers[].env[]' },
  { dockerfile: 'CMD ["npm", "start"]', k8s: '["npm", "start"]', k8sField: 'spec.containers[].args' },
  { dockerfile: 'ENTRYPOINT ["node"]', k8s: '["node"]', k8sField: 'spec.containers[].command' },
  { dockerfile: 'WORKDIR /app', k8s: '/app', k8sField: 'spec.containers[].workingDir' },
];

const CLI_FLAGS = [
  { flag: '--name', short: '-n', description: 'Application name', default: '(required)' },
  { flag: '--namespace', short: '', description: 'Kubernetes namespace', default: 'default' },
  { flag: '--replicas', short: '-r', description: 'Number of replicas', default: '1' },
  { flag: '--output', short: '-o', description: 'Output directory', default: '.' },
  { flag: '--service-type', short: '', description: 'Service type', default: 'ClusterIP' },
  { flag: '--dry-run', short: '', description: 'Preview without writing', default: 'false' },
];

// ============================================================================
// HOOKS
// ============================================================================

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
};

const useTypingEffect = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// ============================================================================
// ICONS
// ============================================================================

const DockerLogo = () => (
  <img src="/docker-mark-blue.svg" alt="Docker" className="w-8 h-8" />
);

const KubernetesLogo = () => (
  <img src="/Kubernetes_logo_without_workmark.svg" alt="Kubernetes" className="w-8 h-8" />
);

const HexagonLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.3 7l8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

// ============================================================================
// COMPONENTS
// ============================================================================

const Navigation = () => (
  <nav className="nav-main">
    <div className="nav-content">
      <a href="/" className="nav-brand group">
        <HexagonLogo className="w-7 h-7 transition-transform group-hover:rotate-12 duration-300" />
        <span className="nav-brand-text">kubefy</span>
      </a>
      <div className="nav-links">
        <a href="#installation" className="nav-link">Install</a>
        <a href="#how-it-works" className="nav-link">How it Works</a>
        <a href="#compare" className="nav-link">Compare</a>
        <a href="#limitations" className="nav-link">Limitations</a>
        <a href="https://github.com/vyagh/kubefy" target="_blank" rel="noopener noreferrer" className="nav-star-btn">
          <Star className="w-4 h-4" />
          Star
        </a>
        <a href="https://github.com/vyagh/kubefy" target="_blank" rel="noopener noreferrer" className="nav-cta">
          <Github className="w-4 h-4" />
          @vyagh
        </a>
      </div>
    </div>
  </nav>
);

const HeroSection = () => {
  const { displayText, isComplete } = useTypingEffect("./kubefy Dockerfile --name myapp", 35);
  
  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="logo-flow-container">
          <div className="logo-flow">
            <div className="logo-box">
              <DockerLogo />
            </div>
            <div className="flow-dash"></div>
            <motion.div 
              className="logo-box logo-box--main"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <HexagonLogo className="w-12 h-12 text-emerald-400" />
            </motion.div>
            <div className="flow-dash"></div>
            <div className="logo-box">
              <KubernetesLogo />
            </div>
          </div>
        </div>

        <h1 className="hero-title">
          You write Dockerfile.<br />
          <span className="hero-title-accent">We generate K8s.</span>
        </h1>
        
        <p className="hero-subtitle">
          A zero-dependency CLI that converts Dockerfiles into production-ready Kubernetes manifests.
        </p>
        
        <div className="hero-terminal-wrapper">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot dot--red"></span>
              <span className="dot dot--yellow"></span>
              <span className="dot dot--green"></span>
            </div>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cmd">{displayText}</span>
              {!isComplete && <span className="terminal-cursor"></span>}
            </div>
            {isComplete && (
              <>
                <div className="terminal-line text-emerald-400">✓ Generated deployment.yaml</div>
                <div className="terminal-line text-emerald-400">✓ Generated service.yaml</div>
              </>
            )}
          </div>
        </div>
        
        <div className="hero-actions">
          <a href="#installation" className="btn-primary">
            Get Started <ArrowRight className="w-4 h-4" />
          </a>
          <div className="hero-stats">
            <span>v0.1.0</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const InstallationSection = () => {
  const { copied, copy } = useCopyToClipboard();
  const installCmd = `git clone https://github.com/vyagh/kubefy
cd kubefy
make build

# Binary will be at ./kubefy`;

  return (
    <section id="installation" className="section">
      <div className="section-header">
        <h2 className="section-title">Installation</h2>
        <p className="section-subtitle">Get up and running in seconds.</p>
      </div>
      
      <div className="cli-window">
        <div className="cli-header">
          <span className="cli-title">bash</span>
        </div>
        <div className="cli-content">
          <pre><code>{installCmd}</code></pre>
          <button onClick={() => copy(installCmd)} className="ide-copy-btn">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => (
  <section id="how-it-works" className="section">
    <div className="section-header">
      <h2 className="section-title">How it Works</h2>
      <p className="section-subtitle">Each Dockerfile directive maps directly to Kubernetes fields.</p>
    </div>

    <div className="mapping-table-container">
      <div className="mapping-table">
        <div className="mapping-header">
          <span>Dockerfile</span>
          <span></span>
          <span>Kubernetes</span>
        </div>
        {DIRECTIVE_MAPPING.map((item, i) => (
          <div key={i} className="mapping-row">
            <span className="mapping-dockerfile">{item.dockerfile}</span>
            <span className="mapping-arrow">→</span>
            <div className="mapping-k8s">
              <span className="mapping-k8s-value">{item.k8s}</span>
              <span className="mapping-k8s-field">{item.k8sField}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BentoCompare = () => (
  <section id="compare" className="section">
    <div className="section-header">
      <h2 className="section-title">Why Kubefy?</h2>
      <p className="section-subtitle">Simple, fast, and designed for developers who know what they're doing.</p>
    </div>

    <div className="bento-grid">
      <motion.div 
        className="bento-card bento-card--featured"
        whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.15)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div>
          <div className="bento-icon"><Terminal className="w-6 h-6 text-emerald-400" /></div>
          <h3>Zero Dependencies</h3>
          <p>No Docker daemon, no kubectl, no cluster access needed. Just a static binary that reads your Dockerfile and outputs YAML.</p>
        </div>
      </motion.div>
      
      <motion.div 
        className="bento-card"
        whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.15)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="bento-icon"><Box className="w-6 h-6 text-emerald-400" /></div>
        <h3>Predictable Output</h3>
        <p>No magic. Same input, same output. Every time.</p>
      </motion.div>

      <motion.div 
        className="bento-card"
        whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.15)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="bento-icon"><Zap className="w-6 h-6 text-emerald-400" /></div>
        <h3>Instant</h3>
        <p>Generate manifests in milliseconds, not seconds.</p>
      </motion.div>
      
      <motion.div 
        className="bento-card"
        whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.15)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="bento-icon"><Server className="w-6 h-6 text-emerald-400" /></div>
        <h3>Single Binary</h3>
        <p>No npm, pip, or docker requirement. Just a single static binary.</p>
      </motion.div>
    </div>
  </section>
);

const CliLimitations = () => (
  <section id="limitations" className="section section--dark">
    <div className="section-header">
      <h2 className="section-title">Scope & Limitations</h2>
      <p className="section-subtitle">We believe in honest tooling. Here's what we don't handle yet.</p>
    </div>

    <div className="cli-window">
      <div className="cli-header">
        <span className="cli-title">limitations</span>
      </div>
      <div className="cli-content">
        <div className="cli-row">
           <span className="text-red-500">✖</span> Multi-stage builds not supported
        </div>
        <div className="cli-row">
           <span className="text-red-500">✖</span> ARG substitution not supported
        </div>
        <div className="cli-row">
           <span className="text-red-500">✖</span> No Ingress generation
        </div>
        <div className="cli-row" style={{marginTop: '16px'}}>
           <span className="text-emerald-500">✓</span> Single-container Dockerfiles fully supported
        </div>
      </div>
    </div>
  </section>
);

const CLISection = () => (
  <section id="cli-reference" className="section section--dark">
    <div className="section-header">
      <h2 className="section-title">CLI Reference</h2>
      <p className="section-subtitle">Power user? We got you covered.</p>
    </div>

    <div className="cli-container">
      <div className="flags-table">
        {CLI_FLAGS.map((item, i) => (
          <div key={i} className="flags-row">
            <div className="flags-flag">
              {item.flag}
              {item.short && <span className="text-gray-500 ml-2">({item.short})</span>}
              {item.default === '(required)' && <span className="flags-required">required</span>}
            </div>
            <div className="flags-desc">{item.description}</div>
            <div className="flags-default">{item.default !== '(required)' ? `Default: ${item.default}` : ''}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CICDSection = () => {
  const { copied, copy } = useCopyToClipboard();
  const ghAction = `# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  k8s:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - name: Build & Run Kubefy
        run: |
          git clone https://github.com/vyagh/kubefy
          cd kubefy && make build
          ./kubefy ../Dockerfile --name app
      - run: kubectl apply -f .`;

  return (
    <section id="cicd" className="section">
      <div className="section-header">
        <h2 className="section-title">Drop into CI/CD</h2>
        <p className="section-subtitle">Integrate seamlessly with your existing pipelines.</p>
      </div>
      <div className="cli-window">
        <div className="cli-header">
          <span className="cli-title">.github/workflows/deploy.yml</span>
        </div>
        <div className="cli-content">
          <pre><code>{ghAction}</code></pre>
          <button onClick={() => copy(ghAction)} className="ide-copy-btn">
            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
          </button>
        </div>
      </div>
    </section>
  );
};

const ProFooter = () => (
  <footer className="footer-minimal">
    <div className="footer-content">
      <div className="footer-brand-minimal">
        <HexagonLogo className="w-5 h-5" />
        <span>kubefy</span>
      </div>
      <span className="footer-divider">•</span>
      <p className="footer-tagline">From Dockerfile to Kubernetes in seconds.</p>
      <span className="footer-divider">•</span>
      <a href="https://github.com/vyagh/kubefy" className="footer-link">
        <Github className="w-4 h-4" />
        GitHub
      </a>
      <span className="footer-divider">•</span>
      <span className="footer-copyright">© 2026 vyagh. MIT License.</span>
    </div>
  </footer>
);

// ============================================================================
// MAIN PAGE
// ============================================================================

const Index = () => (
  <div className="page">
    <Navigation />
    <HeroSection />
    <InstallationSection />
    <HowItWorksSection />
    <BentoCompare />
    <CliLimitations />
    <CLISection />
    <CICDSection />
    <ProFooter />
  </div>
);

export default Index;
