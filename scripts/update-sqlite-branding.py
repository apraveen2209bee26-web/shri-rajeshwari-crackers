import sqlite3
import os

db_path = 'prisma/dev.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("UPDATE AdminSetting SET value = REPLACE(REPLACE(value, 'Shri', 'Sri'), 'Shree', 'Sri')")
    except Exception as e:
        print('AdminSetting:', e)
    try:
        cur.execute("UPDATE Product SET description = REPLACE(REPLACE(description, 'Shri', 'Sri'), 'Shree', 'Sri') WHERE description LIKE '%Shri%' OR description LIKE '%Shree%'")
    except Exception as e:
        print('Product:', e)
    try:
        cur.execute("UPDATE BranchLocation SET name = REPLACE(REPLACE(name, 'Shri', 'Sri'), 'Shree', 'Sri') WHERE name LIKE '%Shri%' OR name LIKE '%Shree%'")
    except Exception as e:
        print('BranchLocation:', e)
    conn.commit()
    conn.close()
    print('SQLite prisma/dev.db updated successfully!')
else:
    print('No dev.db found.')
