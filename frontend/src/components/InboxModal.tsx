'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Mail,
  Search,
  Star,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  Reply,
  ShieldCheck,
  User,
  Inbox,
  Filter,
  Check,
} from 'lucide-react';
import {
  BharatBNMessage,
  getStoredMessages,
  markMessageRead,
  deleteDirectMessage,
  toggleStarMessage,
  syncMessagesFromServer,
} from '@/lib/realMessages';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientSlug: string;
  recipientName?: string;
}

export default function InboxModal({
  isOpen,
  onClose,
  recipientSlug,
  recipientName = 'Your Profile',
}: InboxModalProps) {
  const [messages, setMessages] = useState<BharatBNMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [activeMessage, setActiveMessage] = useState<BharatBNMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  const refreshMessages = () => {
    const list = getStoredMessages(recipientSlug);
    setMessages(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshMessages();
      syncMessagesFromServer(recipientSlug).then((list) => {
        if (list && list.length > 0) setMessages(list);
      });
    }
  }, [isOpen, recipientSlug]);

  useEffect(() => {
    const handleSync = () => refreshMessages();
    window.addEventListener('bharatbn_messages_updated', handleSync);
    return () => window.removeEventListener('bharatbn_messages_updated', handleSync);
  }, [recipientSlug]);

  if (!isOpen) return null;

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const starredCount = messages.filter((m) => m.isStarred).length;

  const filtered = messages.filter((m) => {
    if (selectedFilter === 'unread' && m.isRead) return false;
    if (selectedFilter === 'starred' && !m.isStarred) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSender = m.senderName.toLowerCase().includes(q) || m.senderHandle.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchContent = m.content.toLowerCase().includes(q);
      return matchSender || matchSubject || matchContent;
    }
    return true;
  });

  const handleSelectMessage = (msg: BharatBNMessage) => {
    setActiveMessage(msg);
    setReplySent(false);
    setReplyText('');
    if (!msg.isRead) {
      markMessageRead(msg.id, recipientSlug);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDirectMessage(id, recipientSlug);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (activeMessage?.id === id) {
      setActiveMessage(null);
    }
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStarMessage(id, recipientSlug);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m))
    );
    if (activeMessage?.id === id) {
      setActiveMessage((prev) => (prev ? { ...prev, isStarred: !prev.isStarred } : null));
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    // Simulate sending reply via mailto or local store
    setReplySent(true);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] max-h-[750px] shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-orange-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F95700]/10 text-[#F95700] flex items-center justify-center font-bold">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Direct Messages &amp; Inquiries
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F95700] text-white text-[10px] font-black">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Incoming communications for {recipientName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Layout: Left Message List & Right Message Detail */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Search, Filters & Message Items */}
          <div className={`w-full md:w-5/12 border-r border-slate-100 flex flex-col bg-slate-50/50 ${activeMessage ? 'hidden md:flex' : 'flex'}`}>
            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sender, topic, message..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F95700]"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('unread')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedFilter === 'unread'
                      ? 'bg-[#F95700] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('starred')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    selectedFilter === 'starred'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Starred ({starredCount})</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-left">
              {filtered.length === 0 ? (
                <div className="p-8 text-center space-y-2 text-slate-400">
                  <Mail className="w-8 h-8 mx-auto stroke-1" />
                  <div className="text-xs font-semibold">No messages found</div>
                  <p className="text-[11px] text-slate-400">
                    {searchQuery ? 'Try matching another name or topic' : 'Messages sent to your public profile will appear here'}
                  </p>
                </div>
              ) : (
                filtered.map((msg) => {
                  const isSelected = activeMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-3.5 transition cursor-pointer flex items-start gap-3 relative ${
                        isSelected
                          ? 'bg-orange-50/80 border-l-4 border-l-[#F95700]'
                          : !msg.isRead
                          ? 'bg-white font-semibold'
                          : 'bg-slate-50/40 hover:bg-slate-100/60'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0 relative overflow-hidden text-xs flex items-center justify-center font-bold text-slate-700">
                        {msg.senderAvatar ? (
                          <Image src={msg.senderAvatar} alt={msg.senderName} fill className="object-cover" unoptimized />
                        ) : (
                          msg.senderName.charAt(0).toUpperCase()
                        )}
                      </div>

                      {/* Content Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs truncate ${!msg.isRead ? 'font-black text-slate-900' : 'font-medium text-slate-700'}`}>
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {new Date(msg.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#F95700] font-semibold truncate">
                          {msg.subject}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                          {msg.content}
                        </p>
                      </div>

                      {/* Unread dot / Star button */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleToggleStar(msg.id, e)}
                          className="text-slate-300 hover:text-amber-500 transition"
                        >
                          <Star className={`w-3.5 h-3.5 ${msg.isStarred ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                        {!msg.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#F95700] flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Message Detail & Quick Reply */}
          <div className={`w-full md:w-7/12 flex-col bg-white overflow-y-auto ${activeMessage ? 'flex' : 'hidden md:flex'}`}>
            {activeMessage ? (
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6 text-left">
                {/* Detail Header */}
                <div className="space-y-4">
                  {/* Back on mobile */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveMessage(null)}
                      className="md:hidden text-xs font-bold text-[#F95700] flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Messages
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStar(activeMessage.id, e)}
                        className={`p-1.5 rounded-lg border border-slate-200 text-xs transition cursor-pointer flex items-center gap-1 ${
                          activeMessage.isStarred ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${activeMessage.isStarred ? 'fill-amber-400 text-amber-500' : ''}`} />
                        <span className="text-[11px] font-semibold">{activeMessage.isStarred ? 'Starred' : 'Star'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(activeMessage.id, e)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs transition cursor-pointer"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sender Profile Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 flex-shrink-0 relative overflow-hidden text-base flex items-center justify-center font-bold text-slate-700 shadow-2xs">
                      {activeMessage.senderAvatar ? (
                        <Image src={activeMessage.senderAvatar} alt={activeMessage.senderName} fill className="object-cover" unoptimized />
                      ) : (
                        activeMessage.senderName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {activeMessage.senderName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          {activeMessage.senderHandle}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                        {activeMessage.senderEmail && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {activeMessage.senderEmail}
                          </span>
                        )}
                        {activeMessage.senderPhone && (
                          <span>📞 {activeMessage.senderPhone}</span>
                        )}
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activeMessage.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Badge */}
                  <div className="inline-block px-3 py-1 rounded-xl bg-orange-50 border border-orange-200/80 text-[#F95700] text-xs font-bold">
                    {activeMessage.subject}
                  </div>

                  {/* Message Body */}
                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                    {activeMessage.content}
                  </div>
                </div>

                {/* Reply Form */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {replySent ? (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Reply recorded and sent to {activeMessage.senderName}!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendReply} className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Reply className="w-3.5 h-3.5 text-[#F95700]" />
                          <span>Reply to {activeMessage.senderName}</span>
                        </span>
                        {activeMessage.senderEmail && (
                          <a
                            href={`mailto:${activeMessage.senderEmail}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                            className="text-[11px] text-[#F95700] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Mail className="w-3 h-3" />
                            Open Email App
                          </a>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Write your reply to ${activeMessage.senderName}...`}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className="px-4 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Mail className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Select a message</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Choose an inquiry from the left to read full details, reply, or manage communications.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
