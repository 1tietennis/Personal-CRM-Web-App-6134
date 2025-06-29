// Greta.ai Workflow Configuration for Multi-Platform Social Media Automation
export const gretaWorkflowConfig = {
  name: "Multi-Platform Social Media Automation",
  description: "Automate posting across Instagram, Twitter, LinkedIn, and Facebook with error handling and fallbacks",
  
  triggers: [
    {
      type: "manual",
      name: "Manual Content Post"
    },
    {
      type: "schedule",
      name: "Scheduled Content Post",
      schedule: "0 9,15,21 * * *" // 9 AM, 3 PM, 9 PM daily
    },
    {
      type: "webhook",
      name: "API Content Trigger"
    }
  ],

  variables: [
    {
      name: "content_text",
      type: "string",
      required: true,
      description: "Main post content"
    },
    {
      name: "scripture_reference",
      type: "string",
      required: false,
      description: "Bible verse reference"
    },
    {
      name: "call_to_action",
      type: "string",
      required: false,
      description: "Call to action text"
    },
    {
      name: "hashtags",
      type: "array",
      required: false,
      description: "Array of hashtags"
    },
    {
      name: "brand_voice",
      type: "string",
      default: "bible-scholar",
      options: ["professional", "casual", "inspirational", "bible-scholar"]
    },
    {
      name: "media_url",
      type: "string",
      required: false,
      description: "URL to image or video content"
    },
    {
      name: "target_platforms",
      type: "array",
      default: ["instagram", "twitter", "linkedin_personal", "linkedin_company", "facebook"],
      description: "Platforms to post to"
    }
  ],

  workflow: {
    steps: [
      {
        id: "validate_input",
        name: "Validate Input Content",
        type: "validation",
        conditions: [
          {
            field: "content_text",
            operator: "is_not_empty"
          },
          {
            field: "content_text",
            operator: "length_between",
            min: 10,
            max: 2000
          }
        ],
        on_fail: {
          action: "stop_workflow",
          message: "Content validation failed"
        }
      },

      {
        id: "format_content",
        name: "Format Content for Each Platform",
        type: "transformation",
        script: `
          function formatContent(platform, content, scripture, cta, hashtags, brandVoice) {
            let formatted = content;
            
            // Add scripture for Bible Scholar voice
            if (brandVoice === 'bible-scholar' && scripture) {
              formatted += platform === 'twitter' ? 
                ' 📖 ' + scripture : 
                '\\n\\n📖 ' + scripture;
            }
            
            // Add call to action
            if (cta) {
              formatted += platform === 'twitter' ? 
                ' ' + cta : 
                '\\n\\n' + cta;
            }
            
            // Add hashtags
            if (hashtags && hashtags.length > 0) {
              const hashtagString = platform === 'twitter' ? 
                hashtags.slice(0, 3).join(' ') : 
                hashtags.join(' ');
              formatted += platform === 'twitter' ? 
                ' ' + hashtagString : 
                '\\n\\n' + hashtagString;
            }
            
            // Platform-specific character limits
            const limits = {
              twitter: 280,
              instagram: 2200,
              linkedin_personal: 3000,
              linkedin_company: 3000,
              facebook: 63206
            };
            
            return formatted.substring(0, limits[platform] || 2000);
          }
          
          // Format for each platform
          const platforms = variables.target_platforms;
          const formatted = {};
          
          platforms.forEach(platform => {
            formatted[platform] = formatContent(
              platform,
              variables.content_text,
              variables.scripture_reference,
              variables.call_to_action,
              variables.hashtags,
              variables.brand_voice
            );
          });
          
          return { formatted_content: formatted };
        `
      },

      {
        id: "test_platforms",
        name: "Test Platform Connections",
        type: "parallel",
        branches: [
          {
            id: "test_instagram",
            name: "Test Instagram",
            condition: "target_platforms contains 'instagram'",
            steps: [
              {
                type: "http_request",
                method: "GET",
                url: "https://graph.facebook.com/v18.0/{{instagram_business_id}}",
                headers: {
                  "Authorization": "Bearer {{instagram_access_token}}"
                },
                on_error: {
                  action: "set_variable",
                  variable: "instagram_test_failed",
                  value: true
                }
              }
            ]
          },
          {
            id: "test_twitter",
            name: "Test Twitter",
            condition: "target_platforms contains 'twitter'",
            steps: [
              {
                type: "http_request",
                method: "GET",
                url: "https://api.twitter.com/2/users/me",
                headers: {
                  "Authorization": "Bearer {{twitter_bearer_token}}"
                },
                on_error: {
                  action: "set_variable",
                  variable: "twitter_test_failed",
                  value: true
                }
              }
            ]
          },
          {
            id: "test_linkedin",
            name: "Test LinkedIn",
            condition: "target_platforms contains 'linkedin_personal' or target_platforms contains 'linkedin_company'",
            steps: [
              {
                type: "http_request",
                method: "GET",
                url: "https://api.linkedin.com/v2/people/~",
                headers: {
                  "Authorization": "Bearer {{linkedin_access_token}}"
                },
                on_error: {
                  action: "set_variable",
                  variable: "linkedin_test_failed",
                  value: true
                }
              }
            ]
          },
          {
            id: "test_facebook",
            name: "Test Facebook",
            condition: "target_platforms contains 'facebook'",
            steps: [
              {
                type: "http_request",
                method: "GET",
                url: "https://graph.facebook.com/v18.0/{{facebook_page_id}}",
                headers: {
                  "Authorization": "Bearer {{facebook_access_token}}"
                },
                on_error: {
                  action: "set_variable",
                  variable: "facebook_test_failed",
                  value: true
                }
              }
            ]
          }
        ]
      },

      {
        id: "post_to_platforms",
        name: "Post to All Platforms",
        type: "parallel",
        branches: [
          {
            id: "post_instagram",
            name: "Post to Instagram",
            condition: "target_platforms contains 'instagram' and not instagram_test_failed",
            steps: [
              {
                type: "http_request",
                method: "POST",
                url: "https://graph.facebook.com/v18.0/{{instagram_business_id}}/media",
                headers: {
                  "Content-Type": "application/json"
                },
                body: {
                  "caption": "{{formatted_content.instagram}}",
                  "image_url": "{{media_url}}",
                  "access_token": "{{instagram_access_token}}"
                },
                on_success: {
                  steps: [
                    {
                      type: "http_request",
                      method: "POST",
                      url: "https://graph.facebook.com/v18.0/{{instagram_business_id}}/media_publish",
                      body: {
                        "creation_id": "{{response.id}}",
                        "access_token": "{{instagram_access_token}}"
                      }
                    }
                  ]
                },
                on_error: {
                  action: "trigger_fallback",
                  platform: "instagram"
                }
              }
            ]
          },

          {
            id: "post_twitter",
            name: "Post to Twitter",
            condition: "target_platforms contains 'twitter' and not twitter_test_failed",
            steps: [
              {
                type: "http_request",
                method: "POST",
                url: "https://api.twitter.com/2/tweets",
                headers: {
                  "Authorization": "Bearer {{twitter_bearer_token}}",
                  "Content-Type": "application/json"
                },
                body: {
                  "text": "{{formatted_content.twitter}}"
                },
                on_error: {
                  action: "trigger_fallback",
                  platform: "twitter"
                }
              }
            ]
          },

          {
            id: "post_linkedin_personal",
            name: "Post to LinkedIn Personal",
            condition: "target_platforms contains 'linkedin_personal' and not linkedin_test_failed",
            steps: [
              {
                type: "http_request",
                method: "POST",
                url: "https://api.linkedin.com/v2/ugcPosts",
                headers: {
                  "Authorization": "Bearer {{linkedin_access_token}}",
                  "Content-Type": "application/json",
                  "X-Restli-Protocol-Version": "2.0.0"
                },
                body: {
                  "author": "urn:li:person:{{linkedin_personal_profile}}",
                  "lifecycleState": "PUBLISHED",
                  "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                      "shareCommentary": {
                        "text": "{{formatted_content.linkedin_personal}}"
                      },
                      "shareMediaCategory": "NONE"
                    }
                  },
                  "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                  }
                },
                on_error: {
                  action: "trigger_fallback",
                  platform: "linkedin_personal"
                }
              }
            ]
          },

          {
            id: "post_linkedin_company",
            name: "Post to LinkedIn Company",
            condition: "target_platforms contains 'linkedin_company' and not linkedin_test_failed",
            steps: [
              {
                type: "http_request",
                method: "POST",
                url: "https://api.linkedin.com/v2/ugcPosts",
                headers: {
                  "Authorization": "Bearer {{linkedin_access_token}}",
                  "Content-Type": "application/json",
                  "X-Restli-Protocol-Version": "2.0.0"
                },
                body: {
                  "author": "urn:li:organization:{{linkedin_company_page}}",
                  "lifecycleState": "PUBLISHED",
                  "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                      "shareCommentary": {
                        "text": "{{formatted_content.linkedin_company}}"
                      },
                      "shareMediaCategory": "NONE"
                    }
                  },
                  "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                  }
                },
                on_error: {
                  action: "trigger_fallback",
                  platform: "linkedin_company"
                }
              }
            ]
          },

          {
            id: "post_facebook",
            name: "Post to Facebook",
            condition: "target_platforms contains 'facebook' and not facebook_test_failed",
            steps: [
              {
                type: "http_request",
                method: "POST",
                url: "https://graph.facebook.com/v18.0/{{facebook_page_id}}/feed",
                headers: {
                  "Content-Type": "application/json"
                },
                body: {
                  "message": "{{formatted_content.facebook}}",
                  "link": "{{media_url}}",
                  "access_token": "{{facebook_access_token}}"
                },
                on_error: {
                  action: "trigger_fallback",
                  platform: "facebook"
                }
              }
            ]
          }
        ]
      },

      {
        id: "verify_posts",
        name: "Verify Successful Posts",
        type: "parallel",
        branches: [
          {
            id: "verify_instagram",
            condition: "instagram_post_id exists",
            steps: [
              {
                type: "http_request",
                method: "GET",
                url: "https://graph.facebook.com/v18.0/{{instagram_post_id}}",
                headers: {
                  "Authorization": "Bearer {{instagram_access_token}}"
                },
                on_success: {
                  action: "set_variable",
                  variable: "instagram_verified",
                  value: true
                }
              }
            ]
          }
          // Similar verification for other platforms...
        ]
      },

      {
        id: "handle_fallbacks",
        name: "Handle Failed Platform Fallbacks",
        type: "conditional",
        conditions: [
          {
            field: "failed_platforms",
            operator: "is_not_empty"
          }
        ],
        steps: [
          {
            id: "check_error_types",
            name: "Categorize Errors",
            type: "script",
            script: `
              const failedPlatforms = variables.failed_platforms || [];
              const temporaryErrors = [];
              const permanentErrors = [];
              
              failedPlatforms.forEach(platform => {
                const error = platform.error.toLowerCase();
                if (error.includes('rate limit') || 
                    error.includes('server error') || 
                    error.includes('timeout')) {
                  temporaryErrors.push(platform);
                } else {
                  permanentErrors.push(platform);
                }
              });
              
              return { 
                temporary_errors: temporaryErrors,
                permanent_errors: permanentErrors 
              };
            `
          },

          {
            id: "retry_temporary_failures",
            name: "Retry Temporary Failures",
            condition: "temporary_errors is_not_empty",
            steps: [
              {
                type: "delay",
                duration: "30s"
              },
              {
                type: "loop",
                items: "{{temporary_errors}}",
                steps: [
                  {
                    type: "conditional_retry",
                    platform: "{{item.platform}}",
                    max_attempts: 3,
                    delay: "30s"
                  }
                ]
              }
            ]
          },

          {
            id: "send_fallback_emails",
            name: "Send Fallback Notifications",
            condition: "permanent_errors is_not_empty or retry_failures is_not_empty",
            steps: [
              {
                type: "email",
                to: "{{admin_email}}",
                subject: "🚨 Social Media Posting Failure - Manual Action Required",
                template: "fallback_notification",
                data: {
                  "failed_platforms": "{{permanent_errors}}",
                  "content": "{{content_text}}",
                  "scripture": "{{scripture_reference}}",
                  "cta": "{{call_to_action}}",
                  "hashtags": "{{hashtags}}",
                  "media_url": "{{media_url}}",
                  "timestamp": "{{current_timestamp}}"
                }
              }
            ]
          }
        ]
      },

      {
        id: "generate_report",
        name: "Generate Summary Report",
        type: "script",
        script: `
          const successes = [];
          const failures = [];
          
          // Collect results from each platform
          variables.target_platforms.forEach(platform => {
            if (variables[platform + '_verified']) {
              successes.push({
                platform: platform,
                status: '✅',
                url: variables[platform + '_post_url']
              });
            } else if (variables[platform + '_test_failed'] || variables[platform + '_post_failed']) {
              failures.push({
                platform: platform,
                status: variables[platform + '_fallback_triggered'] ? '❗ fallback triggered' : '❌ failed',
                error: variables[platform + '_error']
              });
            }
          });
          
          const totalPlatforms = successes.length + failures.length;
          const successRate = totalPlatforms > 0 ? (successes.length / totalPlatforms * 100).toFixed(1) : 0;
          
          return {
            summary: {
              total: totalPlatforms,
              successful: successes.length,
              failed: failures.length,
              success_rate: successRate + '%'
            },
            details: {
              successes: successes,
              failures: failures
            },
            timestamp: new Date().toISOString()
          };
        `
      },

      {
        id: "send_summary_report",
        name: "Send Summary Report",
        type: "email",
        to: "{{admin_email}}",
        subject: "📊 Social Media Posting Summary - {{summary.success_rate}} Success Rate",
        template: "summary_report",
        data: "{{report_data}}"
      },

      {
        id: "log_results",
        name: "Log Results to Database",
        type: "database",
        operation: "insert",
        table: "social_media_posts",
        data: {
          "content": "{{content_text}}",
          "platforms": "{{target_platforms}}",
          "successes": "{{report_data.details.successes}}",
          "failures": "{{report_data.details.failures}}",
          "success_rate": "{{report_data.summary.success_rate}}",
          "timestamp": "{{current_timestamp}}",
          "brand_voice": "{{brand_voice}}"
        }
      }
    ]
  },

  error_handling: {
    global_error_handler: {
      action: "send_email",
      to: "{{admin_email}}",
      subject: "🚨 Greta.ai Workflow Critical Error",
      template: "critical_error_notification"
    },
    retry_policy: {
      max_attempts: 3,
      delay: "exponential",
      base_delay: "30s"
    }
  },

  monitoring: {
    success_threshold: 90, // Alert if success rate drops below 90%
    health_check_schedule: "0 */6 * * *", // Every 6 hours
    metrics_to_track: [
      "total_posts",
      "success_rate",
      "platform_availability",
      "error_frequency"
    ]
  },

  email_templates: {
    fallback_notification: `
      🚨 SOCIAL MEDIA POSTING FAILURE - MANUAL ACTION REQUIRED
      
      Platform(s): {{failed_platforms}}
      Error Details: {{error_details}}
      
      Content to post:
      {{content}}
      
      Scripture: {{scripture}}
      CTA: {{cta}}
      Hashtags: {{hashtags}}
      Media URL: {{media_url}}
      
      Please manually post this content to the failed platform(s).
      
      Time: {{timestamp}}
    `,
    
    summary_report: `
      📊 SOCIAL MEDIA POSTING SUMMARY
      
      Success Rate: {{summary.success_rate}}
      Total Platforms: {{summary.total}}
      Successful: {{summary.successful}}
      Failed: {{summary.failed}}
      
      ✅ Successful Posts:
      {{#each details.successes}}
      - {{platform}}: {{url}}
      {{/each}}
      
      ❌ Failed Posts:
      {{#each details.failures}}
      - {{platform}}: {{status}} - {{error}}
      {{/each}}
      
      Timestamp: {{timestamp}}
    `
  }
};

