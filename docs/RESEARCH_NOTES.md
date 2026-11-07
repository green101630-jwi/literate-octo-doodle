# Research notes and figure scope

Portfolio evidence update: 5 November 2026.

This website presents a connected set of robotics projects. Different experiment generations use different models, datasets, colliders, observation contracts, and execution rules. Captions keep these conditions attached to each result.

Home, Research, Projects, and About support English/Korean switching. The detailed technical report at [Research details](research/details/) redirects to [research-details.html](research-details.html) while preserving section anchors and also supports English/Korean switching. Its existing figures and recordings are retained.

| Figure / result | Scope |
| --- | --- |
| Visual ACT / TC-ACT E6000 — primary comparison | Task-specific Teleop30 + Mimic300; training seed 0; XY ±2cm; AMP-on; evaluation seeds 2026–2030 × 250 matched-reset trials, 1,250 per model/task. |
| Visual ACT / TC-ACT E5000 — archived comparison | Earlier Teleop30 + Mimic300 checkpoints; one training seed; five evaluation seeds × 250 paired-reset trials per model/task. Original data, figure, and recordings retain their E5000 scope. |
| Spatial generalization E6000 — earlier protocol | Earlier “basic collider” series; Basket AMP-off / Handover AMP-on evaluation; XY half-ranges 2–6cm; one training seed; 1,250 trials per model/task/range. Separate from the primary AMP-on comparison. |
| Diffusion denoising steps | Earlier 34D no-cube policy; fixed-layout simulation; 250 trials for 4-step, 10-step, and compiled 10-step inference. |
| Diffusion latency | August U-Net benchmark and real-feedback shadow are distinct measurements, preserved in the experiment presentation. |
| Successful-rollout controls | Approximately matched 14k-update budget; two training seeds; 250 evaluations each; final checkpoints. Normalization was fitted on the original Mimic50 and held fixed across conditions. |
| Real-camera 14D / 17D | One training seed; 25 operator-observed physical trials per task/condition. Notes, presentation, and footage retain counts; trial-level raw-log mapping remains to be consolidated. |
| Task2 ACT physical deployment | Five consecutive operator-observed successes on a fixed layout. Detailed timing is retained for the final 796-step run. Joint and fixed-environment observations; a separate model from Visual TC-ACT. |

## Temporal history and model versions

In the configurations using 14 history samples, **14 means sampled past observations, not 14 consecutive frames**. The offsets are `[160, 80, 40, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]` relative to the current observation. This mixes longer-range context with recent observations. Sampling offsets and their time interpretation belong to the relevant data/control-rate contract.

History sample count is separate from observation dimension. **14D** refers to a joint-observation vector; it does not mean a 14-frame history. Likewise, the real-camera 17D setting adds three phase features to the joint observations, rather than changing the number of history samples.

TC-ACT versions do not all use the same training objective. Some early configurations include auxiliary future-state-delta prediction alongside action reconstruction and the CVAE KL term. Future states are training targets, never inference inputs. Later **paper-fair configurations omit that auxiliary objective and use action L1 + KL**. Check the specific run configuration before assigning either formulation to a result.

Both the primary E6000 comparison and the archived E5000 chart compare the reported ACT and TC-ACT model configurations. Their task-dependent differences are **not an isolated causal estimate of history alone**. The TC-ACT checkpoints in these comparisons include sampled joint/image history and auxiliary future-state prediction; isolating history would require controls that separately vary those components and any other configuration differences. The five evaluation seeds assess those trained policies under different resets; they are not five independent training repetitions.

## Primary Visual ACT / TC-ACT comparison: E6000

The primary comparison uses task-specific **Teleop30 + Mimic300**, training seed 0, frozen visual backbones, CVAE policies, chunk length 50, and E6000 final checkpoints. Evaluation uses **XY ±2cm, AMP on, temporal aggregation with decay 0.01**, and seeds 2026–2030 with 250 trials per seed. ACT and TC-ACT have identical recorded initial object positions within each task/seed pair. Each percentage below is the total number of successes divided by **1,250 trials for that model and task**.

| Task | ACT | TC-ACT | Evaluation horizon |
| --- | --- | --- | --- |
| Basket | 1,168/1,250 — **93.44%** | 1,164/1,250 — **93.12%** | 708 control steps |
| Tube Handover | 929/1,250 — **74.32%** | 1,034/1,250 — **82.72%** | 500 control steps |

The Basket reports explicitly record convex-decomposition finger colliders. The current Handover task source also selects a convex-decomposition robot asset, but the historical Handover reports do not serialize a complete physics snapshot. The shared settings above support comparisons between ACT and TC-ACT within each task. Horizon, task geometry, success rules, and the available collider evidence remain task specific; the two tasks are not presented as differing only in task name.

