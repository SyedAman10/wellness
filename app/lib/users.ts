const BASE = "appzgQAMezE0a20Gl";
const TABLE = "Users";
const API = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;

export type UserRecord = { id: string; name: string; email: string; passwordHash: string };

function authHeader() {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) throw new Error("AIRTABLE_API_KEY is not set");
  return `Bearer ${key}`;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const formula = `LOWER({Email})='${email.toLowerCase().replace(/'/g, "")}'`;
  const url = `${API}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;
  const res = await fetch(url, { headers: { Authorization: authHeader() }, cache: "no-store" });
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { records?: { id: string; fields: Record<string, string> }[] };
  const rec = data.records?.[0];
  if (!rec) return null;
  return {
    id: rec.id,
    name: rec.fields["Name"] ?? "",
    email: rec.fields["Email"] ?? "",
    passwordHash: rec.fields["Password Hash"] ?? "",
  };
}

export async function createUser(u: { name: string; email: string; passwordHash: string }): Promise<void> {
  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        Name: u.name,
        Email: u.email,
        "Password Hash": u.passwordHash,
        "Created At": new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
}
