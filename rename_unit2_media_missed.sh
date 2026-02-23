set -euo pipefail

while IFS=$'\t' read -r src dst; do
  [ -z "${src:-}" ] && continue
  echo "git mv \"$src\" \"$dst\""
  git mv "$src" "$dst"
done <<'MAP'
unit_2/media/IMG_2763.webp	unit_2/media/sensation-vs-perception-comparison-slide.webp
unit_2/media/IMG_2764.webp	unit_2/media/what-is-sensation-definition-slide.webp
unit_2/media/IMG_2765.webp	unit_2/media/how-does-sensation-work-transduction-processing-slide.webp
unit_2/media/IMG_2811.jpeg	unit_2/media/absolute-threshold-table-50-percent.jpeg
unit_2/media/IMG_4210.jpeg	unit_2/media/five-senses-icons-labeled.jpeg
unit_2/media/IMG_4387.webp	unit_2/media/circadian-rhythm-light-dark-scn-melatonin.webp
unit_2/media/IMG_4388.webp	unit_2/media/circadian-rhythm-scn-serotonin-melatonin.webp
unit_2/media/IMG_4402.webp	unit_2/media/circadian-rhythm-wheel-aim-health.webp
unit_2/media/IMG_4405.png	unit_2/media/circadian-misalignment-melatonin-cortisol-work-schedule-graph.png
unit_2/media/IMG_4409.webp	unit_2/media/circadian-cortisol-melatonin-cycles-graph.webp
MAP

echo
echo "Done. Now review: git status"
