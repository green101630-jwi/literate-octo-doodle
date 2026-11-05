"""Regenerate the six portfolio figures from evidence-data.json.

Usage: MPLCONFIGDIR=/tmp/mpl-cache python generate_charts.py
Requires matplotlib and numpy. The data file contains only public provenance.
"""
from pathlib import Path
import hashlib
import json
import xml.etree.ElementTree as ET

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator
import numpy as np

ROOT = Path(__file__).resolve().parent
DATA = json.loads((ROOT/'evidence-data.json').read_text())
C = DATA['charts']
BLUE, TEAL, PURPLE = '#377cf6', '#16a08c', '#9b73e8'
INK, MUTED, GRID = '#182c43', '#52647a', '#e8edf3'
ORANGE = '#dc774c'

plt.rcParams.update({
    'font.family': 'DejaVu Sans', 'font.size': 15,
    'text.color': INK, 'axes.labelcolor': INK,
    'axes.edgecolor': '#c8d2df', 'xtick.color': MUTED, 'ytick.color': MUTED,
    'axes.spines.top': False, 'axes.spines.right': False,
    'axes.titleweight': 'bold', 'axes.titlesize': 19, 'axes.labelsize': 16,
    'xtick.labelsize': 15, 'ytick.labelsize': 14,
    'legend.frameon': False, 'legend.fontsize': 15,
    'svg.fonttype': 'none', 'savefig.facecolor': 'white',
    'figure.facecolor': 'white', 'axes.facecolor': 'white',
    'savefig.dpi': 180,
})

manifest = {'schema_version': 1, 'created': '2026-11-03',
    'data': 'evidence-data.json', 'generator': 'generate_charts.py',
    'palette': {'ACT': BLUE, 'TC-ACT': TEAL, 'Diffusion': PURPLE},
    'uncertainty': 'No inferred confidence intervals or significance claims.', 'charts': []}

def base(title, subtitle):
    fig = plt.figure(figsize=(13.2, 8.0))
    fig.text(.075, .95, title, fontsize=25, weight='bold', va='top')
    fig.text(.075, .886, subtitle, fontsize=14.5, color=MUTED, va='top')
    return fig

def style(ax, ylabel='Success rate (%)', limit=100):
    ax.set_ylim(0, limit)
    ax.yaxis.set_major_locator(MultipleLocator(20 if limit == 100 else 10))
    ax.grid(axis='y', color=GRID, linewidth=1)
    ax.set_axisbelow(True)
    ax.tick_params(axis='both', length=0, pad=10)
    ax.spines['left'].set_visible(False)
    ax.set_ylabel(ylabel, labelpad=13)

def footer(fig, line1, line2=''):
    fig.text(.075, .09, line1, fontsize=12.2, color=MUTED, va='top')
    if line2:
        fig.text(.075, .058, line2, fontsize=12.2, color=MUTED, va='top')

def bar_labels(ax, bars, values, counts=None, decimals=1):
    for i, (bar, value) in enumerate(zip(bars, values)):
        inside = value >= 88
        y = value-4 if inside else value+2.6
        label = f'{value:.{decimals}f}%'
        if counts is not None:
            label += '\n'+counts[i]
        ax.text(bar.get_x()+bar.get_width()/2, y, label,
                ha='center', va='top' if inside else 'bottom',
                fontsize=16, weight='bold', color='white' if inside else INK,
                linespacing=1.35)

def save(fig, name, title, alt, notes, source_ids):
    fig.savefig(ROOT/(name+'.png'), dpi=180)
    fig.savefig(ROOT/(name+'.svg'))
    plt.close(fig)
    svg = ROOT/(name+'.svg')
    ns = 'http://www.w3.org/2000/svg'
    ET.register_namespace('', ns)
    ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')
    tree = ET.parse(svg)
    root = tree.getroot()
    root.set('role', 'img')
    root.set('aria-labelledby', name+'-title '+name+'-desc')
    t = ET.Element('{'+ns+'}title', {'id': name+'-title'})
    t.text = title
    d = ET.Element('{'+ns+'}desc', {'id': name+'-desc'})
    d.text = alt
    root.insert(0, t)
    root.insert(1, d)
    tree.write(svg, encoding='utf-8', xml_declaration=True)
    assets = {}
    for ext in ['svg', 'png']:
        p = ROOT/(name+'.'+ext)
        assets[ext] = {'file': p.name, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(),
                       'bytes': p.stat().st_size}
    manifest['charts'].append(dict(id=name, title=title, alt=alt,
        assets=assets, sources=source_ids, notes=notes))

