// CRM to Social Media Integration Service
import SocialMediaAPI from './socialMediaAPI';
import { format, addDays, isAfter, isBefore } from 'date-fns';

class CRMSocialIntegration {
  constructor() {
    this.socialAPI = new SocialMediaAPI();
    this.automationRules = this.loadAutomationRules();
    this.isActive = true;
    this.lastSync = null;
  }

  // Load automation rules from localStorage
  loadAutomationRules() {
    const saved = localStorage.getItem('crm_automation_rules');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default automation rules
    return {
      newContactWelcome: {
        enabled: true,
        delay: 24, // hours
        platforms: ['linkedin'],
        template: 'welcome_new_contact'
      },
      followUpReminders: {
        enabled: true,
        intervals: [7, 30, 90], // days
        platforms: ['linkedin', 'twitter'],
        template: 'follow_up_reminder'
      },
      birthdayGreetings: {
        enabled: true,
        platforms: ['facebook', 'linkedin'],
        template: 'birthday_greeting'
      },
      anniversaryPosts: {
        enabled: true,
        platforms: ['linkedin', 'facebook'],
        template: 'work_anniversary'
      },
      networkingUpdates: {
        enabled: true,
        frequency: 'weekly',
        platforms: ['linkedin'],
        template: 'networking_update'
      },
      clientSuccessStories: {
        enabled: true,
        platforms: ['linkedin', 'twitter', 'facebook'],
        template: 'client_success'
      }
    };
  }

  // Save automation rules
  saveAutomationRules() {
    localStorage.setItem('crm_automation_rules', JSON.stringify(this.automationRules));
  }

  // Main integration workflow
  async processAutomationWorkflows(contacts, interactions) {
    console.log('🔄 Processing CRM automation workflows...');
    
    const results = {
      timestamp: new Date().toISOString(),
      processed: 0,
      successful: 0,
      failed: 0,
      workflows: []
    };

    try {
      // Process each automation rule
      for (const [ruleId, rule] of Object.entries(this.automationRules)) {
        if (!rule.enabled) continue;

        console.log(`📋 Processing rule: ${ruleId}`);
        
        const workflowResult = await this.processWorkflowRule(ruleId, rule, contacts, interactions);
        results.workflows.push(workflowResult);
        results.processed += workflowResult.processed;
        results.successful += workflowResult.successful;
        results.failed += workflowResult.failed;
      }

      this.lastSync = new Date().toISOString();
      console.log('✅ CRM automation workflows completed:', results);
      
    } catch (error) {
      console.error('❌ CRM automation workflow failed:', error);
    }

    return results;
  }

  // Process individual workflow rule
  async processWorkflowRule(ruleId, rule, contacts, interactions) {
    const result = {
      rule: ruleId,
      processed: 0,
      successful: 0,
      failed: 0,
      posts: []
    };

    try {
      switch (ruleId) {
        case 'newContactWelcome':
          await this.processNewContactWelcome(rule, contacts, result);
          break;
        case 'followUpReminders':
          await this.processFollowUpReminders(rule, contacts, interactions, result);
          break;
        case 'birthdayGreetings':
          await this.processBirthdayGreetings(rule, contacts, result);
          break;
        case 'anniversaryPosts':
          await this.processAnniversaryPosts(rule, contacts, result);
          break;
        case 'networkingUpdates':
          await this.processNetworkingUpdates(rule, contacts, interactions, result);
          break;
        case 'clientSuccessStories':
          await this.processClientSuccessStories(rule, contacts, interactions, result);
          break;
      }
    } catch (error) {
      console.error(`❌ Error processing rule ${ruleId}:`, error);
      result.failed++;
    }

    return result;
  }

