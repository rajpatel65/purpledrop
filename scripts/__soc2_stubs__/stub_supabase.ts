// Minimal stand-in for https://esm.sh/@supabase/supabase-js@2
// In-memory tables shaped like the real schema subset the functions touch:
// verification_codes, profiles, assessment_sessions, lead_signals.
export interface Row {
  id: number;
  email?: string;
  code?: string;
  used?: boolean;
  expires_at?: string;
  created_at?: string;
  user_id?: string;
  answers?: unknown;
  status?: string;
  [k: string]: unknown;
}

export const db = {
  verification_codes: [] as Row[],
  profiles: [] as Row[],
  assessment_sessions: [] as Row[],
  lead_signals: [] as Row[],
};

let rowId = 0;
export function resetDb() {
  for (const k of Object.keys(db)) (db as Record<string, unknown>)[k] = [];
  rowId = 0;
}

export function insertRow(table: string, row: Partial<Row>) {
  rowId += 1;
  const full: Row = { id: rowId, created_at: new Date().toISOString(), used: false, ...row } as Row;
  (db as unknown as Record<string, Row[]>)[table].push(full);
  return full;
}

const TABLES: Record<string, Row[]> = db as unknown as Record<string, Row[]>;

function matches(row: Row, conds: Array<[string, unknown]>): boolean {
  return conds.every(([k, v]) => {
    if (Array.isArray(v)) {
      const [op, cmp] = v as [string, string];
      const rv = row[k] as string;
      if (rv === undefined || rv === null) return false;
      return op === 'gt' ? rv > cmp : rv >= cmp;
    }
    return row[k] === v;
  });
}

class Builder {
  private conds: Array<[string, unknown]> = [];
  private opts?: { count?: string; head?: boolean };
  private orderCol?: string;
  private orderAsc = true;
  private limitN = Infinity;
  private countMode = false;
  private patch?: Partial<Row>;

  constructor(private table: string) {}

  select(field = '*', opts?: { count?: string; head?: boolean }) {
    void field;
    this.opts = opts;
    this.countMode = !!opts?.count;
    return this;
  }
  upsert(row: Row, _opts?: unknown) {
    void _opts;
    const t = TABLES[this.table] as Row[];
    const existing = row.id ? t.find((r) => r.id === row.id) : undefined;
    if (existing) Object.assign(existing, row);
    else insertRow(this.table, row);
    return this;
  }
  insert(row: Row | Row[]) {
    const rows = Array.isArray(row) ? row : [row];
    for (const r of rows) insertRow(this.table, r as Partial<Row>);
    return Promise.resolve({ data: null, error: null });
  }
  update(patch: Partial<Row>) { this.patch = patch; return this; }
  eq(k: string, v: unknown) { this.conds.push([k, v]); return this; }
  gt(k: string, v: unknown) { this.conds.push([k, ['gt', v as string]]); return this; }
  gte(k: string, v: unknown) { this.conds.push([k, ['gte', v as string]]); return this; }
  order(col: string, opts?: { ascending?: boolean }) {
    this.orderCol = col;
    this.orderAsc = opts?.ascending !== false;
    return this;
  }
  limit(n: number) { this.limitN = n; return this; }

  private exec(): { data: Row[] | null; count?: number | null; error: unknown } {
    const t = TABLES[this.table] as Row[];
    let out = t.filter((r) => matches(r, this.conds));
    if (this.orderCol) {
      out = [...out].sort((a, b) => {
        const av = a[this.orderCol!] as string, bv = b[this.orderCol!] as string;
        return this.orderAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
      });
    }
    out = out.slice(0, this.limitN);
    if (this.patch) for (const row of out) Object.assign(row, this.patch);
    if (this.countMode) return { data: null, count: out.length, error: null };
    return { data: out, error: null };
  }

  single() {
    const res = this.exec();
    if (res.data && res.data.length >= 1) return Promise.resolve({ data: res.data[0], error: null });
    return Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'no rows' } });
  }

  then<T>(onF: (v: { data: Row[] | null; count?: number | null; error: unknown }) => T) {
    return Promise.resolve(this.exec()).then(onF);
  }
}

export function createClient(_url: string, _key: string) {
  void _url; void _key;
  return {
    from: (table: string) => new Builder(table),
    auth: {
      admin: {
        generateLink: ({ email }: { email: string }) => Promise.resolve({
          data: { user: { id: 'auth-user-1', email }, properties: { hashed_token: 'test-hash' } }, error: null,
        }),
      },
      verifyOtp: () => Promise.resolve({ data: { session: {
        access_token: 'test-access-token', refresh_token: 'test-refresh-token',
      } }, error: null }),
      // assessment calls supabaseAdmin.auth.getUser(jwt) to verify a user
      getUser: () =>
        Promise.resolve({ data: { user: { id: 'user-1', email: 'user-1@example.com' } }, error: null }),
    },
  };
}
