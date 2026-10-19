"""
Builds the bundled exercise demo media from the free-exercise-db dataset
(https://github.com/yuhonas/free-exercise-db, Unlicense / public domain).

For every app exercise it downloads the dataset's two start/end frames, then writes
  assets/exercise-media/<exerciseId>.gif   looping animation (frame 0 <-> frame 1)
  assets/exercise-media/<exerciseId>.jpg   small static thumbnail (frame 0)
and regenerates src/data/exerciseMedia.ts (static require()s, so Metro bundles them).

Usage (from the project root; the download dir must be empty/new):
  python -I scripts/build-exercise-media.py <download-dir>

To use a different animation for one exercise, drop your own file at
assets/exercise-media/<exerciseId>.gif (or .webp) and edit that entry in
src/data/exerciseMedia.ts. Exercises mapped to None have no media and fall back to
the bundled SVG illustration.
"""
import concurrent.futures
import os
import sys
import urllib.request
from PIL import Image

BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "exercise-media")
REGISTRY = os.path.join(ROOT, "src", "data", "exerciseMedia.ts")
GIF_WIDTH = 360
THUMB_WIDTH = 192
FRAME_MS = 900

# app exercise id -> free-exercise-db id (None = no suitable demo; SVG fallback is used)
MAPPING = {
    "push-bench-press": "Barbell_Bench_Press_-_Medium_Grip",
    "push-incline-bench-press": "Barbell_Incline_Bench_Press_-_Medium_Grip",
    "push-decline-bench-press": "Decline_Barbell_Bench_Press",
    "push-db-bench-press": "Dumbbell_Bench_Press",
    "push-incline-db-press": "Incline_Dumbbell_Press",
    "push-cable-fly-high-low": "Cable_Crossover",
    "push-cable-fly-low-high": "Low_Cable_Crossover",
    "push-pec-deck": "Butterfly",
    "push-dips": "Dips_-_Chest_Version",
    "push-pushups": "Pushups",
    "push-overhead-press": "Barbell_Shoulder_Press",
    "push-seated-db-press": "Dumbbell_Shoulder_Press",
    "push-arnold-press": "Arnold_Dumbbell_Press",
    "push-lateral-raise": "Side_Lateral_Raise",
    "push-cable-lateral-raise": "Cable_Seated_Lateral_Raise",
    "push-machine-lateral-raise": None,
    "push-front-raise": "Front_Dumbbell_Raise",
    "push-tricep-pushdown": "Triceps_Pushdown_-_Rope_Attachment",
    "push-straight-bar-pushdown": "Triceps_Pushdown",
    "push-skull-crushers": "EZ-Bar_Skullcrusher",
    "push-overhead-cable-extension": "Cable_Rope_Overhead_Triceps_Extension",
    "push-close-grip-bench": "Close-Grip_Barbell_Bench_Press",
    "pull-pullup": "Pullups",
    "pull-chinup": "Chin-Up",
    "pull-lat-pulldown": "Wide-Grip_Lat_Pulldown",
    "pull-close-grip-pulldown": "V-Bar_Pulldown",
    "pull-straight-arm-pulldown": "Straight-Arm_Pulldown",
    "pull-barbell-row": "Bent_Over_Barbell_Row",
    "pull-db-row": "One-Arm_Dumbbell_Row",
    "pull-seated-cable-row": "Seated_Cable_Rows",
    "pull-tbar-row": "Lying_T-Bar_Row",
    "pull-machine-row": "Leverage_Iso_Row",
    "pull-face-pull": "Face_Pull",
    "pull-reverse-pec-deck": "Reverse_Machine_Flyes",
    "pull-barbell-shrug": "Barbell_Shrug",
    "pull-dumbbell-shrug": "Dumbbell_Shrug",
    "pull-barbell-curl": "Barbell_Curl",
    "pull-incline-db-curl": "Alternate_Incline_Dumbbell_Curl",
    "pull-hammer-curl": "Hammer_Curls",
    "pull-preacher-curl": "Preacher_Curl",
    "pull-cable-curl": "Standing_Biceps_Cable_Curl",
    "legs-squat": "Barbell_Squat",
    "legs-front-squat": "Front_Barbell_Squat",
    "legs-goblet-squat": "Goblet_Squat",
    "legs-leg-press": "Leg_Press",
    "legs-hack-squat": "Hack_Squat",
    "legs-leg-extension": "Leg_Extensions",
    "legs-bulgarian-split-squat": "Split_Squat_with_Dumbbells",
    "legs-lunge": "Dumbbell_Lunges",
    "legs-step-up": "Dumbbell_Step_Ups",
    "legs-rdl": "Romanian_Deadlift",
    "pull-deadlift": "Barbell_Deadlift",
    "legs-seated-leg-curl": "Seated_Leg_Curl",
    "legs-leg-curl": "Lying_Leg_Curls",
    "legs-hip-thrust": "Barbell_Hip_Thrust",
    "legs-cable-kickback": "One-Legged_Cable_Kickback",
    "legs-hip-abduction": "Thigh_Abductor",
    "legs-calf-raise": "Standing_Calf_Raises",
    "legs-seated-calf-raise": "Seated_Calf_Raise",
}


