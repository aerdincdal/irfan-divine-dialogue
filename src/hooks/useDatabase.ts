import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  created_at: string;
  message_count: number;
}

interface Message {
  id: string;
  content: string;
  message_type: 'user' | 'ai';
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  display_name: string;
}

export const useDatabase = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getUserProfile = async (): Promise<Profile | null> => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const getChatSessions = async (): Promise<ChatSession[]> => {
    if (!userId) return [];
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          title,
          preview,
          created_at,
          messages(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(session => ({
        ...session,
        message_count: session.messages?.[0]?.count || 0
      })) || [];
    } catch (error: any) {
      console.error('Error fetching chat sessions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createChatSession = async (title: string, preview: string): Promise<string | null> => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title,
          preview
        })
        .select('id')
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error: any) {
      console.error('Error creating chat session:', error);
      toast({
        title: "Hata",
        description: "Sohbet oturumu oluşturulamadı.",
        variant: "destructive"
      });
      return null;
    }
  };

  const saveMessage = async (sessionId: string, content: string, messageType: 'user' | 'ai'): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          content,
          message_type: messageType
        });
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error saving message:', error);
      return false;
    }
  };

  const getChatMessages = async (sessionId: string): Promise<Message[]> => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'user' | 'ai'
      }));
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const deleteChatSession = async (sessionId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Sohbet Silindi",
        description: "Sohbet başarıyla silindi."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting chat session:', error);
      toast({
        title: "Hata",
        description: "Sohbet silinemedi.",
        variant: "destructive"
      });
      return false;
    }
  };

  const clearAllChatSessions = async (): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Tüm Sohbetler Silindi",
        description: "Tüm sohbet geçmişi temizlendi."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error clearing chat sessions:', error);
      toast({
        title: "Hata",
        description: "Sohbet geçmişi temizlenemedi.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    loading,
    getUserProfile,
    getChatSessions,
    createChatSession,
    saveMessage,
    getChatMessages,
    deleteChatSession,
    clearAllChatSessions
  };
};