# 1: Task-dependent effects; evaluation seeds are explicit.
name = 'visual-act-tc-e5000'
fig = base('Visual ACT vs. TC-ACT', 'E5000  ·  simulation  ·  paired initial positions')
ax = fig.add_axes([.12, .23, .81, .52])
style(ax)
x, w = np.arange(2), .30
for offset, model, color in [(-w/2, 'ACT', BLUE), (w/2, 'TC-ACT', TEAL)]:
    rows = [next(r for r in C[name]['rows'] if r['task'] == t and r['model'] == model)
            for t in ['Basket', 'Handover']]
    vals = [r['success_pct'] for r in rows]
    bars = ax.bar(x+offset, vals, w, color=color, label=model)
    bar_labels(ax, bars, vals, decimals=2)
ax.set_xticks(x, ['Basket', 'Handover'])
ax.set_xlim(-.6, 1.6)
fig.legend(*ax.get_legend_handles_labels(), loc='upper right', bbox_to_anchor=(.94, .838), ncol=2)
footer(fig, '5 evaluation seeds × 250 rollouts = 1,250 per model and task.',
       'One trained model per method/task (training seed 0). Evaluation seeds are not training replicates.')
save(fig, name, 'Visual ACT and TC-ACT at epoch 5000',
     'Basket: ACT 96.00%, TC-ACT 89.04%. Handover: ACT 74.08%, TC-ACT 84.08%. '
     'Each value uses 1,250 simulated rollouts across five evaluation seeds, with training seed 0.',
     ['5 evaluation seeds, not 5 training seeds.', 'Seed 2026 reused an earlier paired evaluation.'], ['e5000-summary'])

# 2: Separate range study; Basket AMP off / Handover AMP on.
name = 'spatial-generalization-e6000'
fig = base('Generalization across initial object positions',
           'Visual ACT / TC-ACT  ·  E6000  ·  task-specific settings')
axes = [fig.add_axes([.10, .25, .38, .49]), fig.add_axes([.58, .25, .38, .49])]
for ax, task in zip(axes, ['Basket', 'Handover']):
    style(ax, 'Success rate (%)' if task == 'Basket' else '')
    ax.set_title(task, pad=18)
    for model, color, marker in [('ACT', BLUE, 'o'), ('TC-ACT', TEAL, 's')]:
        rows = sorted([r for r in C[name]['rows'] if r['task'] == task and r['model'] == model],
                      key=lambda r:r['xy_half_range_cm'])
        xs, ys = [r['xy_half_range_cm'] for r in rows], [r['success_pct'] for r in rows]
        ax.plot(xs, ys, color=color, marker=marker, linewidth=3, markersize=8, label=model)
        above = (task == 'Basket' and model == 'ACT') or (task == 'Handover' and model == 'TC-ACT')
        for xx, yy in zip(xs, ys):
            ax.annotate(f'{yy:.1f}', (xx, yy), xytext=(0, 9 if above else -17),
                        textcoords='offset points', ha='center', fontsize=11.5, color=color, weight='bold')
    ax.set_xticks([2,3,4,5,6])
    ax.set_xlim(1.8, 6.2)
    ax.set_xlabel('Initial XY half-range (± cm)', labelpad=16)
fig.legend(*axes[0].get_legend_handles_labels(), loc='upper right', bbox_to_anchor=(.96,.853), ncol=2)
footer(fig, 'Each point: 5 evaluation seeds × 250 paired rollouts = 1,250 per model/task/range.',
       'Training seed 0. Wider ranges change the evaluation distribution; no confidence intervals inferred.')
