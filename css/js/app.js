/* ═══════════════════════════════════════════════════
   RESUMIND — app.js
   All application logic for AI CV Builder
═══════════════════════════════════════════════════ */

// ── STATE ─────────────────────────────────────────
let selectedTemplate = 'classic';
let experiences = [];
let educations = [];
let lastCVData = null;

// ── ON LOAD: ADD DEFAULT ENTRIES ──────────────────
window.addEventListener('DOMContentLoaded', () => {
  addExperience();
  addEducation();
});

// ── TEMPLATE SELECTION ────────────────────────────
function selectTemplate(el) {
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  selectedTemplate = el.dataset.template;
  // Re-render if CV already generated
  if (lastCVData) renderCV(lastCVData);
}

// ── TAB SWITCHING ─────────────────────────────────
function switchTab(e, name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

// ── TOAST NOTIFICATIONS ───────────────────────────
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3800);
}

// ── ADD / REMOVE EXPERIENCE ───────────────────────
function addExperience() {
  const id = Date.now();
  experiences.push(id);
  const list = document.getElementById('experience-list');
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = 'exp-' + id;
  card.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('exp-${id}', ${id}, 'experience')" title="Remove">✕</button>
    <div class="row-2" style="padding-right:36px">
      <div class="field-group">
        <label class="field-label">Job Title</label>
        <input type="text" id="exp-title-${id}" class="field-input" placeholder="Senior Software Engineer" />
      </div>
      <div class="field-group">
        <label class="field-label">Company / Organisation</label>
        <input type="text" id="exp-company-${id}" class="field-input" placeholder="TechCorp Ltd" />
      </div>
    </div>
    <div class="row-2">
      <div class="field-group">
        <label class="field-label">Start Date</label>
        <input type="text" id="exp-start-${id}" class="field-input" placeholder="Jan 2021" />
      </div>
      <div class="field-group">
        <label class="field-label">End Date</label>
        <input type="text" id="exp-end-${id}" class="field-input" placeholder="Present" />
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">Location</label>
      <input type="text" id="exp-loc-${id}" class="field-input" placeholder="Lagos, Nigeria" />
    </div>
    <div class="field-group">
      <label class="field-label">Key Achievements & Responsibilities <span class="label-hint">(AI will enhance and quantify these)</span></label>
      <textarea id="exp-desc-${id}" class="field-input" rows="3"
        placeholder="Led a team of 5 engineers, built payment API processing $2M/month, reduced latency by 40%..."></textarea>
    </div>
  `;
  list.appendChild(card);
}

function addEducation() {
  const id = Date.now();
  educations.push(id);
  const list = document.getElementById('education-list');
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = 'edu-' + id;
  card.innerHTML = `
    <button class="remove-btn" onclick="removeEntry('edu-${id}', ${id}, 'education')" title="Remove">✕</button>
    <div class="row-2" style="padding-right:36px">
      <div class="field-group">
        <label class="field-label">Degree / Qualification</label>
        <input type="text" id="edu-degree-${id}" class="field-input" placeholder="B.Sc Computer Science" />
      </div>
      <div class="field-group">
        <label class="field-label">Institution</label>
        <input type="text" id="edu-school-${id}" class="field-input" placeholder="University of Lagos" />
      </div>
    </div>
    <div class="row-2">
      <div class="field-group">
        <label class="field-label">Year / Period</label>
        <input type="text" id="edu-year-${id}" class="field-input" placeholder="2015 – 2019" />
      </div>
      <div class="field-group">
        <label class="field-label">Grade / Honours</label>
        <input type="text" id="edu-grade-${id}" class="field-input" placeholder="First Class / 3.9 GPA" />
      </div>
    </div>
  `;
  list.appendChild(card);
}

function removeEntry(domId, id, type) {
  const el = document.getElementById(domId);
  if (el) el.remove();
  if (type === 'experience') experiences = experiences.filter(e => e !== id);
  if (type === 'education')  educations  = educations.filter(e => e !== id);
}

// ── COLLECT ALL FORM DATA ─────────────────────────
function collectData() {
  const expData = experiences.map(id => ({
    title:   (document.getElementById('exp-title-'   + id)?.value || '').trim(),
    company: (document.getElementById('exp-company-' + id)?.value || '').trim(),
    start:   (document.getElementById('exp-start-'   + id)?.value || '').trim(),
    end:     (document.getElementById('exp-end-'     + id)?.value || '').trim(),
    loc:     (document.getElementById('exp-loc-'     + id)?.value || '').trim(),
    desc:    (document.getElementById('exp-desc-'    + id)?.value || '').trim(),
  })).filter(e => e.title || e.company);

  const eduData = educations.map(id => ({
    degree: (document.getElementById('edu-degree-' + id)?.value || '').trim(),
    school: (document.getElementById('edu-school-' + id)?.value || '').trim(),
    year:   (document.getElementById('edu-year-'   + id)?.value || '').trim(),
    grade:  (document.getElementById('edu-grade-'  + id)?.value || '').trim(),
  })).filter(e => e.degree || e.school);

  return {
    fname:        document.getElementById('fname')?.value.trim() || '',
    lname:        document.getElementById('lname')?.value.trim() || '',
    profTitle:    document.getElementById('prof-title')?.value.trim() || '',
    email:        document.getElementById('email')?.value.trim() || '',
    phone:        document.getElementById('phone')?.value.trim() || '',
    location:     document.getElementById('location')?.value.trim() || '',
    website:      document.getElementById('website')?.value.trim() || '',
    bio:          document.getElementById('bio')?.value.trim() || '',
    experiences:  expData,
    educations:   eduData,
    techSkills:   document.getElementById('tech-skills')?.value.trim() || '',
    softSkills:   document.getElementById('soft-skills')?.value.trim() || '',
    certifications: document.getElementById('certifications')?.value.trim() || '',
    languages:    document.getElementById('languages')?.value.trim() || '',
    targetRole:   document.getElementById('target-role')?.value.trim() || '',
    tone:         document.getElementById('tone')?.value || 'dynamic',
    length:       document.getElementById('cv-length')?.value || 'two-page',
  };
}

// ── BUILD AI PROMPT ───────────────────────────────
function buildPrompt(d) {
  const expBlock = d.experiences.length
    ? d.experiences.map(e =>
        `• ${e.title} at ${e.company} | ${e.start} – ${e.end} | ${e.loc}\n  Notes: ${e.desc}`
      ).join('\n')
    : 'Not provided.';

  const eduBlock = d.educations.length
    ? d.educations.map(e =>
        `• ${e.degree} — ${e.school} (${e.year})${e.grade ? ' | ' + e.grade : ''}`
      ).join('\n')
    : 'Not provided.';

  return `You are a world-class CV writer with 20 years of experience crafting resumes that get people hired at top companies.

CANDIDATE DETAILS:
Full Name: ${d.fname} ${d.lname}
Target Job Title: ${d.profTitle}
Email: ${d.email} | Phone: ${d.phone} | Location: ${d.location} | Website/LinkedIn: ${d.website}
Background Summary: ${d.bio || 'Not provided'}

WORK EXPERIENCE:
${expBlock}

EDUCATION:
${eduBlock}

TECHNICAL SKILLS: ${d.techSkills || 'Not provided'}
SOFT SKILLS: ${d.softSkills || 'Not provided'}
CERTIFICATIONS: ${d.certifications || 'None'}
LANGUAGES: ${d.languages || 'Not provided'}

TARGET ROLE / JOB DESCRIPTION:
${d.targetRole || 'General application — make it broadly impressive'}

INSTRUCTIONS:
- Writing tone: ${d.tone}
- CV length: ${d.length}
- Write a compelling 3-4 sentence professional summary that immediately grabs attention
- For each work experience, write 3-5 strong bullet points using the STAR method (Situation, Task, Action, Result)
- Quantify achievements where possible (%, $, team sizes, timeframes)
- Use powerful action verbs (Spearheaded, Engineered, Drove, Scaled, etc.)
- Tailor content to the target role/job description if provided
- Optimize for ATS (Applicant Tracking Systems)
- Split techSkills and softSkills into clean arrays of individual items
- Certifications as an array, languages as an array

YOU MUST RESPOND WITH ONLY VALID JSON — no markdown, no code fences, no explanation. Just the raw JSON object:

{
  "name": "Full Name",
  "title": "Professional Title",
  "email": "email@example.com",
  "phone": "+000 000 000",
  "location": "City, Country",
  "website": "linkedin.com/in/handle",
  "summary": "Compelling professional summary paragraph here...",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "Jan 2021 – Present",
      "location": "City",
      "bullets": [
        "Achievement bullet 1 with metrics",
        "Achievement bullet 2",
        "Achievement bullet 3"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Title",
      "school": "Institution Name",
      "year": "2015 – 2019",
      "grade": "First Class Honours"
    }
  ],
  "techSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "softSkills": ["Skill 1", "Skill 2"],
  "certifications": ["Certification 1"],
  "languages": ["English (Native)"]
}`;
}

// ── GENERATE CV (MAIN FUNCTION) ───────────────────
async function generateCV() {
  const apiKey = document.getElementById('groq-api-key').value.trim();
  if (!apiKey) {
    showToast('⚠️ Please enter your Groq API key first.', 'error');
    return;
  }
  if (!apiKey.startsWith('gsk_')) {
    showToast('⚠️ Invalid Groq API key. It should start with gsk_', 'error');
    return;
  }

  const data = collectData();
  const fullName = (data.fname + ' ' + data.lname).trim();
  if (!fullName) {
    showToast('⚠️ Please enter at least your name.', 'error');
    return;
  }

  // UI — loading state
  const btn     = document.getElementById('generate-btn');
  const loadBar = document.getElementById('loading-bar');
  const loadMsg = document.getElementById('loading-msg');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-icon">⏳</span><span>GENERATING YOUR CV…</span>';
  loadBar.classList.add('active');
  loadMsg.classList.add('active');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: buildPrompt(data) }],
        temperature: 0.7,
        max_tokens: 3500,
      })
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const msg = errBody?.error?.message || `API error ${response.status}`;
      throw new Error(msg);
    }

    const result = await response.json();
    let raw = result.choices[0].message.content.trim();

    // Strip accidental markdown fences
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    const cvData = JSON.parse(raw);
    lastCVData = cvData;
    renderCV(cvData);
    showToast('✅ CV generated successfully!', 'success');

  } catch (err) {
    console.error('Groq Error:', err);
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      showToast('❌ Network error. Check your internet connection.', 'error');
    } else if (err.message.includes('401') || err.message.includes('invalid_api_key')) {
      showToast('❌ Invalid API key. Check your Groq API key.', 'error');
    } else if (err instanceof SyntaxError) {
      showToast('❌ AI returned unexpected format. Try again.', 'error');
    } else {
      showToast('❌ Error: ' + err.message, 'error');
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">⚡</span><span>GENERATE MY CV NOW</span>';
    loadBar.classList.remove('active');
    loadMsg.classList.remove('active');
  }
}

// ── RENDER CV TO PREVIEW ──────────────────────────
function renderCV(cv) {
  const output      = document.getElementById('cv-output');
  const placeholder = document.getElementById('cv-placeholder');
  const actions     = document.getElementById('preview-actions');

  placeholder.style.display = 'none';
  actions.style.display = 'flex';

  const renderers = {
    classic:   renderClassic,
    modern:    renderModern,
    creative:  renderCreative,
    executive: renderExecutive,
  };

  const renderer = renderers[selectedTemplate] || renderers.classic;
  output.innerHTML = renderer(cv);
}

// ── HELPER: build bullet list HTML ────────────────
function bulletsHTML(arr, cls) {
  if (!arr || !arr.length) return '';
  return `<ul class="${cls}">${arr.map(b => `<li>${b}</li>`).join('')}</ul>`;
}
function tagsHTML(arr, cls) {
  if (!arr || !arr.length) return '';
  return `<div class="tag-wrap">${arr.map(s => `<span class="${cls}">${s}</span>`).join('')}</div>`;
}
function skillTagsHTML(arr, cls) {
  if (!arr || !arr.length) return '';
  return `<div class="skill-wrap">${arr.map(s => `<span class="${cls}">${s}</span>`).join('')}</div>`;
}
function contactLine(cv) {
  return [cv.email, cv.phone, cv.location, cv.website]
    .filter(Boolean)
    .map(v => `<span>${v}</span>`)
    .join('');
}

// ── CLASSIC RENDERER ──────────────────────────────
function renderClassic(cv) {
  const allSkills = [...(cv.techSkills||[]), ...(cv.softSkills||[])];
  const expHTML = (cv.experience||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.title}</span>
        <span class="entry-date">${e.period||''}</span>
      </div>
      <div class="entry-org">${e.company}${e.location ? ' · ' + e.location : ''}</div>
      ${bulletsHTML(e.bullets, 'entry-bullets')}
    </div>`).join('');
  const eduHTML = (cv.education||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.degree}</span>
        <span class="entry-date">${e.year||''}</span>
      </div>
      <div class="entry-org">${e.school}${e.grade ? ' · ' + e.grade : ''}</div>
    </div>`).join('');
  return `<div class="cv-classic">
    <div class="cv-name">${cv.name||''}</div>
    <div class="cv-title">${cv.title||''}</div>
    <div class="cv-contact-bar">${contactLine(cv)}</div>
    ${cv.summary ? `<div class="cv-section-title">Professional Summary</div><div class="cv-summary">${cv.summary}</div>` : ''}
    ${expHTML ? `<div class="cv-section-title">Work Experience</div>${expHTML}` : ''}
    ${eduHTML ? `<div class="cv-section-title">Education</div>${eduHTML}` : ''}
    ${allSkills.length ? `<div class="cv-section-title">Skills</div>${skillTagsHTML(allSkills,'skill-tag')}` : ''}
    ${(cv.certifications||[]).length ? `<div class="cv-section-title">Certifications</div>${skillTagsHTML(cv.certifications,'skill-tag')}` : ''}
    ${(cv.languages||[]).length ? `<div class="cv-section-title">Languages</div>${skillTagsHTML(cv.languages,'skill-tag')}` : ''}
  </div>`;
}

// ── MODERN RENDERER ───────────────────────────────
function renderModern(cv) {
  const expHTML = (cv.experience||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.title}</span>
        <span class="entry-date">${e.period||''}</span>
      </div>
      <div class="entry-org">${e.company}${e.location ? ' · ' + e.location : ''}</div>
      ${bulletsHTML(e.bullets, 'entry-bullets')}
    </div>`).join('');
  const eduHTML = (cv.education||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.degree}</span>
        <span class="entry-date">${e.year||''}</span>
      </div>
      <div class="entry-org">${e.school}${e.grade ? ' · ' + e.grade : ''}</div>
    </div>`).join('');
  const techSkillBars = (cv.techSkills||[]).slice(0,8).map(s =>
    `<div class="skill-bar-label">${s}</div><div class="skill-bar-track"><div class="skill-bar-fill" style="width:${70+Math.floor(Math.random()*28)}%"></div></div>`
  ).join('');
  return `<div class="cv-modern">
    <div class="cv-sidebar">
      <div class="cv-name">${cv.name||''}</div>
      <div class="cv-title">${cv.title||''}</div>
      <div class="sidebar-section">
        <div class="sidebar-title">Contact</div>
        <div class="sidebar-text">${[cv.email, cv.phone, cv.location, cv.website].filter(Boolean).join('<br>')}</div>
      </div>
      ${techSkillBars ? `<div class="sidebar-section"><div class="sidebar-title">Technical Skills</div>${techSkillBars}</div>` : ''}
      ${(cv.softSkills||[]).length ? `<div class="sidebar-section"><div class="sidebar-title">Soft Skills</div><div class="sidebar-text">${cv.softSkills.join(', ')}</div></div>` : ''}
      ${(cv.languages||[]).length ? `<div class="sidebar-section"><div class="sidebar-title">Languages</div><div class="sidebar-text">${cv.languages.join('<br>')}</div></div>` : ''}
      ${(cv.certifications||[]).length ? `<div class="sidebar-section"><div class="sidebar-title">Certifications</div><div class="sidebar-text">${cv.certifications.join('<br>')}</div></div>` : ''}
    </div>
    <div class="cv-main">
      ${cv.summary ? `<div class="section-title">Profile</div><div class="cv-summary">${cv.summary}</div>` : ''}
      ${expHTML ? `<div class="section-title">Experience</div>${expHTML}` : ''}
      ${eduHTML ? `<div class="section-title">Education</div>${eduHTML}` : ''}
    </div>
  </div>`;
}

// ── CREATIVE RENDERER ─────────────────────────────
function renderCreative(cv) {
  const allSkills = [...(cv.techSkills||[]), ...(cv.softSkills||[])];
  const expHTML = (cv.experience||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.title}</span>
        <span class="entry-date">${e.period||''}</span>
      </div>
      <div class="entry-org">${e.company}${e.location ? ' · ' + e.location : ''}</div>
      ${bulletsHTML(e.bullets, 'entry-bullets')}
    </div>`).join('');
  const eduHTML = (cv.education||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.degree}</span>
        <span class="entry-date">${e.year||''}</span>
      </div>
      <div class="entry-org">${e.school}${e.grade ? ' · ' + e.grade : ''}</div>
    </div>`).join('');
  return `<div class="cv-creative">
    <div class="cv-hero-band">
      <div class="cv-name">${cv.name||''}</div>
      <div class="cv-title">${cv.title||''}</div>
      <div class="cv-contact-bar">${contactLine(cv)}</div>
    </div>
    <div class="cv-body">
      ${cv.summary ? `<div class="section-title">About Me</div><div class="cv-summary">${cv.summary}</div>` : ''}
      ${expHTML ? `<div class="section-title">Experience</div>${expHTML}` : ''}
      ${eduHTML ? `<div class="section-title">Education</div>${eduHTML}` : ''}
      ${allSkills.length ? `<div class="section-title">Skills</div>${tagsHTML(allSkills,'tag')}` : ''}
      ${(cv.certifications||[]).length ? `<div class="section-title" style="margin-top:16px">Certifications</div>${tagsHTML(cv.certifications,'tag')}` : ''}
      ${(cv.languages||[]).length ? `<div class="section-title" style="margin-top:16px">Languages</div>${tagsHTML(cv.languages,'tag')}` : ''}
    </div>
  </div>`;
}

// ── EXECUTIVE RENDERER ────────────────────────────
function renderExecutive(cv) {
  const allSkills = [...(cv.techSkills||[]), ...(cv.softSkills||[])];
  const expHTML = (cv.experience||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.title}</span>
        <span class="entry-date">${e.period||''}</span>
      </div>
      <div class="entry-org">${e.company}${e.location ? ' · ' + e.location : ''}</div>
      ${bulletsHTML(e.bullets, 'entry-bullets')}
    </div>`).join('');
  const eduHTML = (cv.education||[]).map(e => `
    <div class="entry-row">
      <div class="entry-top">
        <span class="entry-title">${e.degree}</span>
        <span class="entry-date">${e.year||''}</span>
      </div>
      <div class="entry-org">${e.school}${e.grade ? ' · ' + e.grade : ''}</div>
    </div>`).join('');
  return `<div class="cv-executive">
    <div class="cv-header-band">
      <div class="cv-name">${cv.name||''}</div>
      <div class="cv-gold-rule"></div>
      <div class="cv-title">${cv.title||''}</div>
      <div class="cv-contact-bar">${contactLine(cv)}</div>
    </div>
    <div class="cv-body">
      ${cv.summary ? `<div class="section-title">Executive Profile</div><div class="cv-summary">${cv.summary}</div>` : ''}
      ${expHTML ? `<div class="section-title">Professional Experience</div>${expHTML}` : ''}
      ${eduHTML ? `<div class="section-title">Education</div>${eduHTML}` : ''}
      ${allSkills.length ? `<div class="section-title">Core Competencies</div>${tagsHTML(allSkills,'tag')}` : ''}
      ${(cv.certifications||[]).length ? `<div class="section-title" style="margin-top:20px">Certifications</div>${tagsHTML(cv.certifications,'tag')}` : ''}
      ${(cv.languages||[]).length ? `<div class="section-title" style="margin-top:20px">Languages</div>${tagsHTML(cv.languages,'tag')}` : ''}
    </div>
  </div>`;
}

