# Won Ik Jang — Robotics Portfolio

Personal research portfolio covering dual-arm digital twins, ACT and Diffusion Policy, temporal-context ACT, demonstration generation, and real-time visual robot deployment.

**Website:** https://green101630-jwi.github.io/literate-octo-doodle/

## Active website

GitHub Pages serves **`docs/`**. The public portfolio has four English/Korean pages: **Home, Research, Projects, and About**. The research overview links to the existing **English technical report**, which retains its detailed figures, methods, and demonstration videos.

| Page | Source | Purpose |
| --- | --- | --- |
| [Home](https://green101630-jwi.github.io/literate-octo-doodle/) | `docs/index.html` | Research question, selected results, contributions, and engineering projects |
| [Research](https://green101630-jwi.github.io/literate-octo-doodle/research/) | `docs/research/index.html` | Research overview and policy video gallery |
| [Projects](https://green101630-jwi.github.io/literate-octo-doodle/projects/) | `docs/projects/index.html` | Additional robotics, embedded, and biomedical projects |
| [About](https://green101630-jwi.github.io/literate-octo-doodle/about/) | `docs/about/index.html` | Short personal introduction, contact, and co-authored publication |
| [Technical report](https://green101630-jwi.github.io/literate-octo-doodle/research/details/) | `docs/research-details.html` | English experiment details, charts, and existing footage; `docs/research/details/index.html` redirects here |

The repository-root `index.html` is an older technical guide; `portfolio/` is an archived draft. Edit `docs/` for the published website.

```text
docs/
  index.html                  Bilingual Home
  research/index.html         Bilingual Research and policy video gallery
  projects/index.html         Bilingual Projects
  about/index.html            Bilingual About
  portfolio.css / .js         Shared overview layout, language, and navigation
  research-details.html       Existing English technical report
  research/details/index.html Report redirect preserving section anchors
  styles.css / script.js      Technical report layout, tabs, and chart viewer
  policy-videos.css / .js     Policy video gallery presentation and loading
  assets/charts/               SVG + PNG figures, data, and source notes
  assets/data/                 Downloadable evaluation tables
  assets/media/                Existing demonstrations, posters, and manifests
    policy-videos.json        Twelve policy video slots; simulation rollouts and real TC-ACT demos
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

Each run attempt uses a unique `github-pages-<run_id>-<run_attempt>` artifact name shared by the upload and deployment steps, so retrying a failed job does not select duplicate artifacts from earlier attempts.

## Pre-feedback restore point

The complete website before the feedback revision is preserved on the remote branch [`backup/pre-feedback-2026-11-07`](https://github.com/green101630-jwi/literate-octo-doodle/tree/backup/pre-feedback-2026-11-07), at commit [`b645a24b3ea05808780b46892c167fb769886b7d`](https://github.com/green101630-jwi/literate-octo-doodle/commit/b645a24b3ea05808780b46892c167fb769886b7d). This baseline includes the short About page, enlarged competition media, and the two real-robot TC-ACT recordings. Keep this backup branch at that commit.

The revision is developed on `revamp/feedback-2026-11-07`. To undo the published revision while preserving its history, restore the baseline `docs/` tree in a new commit and redeploy `main`; individual pages can also be restored separately. Preserve later unrelated edits and refresh stylesheet/script cache versions when restoring assets. The tracked Git history contains all website images and videos. A local ZIP snapshot of the same baseline is also retained beside the checkout as `homepage-before-feedback-2026-11-07.zip`.

## Adding policy videos

The [policy video gallery](https://green101630-jwi.github.io/literate-octo-doodle/research/#policy-videos) is configured in `docs/assets/media/policy-videos.json` and rendered by `docs/policy-videos.js` with `docs/policy-videos.css`.

It provides **12 slots: simulation / real × ACT / TC-ACT / Diffusion × Basket / Handover**. The six populated videos are shown by default; unregistered slots are available through an optional toggle. Verified simulation successes and owner-confirmed real TC-ACT demonstrations have videos, posters, and their available metadata; remaining slots keep `src: null` and `poster: null`. The two real TC-ACT recordings use the same model discussed for simulation, mapped to hardware, as confirmed by the owner. Their specific checkpoint, observation configuration, recording dates, and aggregate physical evaluation results were not supplied. An empty slot reserves space for future footage; it does **not** claim that a model was trained, an experiment was completed, or a task succeeded. Existing Home and technical-report media remain separate.

To add a recording:

1. Add the actual video and a representative poster frame under `docs/assets/media/`, then fill the matching slot's `src` and `poster` in the manifest.
2. Record the model/checkpoint version, observation inputs, recording date, initial placement, observed success or failure, and the applicable evaluation protocol. Keep simulation and physical recordings distinct.
3. Keep the recording's evidence scope explicit. A selected success or failure is an example, not a success-rate estimate; aggregate rates require their trial counts and conditions. Do not reuse older footage under another policy's label.
4. Preview the gallery through the local HTTP server. Confirm its media URLs load, the poster matches the video, and the caption identifies the correct experiment.

## Updating evidence

- Chart values and protocol descriptions are in `docs/assets/charts/evidence-data.json`.
- Regenerate figures with `python3 docs/assets/charts/generate_charts.py` in an environment with Matplotlib. Matplotlib is only needed for figure authoring, not for the website.
- Figures distinguish training seeds from evaluation seeds, simulation from hardware, and benchmark latency from feedback-shadow timing. Keep each TC-ACT version's history sampling and loss formulation attached to its results.
- Physical trial results are labeled as operator-observed; the final Task2 timing trace and real-camera trial records have different evidence scopes.
- `docs/assets/media/media_manifest.json` records the footage's purpose and presentation edits.
- `docs/assets/media/video_plan.json` lists proposed footage for the existing technical report, including its Task2 and real-camera placeholders. The Research gallery's 12 policy slots are maintained separately in `policy-videos.json`; published simulation clips are traceable in `policy-videos/success-rollout-provenance.json`, and the two real TC-ACT demonstrations in `policy-videos/real-rollout-provenance.json`.

Existing CV, academic information, STM32, EMG/force-measurement, and biomedical data-analysis content are retained.

Research context and external software acknowledgments are in [Research notes](docs/RESEARCH_NOTES.md).
