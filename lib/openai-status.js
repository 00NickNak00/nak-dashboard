const { execSync } = require('child_process');

export function getOpenAIStatus() {
  try {
    const output = execSync('openclaw models', { encoding: 'utf8' });
    
    // Look for openai-codex usage line
    // Format: - openai-codex usage: 5h 100% left ⏱4h 59m · Day 100% left ⏱6d 23h
    const usageLine = output.split('\n').find(l => l.includes('openai-codex usage:'));
    
    if (!usageLine) return { status: 'offline', windowLeft: '0%', dayLeft: '0%' };
    
    const parts = usageLine.split('usage:')[1].trim().split('·');
    const windowLeft = parts[0].match(/(\d+)%/)[0];
    const dayLeft = parts[1].match(/(\d+)%/)[0];
    
    return {
      status: 'active',
      windowLeft,
      dayLeft,
      plan: 'ChatGPT Pro ($200/mo)',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting OpenAI status:', error);
    return { status: 'error' };
  }
}
