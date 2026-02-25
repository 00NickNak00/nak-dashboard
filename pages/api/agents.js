// API route to fetch agent status

export default async function handler(req, res) {
  try {
    const agentData = {
      trader: {
        name: 'Trader',
        status: 'idle',
        lastRun: new Date().toISOString(),
        nextRun: null,
      },
      researcher: {
        name: 'Researcher',
        status: 'offline',
        lastRun: null,
        nextRun: null,
      },
      monitor: {
        name: 'Monitor',
        status: 'offline',
        lastRun: null,
        nextRun: null,
      },
    }

    // TODO: Check actual sub-agent status from openclaw
    // const subagents = await getActiveSubagents()

    res.status(200).json(agentData)
  } catch (error) {
    console.error('Error fetching agent data:', error)
    res.status(500).json({ error: 'Failed to fetch agent data' })
  }
}