Public evidence and reproducible figure: [E6000 data and source checksums](assets/charts/visual-act-tc-e6000.json), [E6000 comparison figure](assets/charts/visual-act-tc-e6000.svg), [per-seed CSV](assets/data/visual-act-tc-e6000.csv), and [figure generator](assets/charts/generate_visual_act_tc_e6000.py).

The [archived E5000 figure](assets/charts/visual-act-tc-e5000.svg) and its original summary values remain preserved. The earlier E6000 spatial-generalization figure retains its original Basket AMP-off / Handover AMP-on protocol. Neither historical series is relabeled as this primary E6000 AMP-on comparison.

## Keep deployment generations separate

- **August Diffusion:** the earlier 34D no-cube policy, its denoiser benchmark, and a separate real-feedback shadow run.
- **September real-camera TC-ACT:** live RGB/joint observations, the real-camera datasets, and the 14D/17D physical comparison.
- **October Task2 ACT:** the joint/fixed-environment policy with its own runtime, repeated operator-observed trials, and retained final-run timing trace.

These generations have different observation and execution contracts. A timing measurement, physical success count, or video from one does not validate another. Preserve the distinction between model inference time, policy request round-trip time, command timing, and complete physical task execution.

## Data and media

Original chart data, source identifiers, and checksums, including the archived E5000 comparison: [evidence-data.json](assets/charts/evidence-data.json). The primary E6000 comparison has its separate data, CSV, figure, and generator linked above.

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

Each clip is a selected successful E5000 rollout; its original single-seed rate comes from the complete corresponding 250-trial evaluation. Original timing, source hashes, camera settings, and rollout evidence belong in [success-rollout-provenance.json](assets/media/policy-videos/success-rollout-provenance.json). These recordings retain their E5000 task/checkpoint/seed conditions and remain separate from the primary E6000 five-seed statistics. No matched E6000 policy-success recording was identified in the audited media. Diffusion slots remain empty.

## Demonstration research: measurement boundaries

The Research overview's Scripted presentation explains how the demonstrations are generated. The collection, replay, and downstream policy measurements are retained here and in the source data, with their separate scopes preserved below.

### Scripted generation implementation

The close64 Basket collection entry point is `run_basket_scripted100_decomposition_close64.sh`, which calls `collect_basket_procedural_demos.py`. This is a different collector from the earlier `collect_double_put_scripted_demos.py`. Here, **close64 means 64 gripper-closing control steps** (1.28 seconds at 50 Hz), increased from the earlier 32-step setting; it is not a gripper position of 0.64. The wrapper also selects convex-decomposition finger colliders and an object-relative pick offset.

The demonstrator reads the current simulated cube and basket poses to construct pickup and placement targets. It completes the yellow-cube sequence with the left arm, including release and return home, before running the green-cube sequence with the right arm. The inactive arm holds its position with the gripper open. The two cubes have separate basket slots. These scene poses guide the scripted demonstrator; they are not added as inputs to the learned visual policy.

`BasketArm.phase_action` implements position inverse kinematics with a damped least-squares Jacobian update. Cartesian goals and gripper targets use cubic smoothstep interpolation; the initial joint transit and return home use quintic minimum-jerk curves. The grasp-offset “lock” stores the measured end-effector/cube offset and joint anchor for subsequent target construction. It does not create an attachment or force the cube to follow the gripper; cube motion during collection is produced by simulated contact physics.

The data path has three stages:

1. **Collect and select low-dimensional demonstrations.** The recorder retains raw actions, joint observations, `initial_state`, and subsequent states. The collector rejects unstable grasps, insufficient lift or release clearance, incomplete home return, and failed final placement; only successful episodes are exported.
2. **Replay the retained actions for RGB.** `record_basket_rgb_replay.py` restores each episode's initial state, captures fixed-camera RGB before action `t`, then applies stored action `t`. It checks final task success. This is action replay from the initial state, rather than a per-frame forced restoration of every recorded state.
3. **Validate and assemble the aligned release.** `assemble_basket_scripted_dataset.py` checks the low-dimensional observation timing against `initial_state` and previous recorded joint states, then requires complete, correctly shaped RGB episodes with final success. It assembles the 14D joint observations, actions, states, and RGB, retaining numeric/action/RGB hashes. The numeric alignment check and RGB byte hashes have separate roles; they do not establish identical physical trajectories between collection and replay.

Implementation source snapshots reviewed on 5 November 2026 are identified below by logical filenames and SHA-256. These identifiers document the implementation examined for this explanation; the website does not distribute the source code, demonstration datasets, or model weights.