  // New Contact Welcome Automation
  async processNewContactWelcome(rule, contacts, result) {
    const cutoffTime = new Date(Date.now() - (rule.delay * 60 * 60 * 1000));
    
    const newContacts = contacts.filter(contact => {
      const addedDate = new Date(contact.createdAt || contact.id);
      return isAfter(addedDate, cutoffTime) && !contact.welcomePosted;
    });

    for (const contact of newContacts) {
      result.processed++;
      
      try {
        const content = this.generateWelcomeContent(contact);
        const postResult = await this.socialAPI.postToAllPlatforms(
          content,
          null,
          rule.platforms
        );

        if (postResult.successes.length > 0) {
          // Mark contact as welcomed
          contact.welcomePosted = true;
          this.updateContact(contact);
          
          result.successful++;
          result.posts.push({
            contact: contact.name,
            platforms: postResult.successes.map(s => s.platform),
            content: content.text.substring(0, 100) + '...'
          });
        } else {
          result.failed++;
        }
      } catch (error) {
        console.error('Welcome post failed:', error);
        result.failed++;
      }
    }
  }

  // Follow-up Reminders Automation
  async processFollowUpReminders(rule, contacts, interactions, result) {
    const today = new Date();
    
    for (const contact of contacts) {
      if (contact.category !== 'client' && contact.category !== 'professional') continue;
      
      const lastInteraction = interactions
        .filter(i => i.contactId === contact.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      if (!lastInteraction) continue;

      const daysSinceLastInteraction = Math.floor(
        (today - new Date(lastInteraction.date)) / (1000 * 60 * 60 * 24)
      );

      // Check if we should send a follow-up
      if (rule.intervals.includes(daysSinceLastInteraction)) {
        result.processed++;
        
        try {
          const content = this.generateFollowUpContent(contact, lastInteraction, daysSinceLastInteraction);
          const postResult = await this.socialAPI.postToAllPlatforms(
            content,
            null,
            rule.platforms
          );

          if (postResult.successes.length > 0) {
            result.successful++;
            result.posts.push({
              contact: contact.name,
              platforms: postResult.successes.map(s => s.platform),
              content: content.text.substring(0, 100) + '...',
              followUpDays: daysSinceLastInteraction
            });
          } else {
            result.failed++;
          }
        } catch (error) {
          console.error('Follow-up post failed:', error);
          result.failed++;
        }
      }
    }
  }

  // Birthday Greetings Automation
  async processBirthdayGreetings(rule, contacts, result) {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const birthdayContacts = contacts.filter(contact => {
      if (!contact.birthday) return false;
      
      const birthday = new Date(contact.birthday);
      return birthday.getMonth() === todayMonth && birthday.getDate() === todayDate;
    });

    for (const contact of birthdayContacts) {
      result.processed++;
      
      try {
        const content = this.generateBirthdayContent(contact);
        const postResult = await this.socialAPI.postToAllPlatforms(
          content,
          null,
          rule.platforms
        );

        if (postResult.successes.length > 0) {
          result.successful++;
          result.posts.push({
            contact: contact.name,
            platforms: postResult.successes.map(s => s.platform),
            content: content.text.substring(0, 100) + '...'
          });
        } else {
          result.failed++;
        }
      } catch (error) {
        console.error('Birthday post failed:', error);
        result.failed++;
      }
    }
  }

  // Anniversary Posts Automation
  async processAnniversaryPosts(rule, contacts, result) {
    const today = new Date();
    
    const anniversaryContacts = contacts.filter(contact => {
      if (!contact.workAnniversary) return false;
      
      const anniversary = new Date(contact.workAnniversary);
      return anniversary.getMonth() === today.getMonth() && 
             anniversary.getDate() === today.getDate();
    });

    for (const contact of anniversaryContacts) {
      result.processed++;
      
      try {
        const yearsWorking = today.getFullYear() - new Date(contact.workAnniversary).getFullYear();
        const content = this.generateAnniversaryContent(contact, yearsWorking);
        
        const postResult = await this.socialAPI.postToAllPlatforms(
          content,
          null,
          rule.platforms
        );

        if (postResult.successes.length > 0) {
          result.successful++;
          result.posts.push({
            contact: contact.name,
            platforms: postResult.successes.map(s => s.platform),
            content: content.text.substring(0, 100) + '...',
            years: yearsWorking
          });
        } else {
          result.failed++;
        }
      } catch (error) {
        console.error('Anniversary post failed:', error);
        result.failed++;
      }
    }
  }

  // Networking Updates Automation
  async processNetworkingUpdates(rule, contacts, interactions, result) {
    const lastWeek = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    
    // Check if we should post weekly networking update
    const lastNetworkingPost = localStorage.getItem('last_networking_post');
    if (lastNetworkingPost && isAfter(new Date(lastNetworkingPost), lastWeek)) {
      return; // Already posted this week
    }

    result.processed++;

    try {
      const recentInteractions = interactions.filter(i => 
        isAfter(new Date(i.date), lastWeek)
      );

      const content = this.generateNetworkingUpdateContent(contacts, recentInteractions);
      const postResult = await this.socialAPI.postToAllPlatforms(
        content,
        null,
        rule.platforms
      );

      if (postResult.successes.length > 0) {
        localStorage.setItem('last_networking_post', new Date().toISOString());
        result.successful++;
        result.posts.push({
          type: 'networking_update',
          platforms: postResult.successes.map(s => s.platform),
          content: content.text.substring(0, 100) + '...',
          interactions: recentInteractions.length
        });
      } else {
        result.failed++;
      }
    } catch (error) {
      console.error('Networking update failed:', error);
      result.failed++;
    }
  }

  // Client Success Stories Automation
  async processClientSuccessStories(rule, contacts, interactions, result) {
    const lastMonth = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    
    const clientSuccesses = interactions.filter(interaction => {
      const contact = contacts.find(c => c.id === interaction.contactId);
      return contact?.category === 'client' && 
             isAfter(new Date(interaction.date), lastMonth) &&
             (interaction.notes.toLowerCase().includes('success') ||
              interaction.notes.toLowerCase().includes('completed') ||
              interaction.notes.toLowerCase().includes('launched') ||
              interaction.notes.toLowerCase().includes('achievement'));
    });

    for (const success of clientSuccesses.slice(0, 2)) { // Limit to 2 per run
      result.processed++;
      
      try {
        const contact = contacts.find(c => c.id === success.contactId);
        const content = this.generateClientSuccessContent(contact, success);
        
        const postResult = await this.socialAPI.postToAllPlatforms(
          content,
          null,
          rule.platforms
        );

        if (postResult.successes.length > 0) {
          result.successful++;
          result.posts.push({
            client: contact.name,
            platforms: postResult.successes.map(s => s.platform),
            content: content.text.substring(0, 100) + '...'
          });
        } else {
          result.failed++;
        }
      } catch (error) {
        console.error('Client success post failed:', error);
        result.failed++;
      }
    }
  }

  // Content Generation Methods
  generateWelcomeContent(contact) {
    const templates = [
      `Excited to connect with ${contact.name}${contact.company ? ` from ${contact.company}` : ''}! Looking forward to building a meaningful professional relationship. 🤝`,
      `Welcome to my network, ${contact.name}! ${contact.company ? `Great to connect with someone from ${contact.company}.` : 'Great to have you here.'} Let's stay in touch! 🌟`,
      `Just connected with ${contact.name}${contact.company ? ` at ${contact.company}` : ''} - always excited to expand my professional network with quality connections! 💼`
    ];

    return {
      text: templates[Math.floor(Math.random() * templates.length)],
      hashtags: ['#networking', '#professional', '#connections'],
      brandVoice: 'professional'
    };
  }

  generateFollowUpContent(contact, lastInteraction, days) {
    const templates = [
      `Checking in with ${contact.name} - it's been ${days} days since our last ${lastInteraction.type}. Hope everything is going well! 🔄`,
      `Following up with ${contact.name} from our recent ${lastInteraction.type}. Always value staying connected with my network! 📞`,
      `Time for a follow-up! Reaching out to ${contact.name} to continue our professional relationship. 🤝`
    ];

    return {
      text: templates[Math.floor(Math.random() * templates.length)],
      hashtags: ['#followup', '#networking', '#relationships'],
      brandVoice: 'professional'
    };
  }

  generateBirthdayContent(contact) {
    const templates = [
      `🎉 Wishing ${contact.name} a very Happy Birthday! Hope you have a wonderful celebration! 🎂`,
      `Happy Birthday to ${contact.name}! 🎈 May this new year bring you success and happiness! ✨`,
      `Celebrating ${contact.name} today! 🎊 Wishing you all the best on your special day! 🎁`
    ];

    return {
      text: templates[Math.floor(Math.random() * templates.length)],
      hashtags: ['#birthday', '#celebration', '#networking'],
      brandVoice: 'casual'
    };
  }

  generateAnniversaryContent(contact, years) {
    return {
      text: `🎊 Congratulations to ${contact.name} on ${years} ${years === 1 ? 'year' : 'years'} ${contact.company ? `at ${contact.company}` : 'in their role'}! Here's to continued success! 🚀`,
      hashtags: ['#workanniversary', '#professional', '#success'],
      brandVoice: 'professional'
    };
  }

  generateNetworkingUpdateContent(contacts, recentInteractions) {
    return {
      text: `This week I had ${recentInteractions.length} meaningful professional interactions! Always grateful for my network of ${contacts.length} amazing connections. Building relationships is the key to success! 🌐✨`,
      hashtags: ['#networking', '#professional', '#relationships', '#growth'],
      brandVoice: 'professional'
    };
  }

  generateClientSuccessContent(contact, success) {
    return {
      text: `🎉 Celebrating another client success! Thrilled to see ${contact.name}${contact.company ? ` at ${contact.company}` : ''} achieving great results. Love working with clients who are committed to excellence! 💼✨`,
      hashtags: ['#clientsuccess', '#achievement', '#professional', '#results'],
      brandVoice: 'professional'
    };
  }

  // Utility Methods
  updateContact(contact) {
    const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
    const index = contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      contacts[index] = contact;
      localStorage.setItem('crm_contacts', JSON.stringify(contacts));
    }
  }

