'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Send,
  CheckCircle2,
  MessageSquare,
  Clock,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  History,
  Briefcase,
  Mic,
  HelpCircle,
  Heart,
} from 'lucide-react';
import {
  BharatBNMessage,
  sendDirectMessage,
  getSentMessages,
} from '@/lib/realMessages';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    slug: string;
    name: string;
    avatarUrl?: string;
    role?: string;
    handle?: string;
    isVerified?: boolean;
  };
}

const INQUIRY_TOPICS = [
  { id: 'Collaboration', label: 'Collaboration', icon: Briefcase },
  { id: 'Speaking / Event', label: 'Speaking / Event', icon: Mic },
  { id: 'Business Inquiry', label: 'Business Inquiry', icon: Sparkles },
  { id: 'Appreciation', label: 'Appreciation', icon: Heart },
  { id: 'General', label: 'General Question', icon: HelpCircle },
];

export default function DirectMessageModal({
  isOpen,
  onClose,
  recipient,
}: DirectMessageModalProps) {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [subject, setSubject] = useState('Collaboration');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSentMessage, setLastSentMessage] = useState<BharatBNMessage | null>(null);
  const [sentHistory, setSentHistory] = useState<BharatBNMessage[]>([]);
  const [userSession, setUserSession] = useState<any>(null);

  // Sync user session if logged in
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('bharatbn_owner_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserSession(parsed);
        if (parsed.name) setSenderName(parsed.name);
        if (parsed.email || parsed.phone) setSenderContact(parsed.email || parsed.phone);
      }
    } catch {}
  }, [isOpen]);

  // Load sent history
  const loadHistory = () => {
    const handleOrSlug = userSession?.handle || userSession?.slug || senderName || 'guest';
    const history = getSentMessages(handleOrSlug, recipient.slug);
    setSentHistory(history);
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, userSession, recipient.slug]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);

    try {
      const effectiveSenderName = senderName.trim() || userSession?.name || 'BharatBN Member';
      const effectiveSenderHandle = userSession?.handle || (senderName ? `@${senderName.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '@visitor');
      const effectiveAvatar = userSession?.avatarUrl || '';

      const msg = await sendDirectMessage({
        recipientSlug: recipient.slug,
        recipientName: recipient.name,
        senderName: effectiveSenderName,
        senderHandle: effectiveSenderHandle,
        senderEmail: senderContact.includes('@') ? senderContact : userSession?.email,
        senderPhone: !senderContact.includes('@') ? senderContact : userSession?.phone,
        senderAvatar: effectiveAvatar,
        subject,
        content,
      });

      setLastSentMessage(msg);
      setIsSuccess(true);
      setContent('');
      loadHistory();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setLastSentMessage(null);
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-orange-50/30">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xs bg-slate-200 flex-shrink-0">
              <Image
                src={recipient.avatarUrl || '/people/anand-sahu-avatar.jpg'}
                alt={recipient.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  Message {recipient.name}
                </h3>
                {recipient.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-[#F95700] fill-orange-50" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {recipient.role || recipient.handle || 'Verified Profile on BharatBN'}
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

        {/* Tab Switcher */}
        <div className="px-5 pt-3 flex gap-2 border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => {
              setActiveTab('compose');
              if (isSuccess) handleReset();
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'compose'
                ? 'border-[#F95700] text-[#F95700]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>New Message</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#F95700] text-[#F95700]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Sent History ({sentHistory.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-left">
          {activeTab === 'compose' ? (
            isSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Message Sent to {recipient.name}&apos;s Inbox!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your direct communication has been registered and delivered to {recipient.name}&apos;s verified communication desk. They can view and review your inquiry in their Dashboard.
                </p>

                {lastSentMessage && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-1.5 mt-4 max-w-sm mx-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Details</div>
                    <div className="font-semibold text-slate-800">{lastSentMessage.subject}</div>
                    <div className="text-slate-600 line-clamp-2 italic">&ldquo;{lastSentMessage.content}&rdquo;</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" /> Just now
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                {/* Sender Identity Preview / Inputs */}
                {userSession ? (
                  <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-200 text-[#F95700] flex items-center justify-center font-bold text-xs">
                        {userSession.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">
                          Sending as {userSession.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {userSession.handle || userSession.email || 'Verified BharatBN Account'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#F95700] bg-white px-2 py-0.5 rounded-full border border-orange-200">
                      Logged In
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="e.g. Rahul Verma"
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Email or Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={senderContact}
                          onChange={(e) => setSenderContact(e.target.value)}
                          placeholder="e.g. rahul@example.com"
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Subject / Topic selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Inquiry Topic / Reason
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {INQUIRY_TOPICS.map((topic) => {
                      const Icon = topic.icon;
                      const selected = subject === topic.id;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSubject(topic.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                            selected
                              ? 'bg-orange-50 border-[#F95700] text-[#F95700] shadow-2xs'
                              : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-3 h-3 ${selected ? 'text-[#F95700]' : 'text-slate-400'}`} />
                          <span>{topic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      Message Body <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {content.length}/1000
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    maxLength={1000}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Write your direct message to ${recipient.name}...\nBe clear about your intent, dates, or collaboration goals.`}
                    className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#F95700] leading-relaxed resize-none"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Encrypted direct delivery to verified desk
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSending || !content.trim()}
                      className="px-5 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )
          ) : (
            /* Sent History Tab */
            <div className="space-y-3">
              {sentHistory.length === 0 ? (
                <div className="py-8 text-center space-y-2 text-slate-400">
                  <History className="w-8 h-8 mx-auto stroke-1" />
                  <div className="text-xs font-medium">No previous messages sent to {recipient.name}</div>
                  <p className="text-[11px] text-slate-400">Messages you send to this profile will appear here.</p>
                </div>
              ) : (
                sentHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px] px-2 py-0.5 rounded-full bg-white border border-slate-200">
                        {msg.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {msg.content}
                    </p>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3 h-3" /> Delivered to {msg.recipientName}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