| Logical source filename | Verified role | SHA-256 |
| --- | --- | --- |
| `double_put_scripted_demo/run_basket_scripted100_decomposition_close64.sh` | Collection parameters; ten chunks; combine → RGB replay → finalize. | `7ff0e91faaabae43827604d2402621af743355099f293e049960062251f1af7b` |
| `double_put_scripted_demo/collect_basket_procedural_demos.py` | Object-relative targets; sequential arm phases; position IK; transit/home curves; successful-only export. | `3d4c6fd28f34e5cfb138ee4394fccd39fa078a4710408c66c9f74bd488639ad4` |
| `double_put_scripted_demo/procedural_template.py` | Arm primitives; cubic interpolation; inactive-arm hold; measured grasp offset. | `41952589201a79632ac6871f57f963878c6a873d4f68809eef28875caa7f7b68` |
| `double_put_scripted_demo/basket_gripper_collider.py` | Select and verify convex-decomposition finger collision geometry. | `310b3e93b3eb597b2ddbbd3db04988a38e5c5c73eab9ed791a35915455daa574` |
| `temporal_context_visual_act_omx/record_basket_rgb_replay.py` | Initial-state reset, pre-action RGB capture, stored-action replay, and final-success check. | `3117695d83b2317430c0c418374919aa0fd465655feec5063673aadf0909919f` |
| `double_put_scripted_demo/assemble_basket_scripted_dataset.py` | Numeric observation alignment, replay completeness/success checks, release assembly, and hashes. | `d8d89e926d69bf00608a91b5c1bf6158248221edab12c72944d64b37b9882526` |

### Collection, replay, and downstream policy results

The close64 scripted Basket study has three separate records:

| Logical source record | Measurement and conditions |
| --- | --- |
| Close64 scripted Basket collection summaries | 100 demonstrations exported from 135 attempts across ten collection chunks. This measures collection yield. |
| Close64 scripted Basket RGB replay summary | All 100 selected episodes reached final success during RGB replay. This validates the retained replay set, not a learned policy. |
| Scripted100 ACT CVAE final evaluation | 221/250 (88.4%); training seed 0, E5000 final checkpoint, 50,000 optimizer updates, 80 training / 20 validation episodes from the 100-demo release; evaluation seed 2026, XY ±2cm, horizon 1,100, AMP off, temporal aggregation with decay 0.01. |

The older Scripted75 E2000 experiment and its diagnostic recordings are different runs. Yellow-on-Green footage is also a different task. Neither recording supports the Scripted100 ACT 88.4% result. No matched policy-success recording is asserted for that result.

**Source-audit scope and the aligned release are separate.** The 660-episode semantics audit checked the action decoding rule `processed_actions = clip(actions × 0.25 + default_joint_pos, joint limits)` and the pre-action observation rule: time zero uses `initial_state`; later observations use `states[t−1]`. It is not a count of episodes manually inspected image by image.

The later aligned release contains Basket and Handover, each Teleop25 + Mimic50, for 150 episodes total. Its report states that all 150 episodes received full-frame numeric reconstruction and hash readback checks; only additional sampled images received visual inspection. One Handover Mimic source episode had an initial RGB/state mismatch corrected in this later release. This does not mean all 660 source episodes were rerendered or that the 150 episodes were produced by a single uniform 660→150 selection funnel. The original datasets and the existing 60-episode verification set were preserved.

Logical source records:

- **660-episode action/observation semantics audit** — SHA-256 `9ea894a278253ca4a2c71117eb8f2b41c7a3d8337d8142c885597fddc29bdabb`.
- **Dual-OMX Teleop25 + Mimic50 release report, 11 October 2026** — SHA-256 `1a0a6bbcfa948ef7e1c3c6a90ed742cdbeae3e82aac8aebd5f367db3f7c2e669`.

The release-creation report records that training, split creation, and feature extraction had not yet run at that stage. Later training runs need their own split/normalization records; release verification alone does not establish lineage-disjoint splits or learned-policy performance.

**Coverage plots describe the selected data.** An initial-position mean is the sample center; a per-axis standard deviation describes spatial spread. Neither is a success rate, a confidence interval for policy performance, or proof of generalization. Keep task, object, coordinate axes, units, source counts, and selection scope attached. Quality selection can change coverage, so its effect cannot be isolated from distribution changes without controlled training and evaluation.

### Task-specific initial-position distributions

The [Basket initial-position figure](assets/charts/demonstration-coverage-basket.svg) describes the selected **T25 + M50** release: 75 demonstrations, each containing one yellow-cube and one green-cube initial XY position, for **150 object observations**. The horizontal and vertical offsets are measured in millimetres from each object's Teleop25 mean. Both Teleop and Mimic points use that same per-object Teleop reference.

Basket Teleop25 already contains 25 distinct initial placements. Mimic50 broadly preserves that spatial spread; these selected data do not show an expansion of Basket coverage. The per-axis standard deviations are:

