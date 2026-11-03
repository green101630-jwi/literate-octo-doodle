# Research notes and figure scope

Portfolio evidence update: 3 November 2026.

This website presents a connected set of robotics projects. Different experiment generations use different models, datasets, colliders, observation contracts, and execution rules. Captions keep these conditions attached to each result.

Home, Research, Projects, and About support English/Korean switching. The detailed technical report remains in English at [Research details](research/details/), which redirects to [research-details.html](research-details.html) while preserving section anchors. Its existing figures and recordings are retained.

| Figure / result | Scope |
| --- | --- |
| Visual ACT / TC-ACT E5000 | Teleop30 + Mimic300; one training seed; five evaluation seeds × 250 paired-reset trials per model/task. |
| Spatial generalization E6000 | Basic collider, AMP-off evaluation; XY half-ranges 2–6cm; one training seed; 1,250 trials per model/task/range. |
| Diffusion denoising steps | Earlier 34D no-cube policy; fixed-layout simulation; 250 trials for 4-step, 10-step, and compiled 10-step inference. |
| Diffusion latency | August U-Net benchmark and real-feedback shadow are distinct measurements, preserved in the experiment presentation. |
| Successful-rollout controls | Approximately matched 14k-update budget; two training seeds; 250 evaluations each; final checkpoints. Normalization was fitted on the original Mimic50 and held fixed across conditions. |
| Real-camera 14D / 17D | One training seed; 25 operator-observed physical trials per task/condition. Notes, presentation, and footage retain counts; trial-level raw-log mapping remains to be consolidated. |
| Task2 ACT physical deployment | Five consecutive operator-observed successes on a fixed layout. Detailed timing is retained for the final 796-step run. Joint and fixed-environment observations; a separate model from Visual TC-ACT. |

## Temporal history and model versions

In the configurations using 14 history samples, **14 means sampled past observations, not 14 consecutive frames**. The offsets are `[160, 80, 40, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]` relative to the current observation. This mixes longer-range context with recent observations. Sampling offsets and their time interpretation belong to the relevant data/control-rate contract.

History sample count is separate from observation dimension. **14D** refers to a joint-observation vector; it does not mean a 14-frame history. Likewise, the real-camera 17D setting adds three phase features to the joint observations, rather than changing the number of history samples.

TC-ACT versions do not all use the same training objective. Some early configurations include auxiliary future-state-delta prediction alongside action reconstruction and the CVAE KL term. Future states are training targets, never inference inputs. Later **paper-fair configurations omit that auxiliary objective and use action L1 + KL**. Check the specific run configuration before assigning either formulation to a result.

The E5000 chart compares the reported ACT and TC-ACT model configurations. Its task-dependent differences are **not an isolated causal estimate of history alone**. That claim would require controls that separately vary history, auxiliary supervision, and any other configuration differences. The five evaluation seeds assess those trained policies under different resets; they are not five independent training repetitions.

## Keep deployment generations separate

- **August Diffusion:** the earlier 34D no-cube policy, its denoiser benchmark, and a separate real-feedback shadow run.
- **September real-camera TC-ACT:** live RGB/joint observations, the real-camera datasets, and the 14D/17D physical comparison.
- **October Task2 ACT:** the joint/fixed-environment policy with its own runtime, repeated operator-observed trials, and retained final-run timing trace.

These generations have different observation and execution contracts. A timing measurement, physical success count, or video from one does not validate another. Preserve the distinction between model inference time, policy request round-trip time, command timing, and complete physical task execution.

## Data and media

Exact chart data, source identifiers, and checksums: [evidence-data.json](assets/charts/evidence-data.json).

Source descriptions and limitations: [sources.txt](assets/charts/sources.txt).

The paired Basket clip is an illustrative diagnostic from 21 October 2026 at ±4cm, with identical initial cube positions. It is separate from the main aggregate evaluation protocols. The shorter ACT clip holds its final frame until the complete TC-ACT recording ends.

System teleoperation, code-scripted simulation, and early physical mapping footage are labeled by their roles. The technical report retains its existing media and two marked future-video placeholders. These do not present generated or substitute footage as evidence of later physical trials.

The Research overview has a separate [policy video gallery](research/index.html#policy-videos), configured by [policy-videos.json](assets/media/policy-videos.json) and `policy-videos.js` / `policy-videos.css`. Its **12 slots** cover simulation / real × ACT / TC-ACT / Diffusion × Basket / Handover. All initially have `src` and `poster` set to `null`. Slot existence or an empty placeholder does not establish experiment completion, model availability, or task success.

When actual footage becomes available, add its video and poster, fill the corresponding manifest fields, and document the experiment/checkpoint version, observation inputs, date, initial placement, observed success/failure, and evaluation protocol. Keep representative successes and failures traceable to their trials. A clip illustrates that execution; any aggregate performance claim needs its own trial count and conditions. Existing hero and technical-report recordings must retain their original labels when new slots are populated.

## Software and research foundations

The projects build on external research and robotics software. This portfolio describes task integration, experimental work, extensions, data tooling, and deployment engineering. Upstream model and robot sources retain their original attribution.

- [ACT](https://github.com/tonyzhaozh/act): action-chunking imitation-learning implementation.
- [Diffusion Policy](https://github.com/real-stanford/diffusion_policy): diffusion-based visuomotor policy implementation.
- [LeRobot](https://github.com/huggingface/lerobot): policy training and inference components used by selected model versions.
- [Isaac Lab](https://github.com/isaac-sim/IsaacLab): simulation environments and demonstration tooling.
- [ROBOTIS OpenMANIPULATOR](https://github.com/ROBOTIS-GIT/open_manipulator): robot models, controllers, and bringup foundations.
- PyTorch, torchvision, ROS 2, and Matplotlib support learning, robot interfaces, and figure generation.

TC-ACT and Mamba-2 temporal-context experiments, source-controlled demonstration studies, and robot-specific adapters are described as extensions and experiments within this system.
