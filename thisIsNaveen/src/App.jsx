// App.jsx - Complete Landing Page with All Fixes, Dark Mode & Advanced Features

import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';

// ==================== CONTEXT FOR THEME ====================
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// ==================== FIXED TYPING EFFECT HOOK ====================
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

// ==================== FIXED API HOOK WITH RELIABLE ENDPOINTS ====================
const useMultipleAPIs = () => {
  const [quote, setQuote] = useState({ text: "Code is like art - every line you write creates something beautiful.", author: "Tech Wisdom" });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ quotes: 'loading', weather: 'loading' });

  useEffect(() => {
    // Local tech quotes (reliable, no CORS issues)
    const localQuotes = [
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
      { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
      { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
      { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
      { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
      { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
      { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
      { text: "First, do it, then do it right, then do it better.", author: "Addy Osmani" },
      { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" }
    ];

    // Set random quote immediately
    const random = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    setQuote(random);
    setApiStatus(prev => ({ ...prev, quotes: 'success' }));

    // Try to fetch from API as enhancement (but don't block UI)
    const fetchQuoteFromAPI = async () => {
      try {
        // Using free CORS-enabled quote API
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (response.ok) {
          const data = await response.json();
          setQuote({ text: data.quote, author: data.author });
          setApiStatus(prev => ({ ...prev, quotes: 'api' }));
        }
      } catch (error) {
        console.log('Using local quotes - API unavailable');
      }
    };

    const fetchWeather = async () => {
      try {
        // Using free weather API with CORS support
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current_weather=true');
        if (response.ok) {
          const data = await response.json();
          const temp = data.current_weather.temperature;
          const weatherCode = data.current_weather.weathercode;
          let description = 'Clear';
          if (weatherCode === 1) description = 'Mainly Clear';
          else if (weatherCode === 2) description = 'Partly Cloudy';
          else if (weatherCode === 3) description = 'Overcast';
          else if (weatherCode >= 45 && weatherCode <= 48) description = 'Foggy';
          else if (weatherCode >= 51 && weatherCode <= 67) description = 'Rain';
          else if (weatherCode >= 71 && weatherCode <= 77) description = 'Snow';
          else if (weatherCode >= 80 && weatherCode <= 99) description = 'Thunderstorm';

          setWeather({ temperature: Math.round(temp) + '°C', description });
          setApiStatus(prev => ({ ...prev, weather: 'success' }));
        } else {
          throw new Error('Weather API failed');
        }
      } catch (error) {
        setWeather({ temperature: "26°C", description: "Partly Cloudy" });
        setApiStatus(prev => ({ ...prev, weather: 'fallback' }));
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteFromAPI();
    fetchWeather();
  }, []);

  return { quote, weather, loading, apiStatus };
};

// ==================== SCROLL PROGRESS HOOK ====================
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

// ==================== SCROLL TO TOP BUTTON ====================
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-zoho-blue hover:bg-zoho-purple' : 'bg-zoho-blue hover:bg-zoho-purple'
        } text-white`}
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
};

// ==================== NAVBAR COMPONENT WITH THEME TOGGLE ====================
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { darkMode, toggleDarkMode } = useTheme();
  const scrollProgress = useScrollProgress();

  const navItems = [
    { name: 'Home', id: 'home', icon: 'fas fa-home' },
    { name: 'Bio', id: 'bio', icon: 'fas fa-user' },
    { name: 'Services', id: 'services', icon: 'fas fa-code' },
    { name: 'Projects', id: 'projects', icon: 'fas fa-folder-open' },
    { name: 'Contact', id: 'contact', icon: 'fas fa-envelope' }
  ];

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-zoho-blue to-zoho-purple z-50" style={{ width: `${scrollProgress}%`, transition: 'width 0.1s' }}></div>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900/95 backdrop-blur-md border-gray-700' : 'bg-white/95 backdrop-blur-md border-blue-100'} shadow-lg border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => scrollToSection('home')} className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-br from-zoho-blue to-zoho-purple rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                  <span className="text-white font-bold text-lg">NK</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-zoho-blue rounded-full animate-ping"></div>
              </div>
              <div>
                <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>NaveenKumar V</span>
                <span className={`block text-xs text-zoho-blue -mt-1`}>Developer</span>
              </div>
            </button>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden group cursor-pointer ${activeSection === item.id
                      ? 'text-zoho-blue'
                      : darkMode ? 'text-gray-300 hover:text-zoho-blue' : 'text-gray-600 hover:text-zoho-blue'
                    }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <i className={item.icon}></i> {item.name}
                  </span>
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-zoho-blue to-zoho-purple animate-slide-in"></span>
                  )}
                  <span className={`absolute inset-0 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-zoho-blue/10 to-zoho-purple/10'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
              ))}
              <button
                onClick={toggleDarkMode}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-blue-50'}`}>
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`md:hidden pb-4 space-y-2 animate-slide-down ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full ${activeSection === item.id ? (darkMode ? 'bg-gray-800 text-zoho-blue' : 'bg-blue-50 text-zoho-blue') : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                  }`}>
                  <i className={item.icon}></i> {item.name}
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
  const { quote, weather, loading, apiStatus } = useMultipleAPIs();
  const { darkMode } = useTheme();
  const typingText = useTypingEffect(['React Developer', 'Tech Educator', 'Problem Solver', 'ML Enthusiast'], 100, 1500);
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="home" className={`relative min-h-screen pt-16 overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 opacity-5 pointer-events-none ${darkMode ? 'opacity-10' : ''}`}>
        <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
          <path d="M0,400 Q300,200 600,400 T1200,400" stroke="#1890ff" fill="none" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M100,500 Q400,300 700,500 T1100,500" stroke="#722ed1" fill="none" strokeWidth="1.5" strokeDasharray="5 15" />
          <circle cx="200" cy="300" r="40" stroke="#1890ff" fill="none" strokeWidth="1.5" />
          <circle cx="800" cy="200" r="60" stroke="#722ed1" fill="none" strokeWidth="1.5" />
          <path d="M900,600 L950,550 L1000,600 L950,650 Z" stroke="#1890ff" fill="none" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Weather Widget */}
        <div className={`absolute top-4 right-4 ${darkMode ? 'bg-gray-800/80 text-gray-300 border-gray-700' : 'bg-white/80 border-blue-200'} backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border`}>
          <div className="flex items-center gap-2">
            <i className="fas fa-microchip text-zoho-blue animate-spin-slow"></i>
            {!loading && weather && (
              <span className="text-sm">{weather.temperature} • {weather.description}</span>
            )}
          </div>
        </div>

        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-blue-200'} backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-md border animate-float`}>
            <span className="w-2 h-2 bg-zoho-blue rounded-full animate-pulse"></span>
            <span className={`text-sm font-medium text-zoho-blue`}>Tech Enthusiast • Live</span>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <span>Hi, I'm </span>
            <span className="bg-gradient-to-r from-zoho-blue to-zoho-purple bg-clip-text text-transparent relative inline-block">
              NaveenKumar
              <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
                <path d="M0,2 Q50,0 100,2 T200,2" stroke="#1890ff" fill="none" strokeWidth="2" />
              </svg>
            </span>
          </h1>

          <div className="text-xl md:text-2xl mb-8">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>I'm a </span>
            <span className="bg-gradient-to-r from-zoho-blue to-zoho-purple bg-clip-text text-transparent font-semibold">
              {typingText}
            </span>
            <span className="animate-blink inline-block w-0.5 h-6 bg-zoho-blue ml-1"></span>
          </div>

          {/* Technology Quote Card */}
          <div className={`max-w-2xl mx-auto rounded-2xl p-6 shadow-lg mb-12 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${darkMode ? 'bg-gray-800 border-l-4 border-zoho-blue' : 'bg-white border-l-4 border-zoho-blue'}`}>
            <div className="flex gap-3">
              <div className="relative">
                <i className="fas fa-terminal text-zoho-blue text-2xl"></i>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-zoho-purple rounded-full animate-ping"></div>
              </div>
              <div>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{quote.text}"</p>
                <p className="text-zoho-blue mt-2 text-sm">— {quote.author}</p>
                {apiStatus.quotes === 'api' && (
                  <p className="text-xs text-green-500 mt-1">✨ Live quote</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-400">
            <button onClick={() => scrollToSection('contact')} className="group relative px-8 py-3 bg-gradient-to-r from-zoho-blue to-zoho-purple text-white rounded-lg font-semibold shadow-lg overflow-hidden cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">Start a Project <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i></span>
              <span className="absolute inset-0 bg-gradient-to-r from-zoho-dark to-zoho-purple transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </button>
            <button onClick={() => scrollToSection('projects')} className={`px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all border-2 flex items-center gap-2 group cursor-pointer ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:border-zoho-blue' : 'bg-white text-gray-700 border-blue-200 hover:border-zoho-blue'}`}>
              <i className="fas fa-folder-open group-hover:rotate-12 transition-transform"></i> View Work
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: "fa-chalkboard-user", value: "6+", label: "Months Training" },
            { icon: "fa-laptop-code", value: "20+", label: "Projects Done" },
            { icon: "fa-users", value: "50+", label: "Students Mentored" }
          ].map((stat, idx) => (
            <div key={stat.label} className={`group relative rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ animationDelay: `${idx * 100}ms` }}>
              <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-zoho-blue transition-all duration-300`}></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-zoho-blue to-zoho-purple opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <i className={`fas ${stat.icon} text-4xl text-zoho-blue mb-3 group-hover:scale-110 transition-transform inline-block`}></i>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
};

// ==================== BIO SECTION ====================
const BioSection = () => {
  const { darkMode } = useTheme();

  return (
    <section id="bio" className={`relative min-h-screen py-20 px-4 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-zoho-light via-white to-zoho-light'}`}>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <path d="M100,200 Q300,100 500,200 T900,200" stroke="#1890ff" fill="none" strokeWidth="2" />
          <circle cx="700" cy="400" r="50" stroke="#722ed1" fill="none" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-3 relative inline-block ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            About Me
            <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
              <path d="M0,2 Q50,0 100,2 T200,2" stroke="#1890ff" fill="none" strokeWidth="2" />
            </svg>
          </h2>
          <p className={darkMode ? 'text-gray-400 mt-4' : 'text-gray-500 mt-4'}>Passionate Developer & Tech Educator — Building digital excellence</p>
        </div>

        <div className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-blue-100'}`}>
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-zoho-blue to-zoho-purple text-white p-8 relative overflow-hidden">
              <div className="relative text-center">
                <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-white/20">
                  <i className="fas fa-user-circle text-6xl"></i>
                </div>
                <h2 className="text-2xl font-bold">NaveenKumar V</h2>
                <p className="text-blue-100 mb-3">BE Electronics & Communication</p>
                <p className="text-indigo-100 text-sm">First Class with Distinction</p>
                <div className="border-t border-white/20 my-4 pt-4 space-y-2 text-sm">
                  <p><i className="fas fa-envelope mr-2 w-5"></i> livnaveen@gmail.com</p>
                  <p><i className="fas fa-map-marker-alt mr-2 w-5"></i> Tech Hub, India</p>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-8">
              <p className={`leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                I'm a passionate Frontend Developer and Tech Educator, with 6+ months of experience as a Trainer specializing in HTML5, CSS3, JavaScript (ES6), React, and WordPress.
                I hold a First-Class Bachelor's Degree in Electronics and Communication Engineering.
              </p>
              <p className={`leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Currently working in a tech-driven environment, I focus on building dynamic, user-friendly web applications using modern technologies.
                I've received excellent feedback for my hands-on teaching approach, helping beginners confidently step into the world of web development.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-zoho-light border-zoho-blue/30'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 text-zoho-blue`}><i className="fas fa-code"></i> Core Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {['HTML5', 'CSS3', 'JavaScript', 'React', 'Python', 'WordPress'].map(skill => (
                      <span key={skill} className={`px-2 py-1 rounded-md text-sm transition-colors ${darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-white text-gray-700 hover:bg-zoho-blue/10'}`}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-zoho-light border-zoho-purple/30'}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 text-zoho-purple`}><i className="fas fa-layer-group"></i> Frameworks & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Bootstrap', 'Tailwind', 'jQuery', 'Git', 'Figma'].map(fw => (
                      <span key={fw} className={`px-2 py-1 rounded-md text-sm transition-colors ${darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-white text-gray-700 hover:bg-zoho-purple/10'}`}>{fw}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-xl border-l-4 border-zoho-blue hover:shadow-md transition-all ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-zoho-light to-white'}`}>
                <h3 className={`font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}><i className="fas fa-chalkboard-user text-zoho-blue"></i> Teaching Philosophy</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>I believe in hands-on, project-based learning. My students don't just learn syntax — they build real-world applications and gain confidence to start their own projects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== SERVICES SECTION ====================
const servicesData = [
  { name: "HTML & CSS", icon: "fab fa-html5", hours: "8 Hours", level: "Mastery", color: "blue", desc: "Semantic HTML, Flexbox, Grid, Animations, Responsive Design" },
  { name: "JavaScript", icon: "fab fa-js", hours: "10 Hours", level: "Advanced", color: "purple", desc: "ES6+, DOM manipulation, Async/Await, API integration" },
  { name: "React JS", icon: "fab fa-react", hours: "15 Hours", level: "Professional", color: "blue", desc: "Hooks, Context API, Router, State Management" },
  { name: "Python", icon: "fab fa-python", hours: "10 Hours", level: "Core to Pro", color: "purple", desc: "Data structures, OOP, Automation — Start your coding journey" },
  { name: "Machine Learning", icon: "fas fa-brain", hours: "Bonus", level: "2 Free Projects", color: "blue", desc: "Intro to ML with Scikit-learn — Build predictive models" },
  { name: "WordPress", icon: "fab fa-wordpress", hours: "6 Hours", level: "Expert", color: "purple", desc: "Custom themes, plugins, WooCommerce, SEO optimization" }
];

const ServiceCard = ({ service, index, darkMode }) => {
  const iconColors = { blue: '#1890ff', purple: '#722ed1' };
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`group relative rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border-2 animate-fade-in-up ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-zoho-blue' : 'bg-white border-gray-100 hover:border-zoho-blue'}`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-zoho-blue/10 to-zoho-purple/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <i className={`${service.icon} text-5xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300`} style={{ color: iconColors[service.color] }}></i>
      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{service.name}</h3>
      <div className="flex justify-between items-center mb-3">
        <span className="text-zoho-blue font-semibold text-sm"><i className="far fa-clock mr-1"></i> {service.hours}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{service.level}</span>
      </div>
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{service.desc}</p>
      <button onClick={scrollToContact} className="inline-flex items-center gap-2 text-zoho-blue text-sm font-medium hover:text-zoho-purple group-hover:gap-3 transition-all cursor-pointer">
        Enquire Now <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

const ServicesSection = () => {
  const { darkMode } = useTheme();

  return (
    <section id="services" className={`min-h-screen py-20 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-zoho-light to-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-3 relative inline-block ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            What I Offer
            <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
              <path d="M0,2 Q50,0 100,2 T200,2" stroke="#1890ff" fill="none" strokeWidth="2" />
            </svg>
          </h2>
          <p className={`max-w-2xl mx-auto mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Professional training programs designed to take you from beginner to job-ready developer</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, idx) => <ServiceCard key={idx} service={service} index={idx} darkMode={darkMode} />)}
        </div>

        <div className="mt-12 bg-gradient-to-r from-zoho-blue to-zoho-purple rounded-xl p-6 text-center text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
          <i className="fas fa-gift text-3xl mb-3 animate-bounce"></i>
          <h3 className="text-xl font-bold mb-2">🎁 Special Bonus: 2 Free ML Projects</h3>
          <p className="text-white/90">Enroll in Python/ML training and get 2 real-world Machine Learning projects absolutely free!</p>
        </div>
      </div>
    </section>
  );
};

// ==================== PROJECTS SECTION ====================
const projectsData = [
  { title: "DevPortfolio Hub", tech: "React + Tailwind", desc: "Modern developer portfolio with dynamic theme switching", icon: "fa-laptop-code", github: "https://github.com/", demo: "#" },
  { title: "CodeCollab", tech: "React + Socket.io", desc: "Real-time collaborative code editor for teams", icon: "fa-code-branch", github: "https://github.com/", demo: "#" },
  { title: "WeatherWave", tech: "JavaScript + API", desc: "Beautiful weather app with 7-day forecast", icon: "fa-cloud-sun-rain", github: "https://github.com/", demo: "#" },
  { title: "TaskFlow Pro", tech: "React Hooks", desc: "Advanced productivity tool with drag-and-drop", icon: "fa-tasks", github: "https://github.com/", demo: "#" },
  { title: "ML Crop Predictor", tech: "Python + Flask", desc: "Predict optimal crops based on soil data (Free project)", icon: "fa-seedling", github: "https://github.com/", demo: "#" },
  { title: "TechBlog Hub", tech: "WordPress", desc: "Modern tech blog with custom theme and SEO", icon: "fa-blog", github: "https://github.com/", demo: "#" }
];

const ProjectsSection = () => {
  const { darkMode } = useTheme();

  return (
    <section id="projects" className={`min-h-screen py-20 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-zoho-light to-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-3 relative inline-block ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            My Work
            <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
              <path d="M0,2 Q50,0 100,2 T200,2" stroke="#1890ff" fill="none" strokeWidth="2" />
            </svg>
          </h2>
          <p className={darkMode ? 'text-gray-400 mt-4' : 'text-gray-500 mt-4'}>Real projects that solve real problems</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, idx) => (
            <div key={idx} className={`group rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border animate-fade-in-up ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`} style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="relative h-48 bg-gradient-to-br from-zoho-blue to-zoho-purple flex items-center justify-center overflow-hidden">
                <i className={`fas ${project.icon} text-5xl text-white/90 group-hover:scale-110 transition-transform duration-300`}></i>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <div className="p-5">
                <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</h3>
                <p className="text-xs text-zoho-blue mb-2">{project.tech}</p>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.desc}</p>
                <div className="flex gap-3">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors ${darkMode ? 'text-gray-400 hover:text-zoho-blue' : 'text-gray-600 hover:text-zoho-blue'}`}><i className="fab fa-github"></i> Code</a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors ${darkMode ? 'text-gray-400 hover:text-zoho-blue' : 'text-gray-600 hover:text-zoho-blue'}`}><i className="fas fa-external-link-alt"></i> Demo</a>
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className={`min-h-screen py-20 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-zoho-light to-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold mb-3 relative inline-block ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Let's Connect
            <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
              <path d="M0,2 Q50,0 100,2 T200,2" stroke="#1890ff" fill="none" strokeWidth="2" />
            </svg>
          </h2>
          <p className={darkMode ? 'text-gray-400 mt-4' : 'text-gray-500 mt-4'}>Ready to start your next project? I'm just a message away.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`rounded-xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={`w-full px-4 py-2 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-zoho-blue ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-transparent' : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'}`} />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className={`w-full px-4 py-2 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-zoho-blue ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-transparent' : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'}`} />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Message</label>
                <textarea name="message" rows="4" value={formData.message} onChange={handleChange} required className={`w-full px-4 py-2 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-zoho-blue ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-transparent' : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'}`}></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="group relative w-full bg-gradient-to-r from-zoho-blue to-zoho-purple text-white py-3 rounded-lg font-semibold overflow-hidden cursor-pointer disabled:opacity-70">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : <><i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i> Send Message</>}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-zoho-dark to-zoho-purple transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </button>
              {submitted && <p className="text-green-500 text-center mt-4 text-sm animate-fade-in">✓ Message sent successfully! I'll reply within 24 hours.</p>}
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-zoho-blue to-zoho-purple rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><i className="fas fa-phone-alt"></i> Get in Touch</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2"><i className="fas fa-envelope w-6"></i> livnaveen@gmail.com</p>
                <p className="flex items-center gap-2"><i className="fab fa-linkedin w-6"></i> linkedin.com/in/naveenkumar-v</p>
                <p className="flex items-center gap-2"><i className="fab fa-github w-6"></i> github.com/naveenkumar2003301</p>
              </div>
            </div>
            <div className={`rounded-xl p-6 border-2 transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-zoho-blue' : 'bg-white border-blue-200 hover:border-zoho-blue'}`}>
              <i className="fas fa-clock text-3xl text-zoho-blue mb-3"></i>
              <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Flexible Scheduling</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weekdays & weekends available. Custom course plans tailored to your learning pace and goals.</p>
            </div>
            <div className={`rounded-xl p-6 border-2 transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-zoho-purple' : 'bg-white border-indigo-200 hover:border-zoho-purple'}`}>
              <i className="fas fa-globe text-3xl text-zoho-purple mb-3"></i>
              <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Available Worldwide</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available for remote collaborations globally. On-site training available in major tech hubs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <i className="fas fa-code text-zoho-blue animate-pulse"></i>
            <span className="text-sm text-gray-400">NaveenKumar V — Web Developer & Tech Trainer</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-zoho-blue transition-all hover:scale-110"><i className="fab fa-github"></i></a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-zoho-blue transition-all hover:scale-110"><i className="fab fa-linkedin"></i></a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-zoho-blue transition-all hover:scale-110"><i className="fab fa-twitter"></i></a>
          </div>
          <p className="text-gray-500 text-sm">© {currentYear} — Crafted with ❤️ by NaveenKumar</p>
        </div>
      </div>
    </footer>
  );
};

// ==================== THEME PROVIDER ====================
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center p-8">
            <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-400">Please refresh the page to continue</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-zoho-blue text-white rounded-lg hover:bg-zoho-purple transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==================== MAIN APP ====================
const App = () => {
  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      @keyframes spinSlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
      .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-spin-slow { animation: spinSlow 10s linear infinite; }
      .animation-delay-200 { animation-delay: 200ms; opacity: 0; animation-fill-mode: forwards; }
      .animation-delay-400 { animation-delay: 400ms; opacity: 0; animation-fill-mode: forwards; }
      html { scroll-behavior: smooth; }
      
      /* Zoho-inspired color variables */
      :root {
        --zoho-blue: #1890ff;
        --zoho-purple: #722ed1;
        --zoho-dark: #0c2d4b;
        --zoho-light: #e6f7ff;
      }
      
      .bg-zoho-blue { background-color: #1890ff; }
      .bg-zoho-purple { background-color: #722ed1; }
      .text-zoho-blue { color: #1890ff; }
      .text-zoho-purple { color: #722ed1; }
      .border-zoho-blue { border-color: #1890ff; }
      .border-zoho-purple { border-color: #722ed1; }
      .from-zoho-blue { --tw-gradient-from: #1890ff; }
      .to-zoho-purple { --tw-gradient-to: #722ed1; }
      .from-zoho-dark { --tw-gradient-from: #0c2d4b; }
      .bg-zoho-light { background-color: #e6f7ff; }
      
      /* Custom scrollbar for dark mode */
      .dark ::-webkit-scrollbar {
        width: 8px;
      }
      .dark ::-webkit-scrollbar-track {
        background: #1f2937;
      }
      .dark ::-webkit-scrollbar-thumb {
        background: #1890ff;
        border-radius: 4px;
      }
      .dark ::-webkit-scrollbar-thumb:hover {
        background: #722ed1;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="font-sans transition-colors duration-300">
          <Navbar />
          <main>
            <HomeSection />
            <BioSection />
            <ServicesSection />
            <ProjectsSection />
            <ContactSection />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;