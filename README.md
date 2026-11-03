# Won Ik Jang — Robotics Portfolio

Personal research portfolio covering dual-arm digital twins, ACT and Diffusion Policy, temporal-context ACT, demonstration generation, and real-time visual robot deployment.

**Website:** https://green101630-jwi.github.io/literate-octo-doodle/

## Active website

GitHub Pages serves **`docs/`**. The root `index.html` is an older technical guide; `portfolio/` is an archived draft. Edit `docs/` for the public homepage.

```text
docs/
  index.html                  Six connected research projects
  styles.css                  Responsive portfolio layout
  script.js                   Accessible tabs, chart viewer, and navigation
  assets/charts/               SVG + PNG figures, data, and source notes
  assets/data/                 Downloadable evaluation tables
  assets/media/                H.264 demonstrations, posters, and video plan
  assets/videos/               Earlier site recordings
  assets/WonIkJang_CV.pdf      Existing CV
```

## Preview locally

No application dependencies or build step are required.

```bash
python3 -m http.server 8765 --directory docs
```

Open `http://localhost:8765`. Serve the directory rather than opening it through an editor's source-code view.

## Publishing

The **Deploy Pages Static** GitHub Actions workflow uploads `docs/`. It runs when changes to the website are pushed to `main` and can also be started manually. GitHub Pages must use **GitHub Actions** as its source, as configured for the existing deployment.

## Updating evidence

- Chart values and protocol descriptions are in `docs/assets/charts/evidence-data.json`.
- Regenerate figures with `python3 docs/assets/charts/generate_charts.py` in an environment with Matplotlib. Matplotlib is only needed for figure authoring, not for the website.
- Figures distinguish training seeds from evaluation seeds, simulation from hardware, and benchmark latency from feedback-shadow timing.
- Physical trial results are labeled as operator-observed; the final Task2 timing trace and real-camera trial records have different evidence scopes.
- `docs/assets/media/media_manifest.json` records the footage's purpose and presentation edits.
- `docs/assets/media/video_plan.json` lists proposed footage. Two clearly marked slots on the homepage are ready for continuous Task2 and synchronized real-camera recordings.

Existing CV, academic information, STM32, EMG/force-measurement, and biomedical data-analysis content are retained.

Research context and external software acknowledgments are in [Research notes](docs/RESEARCH_NOTES.md).
