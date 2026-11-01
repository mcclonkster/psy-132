# PSY-132

This public repository contains PSY-132 (General Psychology) course and reference files, including materials organized during **Spring 2026** and an experimental Vite frontend added in April 2026. **It is not a verified Fall 2026 course website, syllabus, or assignment schedule.**

For current class instructions, assignments, and due dates, use Brightspace. For official syllabus and college-policy statements, use the published John A. Logan College syllabus. A file's presence here does not show that it was assigned, reviewed, or published for a particular section or semester.

## Browse existing materials

The folders below are **repository organization**, not confirmed current exam coverage or student-facing modules.

- [Exam 1 folder — historical organization](exam_1_foundations_biology_of_experience/)
- [Exam 2 folder — historical organization](exam_2_learning_memory_thinking/)
- [Exam 3 folder — historical organization](exam_3_development_health_motivation_emotion/)
- [Exam 4 folder — historical organization](exam_4_social_identity_disorders_treatment/)
- [Instructor resources organized by internal units](instructor_reference/by_unit/)
- [Topic text reference copies](instructor_reference/text/)
- [Historical Spring 2026 course plan](PSY-132_Course_Plan_updated_2026-02-23.md)
- [Lumen course-topic source crosswalk](psy132_lumen_crosswalk_all_modules_with_urls.md)
- [APA guidelines reference](apa_guidelines_undergrad_standards_outcomes_indicators.md)
- [Earlier quarantine notes](quarantine/README.md)
- [Repository status, verified limits, and pending decisions](docs/REPOSITORY_STATUS.md)

## Vite prototype (not a completed course site)

The April 2026 change added [Vite](package.json), [a frontend entry point](src/main.js), and the following local development commands:

```bash
npm install
npm run dev
```

These commands start the prototype when its dependencies are available; they do not turn the course Markdown files into a published catalogue. The current entry point links to four exam-folder URL paths, but those folders have no `index.html` pages. The prototype has **not been verified as a functional course navigation or publishing system**. The previous conversion PR also reported an environment-related install/build failure; no fresh build was performed for this documentation-only change.

The April conversion preserved the content folders. Some provisional cleanup files were moved to [`quarantine/`](quarantine/README.md) for review rather than removed.

## Content and publication status

- The tracked historical topic texts appear in multiple locations. A repository comparison found the same instructional text for all 24 topics after excluding headings, blank lines, separators, and source-title/source-URL metadata. The copies have **not** been consolidated.
- Imported textbook content, transcript material, images, and other third-party files require source-specific license and attribution review before further reuse or redistribution. Existing GitHub visibility does not demonstrate that review.
- Unpublished assessment keys, student records, grades, and other restricted material should not be added to this public repository.
- The authoritative authoring locations, Fall 2026 release status, and long-term publishing implementation remain to be resolved separately. The details in [the status note](docs/REPOSITORY_STATUS.md) are a dated inspection snapshot, not an approved structural specification.

## Previously collected resource links

These existing links have been retained for review. Their availability, permissions, and suitability for public sharing have not been checked.

[Public NotebookLM notebook for OpenStax](https://notebooklm.google.com/notebook/90a2ee5f-cccb-4c28-a356-bb1682cc8aeb?e)

[Class NotebookLM notebook](https://notebooklm.google.com/notebook/fab22e79-9a9f-4e9a-9891-bad32612c98c)

[UPDATED Class NotebookLM notebook](https://notebooklm.google.com/notebook/88a29a7a-0dad-4765-9ae1-993c7f493040)

[Neurodivergent Insights](https://neurodivergentinsights.com)
[Cleveland Clinic - Brain](https://my.clevelandclinic.org/health/body/22638-brain)
[Simply Psychology - Biopsychology](https://www.simplypsychology.org/theories/biological-approach)

[2026 Spring Shared OneDrive Folder](https://jalcollege-my.sharepoint.com/:f:/g/personal/kristenmcconkey_jalc_edu/IgC6IOvuWwggQbU0_3-9NgeYAXTPswpEeA8opZqe-CX2WjY?e=A8pONe)

https://jalcollege-my.sharepoint.com/:f:/g/personal/kristenmcconkey_jalc_edu/IgC6IOvuWwggQbU0_3-9NgeYAXTPswpEeA8opZqe-CX2WjY?e=uw20Wg

[Google Learn About](https://learning.google.com/experiments/learn-about)


## Earlier course themes

1. Psychology is most useful when it turns claims about human behavior and mental life into questions that can be tested with evidence rather than treated as intuition or tradition.
2. Human behavior usually has multiple causes, so strong explanations combine biological mechanisms, learning history, thought patterns, relationships, and culture instead of relying on single-cause stories.
3. Research design sets the limits of what we can conclude, which is why correlation cannot prove causation and why measurement choices determine what a result actually means.
4. Statistical literacy protects you from being misled by tidy numbers, because averages hide variability, samples can be biased, and effect size and generalizability determine whether a finding matters beyond the study that produced it.
5. The mind is efficient but imperfect, so attention limits, memory reconstruction, and decision shortcuts shape what we notice, remember, and believe, especially under stress or social pressure.
6. The practical payoff of psychology is using these tools to make better choices about learning, health, relationships, work, media claims, and getting help, while treating people with dignity and resisting stigma and oversimplification.
