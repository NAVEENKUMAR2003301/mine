
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';


// ==================== CONTEXT FOR THEME ====================
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// ==================== TYPING EFFECT HOOK ====================
const useTypingEffect = (texts, speed = 100, delay = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const currentText = texts[index];
    if (!currentText) return;
    let timeout;

    if (isDeleting) {
      if (subIndex > 0) {
        timeout = setTimeout(() => setSubIndex(subIndex - 1), speed / 2);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      if (subIndex < currentText.length) {
        timeout = setTimeout(() => setSubIndex(subIndex + 1), speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), delay);
      }
    }
    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, texts, speed, delay]);

  useEffect(() => {
    if (texts[index]) {
      setDisplayText(texts[index].substring(0, subIndex));
    }
  }, [subIndex, index, texts]);

  return displayText;
};

// ==================== API HOOK ====================
const useMultipleAPIs = () => {
  const [quote, setQuote] = useState({ text: "Design is not just what it looks like. Design is how it works.", author: "Steve Jobs" });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const modernQuotes = [
      { text: "The future is already here — it's just not very evenly distributed.", author: "William Gibson" },
      { text: "Design is intelligence made visible.", author: "Alina Wheeler" },
      { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
      { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
    ];
    const random = modernQuotes[Math.floor(Math.random() * modernQuotes.length)];
    setQuote(random);

    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current_weather=true');
        if (response.ok) {
          const data = await response.json();
          setWeather({ temperature: Math.round(data.current_weather.temperature) + '°C' });
        } else {
          setWeather({ temperature: "26°C" });
        }
      } catch (error) {
        setWeather({ temperature: "26°C" });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return { quote, weather, loading };
};

// ==================== SCROLL PROGRESS ====================
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxHeight > 0 ? (scrolled / maxHeight) * 100 : 0);
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  return progress;
};

// ==================== SCROLL TO TOP ====================
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.pageYOffset > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${darkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-black/10 text-black border border-black/20'
        }`}
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
};

// ==================== NAVBAR ====================
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const scrollProgress = useScrollProgress();

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 z-50 transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
          ? darkMode ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-white/90 backdrop-blur-xl border-b border-black/10'
          : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => scrollToSection('home')} className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-md">NV</span>
              </div>
              <span className={`font-bold text-lg tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>NaveenKumar</span>
            </button>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === item.id
                      ? darkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
                      : darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'
                    }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={toggleDarkMode}
                className={`ml-2 w-9 h-9 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/10 text-yellow-400' : 'bg-black/5 text-gray-700'
                  }`}
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleDarkMode}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/10 text-yellow-400' : 'bg-black/5 text-gray-700'}`}
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className={`w-full px-4 py-2 rounded-lg text-left text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'}`}>
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