save(fig, name, 'Spatial generalization at epoch 6000',
     'Two panels show ACT and TC-ACT success rates over XY half-ranges from ±2 to ±6 cm. '
     'ACT leads in Basket; TC-ACT leads in Handover. Basket AMP off; Handover AMP on. '
     'training seed 0 and five evaluation seeds, 1,250 rollouts per point.',
     ['XY half-range is not a radius.', 'Separate range study: Basket AMP off; Handover AMP on.'],
     ['e6000-2_4_6-summary', 'e6000-3_5-summary'])

# 3: Existing matched checkpoint, fixed cube placement.
name = 'diffusion-steps'
fig = base('Diffusion denoising steps and task success',
           'Diffusion34  ·  same trained checkpoint  ·  fixed cube placement  ·  simulation')
ax = fig.add_axes([.12,.25,.82,.51])
style(ax)
rows = C[name]['rows']
vals = [r['success_pct'] for r in rows]
bars = ax.bar(np.arange(3), vals, .57, color=['#c6b0f2', PURPLE, '#7250bb'])
bar_labels(ax, bars, vals, [f"{r['successes']} / 250" for r in rows])
ax.set_xticks(np.arange(3), ['4 steps', '10 steps', '10 steps\n+ compiled U-Net'])
ax.set_xlim(-.65,2.65)
footer(fig, '250 rollouts per setting  ·  evaluation seed 2026  ·  temporal aggregation enabled.',
       'Task success is shown here; runtime latency is a separate measurement.')
save(fig, name, 'Diffusion denoising-step comparison',
     'Fixed-placement simulated success: 4 denoising steps 62/250 (24.8%), '
     '10 steps 197/250 (78.8%), 10 steps with compiled U-Net 188/250 (75.2%).',
     ['Simulator results, not hardware trials.', 'A fixed-placement task does not establish random-placement generalization.'],
     [s['id'] for s in DATA['sources'] if s['id'].startswith('diffusion-')])

# 4: Separate panels prevent benchmark and real-feedback shadow conflation.
name = 'diffusion-latency'
fig = base('Reducing Diffusion34 inference latency',
           'August 2026 deployment  ·  presentation-reported p99 measurements')
left = fig.add_axes([.10,.27,.46,.44])
right = fig.add_axes([.72,.27,.23,.44])
for ax in [left,right]:
    style(ax, 'p99 latency (ms)', 40)
    ax.axhline(20, color='#8b9bad', ls=(0,(4,3)), lw=1.6)
left.set_title('U-Net inference benchmark', pad=22)
right.set_title('Real-feedback shadow', pad=22, fontsize=16)
bars = left.bar([0,1], [35.7,11.33], .54, color=['#c6b0f2',PURPLE])
for b, val in zip(bars,[35.7,11.33]):
    left.text(b.get_x()+b.get_width()/2,val+1.0,f'{val:g} ms',ha='center',fontsize=18,weight='bold')
left.set_xticks([0,1],['Eager FP32','Compiled FP32'])
left.set_xlim(-.6,1.6)
right.bar([0],[13.37],.52,color=TEAL)
right.text(0,14.4,'13.37 ms',ha='center',fontsize=18,weight='bold')
right.set_xticks([0],['Policy request'])
right.set_xlim(-.65,.65)
fig.text(.10,.805,'Model computation only',fontsize=13,color=MUTED)
fig.text(.72,.805,'40 s  ·  no motion',fontsize=13,color=MUTED)
fig.text(.10,.17,'Dashed reference: 20 ms policy period (50 Hz). Panels use different measurement scopes.',
         fontsize=12.3,color=MUTED)
footer(fig, 'Shadow run: real joint feedback, 50 Hz policy / 100 Hz control. This is not a physical success test.',
       'Values preserved in the deployment presentation review; original benchmark/shadow JSON unavailable.')
