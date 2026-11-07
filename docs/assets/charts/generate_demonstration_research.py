"""Regenerate the demonstration-research SVGs from the adjacent public JSON.

Requires Python3 and Matplotlib. No original datasets, checkpoints, private
source locations or simulator are needed.

Usage:
    python generate_demonstration_research.py
    python generate_demonstration_research.py --data data.json --output-dir charts
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import xml.etree.ElementTree as ET

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
from matplotlib.ticker import MultipleLocator

NAVY = '#173e64'
TEAL = '#148f88'
INK = '#18364c'
MUTED = '#526a7a'
GRID = '#e4edf1'

plt.rcParams.update({
    'font.family': 'DejaVu Sans',
    'font.size': 17,
    'text.color': INK,
    'axes.labelcolor': INK,
    'axes.edgecolor': '#b4c5cf',
    'xtick.color': MUTED,
    'ytick.color': MUTED,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.labelsize': 17,
    'xtick.labelsize': 15,
    'ytick.labelsize': 15,
    'legend.frameon': False,
    'legend.fontsize': 14,
    'figure.facecolor': 'white',
    'axes.facecolor': 'white',
    'savefig.facecolor': 'white',
    'svg.fonttype': 'none',
    'svg.hashsalt': 'demonstration-research-v1',
})


def save_svg(fig, destination: Path, identifier: str, title: str, description: str):
    fig.savefig(destination, format='svg', metadata={
        'Date': None,
        'Creator': 'Demonstration research chart generator',
        'Title': title,
        'Description': description,
    })
    plt.close(fig)
    ns = 'http://www.w3.org/2000/svg'
    ET.register_namespace('', ns)
    ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')
    tree = ET.parse(destination)
    root = tree.getroot()
    root.set('role', 'img')
    root.set('aria-labelledby', identifier + '-title ' + identifier + '-desc')
    title_element = ET.Element('{' + ns + '}title', {'id': identifier + '-title'})
    title_element.text = title
    description_element = ET.Element('{' + ns + '}desc', {'id': identifier + '-desc'})
    description_element.text = description
    root.insert(0, title_element)
    root.insert(1, description_element)
    tree.write(destination, encoding='utf-8', xml_declaration=True)


def coverage_chart(data, output: Path):
    d = data['coverage']
    sources = {row['source']: row for row in d['series']}
    teleop, mimic = sources['teleop'], sources['mimic']
    assert teleop['n'] == len(teleop['xy_relative_mm']) == 25
    assert mimic['n'] == len(mimic['xy_relative_mm']) == 50
    assert len(set(map(tuple, teleop['xy_relative_mm']))) == 1
    fig = plt.figure(figsize=(8.4, 7.8))
    fig.text(.09, .965, 'Handover start-position coverage',
             fontsize=23, weight='bold', va='top')
    fig.text(.09, .913, 'Selected simulation demonstrations',
             fontsize=16, color=MUTED, va='top')
    ax = fig.add_axes([.15, .245, .76, .56])
    xs, ys = zip(*mimic['xy_relative_mm'])
    ax.scatter(xs, ys, s=74, color=TEAL, alpha=.85, edgecolors='white',
               linewidths=.65, zorder=3, label='Mimic (n = 50)')
    # All 25 starts coincide. A single visible marker preserves their location;
    # it is explicitly labeled with its multiplicity rather than adding jitter.
    tx, ty = teleop['xy_relative_mm'][0]
    ax.scatter([tx], [ty], s=225, marker='*', color=NAVY,
               edgecolors='white', linewidths=.8, zorder=5,
               label='Teleop (n = 25, same XY)')
    ax.axhline(0, color='#b7c8d1', linewidth=.9, zorder=1)
    ax.axvline(0, color='#b7c8d1', linewidth=.9, zorder=1)
    ax.set(xlim=(-22, 22), ylim=(-22, 22),
           xlabel='Initial X offset (mm)', ylabel='Initial Y offset (mm)')
    ax.set_aspect('equal', adjustable='box')
    ax.xaxis.set_major_locator(MultipleLocator(10))
    ax.yaxis.set_major_locator(MultipleLocator(10))
    ax.grid(color=GRID, linewidth=.8, zorder=0)
    ax.tick_params(length=0, pad=7)
    fig.legend(*ax.get_legend_handles_labels(), loc='upper left',
               bbox_to_anchor=(.10, .877), ncol=1, labelspacing=.6,
               borderaxespad=0, handletextpad=.6)
    sx, sy = mimic['population_std_xy_mm']
    fig.text(.09, .142, 'XY standard deviation (mm)', fontsize=15,
             weight='bold')
    fig.text(.09, .103, f'Teleop: 0.00 / 0.00     Mimic: {sx:.2f} / {sy:.2f}',
             fontsize=15, color=MUTED)
    fig.text(.09, .051, 'Relative to the Teleop start. No jitter added.',
             fontsize=13, color=MUTED)
    title = 'Handover initial object-position coverage'
    desc = ('Scatter plot of 50 selected Mimic starts and 25 selected Teleop starts. '
            'All 25 Teleop positions coincide at zero; a single star represents them. '
            f'Mimic population standard deviation is {sx:.2f} mm in X and {sy:.2f} mm in Y. '
            'Offsets are relative to the common Teleop start. No jitter is added. '
            'This describes dataset coverage, not policy generalization.')
    save_svg(fig, output / 'demonstration-coverage.svg',
             'demonstration-coverage', title, desc)


def basket_coverage_chart(data, output: Path):
    d = data['basket_coverage']
    assert d['episode_count'] == 75
    assert d['source_episode_counts'] == {'teleop': 25, 'mimic': 50}
    assert len(d['objects']) == 2
    fig = plt.figure(figsize=(10.4, 8.0))
    fig.text(.08, .965, 'Pick&Place start-position coverage',
             fontsize=25, weight='bold', va='top')
    fig.text(.08, .905, 'Selected release · Teleop25 + Mimic50 = 75 episodes',
             fontsize=16, color=MUTED, va='top')
    panels = [[.10, .31, .36, .46], [.58, .31, .36, .46]]
    handles = []
    stats = []
    for index, (obj, position) in enumerate(zip(d['objects'], panels)):
        series = {row['source']: row for row in obj['series']}
        teleop, mimic = series['teleop'], series['mimic']
        assert teleop['n'] == len(teleop['xy_relative_mm']) == 25
        assert mimic['n'] == len(mimic['xy_relative_mm']) == 50
        assert all(-25 <= value <= 25 for row in (teleop, mimic)
                   for point in row['xy_relative_mm'] for value in point)
        ax = fig.add_axes(position)
        mx, my = zip(*mimic['xy_relative_mm'])
        tx, ty = zip(*teleop['xy_relative_mm'])
        mimic_markers = ax.scatter(mx, my, s=62, color=TEAL, alpha=.83,
                                  edgecolors='white', linewidths=.65,
                                  zorder=3, label='Mimic (n = 50)')
        teleop_markers = ax.scatter(tx, ty, s=64, marker='x', color=NAVY,
                                   linewidths=1.7, zorder=4,
                                   label='Teleop (n = 25)')
        if index == 0:
            handles = [teleop_markers, mimic_markers]
        ax.axhline(0, color='#b7c8d1', linewidth=.9, zorder=1)
        ax.axvline(0, color='#b7c8d1', linewidth=.9, zorder=1)
        ax.set(xlim=(-25, 25), ylim=(-25, 25),
               xlabel='Initial X offset (mm)')
        if index == 0:
            ax.set_ylabel('Initial Y offset (mm)')
        ax.set_title(obj['label'], fontsize=19, weight='bold', pad=14)
        ax.set_aspect('equal', adjustable='box')
        ax.xaxis.set_major_locator(MultipleLocator(10))
        ax.yaxis.set_major_locator(MultipleLocator(10))
        ax.grid(color=GRID, linewidth=.8, zorder=0)
        ax.tick_params(length=0, pad=7, labelsize=15)
        ts, ms = teleop['population_std_xy_mm'], mimic['population_std_xy_mm']
        short_name = obj['label'].replace(' cube', '')
        stats.append(f'{short_name}: Teleop {ts[0]:.2f} / {ts[1]:.2f}'
                     f'   ·   Mimic {ms[0]:.2f} / {ms[1]:.2f}')
    fig.legend(handles=handles, loc='upper left',
               bbox_to_anchor=(.08, .875), ncol=2,
               fontsize=16, borderaxespad=0, columnspacing=2,
               handletextpad=.55)
    fig.text(.08, .195, 'XY standard deviation, X / Y (mm)',
             fontsize=15, weight='bold')
    fig.text(.08, .150, stats[0], fontsize=15, color=MUTED)
    fig.text(.08, .112, stats[1], fontsize=15, color=MUTED)
    fig.text(.08, .066, "Offsets from each object's Teleop mean; no jitter.",
             fontsize=13.5, color=MUTED)
    fig.text(.08, .028, 'Similar initial XY ranges in this selected release.',
             fontsize=13.5, color=MUTED)
    title = 'Pick&Place initial object-position coverage'
    description = (
        'Two scatter panels show the yellow and green cube starts in the same 75 '
        'selected Pick&Place demonstration episodes: 25 Teleop and 50 Mimic. '
        'Each object uses its own selected Teleop centroid as zero, with units '
        'in millimeters and axes from minus 25 to plus 25. No jitter is added. '
        'Yellow XY population standard deviation: Teleop 11.11/12.76 mm and '
        'Mimic 10.85/11.86 mm. Green: Teleop 11.76/10.85 mm and '
        'Mimic 11.18/10.64 mm. Teleop and Mimic occupy similar initial XY ranges '
        'in this selected release. The two panels are 75 shared episodes, '
        'not 150 independent demonstrations. This is dataset coverage, '
        'not a measurement of policy generalization.')
    save_svg(fig, output / 'demonstration-coverage-basket.svg',
             'demonstration-coverage-basket', title, description)


def failure_chart(data, output: Path):
    d = data['failure_breakdown']
    models, categories = d['models'], d['categories']
    assert len(models) == 2
    assert all(sum(row['counts'].values()) == row['n'] == 250 for row in models)
    fig = plt.figure(figsize=(9.4, 6.8))
    fig.text(.07, .96, 'Pick&Place rollout outcomes', fontsize=25,
             weight='bold', va='top')
    fig.text(.07, .897, 'Source-control study · 250 rollouts per model',
             fontsize=16, color=MUTED, va='top')
    ax = fig.add_axes([.34, .40, .60, .32])
    for y, row in enumerate(models):
        start = 0
        for category in categories:
            value = row['counts'][category['id']]
            ax.barh(y, value, left=start, height=.51,
                    color=category['color'], edgecolor='white', linewidth=1.4)
            color = INK if category['id'] == 'lifted_but_cube_never_entered_basket' else 'white'
            ax.text(start + value/2, y, str(value), ha='center', va='center',
                    fontsize=18, weight='bold', color=color)
            start += value
    ax.set_yticks(range(len(models)), ['Mimic50\n(A0)', 'Mimic50 + self50\n(B0)'])
    ax.set_ylim(1.65, -.65)
    ax.set_xlim(0, 250)
    ax.xaxis.set_major_locator(MultipleLocator(50))
    ax.set_xlabel('Rollouts (count)', labelpad=9)
    ax.grid(axis='x', color=GRID, linewidth=.8)
    ax.set_axisbelow(True)
    ax.spines['left'].set_visible(False)
    ax.tick_params(axis='both', length=0, pad=9)
    ax.tick_params(axis='y', labelsize=16)
    handles = [Patch(facecolor=c['color'], label=c['label']) for c in categories]
    fig.legend(handles=handles, loc='lower left', bbox_to_anchor=(.07, .198),
               ncol=2, fontsize=15, columnspacing=1.8, handlelength=1.2,
               labelspacing=.8, borderaxespad=0)
    fig.text(.07, .137, 'Train seed 0 · eval seed 2026 · ±2 cm · horizon 708',
             fontsize=13.5, color=MUTED)
    fig.text(.07, .089, 'Heuristic stage labels; no contact diagnosis.',
             fontsize=13.5, color=MUTED)
    fig.text(.07, .041, 'One model per source condition; no causal claim.',
             fontsize=13.5, color=MUTED)
    title = 'Pick&Place source-control rollout outcome breakdown'
    desc = ('Both models are ACT, trained with seed 0 and evaluated with seed 2026. '
            'Each row contains 250 simulated Pick&Place rollouts. Mimic50 A0: '
            'success 140, neither cube lifted 44, one not lifted 32, lifted but not placed 34. '
            'Mimic50 plus self50 B0: success 56, neither lifted 81, one not lifted 72, '
            'lifted but not placed 41. Not lifted means maximum recorded lift below 2.5 cm. '
            'Failure labels are descriptive heuristics and do not establish contact causes. '
            'This is one model per condition, not independent training replicates.')
    save_svg(fig, output / 'demonstration-failure-breakdown.svg',
             'demonstration-failure-breakdown', title, desc)


def main():
    here = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', type=Path,
                        default=here / 'demonstration-research-data.json')
    parser.add_argument('--output-dir', type=Path, default=here)
    args = parser.parse_args()
    data = json.loads(args.data.read_text(encoding='utf-8'))
    args.output_dir.mkdir(parents=True, exist_ok=True)
    coverage_chart(data, args.output_dir)
    failure_chart(data, args.output_dir)
    basket_coverage_chart(data, args.output_dir)


if __name__ == '__main__':
    main()
