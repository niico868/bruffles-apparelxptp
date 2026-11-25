"""Passport hero compilation: 8 hard cuts of 1.3-1.7s (about 11s), cropped to the panel, charcoal/yellow
duotone, 0.8s crossfade from the tail into the head so it loops without a seam. No audio.
Usage:  python3 scripts/build-pp-hero.py SOURCE_VIDEO OUT_DIR
Today SOURCE_VIDEO is the stock baggage-carousel clip (CC0, Wikimedia Commons). When Passport's own
Instagram clips arrive in reference/ptp-instagram/, edit `cuts` to point at them (one input per clip).
Desktop: 1280px wide (budget 2.5 MB). Mobile: 720px wide (budget 1.2 MB). H.264 CRF 28 + VP9 WebM."""
import subprocess, sys, os
SRC, OUT = sys.argv[1], sys.argv[2]
# (start, dur, crop-mode) ; modes: wide = panel crop of whole frame, close = tighter on the bags (lower-left)
cuts = [(0.4,1.6,"wide"),(2.3,1.4,"close"),(4.2,1.7,"wide"),(6.1,1.3,"closeR"),(7.8,1.6,"wide"),(9.9,1.5,"close"),(11.8,1.4,"wide"),(13.6,1.6,"closeR")]
D = sum(c[1] for c in cuts)
def run(W, H, ar, out):
    # ar = width/height of output
    f = []
    for i,(s,d,m) in enumerate(cuts):
        if m == "wide":
            ch = 1080; cw = int(ch*ar)//2*2; x = 420 if ar < 1 else 120; y = 0
        else:
            ch = 760; cw = int(ch*ar)//2*2; y = 1080-ch; x = (0 if m == "close" else 180) + (260 if ar < 1 else 0)
        cw = min(cw, 1920)
        f.append(f"[0:v]trim=start={s}:duration={d},setpts=PTS-STARTPTS,crop={cw}:{ch}:{x}:{y},scale={W}:{H}:flags=lanczos,setsar=1,fps=30[v{i}]")
    f.append("".join(f"[v{i}]" for i in range(len(cuts))) + f"concat=n={len(cuts)}:v=1:a=0,format=gray,format=rgb24,"
             "eq=contrast=1.15:brightness=-0.02,"
             "lutrgb=r='30+val*(245-30)/255':g='32+val*(204-32)/255':b='35+val*(92-35)/255',format=yuv420p,split[s1][s2]")
    f.append(f"[s1]trim=start=0.8,setpts=PTS-STARTPTS[a];[s2]trim=duration=0.8,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=0.8:offset={D-1.6:.3f}[out]")
    fc = ";".join(f)
    subprocess.run(["ffmpeg","-v","error","-y","-i",SRC,"-filter_complex",fc,"-map","[out]","-an","-c:v","libx264","-crf","28","-preset","veryfast","-pix_fmt","yuv420p","-movflags","+faststart",os.path.join(OUT,out)+".mp4"],check=True)
    subprocess.run(["ffmpeg","-v","error","-y","-i",os.path.join(OUT,out)+".mp4","-an","-c:v","libvpx-vp9","-b:v","0","-crf","40","-row-mt","1","-deadline","good","-cpu-used","4",os.path.join(OUT,out)+".webm"],check=True)
print("total", D, "loop", D-0.8)
run(1280, 1068, 1280/1068, "hero-pp")
run(720, 900, 0.8, "hero-pp-mobile")
