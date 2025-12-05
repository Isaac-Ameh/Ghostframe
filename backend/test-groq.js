// Quick test script to verify Groq API connection
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY not found in .env file');
  process.exit(1);
}

console.log('✅ GROQ_API_KEY found in .env');
console.log('🔑 Key starts with:', GROQ_API_KEY.substring(0, 10) + '...');

async function testGroqConnection() {
  try {
    console.log('\n🧪 Testing Groq API connection...');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello from Groq!" if you can hear me.'
          }
        ],
        temperature: 0.7,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API error:', response.status, errorText);
      process.exit(1);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    console.log('✅ Groq API connection successful!');
    console.log('📝 Response:', content);
    console.log('📊 Tokens used:', data.usage?.total_tokens || 'N/A');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testGroqConnection();
