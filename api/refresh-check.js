// Vercel Cron target (see vercel.json). Runs weekly.
//
// What it does, honestly: it does NOT re-scrape the survey numbers themselves —
// most of this page's figures come from periodic industry reports, not sources
// that change day to day, so a bot re-deriving them weekly would be theater, not
// accuracy. Instead it checks that every cited source URL still resolves, and:
//   - if every source is still reachable, it bumps `meta.lastVerified` to today
//   - if any source is broken, it leaves `lastVerified` alone and records the
//     break in `meta.lastChecked.broken` so a human can find a replacement
//     source or remove the claim (see the build spec's own instruction on this).
//
// Committing the result back to GitHub requires GITHUB_TOKEN + GITHUB_REPO env
// vars (set in the Vercel project settings). Without them, this still runs the
// check and returns the result — it just can't persist it.

import fs from 'node:fs/promises'
import path from 'node:path'

const DATA_PATH = path.join(process.cwd(), 'src/data/landscape.json')
const DATA_REPO_PATH = 'src/data/landscape.json'

function collectSourceUrls(data) {
  const urls = new Set()
  for (const fact of Object.values(data.facts)) {
    for (const s of fact.sources || []) urls.add(s.url)
  }
  return [...urls]
}

async function checkUrl(url) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; sap-ecc-2027-landscape-source-check/1.0)' },
    })
    clearTimeout(timeout)
    return { url, ok: res.ok, status: res.status }
  } catch (err) {
    return { url, ok: false, status: null, error: String(err?.message || err) }
  }
}

async function commitToGitHub({ token, repo, branch, content, message }) {
  const api = `https://api.github.com/repos/${repo}/contents/${DATA_REPO_PATH}`
  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'sap-ecc-2027-landscape-cron',
    Accept: 'application/vnd.github+json',
  }

  const getRes = await fetch(`${api}?ref=${branch}`, { headers })
  if (!getRes.ok) throw new Error(`GitHub read failed: ${getRes.status} ${await getRes.text()}`)
  const { sha } = await getRes.json()

  const putRes = await fetch(api, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      sha,
      branch,
    }),
  })
  if (!putRes.ok) throw new Error(`GitHub commit failed: ${putRes.status} ${await putRes.text()}`)
  return putRes.json()
}

export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.authorization
    if (auth !== `Bearer ${cronSecret}`) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
  }

  const raw = await fs.readFile(DATA_PATH, 'utf-8')
  const data = JSON.parse(raw)

  const urls = collectSourceUrls(data)
  const results = await Promise.all(urls.map(checkUrl))
  const broken = results.filter((r) => !r.ok)
  const today = new Date().toISOString().slice(0, 10)

  data.meta.lastChecked = {
    date: today,
    checkedUrls: urls.length,
    broken: broken.map((b) => ({ url: b.url, status: b.status, error: b.error || null })),
  }

  const allHealthy = broken.length === 0
  if (allHealthy) {
    data.meta.lastVerified = today
  }

  const updatedContent = JSON.stringify(data, null, 2) + '\n'

  let committed = false
  let commitError = null
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (token && repo) {
    try {
      await commitToGitHub({
        token,
        repo,
        branch,
        content: updatedContent,
        message: allHealthy
          ? `chore: weekly source check — all ${urls.length} sources reachable (${today})`
          : `chore: weekly source check — ${broken.length}/${urls.length} sources unreachable (${today})`,
      })
      committed = true
    } catch (err) {
      commitError = String(err?.message || err)
    }
  }

  res.status(200).json({
    ok: true,
    checkedAt: today,
    checkedUrls: urls.length,
    brokenCount: broken.length,
    broken: broken.map((b) => b.url),
    lastVerifiedBumped: allHealthy,
    committed,
    commitError,
    note:
      token && repo
        ? undefined
        : 'GITHUB_TOKEN / GITHUB_REPO not configured — result computed but not committed.',
  })
}