// Instructions for Greta.ai Setup
export const gretaSetupInstructions = `
## Greta.ai Multi-Platform Integration Setup

### 1. Import Workflow
1. Copy the gretaWorkflowConfig object above
2. In Greta.ai dashboard, click "Create New Workflow"
3. Choose "Import from JSON" and paste the configuration
4. Save as "Multi-Platform Social Media Automation"

### 2. Configure Environment Variables
Set these in Greta.ai Environment Settings:
- instagram_access_token: Your Instagram Business access token
- instagram_business_id: Your Instagram Business account ID
- twitter_bearer_token: Twitter API v2 Bearer token
- twitter_access_token: Twitter API access token
- twitter_access_token_secret: Twitter API access token secret
- linkedin_access_token: LinkedIn API access token
- linkedin_personal_profile: Your LinkedIn personal profile ID
- linkedin_company_page: Your LinkedIn company page ID
- facebook_access_token: Facebook Page access token
- facebook_page_id: Your Facebook Page ID
- admin_email: Email for notifications and fallbacks

### 3. Test the Workflow
1. Run a test with sample content
2. Verify all platforms receive the test post
3. Check that fallback emails are sent for any failures
4. Confirm summary reports are delivered

### 4. Set Up Monitoring
1. Enable workflow monitoring in Greta.ai
2. Set up alerts for success rate drops below 90%
3. Schedule weekly health checks
4. Configure log retention for analytics

### 5. Schedule Regular Posts
1. Create triggers for regular posting times
2. Connect with your content calendar
3. Set up webhook endpoints for manual triggers
4. Configure content approval workflows if needed

✅ Your multi-platform automation is now ready!
`;