def fetch(job):
    src_id, frame, dest = job
    req = urllib.request.Request(f"{BASE}{src_id}/{frame}.jpg", headers={"User-Agent": "gym-tracker-build"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if data[:3] != b"\xff\xd8\xff":  # JPEG magic bytes; refuse anything else
        raise ValueError(f"{src_id}/{frame}.jpg is not a JPEG")
    with open(dest, "wb") as f:
        f.write(data)
    return dest


def resized(path, width):
    im = Image.open(path).convert("RGB")
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)


def main():
    dl = sys.argv[1]
    os.makedirs(dl, exist_ok=True)
    if os.listdir(dl):
        sys.exit("download dir must be empty")
    os.makedirs(OUT, exist_ok=True)

    jobs = []
    for ex_id, src_id in MAPPING.items():
        if src_id:
            for frame in (0, 1):
                jobs.append((src_id, frame, os.path.join(dl, f"{ex_id}.{frame}.jpg")))
    with concurrent.futures.ThreadPoolExecutor(8) as pool:
        list(pool.map(fetch, jobs))

    registry = {}
    total = 0
    for ex_id, src_id in MAPPING.items():
        if not src_id:
            registry[ex_id] = None
            continue
        f0 = resized(os.path.join(dl, f"{ex_id}.0.jpg"), GIF_WIDTH)
        f1 = resized(os.path.join(dl, f"{ex_id}.1.jpg"), GIF_WIDTH)
        pal = [f.convert("P", palette=Image.ADAPTIVE, colors=128) for f in (f0, f1)]
        gif = os.path.join(OUT, f"{ex_id}.gif")
        pal[0].save(gif, save_all=True, append_images=pal[1:], duration=FRAME_MS, loop=0, optimize=True)
        thumb = os.path.join(OUT, f"{ex_id}.jpg")
        resized(os.path.join(dl, f"{ex_id}.0.jpg"), THUMB_WIDTH).save(thumb, quality=72, optimize=True)
        total += os.path.getsize(gif) + os.path.getsize(thumb)
        registry[ex_id] = True

    lines = [
        "// GENERATED by scripts/build-exercise-media.py. Safe to hand-edit individual entries:",
        "// replace a require() with your own bundled file or a remote https URL string.",
        "// Source art: free-exercise-db (Unlicense / public domain).",
        "import { ExerciseMediaEntry } from '../types';",
        "",
        "export const EXERCISE_MEDIA: Record<string, ExerciseMediaEntry> = {",
    ]
    for ex_id, ok in registry.items():
        if ok:
            lines.append(
                f"  '{ex_id}': {{\n"
                f"    animationUri: require('../../assets/exercise-media/{ex_id}.gif'),\n"
                f"    thumbnailUri: require('../../assets/exercise-media/{ex_id}.jpg'),\n"
                f"  }},"
            )
        else:
            lines.append(f"  // '{ex_id}': no demo available, uses the SVG illustration")
    lines.append("};")
    with open(REGISTRY, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"built {sum(1 for v in registry.values() if v)} exercises, {total / 1e6:.1f} MB")


main()
