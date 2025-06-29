// Social Media API Integration Service
import axios from 'axios';

class SocialMediaAPI {
  constructor() {
    this.platforms = {
      instagram: { connected: false, lastTest: null },
      twitter: { connected: false, lastTest: null },
      linkedin_personal: { connected: false, lastTest: null },
      linkedin_company: { connected: false, lastTest: null },
      facebook: { connected: false, lastTest: null }
    };
    
    this.config = {
      instagram: {
        baseURL: 'https://graph.facebook.com/v18.0',
        accessToken: localStorage.getItem('instagram_access_token'),
        businessAccountId: localStorage.getItem('instagram_business_id')
      },
      twitter: {
        baseURL: 'https://api.twitter.com/2',
        bearerToken: localStorage.getItem('twitter_bearer_token'),
        accessToken: localStorage.getItem('twitter_access_token'),
        accessTokenSecret: localStorage.getItem('twitter_access_token_secret')
      },
      linkedin: {
        baseURL: 'https://api.linkedin.com/v2',
        accessToken: localStorage.getItem('linkedin_access_token'),
        personalProfile: localStorage.getItem('linkedin_personal_profile'),
        companyPage: localStorage.getItem('linkedin_company_page')
      },
      facebook: {
        baseURL: 'https://graph.facebook.com/v18.0',
        accessToken: localStorage.getItem('facebook_access_token'),
        pageId: localStorage.getItem('facebook_page_id')
      }
    };
  }

