import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
    FiZap, FiCloud, FiUsers, FiFileText, FiCpu, FiTerminal,
    FiDownload, FiGithub, FiTwitter, FiLinkedin, FiMail,
    FiMonitor
} from 'react-icons/fi';
import logoMain from '../assets/logo_main.png';
import heroImage from '../assets/hero.png';
import '../styles/landing.css';

// --- Components ---

const Navbar = () => (
    <nav className="glass-navbar">
        <div className="container">
            <div className="navbar-content">
                <div className="navbar-logo">
                    <img src={logoMain} alt="Openleaf" style={{ height: '32px' }} />
                </div>
                <div className="navbar-links">
                    <a href="#features">Features</a>
                    <a href="#process">How It Works</a>
                    <a href="#testimonials">Testimonials</a>
                    <a href="#pricing">Pricing</a>
                </div>
                <Link to="/signup" className="btn-glow">
                    Get Started
                </Link>
            </div>
        </div>
    </nav>
);

const Hero = () => (
    <section className="hero-section">
        <div className="container">
            <div className="hero-layout">
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

                    <div className="ai-bubbles">
                        <div className="bubble bubble-1"></div>
                        <div className="bubble bubble-2"></div>
                        <div className="bubble bubble-3"></div>
                    </div>
                </div>

                <div className="hero-image">
                    <img src={heroImage} alt="Openleaf Hero" />
                </div>
            </div>
        </div>
    </section>
);

const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section id="features" className="features-section" ref={ref}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title text-gradient">Powerful Features</h2>
                    <p className="section-description">
                        Everything you need to create professional documents, supercharged with AI.
                    </p>
                </motion.div>

                <motion.div
                    className="bento-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div className="bento-card bento-large glass-card-premium" variants={itemVariants}>
                        <div className="bento-icon">
                            <FiCpu size={32} />
                        </div>
                        <h3>AI-Powered Writing</h3>
                        <p>Let AI help you draft complex LaTeX documents with intelligent suggestions, auto-completion, and error fixing in real-time.</p>
                        <div className="feature-visual">
                            <div className="typing-animation"></div>
                        </div>
                    </motion.div>

                    <motion.div className="bento-card bento-small glass-card-premium" variants={itemVariants}>
                        <div className="bento-icon">
                            <FiCloud size={28} />
                        </div>
                        <h3>Cloud Sync</h3>
                        <p>Access your documents anywhere. Changes saved automatically.</p>
                    </motion.div>

                    <motion.div className="bento-card bento-medium glass-card-premium" variants={itemVariants}>
                        <div className="bento-icon">
                            <FiFileText size={28} />
                        </div>
                        <h3>Beautiful Templates</h3>
                        <p>Professional resume and document templates ready to use. Customized for ATS friendliness.</p>
                        <div className="template-stack">
                            <div className="template-card" style={{ transform: 'rotate(-5deg)' }}></div>
                            <div className="template-card" style={{ transform: 'rotate(0deg)', zIndex: 2 }}></div>
                            <div className="template-card" style={{ transform: 'rotate(5deg)' }}></div>
                        </div>
                    </motion.div>

                    <motion.div className="bento-card bento-wide glass-card-premium" variants={itemVariants}>
                        <div className="bento-icon">
                            <FiUsers size={28} />
                        </div>
                        <h3>Real-time Collaboration</h3>
                        <p>Work together with your team. See cursors and edits as they happen.</p>
                        <div className="collab-avatars">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`avatar ${i <= 2 ? 'active' : ''}`} style={{ zIndex: 4 - i }} />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

const Process = () => {
    const steps = [
        { icon: FiZap, title: "Prompt", desc: "Describe what you want to create" },
        { icon: FiCpu, title: "AI Generation", desc: "Our engine writes the LaTeX code" },
        { icon: FiMonitor, title: "Live Preview", desc: "See changes instantly as you edit" },
        { icon: FiDownload, title: "Export", desc: "Download high-quality PDF" },
    ];

    return (
        <section id="process" className="process-section">
            <div className="container">
                <div className="text-center mb-6">
                    <h2 className="section-title text-gradient">How It Works</h2>
                    <p className="section-description">From idea to document in four simple steps.</p>
                </div>

                <div className="timeline">
                    <div className="timeline-line"></div>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="timeline-step"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                        >
                            <div className="step-icon">
                                <step.icon />
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Software Engineer",
            quote: "I never thought I'd say this, but writing LaTeX is actually fun now. Openleaf handles all the syntax errors for me.",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
        },
        {
            name: "Michael Ross",
            role: "PhD Candidate",
            quote: "The collaboration features are a game changer. My advisor can review my thesis significantly faster.",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
        },
        {
            name: "Emily Watson",
            role: "Product Designer",
            quote: "The templates are stunning. I landed my dream job using the 'Modern Minimalist' resume template.",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d"
        }
    ];

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <h2 className="section-title text-gradient">Loved by Creators</h2>
                <div className="testimonials-grid">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            className="glass-card-premium testimonial-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="testimonial-quote">"{t.quote}"</div>
                            <div className="testimonial-author">
                                <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                                <div className="author-info">
                                    <h4>{t.name}</h4>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA = () => (
    <section className="cta-section">
        <div className="cta-container">
            <div className="cta-bg-pattern"></div>
            <motion.div
                className="cta-content"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="cta-title">Ready to create something amazing?</h2>
                <p className="cta-description">
                    Join thousands of students, researchers, and professionals using Openleaf today.
                </p>
                <Link to="/signup" className="btn-primary-large" style={{ fontSize: '1.25rem', padding: '1.25rem 2.5rem' }}>
                    <FiZap size={24} />
                    Get Started for Free
                </Link>
            </motion.div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="landing-footer">
        <div className="container">
            <div className="footer-content">
                <div className="footer-column footer-about">
                    <img src={logoMain} alt="Openleaf" className="footer-logo" />
                    <p className="footer-description">
                        AI-powered LaTeX editing for stunning resumes and documents.
                        Create, collaborate, and export with ease.
                    </p>
                    <div className="footer-social">
                        {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                            <a key={i} href="#" className="social-link" aria-label="Social">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="footer-column">
                    <h4>Product</h4>
                    <ul className="footer-links">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login">Sign In</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Resources</h4>
                    <ul className="footer-links">
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Templates</a></li>
                        <li><a href="#">Tutorials</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Company</h4>
                    <ul className="footer-links">
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="footer-copyright">
                    © 2026 Openleaf. All rights reserved. Powered by AI.
                </p>
            </div>
        </div>
    </footer>
);

export function LandingPage() {
    return (
        <div className="landing-page">
            <Navbar />
            <Hero />
            <Features />
            <Process />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}
