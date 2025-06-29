import { useState, useEffect, useCallback } from 'react';
import { useCRM } from '../context/CRMContext';
import { useSocialMedia } from '../context/SocialMediaContext';
import CRMSocialIntegration from '../services/crmSocialIntegration';

export function useCRMAutomation() {
  const { state: crmState } = useCRM();
  const { state: socialState, dispatch: socialDispatch } = useSocialMedia();
  const [integration] = useState(new CRMSocialIntegration());
  const [automationStatus, setAutomationStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResults, setLastResults] = useState(null);

  // Update automation status when CRM data changes
  useEffect(() => {
    updateAutomationStatus();
  }, [crmState.contacts, crmState.interactions]);

  // Set up automatic processing interval (every hour)
  useEffect(() => {
    const interval = setInterval(() => {
      if (automationStatus?.isActive) {
        processAutomation();
      }
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [automationStatus?.isActive]);

  const updateAutomationStatus = useCallback(() => {
    const status = integration.getAutomationStatus();
    const metrics = integration.getIntegrationMetrics(crmState.contacts, crmState.interactions);
    setAutomationStatus({ ...status, metrics });
  }, [integration, crmState.contacts, crmState.interactions]);

  const processAutomation = useCallback(async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const results = await integration.processAutomationWorkflows(
        crmState.contacts, 
        crmState.interactions
      );
      
      setLastResults(results);
      
      // Add generated posts to social media state
      if (results.workflows) {
        results.workflows.forEach(workflow => {
          workflow.posts.forEach(post => {
            socialDispatch({
              type: 'ADD_POST',
              payload: {
                content: post.content,
                platforms: post.platforms,
                aiGenerated: true,
                automationGenerated: true,
                crmTriggered: true,
                brandVoice: 'professional',
                createdAt: new Date().toISOString()
              }
            });
          });
        });
      }
      
      updateAutomationStatus();
    } catch (error) {
      console.error('Automation processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [integration, crmState.contacts, crmState.interactions, socialDispatch, isProcessing]);

  const toggleAutomation = useCallback((enabled) => {
    integration.toggleAutomation(enabled);
    updateAutomationStatus();
  }, [integration]);

  const updateAutomationRules = useCallback((newRules) => {
    integration.updateAutomationRules(newRules);
    updateAutomationStatus();
  }, [integration]);

  const triggerManualSync = useCallback(async () => {
    return await processAutomation();
  }, [processAutomation]);

  return {
    automationStatus,
    isProcessing,
    lastResults,
    processAutomation,
    toggleAutomation,
    updateAutomationRules,
    triggerManualSync,
    updateAutomationStatus
  };
}