| Basket object | Teleop25 X / Y (mm) | Mimic50 X / Y (mm) |
| --- | --- | --- |
| Yellow cube | 11.11 / 12.76 | 10.85 / 11.86 |
| Green cube | 11.76 / 10.85 | 11.18 / 10.64 |

Handover has a different starting distribution: its selected Teleop25 demonstrations share one initial position, while Mimic50 broadens the initial-position distribution. Keep this expansion claim specific to Handover. These are descriptive statistics of the selected demonstrations, with no isolated claim about their effect on learned-policy success.

Logical source records are the **T25 + M50 selection manifest** (`selection_manifest.json`) and **demonstration-curation audit** (`curation_audit.json`). The public [demonstration research data](assets/charts/demonstration-research-data.json) retain the Basket distribution under `basket_coverage`. The initial-position analysis concerns this T25 + M50 release; the main ACT / TC-ACT gallery videos use the separate **T30 + M300** training datasets and their own evaluation conditions.

## November Task2 Diffusion runtime benchmark

[Task2 C128 runtime data](assets/charts/task2-diffusion-runtime-20261104.json) transcribes an existing 4 November 2026 measurement; the website update did not rerun it. The model consumes 20D observations (14 joint values + 6 fixed-environment values), uses DDIM10, and was measured on an RTX3070 with 100 eager and 100 compiled samples. Eager p50/p99 are 53.85/62.18ms; compiled p50/p99 are 12.94/14.58ms.

This is an inference-runtime measurement for the November C128 Task2 model. It is separate from the August 34D no-cube Diffusion benchmark and from physical-feedback shadow timing. It is not a manipulation-success evaluation, an end-to-end control deadline guarantee, or evidence that Diffusion completed the physical task. The public data retain the logical source filename and its SHA-256, without workstation paths or weights.

## Hardware deployment figures — 7 November 2026

The Research hardware section presents physical deployment and its supporting observation, runtime, mapping and control work. The public [hardware figure data](assets/charts/hardware-deployment-data.json) contain selected measurements, evidence scope and logical source checksums. The [generator](assets/charts/generate_hardware_deployment.py) reads only this adjacent public JSON. These are summary figures; no training demonstrations, weights, hardware identifiers or raw control logs are included.

- **ACT physical Handover:** five consecutive operator-observed successes on a fixed layout. The complete retained trace is the final 796-action run; the reported five successes are not a newly reconstructed five-trial dataset or a general success-rate estimate.
- **Visual TC-ACT:** real-camera-trained policies, one training seed, 25 operator-observed trials per task and observation configuration. The 14D joint-state policies achieved Pick&Place 21/25 and Handover 23/25; the 17D joint-plus-phase policies achieved 0/25 and 20/25. Both configurations also use RGB. This is a separate study from ACT and from the simulation benchmarks.
- **C128 Diffusion model latency:** the 4 November benchmark uses RTX3070, DDIM10 and 100 model-only measurements per execution mode. Eager / compiled p99 are 62.18345652 / 14.57762287 ms. A later whole-DDIM CUDA graph and ordered execution pipeline were also exercised with physical joint feedback. Model-only p99, physical-run server latency and end-to-end latency are distinct measurements.
- **C128 physical execution:** three retained publish runs issued 796 actions each. The latest-feedback run consumed all actions in order, with 22 hold ticks and zero skipped actions. These logs establish command execution; they do not establish successful object manipulation.
- **Feedback age:** a separate no-command probe compared subscription depth 20 with depth 1. Median message age changed from 191.982424 / 193.550917 ms to 3.087694 / 4.648975 ms for the two arms. This is sensor-message age, not inference latency.
- **DDIM steps and task quality:** an earlier 34D Pick&Place policy was evaluated at a fixed demo6 placement, evaluation seed2026, 250 simulated rollouts per condition. DDIM4–10 scored 24.8, 39.6, 50.0, 55.2, 67.2, 73.2 and 78.8%; compiled DDIM10 scored 75.2%. This is a different model and observation contract from the C128 / 20D benchmark. No step-specific latency curve is inferred from these success rates.

Two deployment diagrams are authored in the native, two-page [draw.io source](assets/diagrams/hardware-deployment.drawio) and exported as [architecture](assets/diagrams/hardware-deployment-architecture.svg) and [execution flow](assets/diagrams/hardware-deployment-flow.svg) SVGs. They describe the shared structure and model-specific adapters, rather than one universal configuration: ACT / C128 Diffusion consume joint and fixed-environment observations; visual TC-ACT consumes RGB, joints and sampled history. Independent 50Hz clocks refer to the documented ACT / C128 paths, not every camera or controller in every model version.
