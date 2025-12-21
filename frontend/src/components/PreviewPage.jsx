import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Globe, ExternalLink, ArrowLeft } from 'lucide-react';
import { portfolioAPI } from '../services/api';

function PreviewPage({ onNavigate }) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPortfolio(); }, []);

  const loadPortfolio = async () => {
    try {
      const res = await portfolioAPI.get();
      setPortfolio(res.data);
    } catch (error) {
      console.error('Error loading portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) return <div className="min-h-screen flex items-center justify-center">No portfolio found</div>;

  const { personalInfo, skills, projects, education, experience, contact, theme } = portfolio;

  return (
    <div className="min-h-screen bg-gray-50 fade-in" style={{ fontFamily: theme.font }}>
      <div className="bg-white shadow-md sticky top-0 z-50 p-4 flex justify-between items-center">
        <button onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md transition">
          <ArrowLeft size={18} /> Back to Editor
        </button>
        <h2 className="text-xl font-bold gradient-text">📱 Portfolio Preview</h2>
        <div className="w-32"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-16 fade-in">
          {personalInfo.image && (
            <img src={personalInfo.image} alt={personalInfo.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 shadow-lg card-hover"
              style={{ borderColor: theme.primaryColor }} />
          )}
          <h1 className="text-5xl font-bold mb-2">{personalInfo.name || 'Your Name'}</h1>
          <p className="text-2xl mb-4 font-semibold" style={{ color: theme.primaryColor }}>
            {personalInfo.title || 'Your Title'}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{personalInfo.bio}</p>
          <div className="flex justify-center gap-4 mt-6">
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition card-hover"
                style={{ color: theme.primaryColor }}>
                <Github size={24} />
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition card-hover"
                style={{ color: theme.primaryColor }}>
                <Linkedin size={24} />
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition card-hover"
                style={{ color: theme.primaryColor }}>
                <Mail size={24} />
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition card-hover"
                style={{ color: theme.primaryColor }}>
                <Globe size={24} />
              </a>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-16 fade-in">
            <h2 className="text-3xl font-bold mb-8" style={{ color: theme.primaryColor }}>⚡ Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md card-hover">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{skill.name}</span>
                    <span className="font-bold" style={{ color: theme.primaryColor }}>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all"
                      style={{ width: `${skill.level}%`, backgroundColor: theme.primaryColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-16 fade-in">
            <h2 className="text-3xl font-bold mb-8" style={{ color: theme.primaryColor }}>💼 Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
                  {p.image && <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                    <p className="text-gray-600 mb-4">{p.description}</p>
                    <div className="flex gap-4">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 font-medium hover:underline"
                          style={{ color: theme.primaryColor }}>
                          <Github size={18} />Code
                        </a>
                      )}
                      {p.demo && (
                        <a href={p.demo} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 font-medium hover:underline"
                          style={{ color: theme.primaryColor }}>
                          <ExternalLink size={18} />Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mb-16 fade-in">
            <h2 className="text-3xl font-bold mb-8" style={{ color: theme.primaryColor }}>💻 Experience</h2>
            {experience.map((ex, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 mb-4 card-hover">
                <h3 className="text-xl font-bold">{ex.position}</h3>
                <p className="font-semibold" style={{ color: theme.primaryColor }}>{ex.company}</p>
                <p className="text-sm text-gray-600 mb-2">{ex.duration}</p>
                <p className="text-gray-700">{ex.description}</p>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-16 fade-in">
            <h2 className="text-3xl font-bold mb-8" style={{ color: theme.primaryColor }}>🎓 Education</h2>
            {education.map((e, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 mb-4 card-hover">
                <h3 className="text-xl font-bold">{e.degree}</h3>
                <p className="font-semibold" style={{ color: theme.primaryColor }}>{e.school}</p>
                <p className="text-sm text-gray-600 mb-2">{e.year}</p>
                <p className="text-gray-700">{e.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center bg-white rounded-lg shadow-md p-8 fade-in">
          <h2 className="text-3xl font-bold mb-6" style={{ color: theme.primaryColor }}>📞 Get In Touch</h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-700">
            {contact.email && <p className="font-medium">📧 {contact.email}</p>}
            {contact.phone && <p className="font-medium">📱 {contact.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;