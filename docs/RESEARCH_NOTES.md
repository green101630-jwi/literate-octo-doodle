# Research notes and figure scope

Portfolio evidence update: 5 November 2026.

This website presents a connected set of robotics projects. Different experiment generations use different models, datasets, colliders, observation contracts, and execution rules. Captions keep these conditions attached to each result.

Home, Research, Projects, and About support English/Korean switching. The detailed technical report remains in English at [Research details](research/details/), which redirects to [research-details.html](research-details.html) while preserving section anchors. Its existing figures and recordings are retained.

| Figure / result | Scope |
| --- | --- |
| Visual ACT / TC-ACT E5000 | Teleop30 + Mimic300; one training seed; five evaluation seeds × 250 paired-reset trials per model/task. |
| Spatial generalization E6000 | Basic collider; Basket AMP-off / Handover AMP-on evaluation; XY half-ranges 2–6cm; one training seed; 1,250 trials per model/task/range. |
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

The Research overview has a separate [policy video gallery](research/index.html#policy-videos), configured by [policy-videos.json](assets/media/policy-videos.json) and `policy-videos.js` / `policy-videos.css`. Its **12 slots** cover simulation / real × ACT / TC-ACT / Diffusion × Basket / Handover. Verified simulation successes now have video sources, posters, and experiment metadata; remaining entries retain `src` and `poster` as `null`. Slot existence or an empty placeholder does not establish experiment completion, model availability, or task success.

When actual footage becomes available, add its video and poster, fill the corresponding manifest fields, and document the experiment/checkpoint version, observation inputs, date, initial placement, observed success/failure, and evaluation protocol. The current Sim gallery selects successful rollouts only, with verified 14D joint-state training inputs and one shared fixed camera. RGB and sampled history are additional inputs for visual policies. Keep each selected success traceable to its trial. A clip illustrates that execution; any aggregate performance claim needs its own trial count and conditions. Existing hero and technical-report recordings must retain their original labels when new slots are populated.

## Software and research foundations

The projects build on external research and robotics software. This portfolio describes task integration, experimental work, extensions, data tooling, and deployment engineering. Upstream model and robot sources retain their original attribution.

- [ACT](https://github.com/tonyzhaozh/act): action-chunking imitation-learning implementation.
- [Diffusion Policy](https://github.com/real-stanford/diffusion_policy): diffusion-based visuomotor policy implementation.
- [LeRobot](https://github.com/huggingface/lerobot): policy training and inference components used by selected model versions.
- [Isaac Lab](https://github.com/isaac-sim/IsaacLab): simulation environments and demonstration tooling.
- [ROBOTIS OpenMANIPULATOR](https://github.com/ROBOTIS-GIT/open_manipulator): robot models, controllers, and bringup foundations.
- PyTorch, torchvision, ROS 2, and Matplotlib support learning, robot interfaces, and figure generation.

TC-ACT and Mamba-2 temporal-context experiments, source-controlled demonstration studies, and robot-specific adapters are described as extensions and experiments within this system.

The four Sim gallery cards use ACT / TC-ACT CVAE E5000 checkpoints trained on Teleop30 + Mimic300 (training seed0), with 14D joints + RGB and one shared fixed camera. TC-ACT also uses sampled joint/image history. Basket uses XY ±2 cm resets and evaluation seed2028: ACT 233/250 (93.2%), TC-ACT 228/250 (91.2%). Tube Handover uses XY ±2 cm resets and evaluation seed2030: ACT 178/250 (71.2%), TC-ACT 220/250 (88.0%).

Each clip is a selected successful rollout; its card rate comes from the complete corresponding 250-trial evaluation. The gallery replacement uses these same task/checkpoint/seed conditions. Original timing, source hashes, camera settings, and rollout evidence belong in [success-rollout-provenance.json](assets/media/policy-videos/success-rollout-provenance.json). These single-seed cards remain separate from the five-seed benchmark charts and the older technical-report recordings. Diffusion slots remain empty.

## Demonstration research: measurement boundaries

The close64 scripted Basket study has three separate records:

| Logical source record | Measurement and conditions |
| --- | --- |
| Close64 scripted Basket collection summaries | 100 demonstrations exported from 135 attempts across ten collection chunks. This measures collection yield. |
| Close64 scripted Basket RGB replay summary | All 100 selected episodes reached final success during RGB replay. This validates the retained replay set, not a learned policy. |
| Scripted100 ACT CVAE final evaluation | 221/250 (88.4%); training seed 0, E5000 final checkpoint, 50,000 optimizer updates, 80 training / 20 validation episodes from the 100-demo release; evaluation seed 2026, XY ±2cm, horizon 1,100, AMP off, temporal aggregation with decay 0.01. |

The older Scripted75 E2000 experiment and its diagnostic recordings are different runs. Yellow-on-Green footage is also a different task. Neither recording supports the Scripted100 ACT 88.4% result. No matched policy-success recording is asserted for that result.

**Source-audit scope and the aligned release are separate.** The 660-episode semantics audit checked the action decoding rule `processed_actions = clip(actions × 0.25 + default_joint_pos, joint limits)` and the pre-action observation rule: time zero uses `initial_state`; later observations use `states[t−1]`. It is not a count of episodes manually inspected image by image.

The later aligned release contains Basket and Handover, each Teleop25 + Mimic50, for 150 episodes total. Its report states that all 150 episodes received full-frame numeric reconstruction and hash readback checks; only additional sampled images received visual inspection. The Handover Mimic source episode `demo_143` had an initial RGB/state mismatch corrected in this later release. This does not mean all 660 source episodes were rerendered or that the 150 episodes were produced by a single uniform 660→150 selection funnel. The original datasets and the existing 60-episode verification set were preserved.

Logical source records:

- **660-episode action/observation semantics audit** — SHA-256 `9ea894a278253ca4a2c71117eb8f2b41c7a3d8337d8142c885597fddc29bdabb`.
- **Dual-OMX Teleop25 + Mimic50 release report, 11 October 2026** — SHA-256 `1a0a6bbcfa948ef7e1c3c6a90ed742cdbeae3e82aac8aebd5f367db3f7c2e669`.

The release-creation report records that training, split creation, and feature extraction had not yet run at that stage. Later training runs need their own split/normalization records; release verification alone does not establish lineage-disjoint splits or learned-policy performance.

**Coverage plots describe the selected data.** An initial-position mean is the sample center; a per-axis standard deviation describes spatial spread. Neither is a success rate, a confidence interval for policy performance, or proof of generalization. Keep task, object, coordinate axes, units, source counts, and selection scope attached. Quality selection can change coverage, so its effect cannot be isolated from distribution changes without controlled training and evaluation.

## November Task2 Diffusion runtime benchmark

[Task2 C128 runtime data](assets/charts/task2-diffusion-runtime-20261104.json) transcribes an existing 4 November 2026 measurement; the website update did not rerun it. The model consumes 20D observations (14 joint values + 6 fixed-environment values), uses DDIM10, and was measured on an RTX3070 with 100 eager and 100 compiled samples. Eager p50/p99 are 53.85/62.18ms; compiled p50/p99 are 12.94/14.58ms.

This is an inference-runtime measurement for the November C128 Task2 model. It is separate from the August 34D no-cube Diffusion benchmark and from physical-feedback shadow timing. It is not a manipulation-success evaluation, an end-to-end control deadline guarantee, or evidence that Diffusion completed the physical task. The public data retain the logical source filename and its SHA-256, without workstation paths or weights.
