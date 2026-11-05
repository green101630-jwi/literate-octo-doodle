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


def failure_chart(data, output: Path):
    d = data['failure_breakdown']
    models, categories = d['models'], d['categories']
    assert len(models) == 2
    assert all(sum(row['counts'].values()) == row['n'] == 250 for row in models)
    fig = plt.figure(figsize=(9.4, 6.8))
    fig.text(.07, .96, 'Basket rollout outcomes', fontsize=25,
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
    title = 'Basket source-control rollout outcome breakdown'
    desc = ('Both models are ACT, trained with seed 0 and evaluated with seed 2026. '
            'Each row contains 250 simulated Basket rollouts. Mimic50 A0: '
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


if __name__ == '__main__':
    main()
