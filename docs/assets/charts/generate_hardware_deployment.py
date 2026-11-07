"""Regenerate three figures from the adjacent public aggregate JSON only.

Requires Python 3 and Matplotlib. No original logs, datasets, model weights,
simulator, ROS, camera, or hardware are used.

Usage: python generate_hardware_deployment.py
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
import xml.etree.ElementTree as ET

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import FancyBboxPatch
from matplotlib.ticker import MultipleLocator


ROOT = Path(__file__).resolve().parent
INK, MUTED, GRID = "#182c43", "#52647a", "#e5ebf0"
TEAL, PURPLE, LIGHT = "#168b80", "#75439a", "#f2f7f8"


def load_data(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    act = data["physical_results"]["act"]
    assert act["success_rate_claimed"] is False
    assert act["successful_consecutive_runs"] == 5
    assert act["preserved_full_detail_runs"] == 1
    assert act["final_run_control_ticks"] == 796
    tc = data["physical_results"]["tc_act"]
    assert tc["training_seed"] == 0 and len(tc["rows"]) == 4
    for row in tc["rows"]:
        assert row["trials"] == 25
        assert row["success_percent"] == 100 * row["successes"] / row["trials"]
    model = data["timing"]["model"]
    assert model["eager"]["samples"] == model["compiled"]["samples"] == 100
    assert data["timing"]["feedback"]["hardware_commands"] == 0
    assert len(data["timing"]["feedback"]["rows"]) == 4
    ddim = data["diffusion_ddim"]
    assert [r["ddim_steps"] for r in ddim["sweep"]] == list(range(4, 11))
    for row in [*ddim["sweep"], ddim["compiled10"]]:
        assert row["trials"] == 250
        assert abs(row["success_percent"] - 100 * row["successes"] / 250) < 1e-10
    sources = {row["id"] for row in data["source_provenance"]}
    for source in data["source_provenance"]:
        assert re.fullmatch(r"[0-9a-f]{64}", source["sha256"])
        assert "/" not in source["logical_filename"]
    references = [act["source_id"], tc["source_id"], model["source_id"],
                  data["timing"]["feedback"]["source_id"],
                  *(r["source_id"] for r in ddim["sweep"]),
                  ddim["compiled10"]["source_id"]]
    assert set(references) == sources
    return data


def style() -> None:
    plt.rcParams.update({
        "font.family": "DejaVu Sans", "font.size": 14,
        "text.color": INK, "axes.labelcolor": INK,
        "axes.edgecolor": "#bdcbd5", "xtick.color": MUTED,
        "ytick.color": MUTED, "axes.spines.top": False,
        "axes.spines.right": False, "axes.labelsize": 16,
        "xtick.labelsize": 15, "ytick.labelsize": 14,
        "legend.frameon": False, "legend.fontsize": 14,
        "svg.fonttype": "none", "svg.hashsalt": "hardware-deployment-v1",
        "savefig.facecolor": "white", "figure.facecolor": "white",
        "axes.facecolor": "white",
    })


def save(fig, output: Path, title: str, description: str,
         width: int, height: int) -> None:
    fig.savefig(output, format="svg", metadata={
        "Date": None, "Creator": "Public hardware deployment chart generator",
        "Title": title, "Description": description,
    })
    plt.close(fig)
    ns = "http://www.w3.org/2000/svg"
    ET.register_namespace("", ns)
    ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
    tree = ET.parse(output)
    svg = tree.getroot()
    prefix = output.stem
    svg.set("width", str(width))
    svg.set("height", str(height))
    svg.set("role", "img")
    svg.set("aria-labelledby", f"{prefix}-title {prefix}-desc")
    for child in list(svg):
        if child.tag in {"{" + ns + "}title", "{" + ns + "}desc"}:
            svg.remove(child)
    for index, (tag, value) in enumerate((("title", title), ("desc", description))):
        element = ET.Element("{" + ns + "}" + tag,
                             {"id": f"{prefix}-{tag}"})
        element.text = value
        svg.insert(index, element)
    tree.write(output, encoding="utf-8", xml_declaration=True)


def render_results(data: dict, output: Path) -> None:
    act = data["physical_results"]["act"]
    tc = data["physical_results"]["tc_act"]
    fig = plt.figure(figsize=(13.2, 9.0))
    fig.text(.065, .955, "Two physical deployment studies", fontsize=25,
             weight="bold", va="top")
    fig.text(.065, .902, "Separate experiments · operator-observed task outcomes",
             fontsize=14, color=MUTED, va="top")
    panel = FancyBboxPatch((.065, .655), .87, .195, transform=fig.transFigure,
                          boxstyle="round,pad=0.012,rounding_size=0.012",
                          facecolor=LIGHT, edgecolor="#dbe7e9", linewidth=1)
    fig.add_artist(panel)
    fig.text(.09, .812, "ACT · fixed-layout handover", fontsize=19,
             weight="bold", va="top")
    fig.text(.09, .702, str(act["successful_consecutive_runs"]), fontsize=48,
             color=TEAL, weight="bold", va="baseline")
    fig.text(.153, .727, "consecutive successful runs", fontsize=19,
             weight="bold", va="baseline")
    fig.text(.153, .687, "Detailed command / feedback log: final 796-step run only",
             fontsize=12.5, color=MUTED, va="baseline")
    fig.text(.065, .595, "Visual TC-ACT · live RGB + joints", fontsize=20,
             weight="bold", va="top")
    ax = fig.add_axes([.105, .19, .80, .315])
    ax.set_ylim(0, 108)
    ax.set_xlim(-.6, 1.6)
    ax.set_ylabel("Task success (%)", labelpad=12)
    ax.set_xticks([0, 1], ["Pick&Place", "Handover"])
    ax.yaxis.set_major_locator(MultipleLocator(20))
    ax.tick_params(axis="both", length=0, pad=9)
    ax.yaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    lookup = {(r["task"], r["observation"]): r for r in tc["rows"]}
    handles = []
    for observation, offset, color in (("14D", -.17, TEAL), ("17D", .17, PURPLE)):
        rows = [lookup[(task, observation)] for task in ("Pick&Place", "Handover")]
        bars = ax.bar([offset, 1 + offset], [r["success_percent"] for r in rows],
                      width=.28, color=color, zorder=3)
        handles.append(bars[0])
        for bar, row in zip(bars, rows):
            ax.text(bar.get_x() + bar.get_width()/2, row["success_percent"] + 2,
                    f'{row["success_percent"]:.0f}%\n{row["successes"]}/{row["trials"]}',
                    ha="center", va="bottom", fontsize=14, weight="bold",
                    linespacing=1.3)
    fig.legend(handles, ["14D joints + RGB", "17D joints + phase + RGB"], ncol=2,
               loc="upper center", bbox_to_anchor=(.51, .565),
               handlelength=1.5, columnspacing=2.2)
    fig.text(.065, .105, "TC-ACT: one trained seed · 25 physical trials per task / condition",
             fontsize=12.5, color=MUTED)
    fig.text(.065, .06, "ACT and TC-ACT here use different policies, inputs and trial protocols.",
             fontsize=12.5, color=MUTED)
    save(fig, output, "ACT and Visual TC-ACT: separate physical deployment studies",
         "ACT: five consecutive operator-observed successes on a fixed-layout handover; "
         "no denominator-based success rate is claimed, and only the final 796-step run "
         "has a detailed command and feedback log. Visual TC-ACT: one training seed, "
         "25 operator-observed physical trials per task and observation condition. "
         "Pick&Place: 14D joint-state with RGB 21/25 (84%), phase-augmented "
         "17D state with RGB 0/25 (0%). The 14D/17D dimensions describe the "
         "state vector; both configurations also use live RGB. "
         "Handover: 14D 23/25 (92%), 17D 20/25 (80%). "
         "These are separate studies, not a matched ACT versus TC-ACT comparison.", 1320, 900)


def render_timing(data: dict, output: Path) -> None:
    model = data["timing"]["model"]
    feedback = data["timing"]["feedback"]
    fig = plt.figure(figsize=(13.2, 10.0))
    fig.text(.065, .958, "Two deployment bottlenecks", fontsize=25,
             weight="bold", va="top")
    fig.text(.065, .91, "Model compute and sensor message age are different measurements",
             fontsize=14, color=MUTED, va="top")
    fig.text(.065, .837, "A. Diffusion inference · model p99", fontsize=20,
             weight="bold", va="top")
    fig.text(.065, .793, "November C128 · RTX 3070 · DDIM10 · 100 samples per mode",
             fontsize=12.5, color=MUTED, va="top")
    ax = fig.add_axes([.19, .565, .69, .175])
    values = [model["compiled"]["p99_ms"], model["eager"]["p99_ms"]]
    bars = ax.barh([0, 1], values, height=.49, color=[TEAL, PURPLE], zorder=3)
    ax.set_yticks([0, 1], ["Compiled", "Eager"])
    ax.set_xlim(0, 75)
    ax.set_xlabel("Standalone model inference (ms)", labelpad=10)
    ax.xaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    ax.tick_params(axis="both", length=0, pad=8)
    ax.axvline(20, color=MUTED, linestyle=(0, (4, 4)), linewidth=1.3)
    ax.text(20.8, .46, "20 ms / 50 Hz", fontsize=11.5, color=MUTED,
            ha="left", va="center", bbox={"facecolor":"white", "edgecolor":"none", "pad":2})
    for bar, value in zip(bars, values):
        ax.text(value + 1.3, bar.get_y() + bar.get_height()/2, f"{value:.2f}",
                ha="left", va="center", fontsize=17, weight="bold")
    fig.text(.065, .486, "B. Sensor feedback · median message age", fontsize=20,
             weight="bold", va="top")
    fig.text(.065, .442, "No-command live probe · sensor timestamp age, not model inference",
             fontsize=12.5, color=MUTED, va="top")
    ax = fig.add_axes([.19, .185, .69, .18])
    lookup = {(r["arm"], r["subscription_depth"]): r for r in feedback["rows"]}
    handles = []
    for depth, offset, color in ((20, .18, PURPLE), (1, -.18, TEAL)):
        values = [lookup[(arm, depth)]["median_ms"] for arm in ("pair2", "pair1")]
        bars = ax.barh([offset, 1+offset], values, height=.29, color=color, zorder=3)
        handles.append(bars[0])
        for bar, value in zip(bars, values):
            ax.text(value + 3.5, bar.get_y() + bar.get_height()/2, f"{value:.2f}",
                    ha="left", va="center", fontsize=15, weight="bold")
    ax.set_yticks([0, 1], ["Left arm", "Right arm"])
    ax.set_xlim(0, 225)
    ax.set_xlabel("Sensor timestamp age (ms)", labelpad=10)
    ax.tick_params(axis="both", length=0, pad=8)
    ax.xaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    fig.legend(handles, ["Queue depth 20", "Queue depth 1"], ncol=2,
               loc="upper center", bbox_to_anchor=(.54, .412),
               handlelength=1.5, columnspacing=2.2)
    fig.text(.065, .071, "Neither panel measures physical task success or guarantees a control deadline.",
             fontsize=12.5, color=MUTED)
    save(fig, output, "Diffusion model inference and live sensor message age",
         "Separate timing studies. A: November Task2 C128 Diffusion, 20D observations, "
         "RTX 3070, DDIM10, 100 samples per mode. Standalone model p99 falls from "
         "62.1834565 ms eager to 14.5776229 ms compiled; dashed line is the 20 ms "
         "reference period of a 50 Hz loop, not an end-to-end deadline guarantee. "
         "B: no-command live ROS feedback probe. Median sensor timestamp age changes "
         "from 191.982424 to 3.087694 ms for the left arm and 193.550917 to 4.648975 ms for "
         "the right arm when subscription queue depth changes from 20 to 1. "
         "Model compute and message age are distinct metrics; neither is a task-success result.",
         1320, 1000)


def render_ddim(data: dict, output: Path) -> None:
    study = data["diffusion_ddim"]
    sweep, compiled = study["sweep"], study["compiled10"]
    fig = plt.figure(figsize=(13.2, 8.3))
    fig.text(.065, .95, "Denoising steps and task completion", fontsize=25,
             weight="bold", va="top")
    fig.text(.065, .889, "Archived 34D policy · fixed-layout simulation · 250 rollouts per setting",
             fontsize=14, color=MUTED, va="top")
    ax = fig.add_axes([.105, .245, .80, .49])
    ax.set_xlim(3.6, 10.6)
    ax.set_ylim(0, 102)
    ax.set_xticks(range(4, 11))
    ax.yaxis.set_major_locator(MultipleLocator(20))
    ax.set_xlabel("DDIM denoising steps", labelpad=12)
    ax.set_ylabel("Simulation success (%)", labelpad=12)
    ax.tick_params(axis="both", length=0, pad=9)
    ax.yaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    ax.plot([r["ddim_steps"] for r in sweep], [r["success_percent"] for r in sweep],
            color=TEAL, marker="o", markersize=8, linewidth=2.7, zorder=3)
    for row in sweep:
        ax.text(row["ddim_steps"], row["success_percent"]+4, f'{row["success_percent"]:.1f}%',
                ha="center", va="bottom", fontsize=14, weight="bold")
    ax.scatter([10], [compiled["success_percent"]], s=110, color=PURPLE,
               marker="D", edgecolors="white", linewidths=1.3, zorder=5)
    ax.annotate("Compiled10\n75.2%", xy=(10, compiled["success_percent"]),
                xytext=(8.65, 56), fontsize=15, color=PURPLE, weight="bold",
                ha="left", va="top", linespacing=1.5,
                arrowprops={"arrowstyle":"-", "color":PURPLE, "linewidth":1.3})
    handles = [Line2D([0], [0], color=TEAL, marker="o", linewidth=2.7),
               Line2D([0], [0], color=PURPLE, marker="D", linestyle="none", markersize=8)]
    fig.legend(handles, ["DDIM step sweep", "Separate compiled10 run"], ncol=2,
               loc="upper center", bbox_to_anchor=(.52, .827),
               handlelength=1.6, columnspacing=2.0)
    fig.text(.065, .12, "Fixed demo6 placement · evaluation seed 2026 · temporal aggregation 0.01",
             fontsize=12.5, color=MUTED)
    fig.text(.065, .068, "Simulation only · different generation from November 20D C128 · one evaluation seed",
             fontsize=12.5, color=MUTED)
    save(fig, output, "Archived Diffusion denoising-step simulation study",
         "Archived 34D no-cube Diffusion policy in fixed demo6 simulation, evaluation seed "
         "2026, eight parallel environments, temporal aggregation decay 0.01, 250 rollouts "
         "per setting. DDIM4: 62/250, 24.8%; DDIM5: 99/250, 39.6%; DDIM6: 125/250, "
         "50.0%; DDIM7: 138/250, 55.2%; DDIM8: 168/250, 67.2%; DDIM9: 183/250, "
         "73.2%; DDIM10: 197/250, 78.8%. Separate compiled10 run: 188/250, 75.2%. "
         "This is not the November 20D C128 model, not physical success, and not proof "
         "that compilation preserves task performance.", 1320, 830)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=ROOT / "hardware-deployment-data.json")
    parser.add_argument("--output-dir", type=Path, default=ROOT)
    args = parser.parse_args()
    data = load_data(args.data)
    style()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    render_results(data, args.output_dir / "hardware-deployment-results.svg")
    render_timing(data, args.output_dir / "hardware-deployment-timing.svg")
    render_ddim(data, args.output_dir / "hardware-diffusion-ddim.svg")


if __name__ == "__main__":
    main()