// ── DOWNLOAD: HTML ────────────────────────────────
function downloadHTML() {
  const output = document.getElementById('cv-output');
  if (!output || !output.innerHTML.trim()) {
    showToast('Generate a CV first!', 'error'); return;
  }
  const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,600;1,400&family=Lato:wght@300;400;700&family=Montserrat:wght@300;500;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">`;
  // Inline the CV template styles for the download
  const styleTag = `<style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:white;font-family:Lato,sans-serif}
    ${getTemplateCSS()}
  </style>`;
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>CV - ${lastCVData?.name||'Resume'}</title>${fontLink}${styleTag}</head><body>${output.innerHTML}</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const safeName = (lastCVData?.name || 'resume').toLowerCase().replace(/\s+/g, '-');
  a.download = `${safeName}-cv.html`;
  a.click();
  showToast('📥 HTML file downloaded!', 'success');
}

// ── PRINT (saves as PDF via browser) ─────────────
function printCV() {
  const output = document.getElementById('cv-output');
  if (!output || !output.innerHTML.trim()) {
    showToast('Generate a CV first!', 'error'); return;
  }
  window.print();
}

// ── DOWNLOAD: WORD (.docx via HTML-in-Word trick) ─
function downloadWord() {
  const output = document.getElementById('cv-output');
  if (!output || !output.innerHTML.trim()) {
    showToast('Generate a CV first!', 'error'); return;
  }
  const wordCSS = `
    body { font-family: Calibri, sans-serif; }
    .cv-name { font-size: 28pt; font-weight: bold; }
    .cv-title, .cv-title-line { font-size: 12pt; color: #555; letter-spacing: 1px; margin: 4px 0 12px; }
    .cv-contact-bar, .cv-contact { font-size: 10pt; color: #666; margin-bottom: 14px; }
    .cv-contact-bar span, .cv-contact span { margin-right: 16px; }
    .cv-section-title, .section-title { font-size: 10pt; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px; color: #222; }
    .entry-title { font-weight: bold; font-size: 11pt; }
    .entry-date { font-size: 10pt; color: #777; float: right; }
    .entry-org { font-size: 10pt; color: #555; margin: 2px 0 5px; }
    .entry-bullets li { font-size: 10.5pt; margin-bottom: 3px; }
    .cv-summary, .cv-summary-text { font-size: 11pt; line-height: 1.7; }
    .skill-tag, .tag { border: 1px solid #ccc; padding: 2px 8px; margin: 2px; display: inline-block; font-size: 9.5pt; }
    /* Hide sidebar for word */
    .cv-sidebar { display: none; }
    .cv-modern .cv-main { padding: 0; }
    .cv-hero-band, .cv-header-band { background: #333 !important; color: white !important; padding: 20px; margin-bottom: 14px; }
    .cv-name { color: #000 !important; }
  `;
  const content = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head><meta charset="UTF-8"><style>${wordCSS}</style></head>
  <body>${output.innerHTML}</body></html>`;
  const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const safeName = (lastCVData?.name || 'resume').toLowerCase().replace(/\s+/g, '-');
  a.download = `${safeName}-cv.doc`;
  a.click();
  showToast('📄 Word file downloaded!', 'success');
}

// ── GET INLINE TEMPLATE CSS (for HTML download) ───
function getTemplateCSS() {
  // Fetch the stylesheet text for embedding in downloaded files
  try {
    const sheets = document.styleSheets;
    for (let s of sheets) {
      try {
        const rules = [...s.cssRules];
        return rules.map(r => r.cssText).join('\n');
      } catch(e) { continue; }
    }
  } catch(e) {}
  return '';
}
