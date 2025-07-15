import { createClient } from '@supabase/supabase-js';

class ContactService {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    this.tableName = 'contacts_93h2k1';
  }

  // Create contact and send welcome email
  async createContact(contactData) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([{
          ...contactData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Send welcome email
      await this.sendWelcomeEmail(data);

      return { success: true, data };
    } catch (error) {
      console.error('Error creating contact:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email using Supabase Edge Functions
  async sendWelcomeEmail(contact) {
    try {
      const { error } = await this.supabase.functions.invoke('send-welcome-email', {
        body: { contact }
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Update contact
  async updateContact(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating contact:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete contact
  async deleteContact(id) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all contacts
  async getContacts() {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return { success: false, error: error.message };
    }
  }

  // Get contact by ID
  async getContactById(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching contact:', error);
      return { success: false, error: error.message };
    }
  }

  // Search contacts
  async searchContacts(query) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error searching contacts:', error);
      return { success: false, error: error.message };
    }
  }

  // Get contacts by category
  async getContactsByCategory(category) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching contacts by category:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ContactService;