// ==================== HOME SECTION ====================
const HomeSection = () => {
  const { quote, weather, loading } = useMultipleAPIs();
  const { darkMode } = useTheme();
  const typingText = useTypingEffect(['Creative Developer', 'UI/UX Designer', 'Tech Innovator', 'Problem Solver'], 100, 1500);
  const scrollToSection = (sectionId) => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className={`min-h-screen flex items-center relative overflow-hidden ${darkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm w-fit ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-black/5 text-gray-600'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Available for work</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
              Creating digital
              <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                experiences
              </span>
            </h1>

            <div className="text-xl md:text-2xl">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>I'm a </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                {typingText}
              </span>
              <span className="animate-blink inline-block w-0.5 h-6 bg-cyan-500 ml-1"></span>
            </div>

            <p className={`text-lg max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Frontend developer and tech educator passionate about building beautiful, functional web applications.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollToSection('contact')} className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Get in touch
              </button>
              <button onClick={() => scrollToSection('projects')} className={`px-8 py-3 rounded-full font-medium border-2 transition-all duration-300 ${darkMode ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'}`}>
                View my work
              </button>
            </div>

            {/* Quote */}
            <div className={`pt-8 border-t ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex gap-3">
                <i className="fas fa-quote-left text-2xl text-cyan-500 opacity-50"></i>
                <div>
                  <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>"{quote.text}"</p>
                  <p className="text-xs text-cyan-500 mt-1">— {quote.author}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Card */}
          <div className="relative">
            <div className={`relative rounded-2xl p-8 backdrop-blur-xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
              <div className="text-center">
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                  <i className="fas fa-code text-4xl text-white"></i>
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>NaveenKumar V</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> Senior Associate Software Developer & Educator</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-cyan-500/20">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Experience</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>1.6 Years</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyan-500/20">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projects</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>20+ Completed</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyan-500/20">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Students</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>500+ Mentored</span>
                </div>
                {!loading && weather && (
                  <div className="flex justify-between items-center pt-3">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <i className="fas fa-map-marker-alt mr-1"></i> bangalore
                    </span>
                    <span className="text-sm font-semibold text-cyan-500">
                      <i className="fas fa-cloud-sun mr-1"></i> 
                      {weather.temperature}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-center space-x-3">
                <a href="https://github.com/naveenkumar2003301" className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}>
                  <i className="fab fa-github text-sm"></i>
                </a>
                <a href="https://www.linkedin.com/in/naveenkumar-v-a78244240" className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}>
                  <i className="fab fa-linkedin-in text-sm"></i>
                </a>
                <a href="https://wa.me/916383366774" className={`w-9 h-9 rounded-full flex    items-center justify-center transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}>
                  <i className="fab fa-whatsapp text-sm"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-blink { animation: blink 1s step-end infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  );
};

// ==================== ABOUT SECTION ====================
const AboutSection = () => {
  const { darkMode } = useTheme();

  const skills = [
    { name: 'React', level: 90, color: '#06b6d4' },
    { name: 'JavaScript', level: 95, color: '#f59e0b' },
    { name: 'HTML/CSS', level: 95, color: '#3b82f6' },
    { name: 'Python', level: 80, color: '#8b5cf6' },
    { name: 'Tailwind', level: 88, color: '#14b8a6' }
  ];

  return (
    <section id="about" className={`py-20 px-4 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              I'm a passionate Frontend Developer and Tech Educator with a focus on creating seamless digital experiences. With over 1.6 years of experience in web development, I specialize in building responsive, user-friendly applications using modern technologies.
            </p>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              My journey in tech started with Electronics Engineering, but my love for coding led me to web development. Now, I combine technical expertise with creative design to build solutions that make a difference.
            </p>
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'} shadow-lg mt-6`}>
              <div className="flex items-center gap-3 mb-3">
                <i className="fas fa-graduation-cap text-2xl text-cyan-500"></i>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-black'}`}>Education</h3>
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>BE in Electronics & Communication Engineering</p>
              <p className="text-sm text-cyan-500 mt-1">First Class</p>
            </div>
          </div>

          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{skill.name}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{skill.level}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${skill.level}%`, backgroundColor: skill.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== SERVICES SECTION ====================




// Services Data with Indian Pricing and your tech stack
const ServiceSection = [
  {
    id: 1,
    name: "Web Development",
    icon: "fas fa-globe",
    shortDesc: "Modern websites with HTML, CSS, JS, React",
    gradient: "from-cyan-500 to-blue-500",
    detailedDesc: "I build responsive, high-performance websites using modern technologies. From static sites to dynamic React applications, I deliver solutions that are fast, SEO-friendly, and visually stunning.",
    features: [
      "Custom websites with HTML5, CSS3, JavaScript",
      "React.js single-page applications",
      "Responsive design for all devices",
      "Tailwind CSS for modern styling",
      "Performance optimization & fast loading",
      "Cross-browser compatibility",
      "SEO friendly structure"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS", "Git", "GitHub"],
    benefits: [
      "Professional online presence",
      "Mobile-responsive design",
      "Fast loading times",
      "Easy to update and maintain",
      "Scalable architecture"
    ],
    process: [
      "Requirements gathering",
      "Design & prototyping",
      "Development",
      "Testing & QA",
      "Deployment",
      "Ongoing support"
    ],
    pricingINR: "₹15,000 - ₹45,000",
    timeline: "3-5 weeks"
  },
  {
    id: 2,
    name: "UI/UX Design",
    icon: "fas fa-pen-ruler",
    shortDesc: "Beautiful designs with Figma",
    gradient: "from-purple-500 to-pink-500",
    detailedDesc: "I create intuitive and engaging user interfaces using Figma. My designs focus on user experience, modern aesthetics, and seamless interactions that delight users.",
    features: [
      "Wireframing & prototyping in Figma",
      "User flow & information architecture",
      "High-fidelity mockups",
      "Design systems & component libraries",
      "Responsive & mobile-first designs",
      "Usability testing",
      "Developer-friendly handoff"
    ],
    technologies: ["Figma", "Adobe XD", "Miro", "Whimsical"],
    benefits: [
      "Improved user satisfaction",
      "Reduced development rework",
      "Consistent brand experience",
      "Faster time-to-market"
    ],
    process: [
      "User research",
      "Wireframing",
      "Prototyping",
      "Visual design",
      "Usability testing",
      "Design handoff"
    ],
    pricingINR: "₹10,000 - ₹30,000",
    timeline: "2-4 weeks"
  },
  {
    id: 3,
    name: "Tech Training & Mentoring",
    icon: "fas fa-chalkboard-user",
    shortDesc: "1-on-1 training in web technologies",
    gradient: "from-orange-500 to-red-500",
    detailedDesc: "Personalized one-on-one training in HTML, CSS, JavaScript, React, Git, GitHub, Python, and SQL. Project-based learning to help you build a strong portfolio.",
    features: [
      "Custom learning path",
      "Project-based curriculum",
      "Code reviews & feedback",
      "Career guidance & interview prep",
      "Portfolio development",
      "Flexible scheduling",
      "Lifetime access to resources"
    ],
    technologies: ["HTML/CSS", "JavaScript", "React", "Python", "SQL", "Git/GitHub", "Tailwind"],
    benefits: [
      "Learn at your own pace",
      "Build real-world projects",
      "Get industry-ready skills",
      "Job placement assistance",
      "Recorded sessions for revision"
    ],
    process: [
      "Skill assessment",
      "Custom curriculum",
      "Weekly sessions",
      "Hands-on projects",
      "Portfolio building",
      "Job preparation"
    ],
    pricingINR: "₹2,500/session or ₹25,000/month",
    timeline: "Flexible (2-6 months)"
  },
  {
    id: 4,
    name: "Git & GitHub Workflow",
    icon: "fab fa-github",
    shortDesc: "Version control mastery & collaboration",
    gradient: "from-gray-600 to-gray-800",
    detailedDesc: "Master Git and GitHub for version control. Learn branching strategies, pull requests, code reviews, and collaboration workflows used by professional teams.",
    features: [
      "Git fundamentals & commands",
      "Branching & merging strategies",
      "Pull requests & code reviews",
      "GitHub Actions basics",
      "Conflict resolution",
      "Open source contribution guide",
      "Repository management"
    ],
    technologies: ["Git", "GitHub", "GitLab basics"],
    benefits: [
      "Professional version control",
      "Seamless team collaboration",
      "Clean commit history",
      "CI/CD readiness"
    ],
    process: [
      "Git basics setup",
      "Branching workflows",
      "Collaboration practices",
      "Advanced commands",
      "Real-world exercises"
    ],
    pricingINR: "₹8,000 - ₹15,000",
    timeline: "1-2 weeks"
  },
  {
    id: 5,
    name: "Python Development + ML Projects",
    icon: "fab fa-python",
    shortDesc: "Python apps + 2 bonus ML projects",
    gradient: "from-green-500 to-emerald-600",
    detailedDesc: "Full-stack Python development with Django/Flask. Plus, get 2 exclusive machine learning projects: Sales Forecasting and Movie Recommendation System to boost your portfolio.",
    features: [
      "Python web apps (Django/Flask)",
      "Database integration (SQL)",
      "REST API development",
      "Data analysis with Pandas",
      "ML Project 1: Sales Forecasting",
      "ML Project 2: Movie Recommender",
      "Model deployment basics"
    ],
    technologies: ["Python", "Django", "Flask", "SQL", "Pandas", "Scikit-learn", "Matplotlib"],
    benefits: [
      "End-to-end web applications",
      "Real-world ML experience",
      "Stand out in interviews",
      "Production-ready code"
    ],
    process: [
      "Requirements analysis",
      "Backend development",
      "ML model building",
      "Integration & testing",
      "Deployment guide"
    ],
    pricingINR: "₹35,000 - ₹60,000",
    timeline: "5-7 weeks",
    mlBadge: "2 ML Projects Included"
  },
  {
    id: 6,
    name: "SQL & Database Design",
    icon: "fas fa-database",
    shortDesc: "Efficient database design & queries",
    gradient: "from-indigo-500 to-purple-600",
    detailedDesc: "Expert SQL database design, optimization, and complex query writing. Learn or get help with PostgreSQL, MySQL, and database best practices.",
    features: [
      "Database schema design",
      "Complex SQL queries (JOINs, subqueries)",
      "Query optimization & indexing",
      "Data modeling & normalization",
      "Database migration strategies",
      "Backup & recovery",
      "Integration with Python/Node.js"
    ],
    technologies: ["PostgreSQL", "MySQL", "SQLite", "Prisma", "SQLAlchemy"],
    benefits: [
      "Faster data retrieval",
      "Scalable database architecture",
      "Data integrity & consistency",
      "Reduced storage costs"
    ],
    process: [
      "Requirements analysis",
      "ER diagram design",
      "Schema implementation",
      "Query optimization",
      "Documentation"
    ],
    pricingINR: "₹12,000 - ₹25,000",
    timeline: "2-3 weeks"
  }
];

// Service Detail Page Component
const ServiceDetailPage = ({ service, onBack }) => {
  const { darkMode } = useTheme();

  if (!service) return null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${service.gradient} py-12 md:py-16`}>
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Services
          </button>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <i className={`${service.icon} text-4xl text-white`}></i>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                {service.name}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                {service.shortDesc}
              </p>
              {service.mlBadge && (
                <span className="inline-flex items-center gap-2 mt-3 bg-yellow-500/20 backdrop-blur-sm text-yellow-200 px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-microchip"></i>
                  {service.mlBadge}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                About This Service
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {service.detailedDesc}
              </p>
            </div>

            {/* Features */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode
                        ? 'bg-gray-800 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Benefits
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <i className="fas fa-star text-yellow-500 mt-1"></i>
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                My Process
              </h2>
              <div className="space-y-4">
                {service.process.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {idx + 1}
                    </div>
                    <div className={`flex-1 pt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing Sidebar */}
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg sticky top-6`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Investment
              </h3>
              <div className="mb-6">
                <p className={`text-3xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                  {service.pricingINR}
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <i className="far fa-clock mr-1"></i> Timeline: {service.timeline}
                </p>
              </div>

              {/* <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <i className="fas fa-calendar-alt"></i>
                  Free Consultation
                </button>
                <button className={`w-full border-2 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                  <i className="fas fa-envelope"></i>
                  Send Message
                </button>
              </div> */}

              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  What's Included?
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Free consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Unlimited revisions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>30 days support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Source code & docs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick FAQ */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <h3 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <i className="fas fa-question-circle text-cyan-500"></i>
                Quick Questions?
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>How to start?</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Book a free consultation call.</p>
                </div>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Discounts available?</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Yes for long-term projects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Services Section Component
const ServicesSection = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedService, setSelectedService] = useState(null);

  if (selectedService) {
    return (
      <ServiceDetailPage
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  return (
    <section id="services" className={`py-16 md:py-20 px-4 ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            What I Do
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
          <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            HTML, CSS, JavaScript, React, Figma, Git, GitHub, Python, Tailwind, SQL + 2 ML Projects
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ServiceSection.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`group relative p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden ${darkMode
                  ? 'bg-gray-900/80 hover:bg-gray-900 hover:shadow-2xl hover:shadow-cyan-500/20'
                  : 'bg-white hover:shadow-xl hover:shadow-gray-200'
                }`}
            >
              {/* Animated Border Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}></div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${service.icon} text-2xl text-white`}></i>
              </div>

              {/* Title */}
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {service.name}
              </h3>

              {/* Description */}
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {service.shortDesc}
              </p>

              {/* Price & Timeline */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-cyan-500 font-bold text-sm">{service.pricingINR}</span>
                <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="far fa-clock"></i> {service.timeline}
                </span>
              </div>

              {/* ML Badge */}
              {service.mlBadge && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  <i className="fas fa-microchip mr-1"></i> ML
                </div>
              )}

              {/* Hover Indicator */}
              <div className="flex items-center gap-2 mt-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-cyan-500">
                  Click to explore →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Footer */}
        <div className={`mt-16 p-6 rounded-2xl text-center ${darkMode ? 'bg-gray-900/50' : 'bg-white'} shadow-md`}>
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-html5 text-orange-500"></i> HTML5</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-css3-alt text-blue-500"></i> CSS3</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-js text-yellow-500"></i> JavaScript</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-react text-cyan-500"></i> React</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-figma text-pink-500"></i> Figma</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-github text-gray-500"></i> Git/GitHub</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-python text-blue-400"></i> Python</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fab fa-tailwind text-sky-400"></i> Tailwind</span>
            <span className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><i className="fas fa-database text-indigo-400"></i> SQL</span>
          </div>
          <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ⚡ Bonus: 2 ML Projects (Sales Forecasting + Movie Recommender) with Python package
          </p>
        </div>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-3 rounded-full shadow-2xl transition-all duration-300"
        >
          <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
        </button>
      </div>
    </section>
  );
};




// ==================== PROJECTS SECTION ====================
const projectsData = [
  {
    title: "Nav News",
    category: "Web App",
    desc: "we can see Daily News",
    icon: "fas fa-leaf",
    gradient: "from-green-500 to-emerald-500",
    projectLink: "https://nav-news-demo.com",  // Add unique link for each project
    githubLink: "https://github.com/NAVEENKUMAR2003301/News"  // Optional: GitHub link
  },
  {
    title: "StewDec",
    category: "Fashion",
    desc: "Showing decoration with packages",
    icon: "fas fa-s",
    gradient: "from-blue-500 to-cyan-500",
    projectLink: "https://stewdec-demo.com",
    githubLink: "https://github.com/NAVEENKUMAR2003301/Dec/tree/main/stewDec"
  },
  {
    title: "Gym Site",
    category: "Gym",
    desc: "Digital gym service provider model",
    icon: "fas fa-d",
    gradient: "from-purple-500 to-pink-500",
    projectLink: "https://gym-site-demo.com",
    githubLink: "https://github.com/NAVEENKUMAR2003301/gym/tree/main/pulse-landing-page"
  },
];

const ProjectsSection = () => {
  const { darkMode } = useTheme();
  const [projects, setProjects] = useState(projectsData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    desc: "",
    icon: "fas fa-star",
    gradient: "from-gray-500 to-gray-700",
    projectLink: "",
    githubLink: ""
  });

  // Predefined gradients and icons for new projects
  const gradientOptions = [
    "from-red-500 to-orange-500",
    "from-green-500 to-teal-500",
    "from-indigo-500 to-purple-500",
    "from-yellow-500 to-orange-500",
    "from-pink-500 to-rose-500"
  ];

  const iconOptions = [
    "fas fa-globe", "fas fa-code", "fas fa-mobile-alt",
    "fas fa-shopping-cart", "fas fa-chart-line", "fas fa-gamepad"
  ];

  const handleAddProject = () => {
    if (newProject.title && newProject.category) {
      setProjects([...projects, { ...newProject, id: Date.now() }]);
      setNewProject({
        title: "",
        category: "",
        desc: "",
        icon: "fas fa-star",
        gradient: "from-gray-500 to-gray-700",
        projectLink: "",
        githubLink: ""
      });
      setShowAddForm(false);
    }
  };

  return (
    <section id="projects" className={`py-20 px-4 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>Featured Work</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Some of my best projects</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className={`group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-white/5' : 'bg-white'} hover:shadow-2xl`}>
              <div className={`h-40 bg-gradient-to-r ${project.gradient} flex items-center justify-center`}>
                <i className={`${project.icon} text-5xl text-white/90 group-hover:scale-110 transition-transform`}></i>
              </div>
              <div className="p-6">
                <p className="text-xs text-cyan-500 font-semibold mb-1">{project.category}</p>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>{project.title}</h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.desc}</p>

                {/* Separate View Project Links */}
                <div className="flex gap-3 mt-2">
                  {project.projectLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
                    >
                      Live Demo <i className="fas fa-external-link-alt text-xs"></i>
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
                    >
                      GitHub <i className="fab fa-github"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
       
      </div>
    </section>
  );
};

// ==================== CONTACT SECTION ====================
const ContactSection = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className={`py-20 px-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>Let's Talk</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Have a project in mind? I'd love to hear about it</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <i className="fas fa-envelope text-3xl text-cyan-500 mb-3"></i>
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>Email</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>livnaveen@gmail.com</p>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <i className="fab fa-linkedin text-3xl text-cyan-500 mb-3"></i>
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>LinkedIn</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>linkedin.com/in/naveenkumar-v</p>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <i className="fab fa-github text-3xl text-cyan-500 mb-3"></i>
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>GitHub</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>github.com/naveenkumar2003301</p>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500 ${darkMode ? 'bg-black/50 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-black'}`} />
              <input type="email" name="email" placeholder="Your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500 ${darkMode ? 'bg-black/50 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-black'}`} />
              <textarea name="message" rows="4" placeholder="Tell me about your project..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500 ${darkMode ? 'bg-black/50 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-black'}`}></textarea>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {submitted && <p className="text-green-500 text-center text-sm font-semibold">✓ Message sent successfully!</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
  const { darkMode } = useTheme();
  return (
    <footer className={`py-6 border-t ${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          © {new Date().getFullYear()} Naveenkumar V Tech enthusiast <i className="fas fa-heart text-red-500"></i> 
        </p>
      </div>
    </footer>
  );
};

// ==================== THEME PROVIDER ====================
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg">Refresh</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==================== MAIN APP ====================
const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="font-sans antialiased">
          <Navbar />
          <HomeSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <ContactSection />
          <Footer />
          <ScrollToTop />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;