import sys, json

data = []
current_jam = None
current_iteration = None
current_jam_full = None

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    # new game jam marker
    if line.startswith("**"):
        current_jam = line.lstrip("*").strip()
        current_iteration = None
        current_jam_full = current_jam
    # iteration number for current jam
    elif line.startswith("="):
        current_iteration = line.lstrip("=").strip()
        current_jam_full = f"{current_jam} {current_iteration}"
    # final theme (voted) if asterisk present (but not jam marker)
    elif line.startswith("*"):
        theme = line.lstrip("*").strip()
        role = "Final Theme"
        # if only one theme, distinction can be ignored, but here we assume multiple entries
        tags = [current_jam_full, role, current_jam] if current_iteration else [current_jam, role]
        data.append({ "name": theme, "tags": tags })
    # finalist theme
    else:
        theme = line
        role = "Finalist"
        tags = [current_jam_full, role, current_jam] if current_iteration else [current_jam, role]
        data.append({ "name": theme, "tags": tags })

print(json.dumps(data, indent=2))
