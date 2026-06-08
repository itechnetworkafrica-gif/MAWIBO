import { useState, useRef, useEffect } from "react";
import { 
  useListChatSessions, 
  useGetChatMessages, 
  useSendChatMessage, 
  useCreateChatSession,
  getGetChatMessagesQueryKey,
  getListChatSessionsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Send, Plus, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export default function AIChat() {
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  
  const { data: sessions, isLoading: isLoadingSessions } = useListChatSessions();
  const { data: messages, isLoading: isLoadingMessages } = useGetChatMessages(activeSessionId || 0, {
    query: { enabled: !!activeSessionId, queryKey: getGetChatMessagesQueryKey(activeSessionId || 0) }
  });
  
  const createSession = useCreateChatSession();
  const sendMessage = useSendChatMessage();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessions && sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeSessionId) return;
    
    sendMessage.mutate(
      { id: activeSessionId, data: { content: input } },
      {
        onSuccess: () => {
          setInput("");
          queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey(activeSessionId) });
          queryClient.invalidateQueries({ queryKey: getListChatSessionsQueryKey() });
        }
      }
    );
  };

  const handleNewChat = () => {
    createSession.mutate(
      { data: { topic: "New Health Consultation" } },
      {
        onSuccess: (newSession) => {
          setActiveSessionId(newSession.id);
          queryClient.invalidateQueries({ queryKey: getListChatSessionsQueryKey() });
        }
      }
    );
  };

  return (
    <div className="h-[calc(100dvh-6rem)] md:h-[calc(100dvh-4rem)] flex gap-4 animate-in fade-in duration-500">
      {/* Sidebar - Sessions */}
      <Card className="glass-card hidden md:flex w-80 flex-col border-none shadow-2xl">
        <CardHeader className="p-4 border-b border-white/5">
          <Button onClick={handleNewChat} className="w-full gap-2">
            <Plus className="h-4 w-4" /> New Consultation
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
          {isLoadingSessions ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-1 p-2">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeSessionId === session.id 
                      ? "bg-primary/20 text-primary border border-primary/20" 
                      : "hover:bg-white/5 text-muted-foreground"
                  }`}
                >
                  <p className="font-medium truncate">{session.topic}</p>
                  <p className="text-xs opacity-70 truncate mt-1">{session.lastMessage || "No messages"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No recent sessions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="glass-card flex-1 flex flex-col border-none shadow-2xl overflow-hidden">
        <CardHeader className="p-4 border-b border-white/5 bg-background/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            MAWIBO AI Health Mate
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden relative">
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            ref={scrollRef}
          >
            {isLoadingMessages ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-[80%] rounded-xl rounded-tl-sm" />
                <Skeleton className="h-16 w-[70%] rounded-xl rounded-tr-sm ml-auto" />
              </div>
            ) : !activeSessionId ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Bot className="h-16 w-16 mb-4 opacity-20" />
                <p>Select a session or start a new chat</p>
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((msg, i) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary/20 text-primary'
                  }`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-secondary-foreground rounded-br-sm' 
                      : 'bg-white/5 border border-white/10 rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[10px] opacity-50 block mt-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p>Ask anything about your health, symptoms, or medications.</p>
                <p className="text-xs mt-2 opacity-60">This AI is for informational purposes and does not replace professional medical advice.</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/5 bg-background/50">
            <div className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your symptoms or ask a health question..."
                className="bg-black/20 border-white/10 focus-visible:ring-primary"
                disabled={!activeSessionId || sendMessage.isPending}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || !activeSessionId || sendMessage.isPending}
                className="px-8"
              >
                {sendMessage.isPending ? (
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
