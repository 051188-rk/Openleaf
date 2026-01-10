import { Link } from 'react-router-dom';
import { FiZap, FiCloud, FiUsers, FiFileText, FiCpu, FiTerminal, FiDownload, FiCheck } from 'react-icons/fi';
import logoMain from '../assets/logo_main.png';
import '../styles/landing.css';

export function LandingPage() {
    return (
        <div className="landing-page">
            {/* Floating Navbar */}
            <nav className="glass-navbar">
                <div className="container">
                    <div className="navbar-content">
                        <div className="navbar-logo">
                            <img src={logoMain} alt="Openleaf" style={{ height: '32px' }} />
                        </div>
                        <div className="navbar-links">
                            <a href="#features">Features</a>
                            <a href="#process">How It Works</a>
                            <a href="#pricing">Pricing</a>
                        </div>
                        <Link to="/signup" className="btn-glow">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            LaTeX, Reimagined<br />with Intelligence
                        </h1>
                        <p className="hero-subtitle">
                            Create stunning resumes and documents with AI-powered LaTeX editing.
                            Real-time preview, intelligent suggestions, and beautiful templates.
                        </p>
                        <div className="hero-cta">
                            <Link to="/signup" className="btn-primary-large">
                                <FiZap size={20} />
                                Start Creating Free
                            </Link>
                            <Link to="/login" className="btn-secondary-large">
                                Sign In
                            </Link>
                        </div>

                        {/* AI Bubbles Animation */}
                        <div className="ai-bubbles">
                            <div className="bubble bubble-1"></div>
                            <div className="bubble bubble-2"></div>
                            <div className="bubble bubble-3"></div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="editor-mockup">
                            <div className="mockup-code">
                                <div className="code-line">\\documentclass&#123;resume&#125;</div>
                                <div className="code-line">\\name&#123;Your Name&#125;</div>
                                <div className="code-line pulse">AI generating...</div>
                            </div>
                            <div className="mockup-preview">
                                <div className="preview-header">Resume Preview</div>
                                <div className="preview-content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section id="features" className="features-section">
                <div className="container">
                    <h2 className="section-title">Powerful Features</h2>
                    <div className="bento-grid">
                        <div className="bento-card bento-large">
                            <div className="bento-icon">
                                <FiCpu size={32} />
                            </div>
                            <h3>AI-Powered Writing</h3>
                            <p>Let AI help you draft complex LaTeX documents with intelligent suggestions and auto-completion.</p>
                            <div className="feature-visual">
                                <div className="typing-animation"></div>
                            </div>
                        </div>

                        <div className="bento-card bento-small">
                            <div className="bento-icon">
                                <FiCloud size={28} />
                            </div>
                            <h3>Cloud Sync</h3>
                            <p>Access your documents anywhere, anytime.</p>
                        </div>

                        <div className="bento-card bento-medium">
                            <div className="bento-icon">
                                <FiFileText size={28} />
                            </div>
                            <h3>Beautiful Templates</h3>
                            <p>Professional resume and document templates ready to use.</p>
                            <div className="template-stack">
                                <div className="template-card"></div>
                                <div className="template-card"></div>
                                <div className="template-card"></div>
                            </div>
                        </div>

                        <div className="bento-card bento-wide">
                            <div className="bento-icon">
                                <FiUsers size={28} />
                            </div>
                            <h3>Real-time Collaboration</h3>
                            <p>Work together with your team in real-time.</p>
                            <div className="collab-avatars">
                                <div className="avatar active"></div>
                                <div className="avatar active"></div>
                                <div className="avatar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Timeline */}
            <section id="process" className="process-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="timeline">
                        <div className="timeline-line"></div>
                        <div className="timeline-step">
                            <div className="step-icon">
                                <FiZap />
                            </div>
                            <h3>Prompt</h3>
                            <p>Describe what you want</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-icon">
                                <FiCpu />
                            </div>
                            <h3>AI Drafting</h3>
                            <p>AI generates LaTeX</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-icon">
                                <FiTerminal />
                            </div>
                            <h3>Compilation</h3>
                            <p>Real-time preview</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-icon">
                                <FiDownload />
                            </div>
                            <h3>Export</h3>
                            <p>Perfect PDF output</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="pricing-section">
                <div className="container">
                    <h2 className="section-title">Simple Pricing</h2>
                    <div className="pricing-cards">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Free</h3>
                                <div className="price">
                                    <span className="price-amount">$0</span>
                                    <span className="price-period">/month</span>
                                </div>
                            </div>
                            <ul className="pricing-features">
                                <li><FiCheck /> 5 AI Drafts/month</li>
                                <li><FiCheck /> Standard Templates</li>
                                <li><FiCheck /> PDF Export</li>
                                <li><FiCheck /> Cloud Storage (1GB)</li>
                            </ul>
                            <Link to="/signup" className="btn-pricing">Get Started</Link>
                        </div>

                        <div className="pricing-card pricing-card-featured">
                            <div className="popular-badge">Most Popular</div>
                            <div className="pricing-header">
                                <h3>Pro</h3>
                                <div className="price">
                                    <span className="price-amount">$12</span>
                                    <span className="price-period">/month</span>
                                </div>
                            </div>
                            <ul className="pricing-features">
                                <li><FiCheck /> Unlimited AI Drafts</li>
                                <li><FiCheck /> Premium Templates</li>
                                <li><FiCheck /> Advanced Export</li>
                                <li><FiCheck /> Cloud Storage (100GB)</li>
                                <li><FiCheck /> Real-time Collaboration</li>
                                <li><FiCheck /> Priority Support</li>
                            </ul>
                            <Link to="/signup" className="btn-pricing-featured">Upgrade to Pro</Link>
                        </div>

                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Team</h3>
                                <div className="price">
                                    <span className="price-amount">$39</span>
                                    <span className="price-period">/month</span>
                                </div>
                            </div>
                            <ul className="pricing-features">
                                <li><FiCheck /> Everything in Pro</li>
                                <li><FiCheck /> Up to 10 members</li>
                                <li><FiCheck /> Team Management</li>
                                <li><FiCheck /> Advanced Analytics</li>
                                <li><FiCheck /> Custom Templates</li>
                            </ul>
                            <Link to="/signup" className="btn-pricing">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>© 2026 Openleaf. Powered by AI.</p>
                </div>
            </footer>
        </div>
    );
}