  // Manual trigger for immediate processing
  async triggerManualSync(contacts, interactions) {
    console.log('🚀 Manual CRM sync triggered...');
    return await this.processAutomationWorkflows(contacts, interactions);
  }

  // Get automation status
  getAutomationStatus() {
    return {
      isActive: this.isActive,
      lastSync: this.lastSync,
      rules: this.automationRules,
      rulesEnabled: Object.values(this.automationRules).filter(r => r.enabled).length
    };
  }

  // Update automation rules
  updateAutomationRules(newRules) {
    this.automationRules = { ...this.automationRules, ...newRules };
    this.saveAutomationRules();
  }

  // Toggle automation
  toggleAutomation(enabled) {
    this.isActive = enabled;
    localStorage.setItem('crm_automation_active', enabled.toString());
  }

  // Get integration metrics
  getIntegrationMetrics(contacts, interactions) {
    const lastWeek = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    const lastMonth = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));

    return {
      totalContacts: contacts.length,
      recentInteractions: interactions.filter(i => isAfter(new Date(i.date), lastWeek)).length,
      clientContacts: contacts.filter(c => c.category === 'client').length,
      upcomingBirthdays: contacts.filter(c => {
        if (!c.birthday) return false;
        const birthday = new Date(c.birthday);
        const nextWeek = addDays(new Date(), 7);
        return isBefore(new Date(), addDays(birthday, 7)) && 
               isAfter(addDays(birthday, 7), new Date());
      }).length,
      automationRulesActive: Object.values(this.automationRules).filter(r => r.enabled).length,
      lastSyncTime: this.lastSync
    };
  }
}

export default CRMSocialIntegration;