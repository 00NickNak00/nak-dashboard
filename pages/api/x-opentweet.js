const BASE = process.env.OPENTWEET_BASE_URL || 'https://opentweet.io'

async function ot(path) {
  const key = process.env.OPENTWEET_API_KEY
  if (!key) throw new Error('Missing OPENTWEET_API_KEY')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      'X-API-Key': key,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenTweet ${path} failed: ${res.status} ${text.slice(0, 180)}`)
  }
  return res.json()
}

export default async function handler(req, res) {
  try {
    const me = await ot('/api/v1/me')
    const posts = await ot('/api/v1/posts?limit=10')

    let overview = null
    let tweets = null
    let analyticsWarning = null

    try {
      overview = await ot('/api/v1/analytics/overview')
    } catch (e) {
      analyticsWarning = (analyticsWarning || []).concat(['overview_unavailable'])
    }

    try {
      tweets = await ot('/api/v1/analytics/tweets?limit=10')
    } catch (e) {
      analyticsWarning = (analyticsWarning || []).concat(['tweet_analytics_requires_advanced_plan'])
    }

    return res.status(200).json({
      source: 'opentweet',
      capabilities: {
        canReadOwnPosts: true,
        canReadOwnAnalytics: Boolean(overview || tweets),
        canReadHomeTimeline: false,
        canReadPrivateGroups: false,
      },
      me,
      posts,
      overview,
      tweets,
      analyticsWarning,
      note: 'OpenTweet is for your account posting + analytics. It does not provide full private X timeline/groups access.',
    })
  } catch (error) {
    console.error('x-opentweet error', error)
    return res.status(500).json({ error: error.message })
  }
}
