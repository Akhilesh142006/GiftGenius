import React, { useState, useRef, useEffect } from 'react';
import { useGiftContext } from '../context/GiftContext';
import { chatbotService } from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI gift assistant 🎁 I'm excited to help you find the perfect gift! Tell me, who are you shopping for today?",
      sender: 'bot',
      timestamp: new Date(),
      quickActions: ['Close Friend', 'Family Member', 'Romantic Partner', 'Colleague']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    relationship: '',
    occasion: '',
    budgetMin: 1000,
    budgetMax: 10000,
    ageRange: '',
    interests: []
  });
  const messagesEndRef = useRef(null);
  const giftContext = useGiftContext();
  
  // Save conversation to history
  const saveConversationToHistory = () => {
    if (messages.length > 1) { // Don't save if only initial message
      const conversationSummary = {
        id: sessionId || Date.now(),
        date: new Date(),
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1]?.text?.substring(0, 50) + '...',
        context: conversationContext,
        messages: messages
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('chatbot_history') || '[]');
      const updatedHistory = [conversationSummary, ...existingHistory.slice(0, 9)]; // Keep last 10 conversations
      localStorage.setItem('chatbot_history', JSON.stringify(updatedHistory));
      setConversationHistory(updatedHistory);
    }
  };
  
  // Load conversation history
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('chatbot_history') || '[]');
    setConversationHistory(history);
  }, []);
  
  // Clear current conversation
  const clearConversation = () => {
    saveConversationToHistory();
    setMessages([
      {
        id: Date.now(),
        text: "Hi! I'm your AI gift assistant 🎁 I'm excited to help you find the perfect gift! Tell me, who are you shopping for today?",
        sender: 'bot',
        timestamp: new Date(),
        quickActions: ['Close Friend', 'Family Member', 'Romantic Partner', 'Colleague']
      }
    ]);
    setConversationContext({
      relationship: '',
      occasion: '',
      budgetMin: 1000,
      budgetMax: 10000,
      ageRange: '',
      interests: []
    });
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  };
  
  // Load conversation from history
  const loadConversationFromHistory = (historyItem) => {
    setMessages(historyItem.messages);
    setConversationContext(historyItem.context);
    setSessionId(historyItem.id);
    setShowHistory(false);
  };

  // Sync with main app context
  useEffect(() => {
    const currentMainContext = {
      relationship: giftContext.relationship,
      occasion: giftContext.occasion,
      budgetMin: giftContext.budgetMin,
      budgetMax: giftContext.budgetMax,
      ageRange: giftContext.ageRange,
      interests: giftContext.interests
    };
    
    // Update conversation context if main context has more complete information
    const hasMainContextData = currentMainContext.relationship || 
                              currentMainContext.interests.length > 0 ||
                              currentMainContext.budgetMin !== 1000 ||
                              currentMainContext.budgetMax !== 10000;
    
    if (hasMainContextData) {
      setConversationContext(prev => ({
        ...prev,
        ...currentMainContext
      }));
    }
  }, [giftContext]);
  
  // Initialize session ID
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage({
        message: textToSend,
        context: conversationContext,
        sessionId: sessionId
      });

      if (response.success) {
        // Update conversation context
        if (response.context) {
          setConversationContext(response.context);
          
          // Sync back to main app context if user provided significant information
          if (response.context.relationship && !giftContext.relationship) {
            giftContext.setRelationship(response.context.relationship);
          }
          if (response.context.occasion && !giftContext.occasion) {
            giftContext.setOccasion(response.context.occasion);
          }
          if (response.context.budgetMin && response.context.budgetMax && 
              (giftContext.budgetMin === 1000 && giftContext.budgetMax === 10000)) {
            giftContext.setBudget(response.context.budgetMin, response.context.budgetMax);
          }
          if (response.context.ageRange && !giftContext.ageRange) {
            giftContext.setAgeRange(response.context.ageRange);
          }
          if (response.context.interests && response.context.interests.length > 0) {
            const newInterests = response.context.interests.filter(interest => 
              !giftContext.interests.includes(interest)
            );
            newInterests.forEach(interest => giftContext.toggleInterest(interest));
          }
        }

        const botMessage = {
          id: Date.now() + 1,
          text: response.message,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: response.suggestions || null,
          quickActions: response.quickActions || null
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again or use the main recommendation form.",
        sender: 'bot',
        timestamp: new Date(),
        quickActions: ['Try Again', 'Use Main Form']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    // Handle special quick actions
    if (action === 'Try Again') {
      // Resend last user message
      const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.text);
      }
      return;
    }
    
    if (action === 'Use Main Form') {
      // Navigate to main form
      setIsOpen(false);
      window.location.href = '/relationship-occasion';
      return;
    }
    
    if (action === 'Start gift search') {
      handleSendMessage('I want to find a gift');
      return;
    }
    
    if (action === 'Explain how you work') {
      handleSendMessage('How do you work?');
      return;
    }
    
    if (action === 'Show examples') {
      handleSendMessage('Show me some examples');
      return;
    }
    
    // Handle budget quick actions
    if (action.includes('₹')) {
      handleSendMessage(`My budget is ${action}`);
      return;
    }
    
    // Handle other quick actions as direct messages
    handleSendMessage(action);
  };

  const handleSuggestionClick = (suggestion) => {
    window.open(suggestion.affiliateLink, '_blank');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Chatbot Interface */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-icon">🎁</span>
              Gift Assistant
            </div>
            <div className="chatbot-controls">
              <button 
                className="chatbot-control-btn" 
                onClick={() => setShowHistory(!showHistory)}
                title="Conversation History"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L16 16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className="chatbot-control-btn" 
                onClick={clearConversation}
                title="Start New Conversation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {showHistory && (
            <div className="conversation-history">
              <div className="history-header">
                <h4>Recent Conversations</h4>
                <button 
                  className="history-close"
                  onClick={() => setShowHistory(false)}
                >
                  ×
                </button>
              </div>
              <div className="history-list">
                {conversationHistory.length === 0 ? (
                  <div className="no-history">No previous conversations</div>
                ) : (
                  conversationHistory.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="history-item"
                      onClick={() => loadConversationFromHistory(item)}
                    >
                      <div className="history-date">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                      <div className="history-preview">{item.lastMessage}</div>
                      <div className="history-meta">
                        {item.messageCount} messages
                        {item.context.relationship && (
                          <span className="context-tag">{item.context.relationship}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  {message.suggestions && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-card" onClick={() => handleSuggestionClick(suggestion)}>
                          <div className="suggestion-name">{suggestion.name}</div>
                          <div className="suggestion-price">₹{suggestion.price.toLocaleString()}</div>
                          <div className="suggestion-reason">{suggestion.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {message.quickActions && (
                    <div className="quick-actions">
                      {message.quickActions.map((action, index) => (
                        <button 
                          key={index} 
                          className="quick-action-btn"
                          onClick={() => handleQuickAction(action)}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about gifts or tell me who you're shopping for..."
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;