import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Contact, ContactFormData } from '../types';

export class ContactService {
  // Create a new contact
  static async createContact(contactData: ContactFormData): Promise<Contact> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, simulating contact creation');
        const mockContact: Contact = {
          id: `mock-contact-${Date.now()}`,
          ...contactData,
          property_id: contactData.property_id || null,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return mockContact;
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) {
        console.error('Error creating contact:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createContact:', error);
      throw error;
    }
  }

  // Get all contacts
  static async getContacts(): Promise<Contact[]> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, returning empty contacts');
        return [];
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContacts:', error);
      return [];
    }
  }

  // Update contact status
  static async updateContactStatus(id: string, status: Contact['status']): Promise<Contact> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, simulating contact update');
        const mockContact: Contact = {
          id,
          name: 'Mock Contact',
          email: 'mock@example.com',
          phone: '555-0000',
          subject: 'Mock Subject',
          message: 'Mock Message',
          property_id: null,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return mockContact;
      }

      const { data, error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contact status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateContactStatus:', error);
      throw error;
    }
  }
}