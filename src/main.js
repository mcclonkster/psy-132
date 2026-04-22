import './style.css';

const sections = [
  {
    title: 'Exam 1: Foundations + Biology of Experience',
    path: 'exam_1_foundations_biology_of_experience'
  },
  {
    title: 'Exam 2: Learning + Memory + Thinking',
    path: 'exam_2_learning_memory_thinking'
  },
  {
    title: 'Exam 3: Development + Health + Motivation + Emotion',
    path: 'exam_3_development_health_motivation_emotion'
  },
  {
    title: 'Exam 4: Social + Identity + Disorders + Treatment',
    path: 'exam_4_social_identity_disorders_treatment'
  }
];

document.querySelector('#app').innerHTML = `
  <main>
    <h1>PSY-132 Course Repository</h1>
    <p>This repository now runs as a Vite project while preserving all original course content.</p>
    <section>
      <h2>Course resources</h2>
      <ul>
        ${sections
          .map(
            ({ title, path }) => `<li><a href="/${path}/" target="_blank" rel="noreferrer">${title}</a></li>`
          )
          .join('')}
      </ul>
    </section>
    <section>
      <h2>Quarantine</h2>
      <p>Files that looked safe to remove were moved to <code>/quarantine</code> instead of being deleted.</p>
    </section>
  </main>
`;
