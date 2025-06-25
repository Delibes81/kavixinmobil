import { supabase } from '../lib/supabase';
import { Contact, ContactFormData } from '../types';

export class ContactService {
  // Create a new contact
  static async createContact(contactData: ContactFormData): Promise<Contact> {
    try {
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
      throw error;
    }
  }

  // Update contact status
  static async updateContactStatus(id: string, status: Contact['status']): Promise<Contact> {
    try {
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