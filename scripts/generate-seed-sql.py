import re
from pathlib import Path

backup = Path(
    r"c:/Users/trans/Downloads/db_cluster-17-02-2025@12-20-22.backup/db_cluster-17-02-2025@12-20-22.backup"
)
out_dir = Path(
    r"c:/Users/trans/OneDrive/Desktop/GitHub/the-wild-oasis-app/supabase/seed"
)

content = backup.read_text(encoding="utf-8", errors="replace")
NULL = "\\N"


def extract_copy(table):
    pattern = rf"COPY public\.{table} \(([^)]+)\) FROM stdin;\n(.*?)\n\\\."
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        raise SystemExit(f"no copy for {table}")
    cols = [c.strip() for c in match.group(1).split(",")]
    rows = []
    for line in match.group(2).splitlines():
        if not line.strip():
            continue
        parts = line.split("\t")
        rows.append(dict(zip(cols, parts)))
    return cols, rows


def sql_value(column, value):
    if value == NULL:
        return "NULL"
    if column in ("has_breakfast", "is_paid"):
        return "true" if value == "t" else "false"
    if column in {
        "id",
        "num_nights",
        "num_guests",
        "cabin_id",
        "guest_id",
        "cabin_price",
        "extras_price",
        "total_price",
    }:
        return value
    return "'" + value.replace("'", "''") + "'"


for table in ("guests", "bookings"):
    cols, rows = extract_copy(table)
    values = [
        "(" + ", ".join(sql_value(c, row[c]) for c in cols) + ")" for row in rows
    ]
    sql = (
        f"INSERT INTO public.{table} ({', '.join(cols)})\n"
        "OVERRIDING SYSTEM VALUE\nVALUES\n"
        + ",\n".join(values)
        + ";\n"
    )
    path = out_dir / f"02_{table}.sql"
    path.write_text(sql, encoding="utf-8")
    print(f"wrote {path} ({len(rows)} rows)")
