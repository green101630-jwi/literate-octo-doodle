(() => {
  "use strict";
  // A text-node dictionary keeps the original report HTML, charts, tables,
  // inline formatting and recorded numerical results untouched.
  const dictionary = new Map([
  [
    "Robotics · Imitation learning · Real systems",
    "로보틱스 · 모방학습 · 실물 시스템"
  ],
  [
    "Robot learning,",
    "로봇 학습,"
  ],
  [
    "from demonstrations",
    "시연 데이터에서"
  ],
  [
    "to",
    "실제"
  ],
  [
    "deployment.",
    "로봇 적용까지"
  ],
  [
    "I build dual-arm learning systems that connect digital twins, demonstration data, and physical robots. My work spans",
    "디지털 트윈, 시연 데이터, 실제 로봇을 연결하는 양팔 로봇 학습 시스템을 구축합니다. 주요 연구는"
  ],
  [
    "ACT, Diffusion Policy, and a temporal-context extension of ACT.",
    "ACT, Diffusion Policy, 그리고 ACT의 시간적 문맥 확장을 다룹니다."
  ],
  [
    "Explore the work",
    "연구 내용 보기"
  ],
  [
    "See the results",
    "실험 결과 보기"
  ],
  [
    "Kyung Hee University",
    "경희대학교"
  ],
  [
    "Biomedical / Electronic Engineering",
    "생체의공학 / 전자공학"
  ],
  [
    "THE DUAL-ARM PLATFORM",
    "양팔 로봇 플랫폼"
  ],
  [
    "Download the system demonstration",
    "시스템 시연 영상 보기"
  ],
  [
    "Real teleoperation, recorded trajectories, and a simulation twin.",
    "실물 원격조작, 궤적 기록, 시뮬레이션 디지털 트윈"
  ],
  [
    "policy families",
    "정책 모델 계열"
  ],
  [
    "demonstration sources",
    "시연 데이터 출처"
  ],
  [
    "Human + generated data",
    "사람 시연 + 생성 데이터"
  ],
  [
    "physical robot commands",
    "실물 로봇 명령"
  ],
  [
    "Independent ACT loops",
    "독립적인 ACT 제어 루프"
  ],
  [
    "primary benchmarks",
    "주요 평가 태스크"
  ],
  [
    "Bimanual manipulation",
    "양팔 로봇 조작"
  ],
  [
    "The research, connected",
    "하나로 연결된 연구"
  ],
  [
    "One system. Six lines of work.",
    "하나의 시스템, 여섯 가지 연구 영역"
  ],
  [
    "Building the platform made it possible to study the data, change the policies, and take the resulting behavior back to the robot.",
    "플랫폼을 구축한 뒤 데이터 구성, 정책 개선, 실물 로봇 배포까지 연결해 실험했습니다."
  ],
  [
    "Digital twin & pipeline",
    "디지털 트윈 및 학습 파이프라인"
  ],
  [
    "Connect the complete learning loop",
    "학습 과정을 하나로 연결"
  ],
  [
    "ACT & Diffusion Policy",
    "ACT 및 Diffusion Policy"
  ],
  [
    "Adapt, train, and evaluate two families",
    "두 정책 계열을 구현·학습·평가"
  ],
  [
    "Temporal-context ACT",
    "시간적 문맥 기반 ACT"
  ],
  [
    "Extend ACT with state and visual history",
    "상태·영상 이력으로 ACT 확장"
  ],
  [
    "Demonstration research",
    "시연 데이터 연구"
  ],
  [
    "Generate and learn from four sources",
    "네 가지 출처의 데이터 생성·학습"
  ],
  [
    "Real-time deployment",
    "실시간 배포"
  ],
  [
    "Measure and reduce inference delay",
    "추론 지연 측정 및 감소"
  ],
  [
    "Real-camera policies",
    "실물 카메라 기반 정책"
  ],
  [
    "Bring visual learning onto hardware",
    "시각 기반 학습을 실물에 적용"
  ],
  [
    "01 / Systems foundation",
    "01 / 시스템 기반"
  ],
  [
    "A twin, a dataset,",
    "디지털 트윈과 데이터,"
  ],
  [
    "and a route back to hardware.",
    "그리고 실물 로봇 연결"
  ],
  [
    "I connected the OMX robot assets and manipulation tasks to ROS 2 teleoperation, episode recording, policy training, and rollout evaluation.",
    "OMX 로봇 자산과 조작 태스크를 ROS 2 원격조작, 에피소드 기록, 정책 학습, 롤아웃 평가와 연결했습니다."
  ],
  [
    "Teleoperate",
    "원격조작"
  ],
  [
    "Dual leader–follower robots",
    "양팔 리더–팔로워 로봇"
  ],
  [
    "ROS 2 joint streams",
    "ROS 2 관절 데이터 흐름"
  ],
  [
    "Build the data",
    "데이터 구성"
  ],
  [
    "Record, align, and replay",
    "기록·정렬·재생"
  ],
  [
    "Teleop + generated episodes",
    "원격조작 + 생성 에피소드"
  ],
  [
    "Learn policies",
    "정책 학습"
  ],
  [
    "Shared action contracts",
    "공통 행동 데이터 규약"
  ],
  [
    "Evaluate",
    "평가"
  ],
  [
    "Matched resets & task success",
    "동일 초기화 조건과 성공률"
  ],
  [
    "Generalization & failure analysis",
    "일반화 및 실패 분석"
  ],
  [
    "Deploy",
    "실물 배포"
  ],
  [
    "Camera & joint feedback",
    "카메라 및 관절 피드백"
  ],
  [
    "Actual system footage. The twin supports task development, demonstration replay, and policy evaluation.",
    "실제 시스템 영상. 디지털 트윈은 태스크 개발, 시연 재생, 정책 평가에 활용됩니다."
  ],
  [
    "What I built",
    "구현한 요소"
  ],
  [
    "Robot and task integration.",
    "로봇과 태스크 통합"
  ],
  [
    "Dual-arm assets, grippers, contacts, resets, and success conditions for manipulation tasks.",
    "양팔 로봇 자산, 그리퍼, 접촉, 초기화 및 조작 태스크의 성공 조건을 구현했습니다."
  ],
  [
    "A consistent data interface.",
    "일관된 데이터 인터페이스"
  ],
  [
    "Joint order, action scaling, normalization, timestamps, and HDF5 episode formats.",
    "관절 순서, 행동 스케일, 정규화, 타임스탬프, HDF5 에피소드 형식을 통일했습니다."
  ],
  [
    "Simulation-to-hardware interfaces.",
    "시뮬레이션–실물 연결"
  ],
  [
    "Pair mapping, physical gripper conversion, policy servers, and ROS 2 execution.",
    "로봇 쌍 매핑, 실물 그리퍼 값 변환, 정책 서버, ROS 2 실행 경로를 구현했습니다."
  ],
  [
    "02 / Policy learning",
    "02 / 정책 학습"
  ],
  [
    "ACT and Diffusion.",
    "ACT와 Diffusion,"
  ],
  [
    "Different ways to generate action.",
    "서로 다른 행동 생성 방식"
  ],
  [
    "I adapted both policy families to bimanual demonstrations, managed their observation and action interfaces, and examined success alongside inference cost.",
    "두 정책 계열을 양팔 시연 데이터에 적용하고 관측·행동 인터페이스를 통일하여 성공률과 추론 비용을 함께 평가했습니다."
  ],
  [
    "Predict an action chunk.",
    "행동 청크 예측"
  ],
  [
    "Transformer-based behavior cloning, a CVAE training path, and temporal aggregation of overlapping predictions.",
    "Transformer 기반 행동 복제, CVAE 학습 경로, 중첩된 예측의 시간적 집계를 사용합니다."
  ],
  [
    "Action chunking",
    "행동 청크 생성"
  ],
  [
    "Temporal aggregation",
    "시간적 집계"
  ],
  [
    "DIFFUSION POLICY",
    "디퓨전 정책"
  ],
  [
    "Denoise an action trajectory.",
    "잡음 제거를 통한 행동 궤적 생성"
  ],
  [
    "A conditional U-Net and DDIM inference, with a measurable trade-off between denoising budget, latency, and task success.",
    "조건부 U-Net과 DDIM 추론을 사용하며, 디노이징 단계 수와 지연·성공률의 상충관계를 측정했습니다."
  ],
  [
    "Conditional U-Net",
    "조건부 U-Net"
  ],
  [
    "Inference budget",
    "추론 단계 예산"
  ],
  [
    "A measured inference trade-off",
    "추론 효율 비교 실험"
  ],
  [
    "More denoising steps changed task success.",
    "디노이징 단계 수에 따라 성공률이 달라졌습니다."
  ],
  [
    "Expand",
    "확대"
  ],
  [
    "Fixed-layout simulation · 250 rollouts per condition.",
    "고정 배치 시뮬레이션 · 조건당 롤아웃 250회"
  ],
  [
    "The same 34D no-cube Diffusion checkpoint, evaluation seed 2026. The compiled condition retains 10 denoising steps.",
    "동일한 34D no-cube Diffusion 체크포인트와 평가 시드 2026을 사용했습니다. 컴파일 조건에서도 디노이징 10단계를 유지했습니다."
  ],
  [
    "Model and experiment details",
    "모델 및 실험 조건"
  ],
  [
    "Teleop30, train27 / validation3; 34D observations, 14D actions, chunk50; 60,000 training updates. These are the earlier Diffusion34 experiments. Other deployed checkpoints use separate observation, normalization, and timing contracts.",
    "원격조작 30개(학습 27개/검증 3개), 관측 34D, 행동 14D, 청크 50, 학습 업데이트 60,000회입니다. 초기 Diffusion34 실험이며, 이후 배포된 체크포인트는 별도의 관측·정규화·주기 설정을 사용합니다."
  ],
  [
    "Diffusion denoising evaluation data",
    "Diffusion 디노이징 평가 데이터"
  ],
  [
    "Inference",
    "추론 조건"
  ],
  [
    "Success",
    "성공률"
  ],
  [
    "Rollouts",
    "롤아웃 횟수"
  ],
  [
    "4 steps",
    "4단계"
  ],
  [
    "10 steps",
    "10단계"
  ],
  [
    "10 steps + compile",
    "10단계 + 컴파일"
  ],
  [
    "03 / My ACT extension",
    "03 / ACT 확장 연구"
  ],
  [
    "Giving ACT",
    "ACT에"
  ],
  [
    "a temporal context.",
    "시간적 문맥 추가"
  ],
  [
    "TC-ACT summarizes causal joint and image history into a context token. I studied where that history helps, how the modalities interact, and how performance changes beyond the training reset range.",
    "TC-ACT는 과거 관절·영상 이력을 시간 문맥 토큰으로 요약합니다. 이력의 효과, 모달리티 간 상호작용, 학습 범위 밖 초기 조건에서의 성능을 분석했습니다."
  ],
  [
    "CURRENT OBSERVATION",
    "현재 관측"
  ],
  [
    "Joint state + RGB",
    "관절 상태 + RGB"
  ],
  [
    "Current state and spatial image tokens",
    "현재 상태 및 영상 공간 토큰"
  ],
  [
    "CAUSAL HISTORY",
    "과거 시점의 인과적 이력"
  ],
  [
    "Past states + images",
    "과거 상태 + 영상"
  ],
  [
    "Temporal encoder → learned",
    "시간 인코더 → 학습된"
  ],
  [
    "token",
    "토큰"
  ],
  [
    "ACT POLICY",
    "ACT 정책"
  ],
  [
    "State + vision + [TC]",
    "상태 + 영상 + [TC]"
  ],
  [
    "Predict the future action chunk",
    "미래 행동 청크 예측"
  ],
  [
    "Experiments include state-only, image-only, and combined history; CVAE and phase ablations; and auxiliary future-state prediction in selected versions. Future values are training targets only.",
    "실험은 상태만 사용한 이력, 영상만 사용한 이력, 혼합 이력, CVAE·phase 제거 실험 및 일부 버전의 미래 상태 보조 예측을 포함합니다. 미래 값은 학습 목표로만 사용합니다."
  ],
  [
    "Model generations use different history encodings and auxiliary objectives. E5000 compares complete ACT/TC-ACT configurations under paired resets; it does not isolate history alone.",
    "모델 세대마다 이력 인코딩 및 보조 목적함수가 다릅니다. E5000은 동일 초기화 조건에서 ACT/TC-ACT 전체 구성을 비교하므로 이력만의 효과를 분리한 결과는 아닙니다."
  ],
  [
    "Model-version context (EN / KO) ↗",
    "모델 버전별 설정 보기 ↗"
  ],
  [
    "Position generalization",
    "위치 변화 일반화"
  ],
  [
    "Visual policies · E5000",
    "시각 정책 · E5000"
  ],
  [
    "TC-ACT improved Handover; Basket favored ACT.",
    "Handover에서는 TC-ACT가, Basket에서는 ACT가 더 높은 성공률을 기록했습니다."
  ],
  [
    "1,250 paired-reset evaluations per model and task.",
    "모델·태스크당 동일 초기화 비교 평가 1,250회"
  ],
  [
    "Five evaluation seeds × 250 rollouts; one trained seed. Basket and Handover show different effects of temporal context.",
    "평가 시드 5개 × 롤아웃 250회이며 학습 시드는 1개입니다. Basket과 Handover에서 시간 문맥의 효과가 다르게 나타났습니다."
  ],
  [
    "Evaluation setup and exact values",
    "평가 설정과 실제 수치"
  ],
  [
    "Teleop30 + Mimic300 visual policies; epoch5000, frozen ResNet18 features, temporal aggregation. The five seeds vary evaluation resets. They are not five separately trained policies.",
    "Teleop30 + Mimic300 시각 정책, 5,000 epoch, 고정된 ResNet18 특징, 시간적 집계를 사용했습니다. 다섯 시드는 평가 초기화 조건의 차이이며 서로 다른 다섯 개의 학습 정책이 아닙니다."
  ],
  [
    "E5000 visual policy success rates",
    "E5000 시각 정책 성공률"
  ],
  [
    "Task",
    "태스크"
  ],
  [
    "TC − ACT",
    "TC − ACT 차이"
  ],
  [
    "Spatial robustness · E6000",
    "공간 일반화 성능 · E6000"
  ],
  [
    "Test the policy beyond its training placements.",
    "학습 위치 범위 밖에서 정책을 평가합니다."
  ],
  [
    "25,000 simulation evaluations across the plotted conditions.",
    "그래프의 모든 조건에서 시뮬레이션 평가 총 25,000회"
  ],
  [
    "Basic collider, AMP-off evaluation, E6000. Each model/task/range has 5 evaluation seeds × 250 rollouts. XY half-range is per axis, not a radial distance.",
    "기본 충돌체, AMP 비활성화, E6000 평가입니다. 모델·태스크·범위별로 시드 5개 × 롤아웃 250회를 수행했습니다. XY 절반 범위는 반경이 아니라 각 축 기준입니다."
  ],
  [
    "Read the evaluation protocol",
    "평가 절차 보기"
  ],
  [
    "ACT and TC-ACT share initial placements within each pair. Both use training seed0. These E6000 policies, geometry, and numerical settings form a separate experiment from the E5000 comparison above and later convex-decomposition runs.",
    "각 비교 쌍에서 ACT와 TC-ACT는 동일한 초기 물체 위치를 사용합니다. 두 모델의 학습 시드는 0입니다. E6000의 정책·기하 구조·수치 설정은 위 E5000 및 이후 볼록 분해 실험과 별개입니다."
  ],
  [
    "Download the plotted values",
    "그래프 원본 값 보기"
  ],
  [
    "Look at a failure, too",
    "실패 사례도 분석"
  ],
  [
    "The same placement can expose different behavior.",
    "같은 초기 배치에서도 서로 다른 행동이 나타납니다."
  ],
  [
    "Illustrative rollout",
    "사례 롤아웃"
  ],
  [
    "Download the paired example",
    "비교 사례 영상 보기"
  ],
  [
    "Basket · ±4cm · 21 Oct 2026.",
    "Basket · ±4cm · 2026년 10월 21일"
  ],
  [
    "An illustrative ACT-success / TC-ACT-failure pair with identical initial cube positions. This diagnostic run is separate from the aggregate chart protocols.",
    "동일한 초기 큐브 위치에서 ACT는 성공하고 TC-ACT는 실패한 예시입니다. 이 진단 실험은 전체 통계 그래프의 평가 절차와는 별개입니다."
  ],
  [
    "04 / Demonstration research",
    "04 / 시연 데이터 연구"
  ],
  [
    "Four sources.",
    "네 가지 데이터 출처,"
  ],
  [
    "Different data, different behavior.",
    "서로 다른 학습 행동"
  ],
  [
    "I studied how demonstrations are generated, aligned, selected, and mixed—and how those choices affect a learned manipulation policy.",
    "시연 데이터의 생성·정렬·선별·혼합 방식이 학습된 조작 정책에 미치는 영향을 연구했습니다."
  ],
  [
    "Human demonstrations",
    "사람 시연 데이터"
  ],
  [
    "Teleoperation",
    "원격조작"
  ],
  [
    "Record operator strategies and real joint trajectories. Establish a task-specific learning baseline.",
    "작업자 전략과 실제 관절 궤적을 기록하여 태스크별 기본 학습 데이터를 구성합니다."
  ],
  [
    "Retargeted trajectories",
    "재목표화 궤적"
  ],
  [
    "Mimic augmentation",
    "Mimic 데이터 증강"
  ],
  [
    "Segment subtasks, retarget around objects, and broaden placement coverage while tracking source lineage.",
    "하위 동작을 나누고 물체 위치에 맞춰 재목표화하여 데이터 다양성을 늘리고 출처를 추적합니다."
  ],
  [
    "Programmatic collection",
    "코드 기반 수집"
  ],
  [
    "Code-scripted",
    "코드 스크립트"
  ],
  [
    "Generate contact-rich simulation demonstrations with IK, grasp phases, clearances, and smooth returns.",
    "역기구학, 파지 단계, 충돌 여유 및 복귀 경로를 사용해 접촉 중심의 시뮬레이션 시연을 생성합니다."
  ],
  [
    "Policy-generated data",
    "정책 생성 데이터"
  ],
  [
    "Successful rollouts",
    "성공한 롤아웃"
  ],
  [
    "Filter successful executions and retrain. Test how additional teacher-generated data changes performance.",
    "성공한 실행을 선별하여 재학습하고, 정책이 생성한 데이터를 추가했을 때의 성능 변화를 평가합니다."
  ],
  [
    "source episodes audited",
    "출처 확인된 에피소드"
  ],
  [
    "aligned release episodes",
    "정렬 완료된 공개 에피소드"
  ],
  [
    "75 Basket + 75 Handover",
    "Basket 75개 + Handover 75개"
  ],
  [
    "Data quality is part of the experiment.",
    "데이터 품질도 실험 조건입니다."
  ],
  [
    "RGB/state/action alignment, stable endings, source IDs, and train/validation splits are recorded alongside the learning results.",
    "RGB·상태·행동 정렬, 종료 안정성, 출처 ID 및 학습/검증 분할을 학습 결과와 함께 기록했습니다."
  ],
  [
    "Download the teleoperation demonstration",
    "원격조작 시연 영상 보기"
  ],
  [
    "Human-driven, dual-arm cubes-to-cups collection.",
    "사람이 조작한 양팔 큐브-컵 시연 데이터입니다."
  ],
  [
    "Download the scripted demonstration",
    "스크립트 시연 영상 보기"
  ],
  [
    "CODE-SCRIPTED / SIMULATION",
    "코드 스크립트 / 시뮬레이션"
  ],
  [
    "Object-relative grasp, place, release, and retreat.",
    "물체 기준 파지·배치·놓기·복귀 동작"
  ],
  [
    "A collection-to-learning example",
    "데이터 수집부터 정책 학습까지"
  ],
  [
    "Scripted Basket demonstrations",
    "스크립트 기반 Basket 시연"
  ],
  [
    "100 exported from 135 attempts.",
    "총 135회 시도 중 100개 내보내기"
  ],
  [
    "All 100 selected episodes reached final success in RGB replay. A subsequent ACT CVAE experiment recorded",
    "선별된 100개 에피소드는 RGB 재생에서 모두 최종 성공했습니다. 이후 ACT CVAE 실험에서는"
  ],
  [
    "Collection attempt rate, selected-demo replay, and learned-policy success are three separate measurements.",
    "수집 시도 성공률, 선별된 시연 재생 성공률, 학습된 정책의 성공률은 서로 다른 지표입니다."
  ],
  [
    "Mixing human and generated data",
    "사람 시연과 생성 데이터 혼합"
  ],
  [
    "Track the training budget, too.",
    "학습량도 함께 비교해야 합니다."
  ],
  [
    "Low-dimensional ACT Teleop-only at 60k updates averaged",
    "저차원 ACT의 Teleop-only 조건은 60,000 업데이트에서 평균"
  ],
  [
    "over three training seeds. The C5 mixed condition at 200k averaged",
    "를 세 학습 시드에서 기록했습니다. C5 혼합 조건은 200,000 업데이트에서 평균"
  ],
  [
    "Different update budgets: these numbers describe separate conditions, rather than isolating the effect of augmentation.",
    "업데이트 횟수가 다르므로, 이 값은 별개 조건의 결과이지 데이터 증강만의 효과를 분리한 것은 아닙니다."
  ],
  [
    "A useful negative result",
    "의미 있는 부정적 결과"
  ],
  [
    "Adding successful policy rollouts needed careful controls.",
    "성공 롤아웃을 추가하는 재학습에는 통제 실험이 필요했습니다."
  ],
  [
    "Two training seeds · 250 evaluations per condition and seed.",
    "학습 시드 2개 · 조건·시드별 평가 250회"
  ],
  [
    "Expert50 versus Expert50 + Self50 at an approximately matched update budget. This result motivated closer checks of data source, normalization, and teacher-generated selection.",
    "유사한 업데이트 횟수에서 Expert50과 Expert50 + Self50을 비교했습니다. 이 결과를 바탕으로 데이터 출처, 정규화, 정책 생성 데이터 선별 과정을 추가 점검했습니다."
  ],
  [
    "What this comparison controls",
    "비교 실험의 통제 조건"
  ],
  [
    "The six-control study uses approximately 14,000 optimizer updates per condition, a fixed evaluation seed2026, and a final checkpoint. Normalization was fitted on the original Mimic50 and held fixed across conditions; student policies were trained from scratch. Successful rollouts come from a policy trained on related expert data. The full four-source × two-policy experiment matrix is not complete.",
    "6개 통제 조건에서 조건당 약 14,000회 최적화 업데이트, 고정 평가 시드 2026, 최종 체크포인트를 사용했습니다. 정규화는 기존 Mimic50으로 계산해 모든 조건에 고정했고, 학생 정책은 처음부터 다시 학습했습니다. 성공 롤아웃은 관련 전문가 데이터로 학습한 정책에서 수집했습니다. 네 가지 데이터 출처 × 두 정책의 전체 실험 행렬은 아직 완성되지 않았습니다."
  ],
  [
    "05 / Real-time systems",
    "05 / 실시간 시스템"
  ],
  [
    "Close the timing gap.",
    "실행 지연을 줄이고,"
  ],
  [
    "Keep the robot loop moving.",
    "로봇 제어 주기 유지"
  ],
  [
    "I profiled inference and communication, optimized the Diffusion denoiser, and separated ACT policy queries from hardware command timing.",
    "추론과 통신 지연을 측정하고 Diffusion 디노이저를 최적화했으며, ACT 정책 요청과 하드웨어 명령 주기를 분리했습니다."
  ],
  [
    "MODEL EXECUTION",
    "모델 실행"
  ],
  [
    "Optimize the expensive path.",
    "연산량이 큰 경로 최적화"
  ],
  [
    "Compile the FP32 U-Net with",
    "FP32 U-Net에"
  ],
  [
    "reduce-overhead",
    "reduce-overhead 옵션으로 컴파일하고"
  ],
  [
    ", retain the 10-step denoising budget, and warm up the runtime before execution.",
    " 옵션을 적용해 컴파일하고, 디노이징 10단계를 유지하며 실행 전 워밍업합니다."
  ],
  [
    "CONTROL TIMING",
    "제어 주기"
  ],
  [
    "Give commands their own clock.",
    "하드웨어 명령 주기 분리"
  ],
  [
    "Independent ACT policy and command loops, TCP interfaces, explicit normalization, and consistent arm/gripper mapping.",
    "독립적인 ACT 정책·명령 루프, TCP 인터페이스, 명시적 정규화, 일관된 로봇팔·그리퍼 매핑을 구현했습니다."
  ],
  [
    "PORTABLE RUNTIME",
    "이식 가능한 실행 환경"
  ],
  [
    "Carry the model, preserve the behavior.",
    "실행 환경이 달라도 정책 동작 유지"
  ],
  [
    "Minimal PyTorch ACT/Diffusion inference packages, reference-output comparisons, reset semantics, and a separate ROS 2 bridge.",
    "최소 PyTorch ACT/Diffusion 추론 패키지, 기준 출력 비교, 리셋 동작 정의, 독립된 ROS 2 브리지를 구현했습니다."
  ],
  [
    "Earlier Diffusion34 deployment",
    "초기 Diffusion34 배포"
  ],
  [
    "Denoiser latency before and after compilation.",
    "컴파일 전후 디노이저 지연 비교"
  ],
  [
    "August deployment measurements.",
    "8월 배포 실험 측정값"
  ],
  [
    "Model benchmark p99: 35.7 → 11.33ms. A separate 40-second real-feedback shadow recorded 50.00Hz policy / 100.02Hz commands and p99 13.37ms. Benchmark and shadow measure different execution paths.",
    "모델 벤치마크 p99 지연은 35.7ms에서 11.33ms로 감소했습니다. 별도로 수행한 40초 실물 피드백 섀도 실행에서는 정책 50.00Hz, 명령 100.02Hz, p99 13.37ms를 기록했습니다. 벤치마크와 섀도 실행은 측정 경로가 다릅니다."
  ],
  [
    "Measurement and model scope",
    "측정 조건과 모델 범위"
  ],
  [
    "Values are preserved in the August experiment presentation. The model is the earlier 34D Diffusion policy; later Task2 checkpoints and RTX3070 timing experiments have separate contracts and results. Their measurements are not pooled here.",
    "값은 8월 실험 발표 자료에 보존되어 있습니다. 해당 모델은 초기 34D Diffusion 정책이며, 이후 Task2 체크포인트 및 RTX 3070 지연 실험은 설정과 결과가 달라 합산하지 않았습니다."
  ],
  [
    "October / Task2 ACT on hardware",
    "10월 / Task2 ACT 실물 실험"
  ],
  [
    "consecutive physical successes.",
    "회 연속 실물 태스크 성공"
  ],
  [
    "Operator-observed, fixed-layout handover trials. A detailed timing log is retained for the final 796-step run.",
    "작업자가 관찰한 고정 배치 Handover 실험입니다. 마지막 796스텝 실행의 상세 지연 로그를 보관하고 있습니다."
  ],
  [
    "Command interval · median",
    "명령 간격 · 중앙값"
  ],
  [
    "Policy round-trip · median",
    "정책 왕복 지연 · 중앙값"
  ],
  [
    "Independent clocks",
    "독립적인 제어 주기"
  ],
  [
    "This Task2 ACT policy uses joint and fixed-environment observations. Its hardware result is a separate experiment from the real-camera Visual TC-ACT study below.",
    "Task2 ACT 정책은 관절 상태와 고정 환경 관측을 사용합니다. 실물 평가 결과는 아래의 실시간 카메라 Visual TC-ACT 실험과 별개입니다."
  ],
  [
    "Download the hardware mapping test",
    "하드웨어 매핑 테스트 영상 보기"
  ],
  [
    "EARLIER HARDWARE MAPPING TEST",
    "기존 하드웨어 매핑 테스트"
  ],
  [
    "Physical arm and gripper mapping. Separate from the October Task2 trials.",
    "실물 로봇팔 및 그리퍼 매핑 시험이며 10월 Task2 실험과는 별개입니다."
  ],
  [
    "POLICY VIDEO DIRECTORY",
    "정책 영상 목록"
  ],
  [
    "Real · ACT · Handover",
    "실물 · ACT · Handover"
  ],
  [
    "The dedicated Sim / Real video matrix reserves this task-policy slot. New footage will carry its own model version and trial context.",
    "Sim / Real 영상 비교표에 태스크·정책별 영상 공간이 마련되어 있습니다. 새 영상에는 모델 버전과 시행 정보를 함께 기록합니다."
  ],
  [
    "Open the reserved video slot ↗",
    "영상 공간 보기 ↗"
  ],
  [
    "Recording context",
    "녹화 조건"
  ],
  [
    "For the Task2 run, keep the full workspace visible from the closed-gripper start to task completion. Include the date and link the clip to its timing trace.",
    "Task2에서는 그리퍼가 닫힌 초기 상태부터 완료까지 전체 작업 공간을 녹화합니다. 날짜와 지연 기록을 연결합니다."
  ],
  [
    "06 / Visual policies on hardware",
    "06 / 실물 시각 정책"
  ],
  [
    "From camera frames",
    "카메라 프레임에서"
  ],
  [
    "to physical execution.",
    "실물 로봇 구동까지"
  ],
  [
    "I collected real-camera demonstrations and deployed Visual TC-ACT using live RGB and joint observations. The study compares joint-only 14D inputs with 17D inputs that add phase features.",
    "실물 카메라 시연을 수집하고 실시간 RGB 영상과 관절 상태를 입력으로 Visual TC-ACT를 배포했습니다. 관절만 사용하는 14D와 phase 특징 3개를 추가한 17D 입력을 비교했습니다."
  ],
  [
    "Camera thread",
    "카메라 스레드"
  ],
  [
    "Latest frame",
    "최신 프레임"
  ],
  [
    "Aligned RGB + joints",
    "정렬된 RGB + 관절"
  ],
  [
    "State & image history",
    "상태 및 영상 이력"
  ],
  [
    "Dual-arm commands",
    "양팔 로봇 명령"
  ],
  [
    "Reduce waiting.",
    "대기 시간 최소화"
  ],
  [
    "Separate camera acquisition, keep the latest frame, and warm up GPU inference.",
    "카메라 수집을 별도 처리하고 최신 프레임을 유지하며 GPU 추론을 워밍업합니다."
  ],
  [
    "Match learning and execution.",
    "학습과 실행 조건 일치"
  ],
  [
    "Reuse image preprocessing, history features, joint conventions, and episode reset behavior.",
    "영상 전처리, 이력 특징, 관절 규약 및 에피소드 리셋 동작을 재사용합니다."
  ],
  [
    "Physical experiments · training seed0",
    "실물 실험 · 학습 시드 0"
  ],
  [
    "Observation design changed real behavior.",
    "관측 구성에 따라 실물 성공률이 달라졌습니다."
  ],
  [
    "25 operator-observed trials per condition · one training seed.",
    "조건당 작업자 관찰 실험 25회 · 학습 시드 1개"
  ],
  [
    "Results are preserved in experiment notes, presentations, and success/failure footage. The trial-level raw log mapping remains to be consolidated.",
    "실험 기록, 발표 자료, 성공·실패 영상에 결과가 보존되어 있습니다. 시행별 원본 로그 매핑은 아직 정리 중입니다."
  ],
  [
    "Observation and dataset details",
    "관측 및 데이터셋 조건"
  ],
  [
    "Real-camera clean30 datasets; 24 training / 6 validation demonstrations per task. 14D uses joint observations; 17D adds three phase features. Historical image and joint information is maintained by the Visual TC-ACT policy.",
    "실물 카메라 clean30 데이터셋에서 태스크당 학습 24개·검증 6개 시연을 사용했습니다. 14D는 관절 상태를 사용하고 17D에는 phase 특징 3개를 추가합니다. Visual TC-ACT 정책은 과거 영상과 관절 이력도 유지합니다."
  ],
  [
    "Physical real-camera trial counts",
    "실물 카메라 실험 성공 횟수"
  ],
  [
    "14D joints",
    "14D 관절"
  ],
  [
    "17D joints + phase",
    "17D 관절 + phase"
  ],
  [
    "The physical OMX workspace. This still is from the earlier hardware mapping demonstration.",
    "실물 OMX 작업 공간 사진입니다. 기존 하드웨어 매핑 시연에서 촬영한 장면입니다."
  ],
  [
    "Real · TC-ACT · Basket / Handover",
    "실물 · TC-ACT · Basket / Handover"
  ],
  [
    "The dedicated matrix contains separate slots for both tasks. The earlier workspace still is kept here as system documentation.",
    "영상 비교표에는 두 태스크를 위한 별도 영역이 있습니다. 기존 작업 공간 사진은 시스템 문서로 남겨두었습니다."
  ],
  [
    "Basket video slot ↗",
    "Basket 영상 공간 ↗"
  ],
  [
    "Handover video slot ↗",
    "Handover 영상 공간 ↗"
  ],
  [
    "Synchronize the camera input and physical workspace. Keep model, 14D/17D observation, date, trial ID, and outcome attached to each recording.",
    "카메라 입력과 실물 작업 공간을 동기화합니다. 각 녹화에 모델, 14D/17D 관측, 날짜, 시행 ID 및 결과를 연결합니다."
  ],
  [
    "How the work is evaluated",
    "연구 평가 기준"
  ],
  [
    "Keep the experiment",
    "실험 조건을"
  ],
  [
    "attached to the result.",
    "결과와 함께 기록"
  ],
  [
    "Success rates, timing measurements, and demonstration counts have different meanings. Each figure carries its task, model version, sampling conditions, and evidence scope.",
    "성공률, 지연 시간, 시연 데이터 개수는 서로 다른 지표입니다. 각 그림에 태스크, 모델 버전, 표본 추출 조건, 근거 범위를 기록했습니다."
  ],
  [
    "Matched comparisons",
    "동일 조건 비교"
  ],
  [
    "Same initial placements within policy pairs. Training seeds and evaluation seeds are reported separately.",
    "정책 비교 쌍에서 동일 초기 위치를 사용하고 학습 시드와 평가 시드를 구분해 보고했습니다."
  ],
  [
    "Data provenance",
    "데이터 출처 추적"
  ],
  [
    "Source episode IDs, aligned RGB/state/action fields, splits, quality filtering, and normalization conventions.",
    "원본 에피소드 ID, RGB·상태·행동 정렬, 데이터 분할, 품질 필터링 및 정규화 규약을 추적합니다."
  ],
  [
    "Failures included",
    "실패 결과도 포함"
  ],
  [
    "Wider reset ranges, failed rollouts, unsuccessful retraining conditions, and task-dependent temporal effects.",
    "확장된 초기화 범위, 실패 롤아웃, 성능이 저하된 재학습 조건, 태스크별 시간 문맥 효과를 함께 제시합니다."
  ],
  [
    "Chart data & conditions ↗",
    "그래프 수치와 조건 ↗"
  ],
  [
    "Research source notes ↗",
    "연구 원본 기록 ↗"
  ],
  [
    "Website source ↗",
    "홈페이지 소스코드 ↗"
  ],
  [
    "About / Additional work",
    "소개 / 추가 연구"
  ],
  [
    "with a systems background.",
    "시스템 구현 역량"
  ],
  [
    "I am an undergraduate student at Kyung Hee University, working across Biomedical Engineering and Electronic Engineering. My interests include visual manipulation, imitation learning, reinforcement learning, and embodied intelligence.",
    "경희대학교에서 생체의공학과 전자공학을 복수전공하는 학부연구생입니다. 시각 기반 조작, 모방학습, 강화학습, 임바디드 인텔리전스에 관심이 있습니다."
  ],
  [
    "Further experiments include Mamba-2 temporal encoders and MAT/PPO action-chunk learning. My earlier work also spans embedded control, biomedical instrumentation, and data analysis.",
    "추가 연구로 Mamba-2 시간 인코더와 MAT/PPO 행동 청크 학습을 진행했습니다. 이전 작업에는 임베디드 제어, 생체계측 및 데이터 분석이 포함됩니다."
  ],
  [
    "Download CV",
    "CV 보기"
  ],
  [
    "Embedded systems",
    "임베디드 시스템"
  ],
  [
    "STM32 control & sensor integration",
    "STM32 제어 및 센서 통합"
  ],
  [
    "UART, I2C, ADC, PWM, timer input capture, CLCD output, joystick input, and sensor interfaces.",
    "UART, I2C, ADC, PWM, 타이머 입력 캡처, CLCD 출력, 조이스틱 입력, 센서 인터페이스를 구현했습니다."
  ],
  [
    "Biomedical instrumentation",
    "생체계측"
  ],
  [
    "EMG & force measurement",
    "근전도 및 힘 측정"
  ],
  [
    "Signal acquisition, analog circuits, force measurement, soldering, and GUI-based signal visualization.",
    "신호 수집, 아날로그 회로, 힘 측정, 납땜 및 GUI 기반 신호 시각화를 수행했습니다."
  ],
  [
    "Research support",
    "연구 지원"
  ],
  [
    "Biomedical data analysis",
    "생체의학 데이터 분석"
  ],
  [
    "Data processing, statistical analysis, and publication-oriented figure preparation.",
    "데이터 전처리, 통계 분석 및 논문용 결과 그림 제작을 수행했습니다."
  ]
]);
  const nodes = [];
  for (const root of [document.querySelector("main"),document.querySelector(".footer")]) {
    if (!root) continue;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode;
      if(node.parentElement?.closest('[data-locale],script,style,pre,code,svg,textarea')) continue;
      const original=node.nodeValue;
      const english=original.trim();
      if(!dictionary.has(english)) continue;
      const leading=original.match(/^\s*/)?.[0] || "";
      const trailing=original.match(/\s*$/)?.[0] || "";
      nodes.push({node,english:original,korean:leading+dictionary.get(english)+trailing});
    }
  }
  function render(){
    const korean=document.documentElement.lang==="ko";
    for(const item of nodes) item.node.nodeValue=korean?item.korean:item.english;
  }
  render();
  document.querySelectorAll("[data-language]").forEach(button=>button.addEventListener("click",render));
})();