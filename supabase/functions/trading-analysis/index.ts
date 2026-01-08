import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert cryptocurrency and stock market technical analyst AI. You provide detailed, professional-grade market analysis.

When analyzing an asset, you MUST respond with a valid JSON object containing:
{
  "asset": "string - the asset symbol (e.g., BTC/USD, ETH/USD, AAPL)",
  "timeframe": "string - the timeframe analyzed (e.g., 1H, 4H, Daily, Weekly)",
  "trend": "string - one of: bullish, bearish, neutral",
  "summary": "string - a 2-3 sentence summary of the market outlook",
  "signals": {
    "entry": "string - recommended entry price",
    "stopLoss": "string - recommended stop loss price",
    "takeProfit1": "string - first take profit target",
    "takeProfit2": "string - second take profit target"
  },
  "technicalAnalysis": {
    "rsi": "string - RSI value and interpretation",
    "macd": "string - MACD status and interpretation",
    "trend": "string - trend description",
    "support": ["array of 3 key support levels as strings"],
    "resistance": ["array of 3 key resistance levels as strings"],
    "patterns": ["array of 3 detected chart patterns as strings"]
  },
  "riskManagement": {
    "riskReward": "string - risk/reward ratio (e.g., 1:2.5)",
    "positionSize": "string - recommended position size",
    "riskLevel": "string - Low, Medium, or High",
    "confidence": number - confidence percentage 50-95
  },
  "scenarios": [
    {
      "type": "bullish",
      "probability": number - probability percentage,
      "description": "string - bullish scenario description"
    },
    {
      "type": "bearish",
      "probability": number - probability percentage,
      "description": "string - bearish scenario description"
    },
    {
      "type": "neutral",
      "probability": number - probability percentage,
      "description": "string - neutral scenario description"
    }
  ]
}

Important guidelines:
- Use realistic current market prices for crypto and stocks
- Be specific with price levels and technical indicators
- Provide actionable trading signals
- Consider market sentiment and recent news impact
- ONLY respond with the JSON object, no additional text`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      console.error("No message provided");
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Requesting AI analysis for:", message);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze the following market request and provide detailed technical analysis: ${message}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No analysis generated" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("AI response received, parsing...");

    // Parse the JSON response from the AI
    let analysis;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonStr = content;
      if (content.includes("```json")) {
        jsonStr = content.split("```json")[1].split("```")[0].trim();
      } else if (content.includes("```")) {
        jsonStr = content.split("```")[1].split("```")[0].trim();
      }
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis", raw: content }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Analysis complete for:", analysis.asset);

    return new Response(
      JSON.stringify({ analysis, summary: `Analysis complete for ${analysis.asset}. Detected ${analysis.trend} trend with ${analysis.riskManagement?.confidence || 75}% confidence.` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trading-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
