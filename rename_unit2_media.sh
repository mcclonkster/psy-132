set -euo pipefail

while IFS=$'\t' read -r src dst; do
  [ -z "${src:-}" ] && continue
  echo "git mv \"$src\" \"$dst\""
  git mv "$src" "$dst"
done <<'MAP'
unit_2/media/IMG_0004.png	unit_2/media/craving-loop-comic.png
unit_2/media/IMG_0008.jpeg	unit_2/media/perception-creates-reality-graphic.jpeg
unit_2/media/IMG_0095.webp	unit_2/media/auditory-transduction-diagram.webp
unit_2/media/IMG_0100.webp	unit_2/media/afferent-vs-efferent-nervous-system.webp
unit_2/media/IMG_0101.webp	unit_2/media/sensory-system-overview.webp
unit_2/media/IMG_0117.jpeg	unit_2/media/sensory-information-transmission-pathway.jpeg
unit_2/media/IMG_0157.png	unit_2/media/absolute-thresholds-five-senses.png
unit_2/media/IMG_0160.jpeg	unit_2/media/stimulus-sensation-transduction-perception-traffic-light.jpeg
unit_2/media/IMG_0379.png	unit_2/media/visual-pathway-optic-chiasm.png
unit_2/media/IMG_0382.png	unit_2/media/visual-field-defect-lesion-location.png

unit_2/media/IMG_0504.jpeg	unit_2/media/circadian-scn-pineal-pathway.jpeg
unit_2/media/IMG_0678.jpeg	unit_2/media/circadian-rhythm-influences-cleveland-clinic.jpeg
unit_2/media/IMG_0680.jpeg	unit_2/media/average-teen-circadian-cycle.jpeg
unit_2/media/IMG_0682.webp	unit_2/media/circadian-rhythm-cortisol-graph-disorders-treatment.webp
unit_2/media/IMG_0685.jpeg	unit_2/media/circadian-rhythm-human-body-timeline.jpeg
unit_2/media/IMG_1226.jpeg	unit_2/media/cortisol-melatonin-circadian-graphs-car.jpeg
unit_2/media/IMG_2690.png	unit_2/media/perceptual-process-exposure-attention-interpretation-adaptation.png
unit_2/media/IMG_2693.jpeg	unit_2/media/sensation-perception-action-cycle-electricity.jpeg
unit_2/media/IMG_2694.webp	unit_2/media/perception-recognition-action-flowchart-tree.webp
unit_2/media/IMG_2709.jpeg	unit_2/media/sensation-to-perception-stimulus-receptors-impulses-brain.jpeg

unit_2/media/IMG_2710.webp	unit_2/media/visual-information-reception-transduction-transmission-interpretation.webp
unit_2/media/IMG_2712.webp	unit_2/media/information-sensation-perception-receptors-brain.webp
unit_2/media/IMG_2714.png	unit_2/media/stimulation-transduction-sensation-perception-butterfly.png
unit_2/media/IMG_2716.jpeg	unit_2/media/sensation-perception-bottom-up-top-down-processing-notes.jpeg
unit_2/media/IMG_2717.jpeg	unit_2/media/selective-attention-types-cocktail-party-inattentional-change-popout.jpeg
unit_2/media/IMG_2718.jpeg	unit_2/media/sensation-psychophysics-thresholds-signal-detection-priming-weber.jpeg
unit_2/media/IMG_2722.jpeg	unit_2/media/proactive-retroactive-interference-memory-notes.jpeg
unit_2/media/IMG_2738.jpeg	unit_2/media/sensation-perception-psychophysics-fechner-tastes-expectations.jpeg
unit_2/media/IMG_2746.png	unit_2/media/process-of-sensation-stimulation-transduction-transmission-processing.png
unit_2/media/IMG_2750.webp	unit_2/media/top-down-vs-bottom-up-processing-jack-westin.webp

unit_2/media/IMG_4410.jpeg	unit_2/media/circadian-rhythm-key-events-simple-wheel.jpeg
unit_2/media/IMG_4415.png	unit_2/media/circadian-clock-scn-pineal-melatonin-cortisol-genes.png
unit_2/media/IMG_4429.webp	unit_2/media/circadian-rhythm-human-body-daily-schedule.webp
unit_2/media/IMG_4951.png	unit_2/media/sensory-memory-types-five-senses.png
unit_2/media/IMG_8428.jpeg	unit_2/media/circadian-rhythm-scn-melatonin-cortisol-wheel.jpeg
unit_2/media/sensation_perception_examplescom.png	unit_2/media/sensation-perception-processes-examplescom.png
MAP

echo
echo "Done. Now review: git status"
