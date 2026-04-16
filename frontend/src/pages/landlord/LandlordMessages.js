import React, { useState, useEffect, useRef } from 'react';
import { Send, Search } from 'lucide-react';
import { messageService } from '../../services';

const LandlordMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [thread, setThread] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  // Load conversations
  useEffect(() => {
    messageService.getConversations()
      .then(res => {
        const data = res.data || [];
        setConversations(data);
        if (data.length > 0) setActiveChat(data[0]);
      })
      .catch(() => setError('Failed to load conversations.'))
      .finally(() => setLoading(false));
  }, []);

  // Load thread when activeChat changes
  useEffect(() => {
    if (!activeChat) return;
    const userId = activeChat.user?._id || activeChat.user;
    if (!userId) return;
    setThreadLoading(true);
    messageService.getThread(userId)
      .then(res => setThread(res.data || []))
      .catch(() => setThread([]))
      .finally(() => setThreadLoading(false));
  }, [activeChat]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || sending) return;
    const receiverId = activeChat.user?._id || activeChat.user;
    setSending(true);
    try {
      const res = await messageService.send(receiverId, message.trim());
      setThread(prev => [...prev, res.data]);
      setMessage('');
      // Update last message in conversations list
      setConversations(prev =>
        prev.map(c =>
          (c.user?._id || c.user) === receiverId
            ? { ...c, lastMessage: message.trim(), lastMessageAt: new Date() }
            : c
        )
      );
    } catch {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter(c =>
    c.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Messages</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Communicate with your tenants.</p>
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>
      )}

      <div className="glass-panel" style={{ display: 'flex', height: 'calc(100vh - 240px)', overflow: 'hidden' }}>

        {/* Contacts Sidebar */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)', fontSize: '0.875rem' }}
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.875rem' }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.875rem' }}>No conversations yet.</div>
            ) : (
              filtered.map(contact => (
                <div
                  key={contact.user?._id || contact.user}
                  onClick={() => setActiveChat(contact)}
                  style={{
                    padding: '1rem', borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    background: activeChat?.user?._id === (contact.user?._id || contact.user) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    transition: 'background 0.2s', display: 'flex', gap: '1rem'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
                      {contact.user?.name?.charAt(0) || '?'}
                    </div>
                    {contact.unreadCount > 0 && (
                      <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '14px', height: '14px', background: 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white', fontWeight: 'bold' }}>
                        {contact.unreadCount}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{contact.user?.name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {contact.lastMessageAt ? new Date(contact.lastMessageAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {contact.lastMessage || 'No messages yet'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!activeChat ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Select a conversation
            </div>
          ) : (
            <>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {activeChat.user?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{activeChat.user?.name || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tenant</div>
                </div>
              </div>

              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {threadLoading ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading messages...</div>
                ) : thread.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No messages yet. Say hello!</div>
                ) : (
                  thread.map((msg, i) => {
                    const isMe = msg.sender?._id === activeChat.user?._id ? false : true;
                    return (
                      <div key={msg._id || i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ padding: '0.75rem 1rem', background: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: isMe ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0', color: 'white', fontSize: '0.875rem', lineHeight: '1.4' }}>
                          {msg.content}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '99px', padding: '0.75rem 1.25rem' }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', opacity: sending ? 0.6 : 1 }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Send size={18} style={{ marginLeft: '2px' }} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordMessages;
