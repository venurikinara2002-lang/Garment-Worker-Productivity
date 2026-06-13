def validate_inputs(d: dict) -> list[str]:
    warns = []
    if d["targeted_productivity"] > 0.95:
        warns.append("Targeted productivity is unusually high (>0.95).")
    if d["over_time"] > 425:
        warns.append("Over time seems high (>425). Check units (hours).")
    if d["smv"] > 60:
        warns.append("SMV is very high (>60). Check input.")
    if d["wip"] > 24000:
        warns.append("WIP is very high (>24000). Check input.")
    if d["idle_time"] > 150:
        warns.append("Idle time is high (>150). Check units.")
    if d["no_of_workers"] > 60:
        warns.append("Number of workers is unusually high (>60). Check input.")
    if d["day"] == "Friday":
        warns.append("Friday is a Holiday Check input.")
    return warns

def quality_badge(warns: list[str]) -> str:
    if not warns:
        return "✅ Good"
    if len(warns) <= 2:
        return "⚠️ Suspect"
    return "❌ Poor"