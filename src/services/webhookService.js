// Webhook Service for managing and triggering webhooks

class WebhookService {
  constructor() {
    this.webhooks = [];
    this.logs = [];
    this.maxLogs = 1000;
    this.loadLogs();
  }

  // Set webhooks array
  setWebhooks(webhooks) {
    this.webhooks = webhooks;
  }

  // Trigger webhook for specific event
  async triggerWebhook(webhook, payload) {
    const startTime = Date.now();
    const logEntry = {
      timestamp: new Date().toISOString(),
      webhookId: webhook.id,
      webhookName: webhook.name,
      url: webhook.url,
      event: payload.event,
      success: false,
      status: null,
      responseTime: 0,
      error: null,
      payload: payload
    };

    try {
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'PersonalCRM-Webhook/1.0',
        'X-Webhook-Event': payload.event,
        'X-Webhook-Timestamp': logEntry.timestamp,
        ...webhook.headers
      };

      // Add signature if secret is provided
      if (webhook.secret) {
        const signature = await this.generateSignature(webhook.secret, payload);
        headers['X-Webhook-Signature'] = signature;
      }

      // Make the webhook request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), webhook.timeout || 30000);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      logEntry.status = response.status;
      logEntry.responseTime = Date.now() - startTime;
      logEntry.success = response.ok;

      if (!response.ok) {
        logEntry.error = `HTTP ${response.status}: ${response.statusText}`;
      }

      this.addLog(logEntry);
      return logEntry;

    } catch (error) {
      logEntry.responseTime = Date.now() - startTime;
      logEntry.error = error.message;
      logEntry.success = false;

      if (error.name === 'AbortError') {
        logEntry.error = 'Request timeout';
      }

      this.addLog(logEntry);
      return logEntry;
    }
  }

  // Trigger webhooks for all subscribers of an event
  async triggerEvent(eventType, data) {
    const subscribedWebhooks = this.webhooks.filter(webhook => 
      webhook.enabled && webhook.events.includes(eventType)
    );

    const payload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: data
    };

    const results = [];

    for (const webhook of subscribedWebhooks) {
      try {
        const result = await this.triggerWebhook(webhook, payload);
        results.push(result);

        // Retry failed webhooks if configured
        if (!result.success && webhook.retryAttempts > 0) {
          await this.retryWebhook(webhook, payload, webhook.retryAttempts);
        }
      } catch (error) {
        console.error(`Failed to trigger webhook ${webhook.name}:`, error);
        results.push({
          webhookId: webhook.id,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  // Retry failed webhook with exponential backoff
  async retryWebhook(webhook, payload, attemptsLeft) {
    if (attemptsLeft <= 0) return;

    const delay = Math.pow(2, webhook.retryAttempts - attemptsLeft) * 1000; // Exponential backoff
    
    await new Promise(resolve => setTimeout(resolve, delay));

    const result = await this.triggerWebhook(webhook, payload);
    
    if (!result.success && attemptsLeft > 1) {
      await this.retryWebhook(webhook, payload, attemptsLeft - 1);
    }
  }

  // Generate HMAC signature for webhook security
  async generateSignature(secret, payload) {
    const payloadString = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const data = encoder.encode(payloadString);
    const key = encoder.encode(secret);

    try {
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return `sha256=${hashHex}`;
    } catch (error) {
      console.error('Failed to generate signature:', error);
      return null;
    }
  }

  // Add log entry
  addLog(logEntry) {
    this.logs.unshift(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.saveLogs();
  }

  // Get logs
  getLogs() {
    return this.logs;
  }

  // Save logs to localStorage
  saveLogs() {
    try {
      // Save only recent logs to prevent localStorage from getting too large
      const recentLogs = this.logs.slice(0, 100);
      localStorage.setItem('webhook_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to save webhook logs:', error);
    }
  }

  // Load logs from localStorage
  loadLogs() {
    try {
      const saved = localStorage.getItem('webhook_logs');
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load webhook logs:', error);
      this.logs = [];
    }
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('webhook_logs');
  }

  // Get webhook statistics
  getWebhookStats(webhookId) {
    const webhookLogs = this.logs.filter(log => log.webhookId === webhookId);
    
    if (webhookLogs.length === 0) {
      return {
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        successRate: 0,
        averageResponseTime: 0
      };
    }

    const successfulCalls = webhookLogs.filter(log => log.success).length;
    const failedCalls = webhookLogs.length - successfulCalls;
    const successRate = (successfulCalls / webhookLogs.length) * 100;
    const averageResponseTime = webhookLogs.reduce((sum, log) => sum + log.responseTime, 0) / webhookLogs.length;

    return {
      totalCalls: webhookLogs.length,
      successfulCalls,
      failedCalls,
      successRate: Math.round(successRate),
      averageResponseTime: Math.round(averageResponseTime)
    };
  }

  // Event trigger methods for different parts of the application
  
  // Social Media Events
  async onPostCreated(postData) {
    return await this.triggerEvent('post.created', postData);
  }

  async onPostScheduled(postData) {
    return await this.triggerEvent('post.scheduled', postData);
  }

  async onResponseGenerated(responseData) {
    return await this.triggerEvent('response.generated', responseData);
  }

  async onResponsePosted(responseData) {
    return await this.triggerEvent('response.posted', responseData);
  }

  async onPlatformConnected(platformData) {
    return await this.triggerEvent('platform.connected', platformData);
  }

  async onPlatformError(errorData) {
    return await this.triggerEvent('platform.error', errorData);
  }

  // CRM Events
  async onContactAdded(contactData) {
    return await this.triggerEvent('contact.added', contactData);
  }

  async onInteractionLogged(interactionData) {
    return await this.triggerEvent('interaction.logged', interactionData);
  }

  async onAutomationTriggered(automationData) {
    return await this.triggerEvent('automation.triggered', automationData);
  }
}

export default WebhookService;