  // Platform Authentication Methods
  async authenticateInstagram(accessToken, businessAccountId) {
    try {
      const response = await axios.get(
        `${this.config.instagram.baseURL}/${businessAccountId}`,
        {
          params: {
            fields: 'id,name,username',
            access_token: accessToken
          }
        }
      );
      
      if (response.data.id) {
        localStorage.setItem('instagram_access_token', accessToken);
        localStorage.setItem('instagram_business_id', businessAccountId);
        this.config.instagram.accessToken = accessToken;
        this.config.instagram.businessAccountId = businessAccountId;
        this.platforms.instagram.connected = true;
        return { success: true, data: response.data };
      }
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  async authenticateTwitter(bearerToken, accessToken, accessTokenSecret) {
    try {
      const response = await axios.get(
        `${this.config.twitter.baseURL}/users/me`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      );
      
      if (response.data.data.id) {
        localStorage.setItem('twitter_bearer_token', bearerToken);
        localStorage.setItem('twitter_access_token', accessToken);
        localStorage.setItem('twitter_access_token_secret', accessTokenSecret);
        this.config.twitter.bearerToken = bearerToken;
        this.config.twitter.accessToken = accessToken;
        this.config.twitter.accessTokenSecret = accessTokenSecret;
        this.platforms.twitter.connected = true;
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  async authenticateLinkedIn(accessToken, personalProfile, companyPage) {
    try {
      const response = await axios.get(
        `${this.config.linkedin.baseURL}/people/~`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (response.data.id) {
        localStorage.setItem('linkedin_access_token', accessToken);
        localStorage.setItem('linkedin_personal_profile', personalProfile);
        localStorage.setItem('linkedin_company_page', companyPage);
        this.config.linkedin.accessToken = accessToken;
        this.config.linkedin.personalProfile = personalProfile;
        this.config.linkedin.companyPage = companyPage;
        this.platforms.linkedin_personal.connected = true;
        this.platforms.linkedin_company.connected = true;
        return { success: true, data: response.data };
      }
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  async authenticateFacebook(accessToken, pageId) {
    try {
      const response = await axios.get(
        `${this.config.facebook.baseURL}/${pageId}`,
        {
          params: {
            fields: 'id,name',
            access_token: accessToken
          }
        }
      );
      
      if (response.data.id) {
        localStorage.setItem('facebook_access_token', accessToken);
        localStorage.setItem('facebook_page_id', pageId);
        this.config.facebook.accessToken = accessToken;
        this.config.facebook.pageId = pageId;
        this.platforms.facebook.connected = true;
        return { success: true, data: response.data };
      }
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Content Formatting for Each Platform
  formatContentForPlatform(content, platform, brandVoice = 'professional') {
    const baseContent = content.text || content;
    const scripture = content.scripture || '';
    const cta = content.cta || '';
    const hashtags = content.hashtags || [];
    
    switch (platform) {
      case 'instagram':
        return this.formatInstagramContent(baseContent, scripture, cta, hashtags, brandVoice);
      case 'twitter':
        return this.formatTwitterContent(baseContent, scripture, cta, hashtags, brandVoice);
      case 'linkedin_personal':
      case 'linkedin_company':
        return this.formatLinkedInContent(baseContent, scripture, cta, hashtags, brandVoice);
      case 'facebook':
        return this.formatFacebookContent(baseContent, scripture, cta, hashtags, brandVoice);
      default:
        return baseContent;
    }
  }

  formatInstagramContent(content, scripture, cta, hashtags, brandVoice) {
    let formatted = content;
    
    if (brandVoice === 'bible-scholar' && scripture) {
      formatted += `\n\n📖 ${scripture}`;
    }
    
    if (cta) {
      formatted += `\n\n${cta}`;
    }
    
    if (hashtags.length > 0) {
      formatted += `\n\n${hashtags.join(' ')}`;
    }
    
    // Instagram character limit: 2,200
    return formatted.substring(0, 2200);
  }

  formatTwitterContent(content, scripture, cta, hashtags, brandVoice) {
    let formatted = content;
    
    if (brandVoice === 'bible-scholar' && scripture) {
      formatted += ` 📖 ${scripture}`;
    }
    
    if (cta) {
      formatted += ` ${cta}`;
    }
    
    if (hashtags.length > 0) {
      const hashtagString = hashtags.slice(0, 3).join(' '); // Limit hashtags for Twitter
      formatted += ` ${hashtagString}`;
    }
    
    // Twitter character limit: 280
    return formatted.substring(0, 280);
  }

  formatLinkedInContent(content, scripture, cta, hashtags, brandVoice) {
    let formatted = content;
    
    if (brandVoice === 'bible-scholar' && scripture) {
      formatted += `\n\n📖 Scripture: ${scripture}`;
    }
    
    if (cta) {
      formatted += `\n\n${cta}`;
    }
    
    if (hashtags.length > 0) {
      formatted += `\n\n${hashtags.join(' ')}`;
    }
    
    // LinkedIn character limit: 3,000
    return formatted.substring(0, 3000);
  }

  formatFacebookContent(content, scripture, cta, hashtags, brandVoice) {
    let formatted = content;
    
    if (brandVoice === 'bible-scholar' && scripture) {
      formatted += `\n\n📖 ${scripture}`;
    }
    
    if (cta) {
      formatted += `\n\n${cta}`;
    }
    
    if (hashtags.length > 0) {
      formatted += `\n\n${hashtags.join(' ')}`;
    }
    
    // Facebook character limit: 63,206 (practically unlimited)
    return formatted;
  }

  // Posting Methods
  async postToInstagram(content, mediaUrl = null, isTestPost = false) {
    try {
      const formattedContent = this.formatContentForPlatform(content, 'instagram', content.brandVoice);
      
      let postData = {
        caption: formattedContent,
        access_token: this.config.instagram.accessToken
      };

      if (mediaUrl) {
        postData.image_url = mediaUrl;
      }

      if (isTestPost) {
        postData.published = false; // Create as draft for testing
      }

      const response = await axios.post(
        `${this.config.instagram.baseURL}/${this.config.instagram.businessAccountId}/media`,
        postData
      );

      if (response.data.id && !isTestPost) {
        // Publish the media
        await axios.post(
          `${this.config.instagram.baseURL}/${this.config.instagram.businessAccountId}/media_publish`,
          {
            creation_id: response.data.id,
            access_token: this.config.instagram.accessToken
          }
        );
      }

      return {
        success: true,
        platform: 'instagram',
        postId: response.data.id,
        url: `https://instagram.com/p/${response.data.id}`
      };
    } catch (error) {
      return {
        success: false,
        platform: 'instagram',
        error: error.response?.data || error.message,
        fallbackRequired: true
      };
    }
  }

  async postToTwitter(content, mediaUrl = null, isTestPost = false) {
    try {
      const formattedContent = this.formatContentForPlatform(content, 'twitter', content.brandVoice);
      
      let postData = {
        text: formattedContent
      };

      if (mediaUrl && !isTestPost) {
        // Upload media first
        const mediaResponse = await this.uploadTwitterMedia(mediaUrl);
        if (mediaResponse.success) {
          postData.media = { media_ids: [mediaResponse.media_id] };
        }
      }

      const response = await axios.post(
        `${this.config.twitter.baseURL}/tweets`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        platform: 'twitter',
        postId: response.data.data.id,
        url: `https://twitter.com/i/web/status/${response.data.data.id}`
      };
    } catch (error) {
      return {
        success: false,
        platform: 'twitter',
        error: error.response?.data || error.message,
        fallbackRequired: true
      };
    }
  }

  async postToLinkedIn(content, mediaUrl = null, isTestPost = false, isCompanyPage = false) {
    try {
      const platform = isCompanyPage ? 'linkedin_company' : 'linkedin_personal';
      const formattedContent = this.formatContentForPlatform(content, platform, content.brandVoice);
      
      const author = isCompanyPage 
        ? `urn:li:organization:${this.config.linkedin.companyPage}`
        : `urn:li:person:${this.config.linkedin.personalProfile}`;

      let postData = {
        author: author,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: formattedContent
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      if (mediaUrl && !isTestPost) {
        // Handle media upload for LinkedIn
        postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
        // Additional media handling would go here
      }

      const response = await axios.post(
        `${this.config.linkedin.baseURL}/ugcPosts`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.linkedin.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return {
        success: true,
        platform: platform,
        postId: response.data.id,
        url: `https://linkedin.com/feed/update/${response.data.id}`
      };
    } catch (error) {
      return {
        success: false,
        platform: isCompanyPage ? 'linkedin_company' : 'linkedin_personal',
        error: error.response?.data || error.message,
        fallbackRequired: true
      };
    }
  }

  async postToFacebook(content, mediaUrl = null, isTestPost = false) {
    try {
      const formattedContent = this.formatContentForPlatform(content, 'facebook', content.brandVoice);
      
      let postData = {
        message: formattedContent,
        access_token: this.config.facebook.accessToken
      };

      if (mediaUrl) {
        postData.link = mediaUrl;
      }

      if (isTestPost) {
        postData.published = false;
      }

      const response = await axios.post(
        `${this.config.facebook.baseURL}/${this.config.facebook.pageId}/feed`,
        postData
      );

      return {
        success: true,
        platform: 'facebook',
        postId: response.data.id,
        url: `https://facebook.com/${response.data.id}`
      };
    } catch (error) {
      return {
        success: false,
        platform: 'facebook',
        error: error.response?.data || error.message,
        fallbackRequired: true
      };
    }
  }

  // Multi-Platform Posting with Error Handling
  async postToAllPlatforms(content, mediaUrl = null, selectedPlatforms = null) {
    const platforms = selectedPlatforms || ['instagram', 'twitter', 'linkedin_personal', 'linkedin_company', 'facebook'];
    const results = [];
    const errors = [];
    const fallbacksNeeded = [];

    console.log('🚀 Starting multi-platform posting...');

    for (const platform of platforms) {
      if (!this.platforms[platform]?.connected) {
        errors.push({
          platform,
          error: 'Platform not connected',
          fallbackRequired: true
        });
        continue;
      }

      console.log(`📤 Posting to ${platform}...`);

      let result;
      try {
        switch (platform) {
          case 'instagram':
            result = await this.postToInstagram(content, mediaUrl);
            break;
          case 'twitter':
            result = await this.postToTwitter(content, mediaUrl);
            break;
          case 'linkedin_personal':
            result = await this.postToLinkedIn(content, mediaUrl, false, false);
            break;
          case 'linkedin_company':
            result = await this.postToLinkedIn(content, mediaUrl, false, true);
            break;
          case 'facebook':
            result = await this.postToFacebook(content, mediaUrl);
            break;
          default:
            result = {
              success: false,
              platform,
              error: 'Unsupported platform',
              fallbackRequired: true
            };
        }

        if (result.success) {
          results.push(result);
          console.log(`✅ ${platform} posted successfully`);
        } else {
          errors.push(result);
          if (result.fallbackRequired) {
            fallbacksNeeded.push(result);
          }
          console.log(`❌ ${platform} failed: ${result.error}`);
        }
      } catch (error) {
        const errorResult = {
          success: false,
          platform,
          error: error.message,
          fallbackRequired: true
        };
        errors.push(errorResult);
        fallbacksNeeded.push(errorResult);
        console.log(`❌ ${platform} failed with exception: ${error.message}`);
      }

      // Add delay between posts to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Handle fallbacks
    if (fallbacksNeeded.length > 0) {
      await this.handleFallbacks(content, mediaUrl, fallbacksNeeded);
    }

    // Generate and send summary report
    await this.sendSummaryReport(results, errors);

    return {
      successes: results,
      errors,
      fallbacksTriggered: fallbacksNeeded.length > 0
    };
  }

  // Error Handling and Fallback Methods
  async handleFallbacks(content, mediaUrl, failedPlatforms) {
    console.log('🔄 Handling fallbacks for failed platforms...');

    for (const failed of failedPlatforms) {
      await this.tryFallbackMethod(content, mediaUrl, failed);
    }
  }

  async tryFallbackMethod(content, mediaUrl, failedResult) {
    const { platform, error } = failedResult;

    // Check if it's a temporary error (rate limit, server error)
    if (this.isTemporaryError(error)) {
      console.log(`⏳ Temporary error detected for ${platform}, retrying in 30 seconds...`);
      
      setTimeout(async () => {
        let retryResult;
        switch (platform) {
          case 'instagram':
            retryResult = await this.postToInstagram(content, mediaUrl);
            break;
          case 'twitter':
            retryResult = await this.postToTwitter(content, mediaUrl);
            break;
          case 'linkedin_personal':
            retryResult = await this.postToLinkedIn(content, mediaUrl, false, false);
            break;
          case 'linkedin_company':
            retryResult = await this.postToLinkedIn(content, mediaUrl, false, true);
            break;
          case 'facebook':
            retryResult = await this.postToFacebook(content, mediaUrl);
            break;
        }

        if (!retryResult.success) {
          await this.sendFallbackEmail(content, mediaUrl, platform, error);
        }
      }, 30000);
    } else {
      // Permanent error - send immediate notification
      await this.sendFallbackEmail(content, mediaUrl, platform, error);
    }
  }

  isTemporaryError(error) {
    const temporaryErrors = [
      'rate limit',
      'server error',
      'timeout',
      'temporarily unavailable',
      'service unavailable'
    ];
    
    const errorString = (typeof error === 'string' ? error : JSON.stringify(error)).toLowerCase();
    return temporaryErrors.some(tempError => errorString.includes(tempError));
  }

  async sendFallbackEmail(content, mediaUrl, platform, error) {
    const emailContent = `
      🚨 SOCIAL MEDIA POSTING FAILURE - MANUAL ACTION REQUIRED

      Platform: ${platform.toUpperCase()}
      Error: ${JSON.stringify(error, null, 2)}
      
      Content to post:
      ${JSON.stringify(content, null, 2)}
      
      Media URL: ${mediaUrl || 'None'}
      
      Please manually post this content to ${platform}.
      
      Time: ${new Date().toISOString()}
    `;

    // In a real implementation, this would send an actual email
    console.log('📧 Fallback email would be sent:', emailContent);
    
    // You could integrate with services like SendGrid, Nodemailer, etc.
    // await this.emailService.send({
    //   to: 'admin@yoursite.com',
    //   subject: `Social Media Posting Failed - ${platform}`,
    //   text: emailContent
    // });
  }

  async sendSummaryReport(successes, errors) {
    const totalPlatforms = successes.length + errors.length;
    const successRate = (successes.length / totalPlatforms) * 100;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalPlatforms,
        successful: successes.length,
        failed: errors.length,
        successRate: `${successRate.toFixed(1)}%`
      },
      details: {
        successes: successes.map(s => ({
          platform: s.platform,
          status: '✅',
          url: s.url
        })),
        errors: errors.map(e => ({
          platform: e.platform,
          status: e.fallbackRequired ? '❗ fallback triggered' : '❌ failed',
          error: e.error
        }))
      }
    };

    console.log('📊 Summary Report:', report);
    
    // Send report via email or dashboard notification
    // await this.sendReportEmail(report);
  }

  // Testing Methods
  async runTestSuite() {
    console.log('🧪 Running platform test suite...');
    
    const testContent = {
      text: 'Test post from automated system - please ignore',
      scripture: 'Test Scripture (Test 1:1)',
      cta: 'This is a test post',
      hashtags: ['#test', '#automated'],
      brandVoice: 'bible-scholar'
    };

    const testResults = [];

    for (const platform of Object.keys(this.platforms)) {
      if (this.platforms[platform].connected) {
        console.log(`Testing ${platform}...`);
        
        try {
          let result;
          switch (platform) {
            case 'instagram':
              result = await this.postToInstagram(testContent, null, true);
              break;
            case 'twitter':
              result = await this.postToTwitter(testContent, null, true);
              break;
            case 'linkedin_personal':
              result = await this.postToLinkedIn(testContent, null, true, false);
              break;
            case 'linkedin_company':
              result = await this.postToLinkedIn(testContent, null, true, true);
              break;
            case 'facebook':
              result = await this.postToFacebook(testContent, null, true);
              break;
          }

          testResults.push({
            platform,
            success: result.success,
            error: result.error || null
          });

          this.platforms[platform].lastTest = new Date().toISOString();
        } catch (error) {
          testResults.push({
            platform,
            success: false,
            error: error.message
          });
        }
      }
    }

    console.log('🧪 Test suite completed:', testResults);
    return testResults;
  }

  // Utility Methods
  async uploadTwitterMedia(mediaUrl) {
    try {
      // This is a simplified version - real implementation would handle file upload
      const response = await axios.post(
        'https://upload.twitter.com/1.1/media/upload.json',
        {
          media_data: mediaUrl // This would be base64 encoded media
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`
          }
        }
      );

      return {
        success: true,
        media_id: response.data.media_id_string
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  getConnectionStatus() {
    return Object.entries(this.platforms).map(([platform, data]) => ({
      platform,
      connected: data.connected,
      lastTest: data.lastTest
    }));
  }
}

export default SocialMediaAPI;