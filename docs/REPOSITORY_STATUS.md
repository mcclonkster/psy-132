# Repository status — October 11, 2026

This is a **read-only inspection snapshot** of `mcclonkster/psy-132`, based on the public `master` branch at commit `d869a8fa69cfd5f9c8b74934c4c30c158fe326c2`. It records observed facts and unresolved questions. It does **not** establish an approved source-of-truth architecture, institutional publication, course requirement, or authorization to reorganize files.

## Verified on the inspected branch

- The repository is public and contains **888 tracked files** in the inspected tree.
- The root [course plan](../PSY-132_Course_Plan_updated_2026-02-23.md) explicitly describes **Spring 2026**, not Fall 2026.
- The four existing `exam_*` folders contain topic-text files for Topics 1–24, with corresponding files under `instructor_reference/by_unit/` and `instructor_reference/text/`.
- For all 24 topics, the `by_unit` and `text` copies are byte-identical. The corresponding exam-folder texts match after excluding the first Markdown heading, source-title/source-URL lines, blank lines, and divider-only lines. This comparison does **not** establish which path should be authoritative.
- The [Vite entry point](../src/main.js) links to four exam-folder web paths, none of which contains an `index.html` page.
- [The previous Vite conversion PR](https://github.com/mcclonkster/psy-132/pull/1) reports that install/build tests did not complete successfully in its execution environment. That does not establish whether a build would succeed today.
- There is no `openspec/` directory or `.github/workflows/` directory in the inspected default-branch file tree.
- [The by-unit Markdown index](../instructor_reference/by_unit/index.md) contains absolute `/units/...` links; their intended site routing has not been established. Do not rewrite them without determining their consumer.

## Not established by this inspection

- What is actually published or assigned for Fall 2026 in Brightspace, Microsoft Forms, and the published institutional syllabus.
- Which existing topic text copy, if any, is the accepted editable teaching manuscript.
- Whether local/uncommitted work or other repositories contain newer PSY-132 readers, slides, assessment design, or specifications.
- Whether every third-party passage, image, transcript, or PDF in this public repository is cleared for public redistribution.
- Whether previously shared external resource links remain accessible to the intended audience and are appropriately shared.
- Whether the Vite prototype builds, deploys, or functions as a student-facing course site.

## Safe handling while decisions are open

- Preserve existing paths, content, Git history, and any `quarantine/` artifacts until consumers and permissions have been checked.
- Treat historical Spring source documents as historical. Do not infer Fall policy, dates, or assigned work from them.
- Keep private student data, grading records, and unpublished assessment answers outside this public repository.
- Distinguish source copies, editable PSY-132 instructional works, reviewed exports, and actual LMS-published instances.
- Evaluate external materials' licenses and attribution requirements before deciding public distribution or replacement.
- Use a reviewed, narrow pull request for substantive changes. Changes to public/private ownership, course specifications, or publishing technology require a separate decision.

## What this documentation repair changes

Only the repository's orientation and status documentation. **No course topic text, third-party media, assessment file, Vite implementation, or quarantine artifact is changed by this documentation proposal.**