save(fig, name, 'Diffusion34 latency measurements',
     'Presentation-reported p99 U-Net inference latency: eager FP32 35.7 ms, compiled FP32 11.33 ms. '
     'A separate 40-second no-motion real-feedback shadow recorded p99 policy request latency 13.37 ms. '
     'The panels have different measurement scopes; dashed line is the 20 ms policy period.',
     ['Presentation-level evidence; original latency JSON was not located.',
      'Benchmark, real-feedback shadow, and physical task success are distinct.'], ['deployment-audit'])

# 5: User-observed counts, not reconstructed trial records.
name = 'real-camera-phase-ablation'
fig = base('Real-camera TC-ACT: joint input with and without phase',
           'Physical trials  ·  training seed 0  ·  user-observed success / attempt totals')
ax = fig.add_axes([.12,.25,.81,.49])
style(ax)
x, w = np.arange(2), .30
for offset, observation, color in [(-w/2,'14D',TEAL),(w/2,'17D','#78bfb1')]:
    rows = [next(r for r in C[name]['rows'] if r['task'] == t and r['observation'] == observation)
            for t in ['Basket','Handover']]
    vals = [r['success_pct'] for r in rows]
    bars = ax.bar(x+offset,vals,w,color=color,label='14D: joints only' if observation=='14D' else '17D: joints + phase')
    bar_labels(ax,bars,vals,[f"{r['successes']} / 25" for r in rows],0)
ax.set_xticks(x,['Basket','Handover'])
ax.set_xlim(-.6,1.6)
fig.legend(*ax.get_legend_handles_labels(),loc='upper right',bbox_to_anchor=(.94,.837),ncol=2,fontsize=14)
footer(fig, '25 physical attempts per task/configuration, recorded in September deployment notes.',
       'User-observed totals; a complete trial-level ledger and model-hash mapping are unavailable.')
save(fig,name,'Real-camera phase-input comparison',
     'User-observed physical trials, seed-0 models: Basket joint-only 14D 21/25 (84%), '
     '17D with phase 0/25 (0%); Handover 14D 23/25 (92%), 17D 20/25 (80%). '
     'Complete trial-level raw ledger unavailable.',
     ['User-observed counts, not simulator evaluation.', 'Seed-1/2 results excluded because denominators were not confirmed.'],
     ['real-camera-notes','deployment-audit'])

# 6: Show both training seeds rather than a pooled average.
name = 'success-rollout-controls'
fig = base('Successful self-rollouts did not improve this baseline',
           'Basket simulation  ·  matched update budget (~14,000)  ·  two training seeds')
ax = fig.add_axes([.12,.25,.81,.49])
style(ax)
x, w = np.arange(2), .30
conditions = [('Expert 50',BLUE),('Expert 50 + self-success 50',ORANGE)]
for offset,(condition,color) in zip([-w/2,w/2],conditions):
    rows = [next(r for r in C[name]['rows'] if r['training_seed']==s and r['condition']==condition) for s in [0,1]]
    vals = [r['success_pct'] for r in rows]
    bars = ax.bar(x+offset,vals,w,color=color,label=condition)
    bar_labels(ax,bars,vals,[f"{r['successes']} / 250" for r in rows])
ax.set_xticks(x,['Training seed 0','Training seed 1'])
ax.set_xlim(-.6,1.6)
fig.legend(*ax.get_legend_handles_labels(),loc='upper right',bbox_to_anchor=(.94,.838),ncol=2,fontsize=14)
footer(fig, 'Expert = Mimic demonstrations. Expert-only: 14,000 updates; expert + self-success: 14,001.',
       '250 rollouts per model at evaluation seed 2026. This result is specific to this data/training protocol.')
save(fig,name,'Successful self-rollout data control experiment',
     'Basket simulation with approximately 14,000 training updates: expert50 scores 56.0% and 57.2% '
     'for training seeds 0 and 1; expert50 plus self-success50 scores 22.4% and 14.4%. '
     'Each model was evaluated on 250 rollouts at evaluation seed 2026.',
     ['A negative result under this protocol, not a universal claim about self-generated data.',
      'Two training seeds; no confidence intervals inferred.'], ['success-rollout-control-summary'])

(ROOT/'chart-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Generated six SVG/PNG pairs and chart-manifest.json.')
