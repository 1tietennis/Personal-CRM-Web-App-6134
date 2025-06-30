// AI Provider Service for managing multiple AI models

class AIProviderService {
  constructor() {
    this.providers = {};
    this.activeProvider = null;
    this.loadProviders();
  }

  // Load providers from localStorage
  loadProviders() {
    const saved = localStorage.getItem('ai_providers');
    if (saved) {
      this.providers = JSON.parse(saved);
      
      // Find the first enabled provider as active
      const enabledProviders = Object.values(this.providers).filter(p => p.enabled && p.status === 'connected');
      if (enabledProviders.length > 0) {
        this.activeProvider = enabledProviders[0];
      }
    }
  }

  // Save providers to localStorage
  saveProviders() {
    localStorage.setItem('ai_providers', JSON.stringify(this.providers));
  }

  // Set active provider
  setActiveProvider(providerId) {
    const provider = this.providers[providerId];
    if (provider && provider.enabled && provider.status === 'connected') {
      this.activeProvider = provider;
      return true;
    }
    return false;
  }

  // Generate content using active provider
  async generateContent(prompt, options = {}) {
    if (!this.activeProvider) {
      throw new Error('No active AI provider configured');
    }

    const provider = this.activeProvider;
    const startTime = Date.now();

    try {
      let response;

      switch (provider.id || this.getProviderIdByName(provider.name)) {
        case 'openai':
          response = await this.generateWithOpenAI(provider, prompt, options);
          break;
        case 'gemini':
          response = await this.generateWithGemini(provider, prompt, options);
          break;
        case 'grok':
          response = await this.generateWithGrok(provider, prompt, options);
          break;
        case 'claude':
          response = await this.generateWithClaude(provider, prompt, options);
          break;
        default:
          response = await this.generateWithCustomProvider(provider, prompt, options);
      }

      return {
        success: true,
        content: response.content,
        provider: provider.name,
        model: provider.model,
        tokensUsed: response.tokensUsed || 0,
        responseTime: Date.now() - startTime
      };

    } catch (error) {
      console.error(`AI generation failed with ${provider.name}:`, error);
      
      // Try fallback to another provider
      const fallbackResult = await this.tryFallbackProvider(prompt, options);
      if (fallbackResult) {
        return fallbackResult;
      }

      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  // Generate with OpenAI
  async generateWithOpenAI(provider, prompt, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: options.systemPrompt || 'You are a helpful AI assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || provider.maxTokens,
        temperature: options.temperature ?? provider.temperature,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }

  // Generate with Gemini
  async generateWithGemini(provider, prompt, options) {
    const response = await fetch(`${provider.endpoint}?key=${provider.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature ?? provider.temperature,
          maxOutputTokens: options.maxTokens || provider.maxTokens,
          topP: options.topP || 1,
          topK: options.topK || 40
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    return {
      content: data.candidates[0].content.parts[0].text,
      tokensUsed: data.usageMetadata?.totalTokenCount || 0
    };
  }

  // Generate with Grok
  async generateWithGrok(provider, prompt, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: options.systemPrompt || 'You are Grok, a witty and helpful AI assistant with real-time knowledge.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || provider.maxTokens,
        temperature: options.temperature ?? provider.temperature,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Grok API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }

  // Generate with Claude
  async generateWithClaude(provider, prompt, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: options.maxTokens || provider.maxTokens,
        temperature: options.temperature ?? provider.temperature,
        system: options.systemPrompt || 'You are Claude, a helpful AI assistant.'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens || 0
    };
  }

  // Generate with custom provider
  async generateWithCustomProvider(provider, prompt, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        ...provider.headers
      },
      body: JSON.stringify({
        model: provider.model,
        prompt: prompt,
        max_tokens: options.maxTokens || provider.maxTokens,
        temperature: options.temperature ?? provider.temperature,
        ...options.customParams
      })
    });

    if (!response.ok) {
      throw new Error(`Custom provider API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Try to extract content from common response formats
    let content = data.choices?.[0]?.text || 
                  data.choices?.[0]?.message?.content ||
                  data.completion || 
                  data.text || 
                  data.response ||
                  JSON.stringify(data);

    return {
      content: content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }

  // Try fallback provider if primary fails
  async tryFallbackProvider(prompt, options) {
    const enabledProviders = Object.values(this.providers)
      .filter(p => p.enabled && p.status === 'connected')
      .filter(p => p !== this.activeProvider); // Exclude current provider

    for (const provider of enabledProviders) {
      try {
        const originalActive = this.activeProvider;
        this.activeProvider = provider;
        
        const result = await this.generateContent(prompt, options);
        
        // Restore original active provider
        this.activeProvider = originalActive;
        
        return {
          ...result,
          fallback: true,
          fallbackFrom: originalActive?.name
        };
      } catch (error) {
        console.error(`Fallback provider ${provider.name} also failed:`, error);
        continue;
      }
    }

    return null;
  }

  // Get provider ID by name (for backward compatibility)
  getProviderIdByName(name) {
    const nameMap = {
      'OpenAI GPT-4': 'openai',
      'Google Gemini Pro': 'gemini',
      'Grok 3': 'grok',
      'Grok 4': 'grok',
      'Anthropic Claude': 'claude'
    };
    
    return nameMap[name] || 'custom';
  }

  // Get available providers
  getAvailableProviders() {
    return Object.values(this.providers).filter(p => p.enabled && p.status === 'connected');
  }

  // Get provider capabilities
  getProviderCapabilities(providerId) {
    const provider = this.providers[providerId];
    if (!provider) return null;

    return {
      name: provider.name,
      model: provider.model,
      maxTokens: provider.maxTokens,
      features: provider.features || [],
      tier: provider.tier || 'custom',
      supportsStreaming: provider.features?.includes('streaming') || false,
      supportsImages: provider.features?.includes('multimodal') || false,
      supportsCode: provider.features?.includes('code') || false
    };
  }

  // Update provider configuration
  updateProvider(providerId, updates) {
    if (this.providers[providerId]) {
      this.providers[providerId] = { ...this.providers[providerId], ...updates };
      this.saveProviders();
      return true;
    }
    return false;
  }

  // Upgrade Grok to version 4
  upgradeGrok() {
    const grokProviders = Object.entries(this.providers).filter(([id, provider]) => 
      provider.name.includes('Grok') && provider.upgradable
    );

    for (const [id, provider] of grokProviders) {
      this.updateProvider(id, {
        name: 'Grok 4',
        model: 'grok-4',
        maxTokens: 8192,
        features: [...(provider.features || []), 'advanced-reasoning', 'real-time-web'],
        upgradable: false,
        upgraded: true,
        upgradeDate: new Date().toISOString()
      });
    }

    return grokProviders.length > 0;
  }

  // Test provider connection
  async testProvider(providerId) {
    const provider = this.providers[providerId];
    if (!provider) {
      throw new Error('Provider not found');
    }

    try {
      const result = await this.generateContent('Test connection', { maxTokens: 10 });
      
      this.updateProvider(providerId, {
        status: 'connected',
        lastTest: new Date().toISOString(),
        error: null
      });

      return { success: true, result };
    } catch (error) {
      this.updateProvider(providerId, {
        status: 'error',
        lastTest: new Date().toISOString(),
        error: error.message
      });

      throw error;
    }
  }
}

export default AIProviderService;