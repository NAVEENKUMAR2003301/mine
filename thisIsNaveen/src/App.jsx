
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
                      <i className="fas fa-map-marker-alt mr-1"></i> bangalore{console.log(fetch())}
                    </span>
                    <span className="text-sm font-semibold text-cyan-500">
                      <i className="fas fa-cloud-sun mr-1"></i> Bangalore
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-center space-x-3">
                <a href="https://github.com/naveenkumar2003301" className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}>
                  <i className="fab fa-github text-sm"></i>
                </a>
                <a href="https://linkedin.com/in/naveenkumar-v" className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}>
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
    { name: 'JavaScript', level: 85, color: '#f59e0b' },
    { name: 'HTML/CSS', level: 95, color: '#3b82f6' },
    { name: 'Python', level: 75, color: '#8b5cf6' },
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
              I'm a passionate Frontend Developer and Tech Educator with a focus on creating seamless digital experiences. With over 2 years of experience in web development, I specialize in building responsive, user-friendly applications using modern technologies.
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
              <p className="text-sm text-cyan-500 mt-1">First Class with Distinction</p>
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
const servicesData = [
  { name: "Web Development", icon: "fas fa-globe", desc: "Modern, responsive websites built with React", gradient: "from-cyan-500 to-blue-500" },
  { name: "UI/UX Design", icon: "fas fa-pen-ruler", desc: "Beautiful, intuitive interfaces", gradient: "from-purple-500 to-pink-500" },
  { name: "Tech Training", icon: "fas fa-chalkboard-user", desc: "One-on-one mentoring in web technologies", gradient: "from-orange-500 to-red-500" },
  { name: "API Integration", icon: "fas fa-plug", desc: "Seamless third-party services integration", gradient: "from-indigo-500 to-purple-500" },
  { name: "Performance", icon: "fas fa-rocket", desc: "Speed optimization for better UX", gradient: "from-pink-500 to-rose-500" }
];

const ServicesSection = () => {
  const { darkMode } = useTheme();

  return (
    <section id="services" className={`py-20 px-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>What I Do</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
          <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Comprehensive services to bring your digital ideas to life</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, idx) => (
            <div key={idx} className={`group p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:shadow-xl'}`}>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <i className={`${service.icon} text-2xl text-white`}></i>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>{service.name}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PROJECTS SECTION ====================
const projectsData = [
  { title: "EcoTrack", category: "Web App", desc: "Carbon footprint tracking", icon: "fas fa-leaf", gradient: "from-green-500 to-emerald-500" },
  { title: "NeoBank", category: "Fintech", desc: "Modern banking dashboard", icon: "fas fa-university", gradient: "from-blue-500 to-cyan-500" },
  { title: "ArtSpace", category: "Creative", desc: "Digital art gallery", icon: "fas fa-palette", gradient: "from-purple-500 to-pink-500" },
  { title: "FitTrack", category: "Health", desc: "Fitness tracking app", icon: "fas fa-heartbeat", gradient: "from-red-500 to-orange-500" },
  { title: "CloudBox", category: "Storage", desc: "Cloud storage solution", icon: "fas fa-cloud-upload-alt", gradient: "from-indigo-500 to-blue-500" },
  { title: "ChatGen", category: "AI", desc: "AI-powered chatbot", icon: "fas fa-robot", gradient: "from-yellow-500 to-orange-500" }
];

const ProjectsSection = () => {
  const { darkMode } = useTheme();

  return (
    <section id="projects" className={`py-20 px-4 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>Featured Work</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Some of my best projects</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, idx) => (
            <div key={idx} className={`group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-white/5' : 'bg-white'} hover:shadow-2xl`}>
              <div className={`h-40 bg-gradient-to-r ${project.gradient} flex items-center justify-center`}>
                <i className={`${project.icon} text-5xl text-white/90 group-hover:scale-110 transition-transform`}></i>
              </div>
              <div className="p-6">
                <p className="text-xs text-cyan-500 font-semibold mb-1">{project.category}</p>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>{project.title}</h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.desc}</p>
                <a href="#" className={`text-sm font-medium transition-colors ${darkMode ? 'text-gray-400 hover:text-cyan-500' : 'text-gray-600 hover:text-cyan-500'}`}>
                  View Project <i className="fas fa-arrow-right ml-1"></i>
                </a>
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
          © {new Date().getFullYear()} NaveenKumar V. Crafted with <i className="fas fa-heart text-red-500"></i> using React
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