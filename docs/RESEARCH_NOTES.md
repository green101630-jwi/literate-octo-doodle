# Research notes and figure scope

Portfolio evidence update: 3 November 2026.

This website presents a connected set of robotics projects. Different experiment generations use different models, datasets, colliders, observation contracts, and execution rules. Captions keep these conditions attached to each result.

| Figure / result | Scope |
| --- | --- |
| Visual ACT / TC-ACT E5000 | Teleop30 + Mimic300; one training seed; five evaluation seeds × 250 paired-reset trials per model/task. |
| Spatial generalization E6000 | Basic collider, AMP-off evaluation; XY half-ranges 2–6cm; one training seed; 1,250 trials per model/task/range. |
| Diffusion denoising steps | Earlier 34D no-cube policy; fixed-layout simulation; 250 trials for 4-step, 10-step, and compiled 10-step inference. |
| Diffusion latency | August U-Net benchmark and real-feedback shadow are distinct measurements, preserved in the experiment presentation. |
| Successful-rollout controls | Approximately matched 14k-update budget; two training seeds; 250 evaluations each; final checkpoints. Normalization was fitted on the original Mimic50 and held fixed across conditions. |
| Real-camera 14D / 17D | One training seed; 25 operator-observed physical trials per task/condition. Notes, presentation, and footage retain counts; trial-level raw-log mapping remains to be consolidated. |
| Task2 ACT physical deployment | Five consecutive operator-observed successes on a fixed layout. Detailed timing is retained for the final 796-step run. Joint and fixed-environment observations; a separate model from Visual TC-ACT. |

## Data and media

Exact chart data, source identifiers, and checksums: [evidence-data.json](assets/charts/evidence-data.json).

Source descriptions and limitations: [sources.txt](assets/charts/sources.txt).

The paired Basket clip is an illustrative diagnostic from 21 October 2026 at ±4cm, with identical initial cube positions. It is separate from the main aggregate evaluation protocols. The shorter ACT clip holds its final frame until the complete TC-ACT recording ends.

System teleoperation, code-scripted simulation, and early physical mapping footage are labeled by their roles. The marked future-video slots do not present generated or substitute footage as evidence of later physical trials.

## Software and research foundations

The projects build on external research and robotics software. This portfolio describes task integration, experimental work, extensions, data tooling, and deployment engineering. Upstream model and robot sources retain their original attribution.

- [ACT](https://github.com/tonyzhaozh/act): action-chunking imitation-learning implementation.
- [Diffusion Policy](https://github.com/real-stanford/diffusion_policy): diffusion-based visuomotor policy implementation.
- [LeRobot](https://github.com/huggingface/lerobot): policy training and inference components used by selected model versions.
- [Isaac Lab](https://github.com/isaac-sim/IsaacLab): simulation environments and demonstration tooling.
- [ROBOTIS OpenMANIPULATOR](https://github.com/ROBOTIS-GIT/open_manipulator): robot models, controllers, and bringup foundations.
- PyTorch, torchvision, ROS 2, and Matplotlib support learning, robot interfaces, and figure generation.

TC-ACT and Mamba-2 temporal-context experiments, source-controlled demonstration studies, and robot-specific adapters are described as extensions and experiments within this system.
