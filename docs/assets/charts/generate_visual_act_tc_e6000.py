"""Regenerate the E6000 figure and CSV from the adjacent public summary JSON.

Requires Python 3 and Matplotlib. No original evaluation files, robot assets,
datasets, checkpoints, or simulator are needed.

Usage: python generate_visual_act_tc_e6000.py
"""
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
import xml.etree.ElementTree as ET

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator


ROOT = Path(__file__).resolve().parent
PALETTE = {"ACT": "#377cf6", "TC-ACT": "#16a08c"}
INK, MUTED, GRID = "#182c43", "#52647a", "#e8edf3"


def load_summary(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    assert len(data["summary"]) == 4
    sources = {row["id"] for row in data["source_provenance"]}
    assert len(sources) == 20
    for row in data["summary"]:
        trials = [r for r in data["per_evaluation_seed"]
                  if r["task"] == row["task"] and r["model"] == row["model"]]
        assert {r["evaluation_seed"] for r in trials} == set(range(2026, 2031))
        assert all(r["trials"] == 250 for r in trials)
        assert sum(r["successes"] for r in trials) == row["successes"]
        assert sum(r["trials"] for r in trials) == row["trials"] == 1250
        assert round(100 * row["successes"] / row["trials"], 2) == row["success_percent"]
        assert set(row["source_ids"]) == {r["source_id"] for r in trials}
        assert set(row["source_ids"]) <= sources
    return data


def render_svg(data: dict, output: Path) -> None:
    plt.rcParams.update({
        "font.family": "DejaVu Sans", "font.size": 15,
        "text.color": INK, "axes.labelcolor": INK,
        "axes.edgecolor": "#c8d2df", "xtick.color": MUTED,
        "ytick.color": MUTED, "axes.spines.top": False,
        "axes.spines.right": False, "axes.labelsize": 16,
        "xtick.labelsize": 17, "ytick.labelsize": 14,
        "legend.frameon": False, "legend.fontsize": 15,
        "svg.fonttype": "none", "svg.hashsalt": "visual-act-tc-e6000-v1",
        "savefig.facecolor": "white", "figure.facecolor": "white",
        "axes.facecolor": "white",
    })
    fig = plt.figure(figsize=(13.2, 8.0))
    fig.text(.075, .95, "Visual ACT vs. TC-ACT", fontsize=25,
             weight="bold", va="top")
    fig.text(.075, .886, "E6000 · XY ±2 cm · 5 evaluation seeds",
             fontsize=15, color=MUTED, va="top")
    ax = fig.add_axes([.105, .245, .85, .50])
    ax.set_ylim(0, 100)
    ax.set_xlim(-.62, 1.62)
    ax.yaxis.set_major_locator(MultipleLocator(20))
    ax.set_ylabel("Success rate (%)", labelpad=13)
    ax.set_xticks([0, 1], ["Pick&Place", "Handover"])
    ax.tick_params(axis="x", length=0, pad=13)
    ax.tick_params(axis="y", length=0, pad=8)
    ax.yaxis.grid(True, color=GRID, linewidth=1)
    ax.set_axisbelow(True)
    lookup = {(r["task"], r["model"]): r for r in data["summary"]}
    handles = []
    for model, offset in (("ACT", -.17), ("TC-ACT", .17)):
        rates = [lookup[(task, model)]["success_percent"]
                 for task in ("Basket", "Handover")]
        bars = ax.bar([offset, 1 + offset], rates, width=.28,
                      color=PALETTE[model], zorder=3)
        handles.append(bars[0])
        for bar, value in zip(bars, rates):
            ax.text(bar.get_x() + bar.get_width() / 2, value + 1.8,
                    f"{value:.2f}%", ha="center", va="bottom",
                    fontsize=18, weight="bold", color=INK,
                    bbox={"facecolor": "white", "edgecolor": "none", "pad": 1.5})
    fig.legend(handles, ["ACT", "TC-ACT"], ncol=2, loc="upper center",
               bbox_to_anchor=(.53, .84), columnspacing=2.4, handlelength=1.8)
    fig.text(.075, .122,
             "1,250 rollouts per bar · 5 evaluation seeds × 250 · training seed 0",
             fontsize=12, color=MUTED)
    fig.text(.075, .078,
             "Task-specific physics and horizons; recorded starts match within ACT / TC-ACT pairs.",
             fontsize=11.5, color=MUTED)
    output.parent.mkdir(parents=True, exist_ok=True)
    title = "Visual ACT vs. TC-ACT at E6000"
    description = (
        "Pick&Place: ACT 1168/1250, 93.44%; TC-ACT 1164/1250, 93.12%. "
        "Handover: ACT 929/1250, 74.32%; TC-ACT 1034/1250, 82.72%. "
        "Five evaluation seeds, training seed 0, XY half-range ±2 cm and AMP on. "
        "The tasks use different horizons and task-specific physics."
    )
    fig.savefig(output, format="svg", metadata={
        "Date": None, "Creator": "E6000 public-summary chart generator",
        "Title": title, "Description": description,
    })
    plt.close(fig)
    ns = "http://www.w3.org/2000/svg"
    ET.register_namespace("", ns)
    ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
    tree = ET.parse(output)
    svg = tree.getroot()
    svg.set("role", "img")
    svg.set("aria-labelledby", "visual-act-tc-e6000-title visual-act-tc-e6000-desc")
    for index, (tag, value) in enumerate((("title", title), ("desc", description))):
        element = ET.Element("{" + ns + "}" + tag,
                             {"id": "visual-act-tc-e6000-" + tag})
        element.text = value
        svg.insert(index, element)
    tree.write(output, encoding="utf-8", xml_declaration=True)


def write_csv(data: dict, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    fields = ["task", "model", "successes", "trials", "success_percent",
              "checkpoint_epoch", "training_seed", "evaluation_seeds",
              "xy_half_range_cm", "evaluation_amp", "horizon", "source_ids"]
    with output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        for row in data["summary"]:
            writer.writerow({
                "task": row["task"], "model": row["model"],
                "successes": row["successes"], "trials": row["trials"],
                "success_percent": f"{row['success_percent']:.2f}",
                "checkpoint_epoch": data["training_contract"]["completed_epochs"],
                "training_seed": data["training_contract"]["training_seed"],
                "evaluation_seeds": ";".join(map(str, data["evaluation_contract"]["seeds"])),
                "xy_half_range_cm": data["evaluation_contract"]["xy_half_range_cm"],
                "evaluation_amp": "true",
                "horizon": data["task_conditions"][row["task"]]["horizon"],
                "source_ids": ";".join(row["source_ids"]),
            })


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=ROOT / "visual-act-tc-e6000.json")
    parser.add_argument("--svg-output", type=Path, default=ROOT / "visual-act-tc-e6000.svg")
    parser.add_argument("--csv-output", type=Path,
                        default=ROOT.parent / "data" / "visual-act-tc-e6000.csv")
    args = parser.parse_args()
    data = load_summary(args.data)
    render_svg(data, args.svg_output)
    write_csv(data, args.csv_output)


if __name__ == "__main__":
    main()
