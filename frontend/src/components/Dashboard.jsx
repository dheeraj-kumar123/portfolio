import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Eye, Share2, Save, LogOut, Menu, X, Download, Github, Linkedin, Mail, Globe, ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { portfolioAPI } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Dashboard({ onNavigate }) {
  const { user, logout } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState({
    username: '', personalInfo: { name: '', bio: '', image: '', title: '' },
    skills: [], projects: [], education: [], experience: [],
    contact: { email: '', phone: '', github: '', linkedin: '', website: '' },
    theme: { template: 'modern', primaryColor: '#8B5CF6', font: 'Inter' },
    published: false
  });
  const [activeSection, setActiveSection] = useState('personal');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { loadPortfolio(); }, []);

  const loadPortfolio = async () => {
    try {
      const res = await portfolioAPI.get();
      if (res.data) {
        setPortfolio(res.data);
      }
    } catch (error) {
      console.log('No portfolio found or error fetching');
    } finally {
      setLoading(false);
    }
  };

  const savePortfolio = async () => {
    try {
      await portfolioAPI.save(portfolio);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const publishPortfolio = async () => {
    if (!portfolio.username) {
      alert('⚠️ Please set a username before publishing');
      setActiveSection('personal');
      return;
    }
    try {
      await portfolioAPI.save({ ...portfolio, published: true });
      setPortfolio({ ...portfolio, published: true });
      alert('🎉 Portfolio published successfully!');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('hidden-preview');
    if (!element) return;

    setDownloading(true);
    try {
      // Temporarily set display block for capture
      element.style.display = 'block';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 1024
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${portfolio.personalInfo.name || 'Portfolio'}.pdf`);

    } catch (err) {
      console.error('PDF Error:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      // Ensure it stays off-screen
      element.style.display = 'block';
      setDownloading(false);
    }
  };

  const sections = [
    { id: 'personal', label: '👤 Personal', icon: '👤' },
    { id: 'skills', label: '⚡ Skills', icon: '⚡' },
    { id: 'projects', label: '💼 Projects', icon: '💼' },
    { id: 'education', label: '🎓 Education', icon: '🎓' },
    { id: 'experience', label: '💻 Experience', icon: '💻' },
    { id: 'contact', label: '📞 Contact', icon: '📞' },
    { id: 'theme', label: '🎨 Theme', icon: '🎨' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 fade-in">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">PortfolioHub</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={savePortfolio}
              className="hidden md:flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md hover:shadow-lg transition"
            >
              <Save size={18} />
              {saved ? '✓ Saved!' : 'Save'}
            </button>
            <button
              onClick={() => onNavigate('preview')}
              className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition"
            >
              <Eye size={18} />
              Preview
            </button>
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className={`hidden md:flex items-center gap-2 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition ${downloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              <Download size={18} className={downloading ? 'animate-bounce' : ''} />
              {downloading ? '...' : 'Download'}
            </button>
            <button
              onClick={logout}
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white p-4 space-y-2 fade-in">
            <button onClick={savePortfolio} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
              <Save size={18} /> {saved ? '✓ Saved!' : 'Save'}
            </button>
            <button onClick={() => onNavigate('preview')} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
              <Eye size={18} /> Preview
            </button>
            <button onClick={downloadPDF} disabled={downloading} className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${downloading ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}>
              <Download size={18} /> {downloading ? 'Generating PDF...' : 'Download'}
            </button>
            <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-red-600">
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="md:w-64 bg-white rounded-xl shadow-sm p-4">
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-semibold text-purple-600">Welcome, {user?.name}!</p>
            <p className="text-xs text-gray-600 mt-1">Build your amazing portfolio</p>
          </div>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-medium transition-all ${activeSection === s.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm p-6 card-hover">
          {activeSection === 'personal' && (
            <div className="space-y-4 fade-in">
              <h2 className="text-2xl font-bold mb-6 gradient-text">👤 Personal Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username (for portfolio URL) *</label>
                <input type="text" placeholder="johndoe" value={portfolio.username}
                  onChange={(e) => setPortfolio({ ...portfolio, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                <input type="text" placeholder="Full Stack Developer" value={portfolio.personalInfo.title}
                  onChange={(e) => setPortfolio({ ...portfolio, personalInfo: { ...portfolio.personalInfo, title: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio / About Me</label>
                <textarea placeholder="Tell us about yourself..." value={portfolio.personalInfo.bio}
                  onChange={(e) => setPortfolio({ ...portfolio, personalInfo: { ...portfolio.personalInfo, bio: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                <input type="text" placeholder="https://example.com/image.jpg" value={portfolio.personalInfo.image}
                  onChange={(e) => setPortfolio({ ...portfolio, personalInfo: { ...portfolio.personalInfo, image: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition" />
                {portfolio.personalInfo.image && (
                  <img src={portfolio.personalInfo.image} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover border-4 border-purple-200" />
                )}
              </div>
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="space-y-4 fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">⚡ Skills</h2>
                <button onClick={() => setPortfolio({ ...portfolio, skills: [...portfolio.skills, { name: '', level: 50 }] })}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 shadow-md hover:shadow-lg transition">
                  <Plus size={18} /> Add Skill
                </button>
              </div>
              {portfolio.skills.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl mb-2">No skills added yet</p>
                  <p>Click "Add Skill" to get started!</p>
                </div>
              ) : (
                portfolio.skills.map((skill, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex gap-2 mb-3">
                      <input type="text" placeholder="Skill Name (e.g., React)" value={skill.name}
                        onChange={(e) => {
                          const s = [...portfolio.skills];
                          s[i].name = e.target.value;
                          setPortfolio({ ...portfolio, skills: s });
                        }} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                      <button onClick={() => setPortfolio({ ...portfolio, skills: portfolio.skills.filter((_, idx) => idx !== i) })}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Proficiency Level</span>
                        <span className="font-bold text-purple-600">{skill.level}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={skill.level}
                        onChange={(e) => {
                          const s = [...portfolio.skills];
                          s[i].level = e.target.value;
                          setPortfolio({ ...portfolio, skills: s });
                        }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${skill.level}%, #e5e7eb ${skill.level}%, #e5e7eb 100%)` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="space-y-4 fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">💼 Projects</h2>
                <button onClick={() => setPortfolio({ ...portfolio, projects: [...portfolio.projects, { title: '', description: '', image: '', github: '', demo: '' }] })}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 shadow-md hover:shadow-lg transition">
                  <Plus size={18} /> Add Project
                </button>
              </div>
              {portfolio.projects.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl mb-2">No projects yet</p>
                  <p>Showcase your amazing work!</p>
                </div>
              ) : (
                portfolio.projects.map((p, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-purple-600">Project {i + 1}</h3>
                      <button onClick={() => setPortfolio({ ...portfolio, projects: portfolio.projects.filter((_, idx) => idx !== i) })}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <input type="text" placeholder="Project Title" value={p.title}
                      onChange={(e) => {
                        const pr = [...portfolio.projects];
                        pr[i].title = e.target.value;
                        setPortfolio({ ...portfolio, projects: pr });
                      }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <textarea placeholder="Project Description" value={p.description}
                      onChange={(e) => {
                        const pr = [...portfolio.projects];
                        pr[i].description = e.target.value;
                        setPortfolio({ ...portfolio, projects: pr });
                      }} className="w-full px-4 py-2 border rounded-lg h-24 focus:ring-2 focus:ring-purple-500" />
                    <input type="text" placeholder="Image URL" value={p.image}
                      onChange={(e) => {
                        const pr = [...portfolio.projects];
                        pr[i].image = e.target.value;
                        setPortfolio({ ...portfolio, projects: pr });
                      }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <input type="text" placeholder="GitHub URL" value={p.github}
                      onChange={(e) => {
                        const pr = [...portfolio.projects];
                        pr[i].github = e.target.value;
                        setPortfolio({ ...portfolio, projects: pr });
                      }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                    <input type="text" placeholder="Live Demo URL" value={p.demo}
                      onChange={(e) => {
                        const pr = [...portfolio.projects];
                        pr[i].demo = e.target.value;
                        setPortfolio({ ...portfolio, projects: pr });
                      }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === 'education' && (
            <div className="space-y-4 fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">🎓 Education</h2>
                <button onClick={() => setPortfolio({ ...portfolio, education: [...portfolio.education, { school: '', degree: '', year: '', description: '' }] })}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 shadow-md hover:shadow-lg transition">
                  <Plus size={18} /> Add
                </button>
              </div>
              {portfolio.education.map((e, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-purple-600">Education {i + 1}</h3>
                    <button onClick={() => setPortfolio({ ...portfolio, education: portfolio.education.filter((_, idx) => idx !== i) })}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={20} /></button>
                  </div>
                  <input type="text" placeholder="School/University" value={e.school}
                    onChange={(ev) => {
                      const ed = [...portfolio.education];
                      ed[i].school = ev.target.value;
                      setPortfolio({ ...portfolio, education: ed });
                    }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <input type="text" placeholder="Degree" value={e.degree}
                    onChange={(ev) => {
                      const ed = [...portfolio.education];
                      ed[i].degree = ev.target.value;
                      setPortfolio({ ...portfolio, education: ed });
                    }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <input type="text" placeholder="Year (e.g., 2020-2024)" value={e.year}
                    onChange={(ev) => {
                      const ed = [...portfolio.education];
                      ed[i].year = ev.target.value;
                      setPortfolio({ ...portfolio, education: ed });
                    }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <textarea placeholder="Description" value={e.description}
                    onChange={(ev) => {
                      const ed = [...portfolio.education];
                      ed[i].description = ev.target.value;
                      setPortfolio({ ...portfolio, education: ed });
                    }} className="w-full px-4 py-2 border rounded-lg h-20 focus:ring-2 focus:ring-purple-500" />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-4 fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">💻 Experience</h2>
                <button onClick={() => setPortfolio({ ...portfolio, experience: [...portfolio.experience, { company: '', position: '', duration: '', description: '' }] })}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 shadow-md hover:shadow-lg transition">
                  <Plus size={18} /> Add
                </button>
              </div>
              {portfolio.experience.map((ex, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-purple-600">Experience {i + 1}</h3>
                    <button onClick={() => setPortfolio({ ...portfolio, experience: portfolio.experience.filter((_, idx) => idx !== i) })}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={20} /></button>
                  </div>
                  <input type="text" placeholder="Company" value={ex.company}
                    onChange={(e) => {
                      const exp = [...portfolio.experience];
                      exp[i].company = e.target.value;
                      setPortfolio({ ...portfolio, experience: exp });
                    }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <input type="text" placeholder="Position" value={ex.position}
                    onChange={(e) => {
                      const exp = [...portfolio.experience];
                      exp[i].position = e.target.value;
                      setPortfolio({ ...portfolio, experience: exp });
                    }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <input type="text" placeholder="Duration (e.g., Jan 2023 - Present)" value={ex.duration}
                    onChange={(e) => {
                      const exp = [...portfolio.experience];
                      exp[i].duration = e.target.value;
                      setPortfolio({ ...portfolio, experience: exp });
                    }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
                  <textarea placeholder="Description" value={ex.description}
                    onChange={(e) => {
                      const exp = [...portfolio.experience];
                      exp[i].description = e.target.value;
                      setPortfolio({ ...portfolio, experience: exp });
                    }} className="w-full px-4 py-2 border rounded-lg h-20 focus:ring-2 focus:ring-purple-500" />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-4 fade-in">
              <h2 className="text-2xl font-bold mb-6 gradient-text">📞 Contact Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" placeholder="john@example.com" value={portfolio.contact.email}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, email: e.target.value } })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="text" placeholder="+1 234 567 8900" value={portfolio.contact.phone}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, phone: e.target.value } })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input type="text" placeholder="https://github.com/yourusername" value={portfolio.contact.github}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, github: e.target.value } })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input type="text" placeholder="https://linkedin.com/in/yourusername" value={portfolio.contact.linkedin}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, linkedin: e.target.value } })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input type="text" placeholder="https://yourwebsite.com" value={portfolio.contact.website}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, website: e.target.value } })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
          )}

          {activeSection === 'theme' && (
            <div className="space-y-6 fade-in">
              <h2 className="text-2xl font-bold mb-6 gradient-text">🎨 Theme Settings</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Style</label>
                <select value={portfolio.theme.template}
                  onChange={(e) => setPortfolio({ ...portfolio, theme: { ...portfolio.theme, template: e.target.value } })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="modern">🎯 Modern</option>
                  <option value="minimal">✨ Minimal</option>
                  <option value="creative">🎨 Creative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={portfolio.theme.primaryColor}
                    onChange={(e) => setPortfolio({ ...portfolio, theme: { ...portfolio.theme, primaryColor: e.target.value } })}
                    className="w-20 h-12 border-2 rounded-lg cursor-pointer" />
                  <input type="text" value={portfolio.theme.primaryColor}
                    onChange={(e) => setPortfolio({ ...portfolio, theme: { ...portfolio.theme, primaryColor: e.target.value } })}
                    className="flex-1 px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select value={portfolio.theme.font}
                  onChange={(e) => setPortfolio({ ...portfolio, theme: { ...portfolio.theme, font: e.target.value } })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              <div className="border-t pt-6 mt-6">
                <button onClick={publishPortfolio}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition">
                  <Share2 size={24} />
                  {portfolio.published ? '✓ Update Published Portfolio' : '🚀 Publish Portfolio'}
                </button>
                {portfolio.published && portfolio.username && (
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg fade-in">
                    <p className="text-sm font-semibold text-green-800 mb-2">🎉 Your portfolio is live!</p>
                    <p className="font-mono text-sm bg-white p-3 rounded border break-all">
                      https://portfoliohub.com/{portfolio.username}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Hidden Preview for PDF Generation - Improved visibility for capture */}
      <div id="hidden-preview" style={{
        position: 'fixed',
        left: '0',
        top: '0',
        width: '1024px',
        backgroundColor: 'white',
        fontFamily: portfolio.theme.font,
        zIndex: -9999,
        pointerEvents: 'none',
        visibility: 'visible',
        display: 'block',
        minHeight: '1000px'
      }}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            {portfolio.personalInfo.image && (
              <img src={portfolio.personalInfo.image} alt={portfolio.personalInfo.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4" style={{ borderColor: portfolio.theme.primaryColor }} />
            )}
            <h1 className="text-5xl font-bold mb-2">{portfolio.personalInfo.name || 'Your Name'}</h1>
            <p className="text-2xl mb-4 font-semibold" style={{ color: portfolio.theme.primaryColor }}>{portfolio.personalInfo.title || 'Your Title'}</p>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{portfolio.personalInfo.bio}</p>
          </div>
          {portfolio.skills.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8" style={{ color: portfolio.theme.primaryColor }}>⚡ Skills</h2>
              <div className="grid grid-cols-2 gap-6">
                {portfolio.skills.map((skill, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{skill.name}</span>
                      <span className="font-bold" style={{ color: portfolio.theme.primaryColor }}>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${skill.level}%`, backgroundColor: portfolio.theme.primaryColor }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {portfolio.projects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8" style={{ color: portfolio.theme.primaryColor }}>💼 Projects</h2>
              <div className="grid grid-cols-2 gap-6">
                {portfolio.projects.map((p, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {p.image && <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                      <p className="text-gray-600 mb-4">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {portfolio.experience.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8" style={{ color: portfolio.theme.primaryColor }}>💻 Experience</h2>
              {portfolio.experience.map((ex, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 mb-4">
                  <h3 className="text-xl font-bold">{ex.position}</h3>
                  <p className="font-semibold" style={{ color: portfolio.theme.primaryColor }}>{ex.company}</p>
                  <p className="text-sm text-gray-600 mb-2">{ex.duration}</p>
                  <p className="text-gray-700">{ex.description}</p>
                </div>
              ))}
            </div>
          )}
          {portfolio.education.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8" style={{ color: portfolio.theme.primaryColor }}>🎓 Education</h2>
              {portfolio.education.map((e, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 mb-4">
                  <h3 className="text-xl font-bold">{e.degree}</h3>
                  <p className="font-semibold" style={{ color: portfolio.theme.primaryColor }}>{e.school}</p>
                  <p className="text-sm text-gray-600 mb-2">{e.year}</p>
                  <p className="text-gray-700">{e.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6" style={{ color: portfolio.theme.primaryColor }}>📞 Contact</h2>
            <div className="flex justify-center gap-6">
              {portfolio.contact.email && <p>📧 {portfolio.contact.email}</p>}
              {portfolio.contact.phone && <p>📱 {portfolio.contact.phone}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;