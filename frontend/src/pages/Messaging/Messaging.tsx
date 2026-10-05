import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../Auth/useAuth";
import Button from "../../components/Button";
import type { User } from "../UsersPage/userApi";
import {
  deleteMessage,
  getInbox,
  getRecipients,
  getSentMessages,
  markMessageAsRead,
  sendMessage,
  type Message,
  type MessageFolder,
  type SendMessageInput,
} from "./messagingApi";


interface ComposeDraft {
  receiverId?: number;
  subject?: string;
  isReply?: boolean;
}

interface MessageListProps {
  folder: MessageFolder;
  messages: Message[];
  selectedId: string | null;
  onSelect: (message: Message) => void;
}

const messageDateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string) {
  return messageDateFormatter.format(new Date(value));
}

function MessageList({ folder, messages, selectedId, onSelect }: MessageListProps) {
  if (messages.length === 0) return <p className="muted">No messages in this folder.</p>;

  return (
    <div className="message-list">
      {messages.map((message) => {
        console.log(message)
        const contact = folder === "inbox" ? message.senderName : message.receiverName;
        return (
          <button
            className={`message-row${selectedId === message.id ? " message-row--selected" : ""}`}
            key={message.id}
            type="button"
            onClick={() => onSelect(message)}
          >
            <span className="message-row__top">
              <strong>
                {folder === "inbox" && !message.isRead ? <span className="message-row__unread" aria-label="Unread">●</span> : null}
                {contact}
              </strong>
              <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleDateString("en-GB")}</time>
            </span>
            <span className="message-row__subject">{message.subject}</span>
            <span className="message-row__preview">{message.body}</span>
          </button>
        );
      })}
    </div>
  );
}

interface MessageFormProps {
  contacts: User[];
  draft: ComposeDraft;
  isSending: boolean;
  onCancel: () => void;
  onSend: (input: SendMessageInput) => Promise<boolean>;
}

function MessageForm({ contacts, draft, isSending, onCancel, onSend }: MessageFormProps) {
  const [receiverId, setReceiverId] = useState(draft.receiverId ?? 0);
  const [subject, setSubject] = useState(draft.subject ?? "");
  const [body, setBody] = useState("");
  const [validationError, setValidationError] = useState("");
  const selectedContact = contacts.find((contact) => contact.id === receiverId);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!selectedContact || !subject.trim() || !body.trim()) {
      setValidationError("Select a recipient and enter a subject and message.");
      return;
    }

    await onSend({
      receiverId: selectedContact.id,
      subject: subject.trim(),
      body: body.trim(),
    });
  }

  if (contacts.length === 0) {
    return (
      <section>
        <h2>New message</h2>
        <p>No event contacts are available.</p>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </section>
    );
  }

  return (
    <section>
      <h2>{draft.isReply ? "Reply" : "New message"}</h2>
      <form className="form" onSubmit={handleSubmit}>
        {draft.isReply && selectedContact ? (
          <p className="page-message">To {selectedContact.firstName} {selectedContact.lastName}</p>
        ) : (
          <div className="form-field">
            <label htmlFor="message-recipient">Recipient</label>
            <select id="message-recipient" value={receiverId} onChange={(event) => setReceiverId(Number(event.target.value))}>
              {contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</option>)}
            </select>
          </div>
        )}
        <div className="form-field">
          <label htmlFor="message-subject">Subject</label>
          <input id="message-subject" maxLength={120} value={subject} onChange={(event) => setSubject(event.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="message-body">Message</label>
          <textarea id="message-body" maxLength={2000} rows={8} value={body} onChange={(event) => setBody(event.target.value)} />
        </div>
        {validationError ? <p className="field-error" role="alert">{validationError}</p> : null}
        <div className="page-actions">
          <Button type="submit" disabled={isSending}>{isSending ? "Sending..." : "Send"}</Button>
          <Button variant="secondary" disabled={isSending} onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </section>
  );
}

export default function Messaging() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sent, setSent] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [activeFolder, setActiveFolder] = useState<MessageFolder>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeDraft, setComposeDraft] = useState<ComposeDraft | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    setStatus("loading");

    Promise.all([
      getInbox(controller.signal),
      getSentMessages(controller.signal),
      getRecipients(controller.signal),
    ])
      .then(([inboxMessages, sentMessages, availableContacts]) => {
        setInbox(inboxMessages);
        setSent(sentMessages);
        setContacts(availableContacts);
        setSelectedId(inboxMessages[0]?.id ?? null);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setFeedback({ type: "error", text: error instanceof Error ? error.message : "Could not load messages." });
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, [user, loadAttempt]);

  if (!user) return null;

  const messages = activeFolder === "inbox" ? inbox : sent;
  const selectedMessage = messages.find((message) => message.id === selectedId);
  const unreadCount = inbox.filter((message) => !message.isRead).length;

  function selectFolder(folder: MessageFolder) {
    const folderMessages = folder === "inbox" ? inbox : sent;
    setActiveFolder(folder);
    setSelectedId(folderMessages[0]?.id ?? null);
    setComposeDraft(null);
    setFeedback(null);
  }

  async function selectMessage(message: Message) {
    setSelectedId(message.id);
    setComposeDraft(null);
    setFeedback(null);
    if (activeFolder !== "inbox" || message.isRead) return;

    setInbox((current) => current.map((item) => item.id === message.id ? { ...item, isRead: true } : item));
    try {
      await markMessageAsRead(message.id);
    } catch {
      setInbox((current) => current.map((item) => item.id === message.id ? { ...item, isRead: false } : item));
      setFeedback({ type: "error", text: "Could not mark the message as read." });
    }
  }

  async function handleSend(input: SendMessageInput) {
    setIsSending(true);
    setFeedback(null);
    try {
      const newMessage = await sendMessage(input);
      setSent((current) => [newMessage, ...current]);
      setActiveFolder("outbox");
      setSelectedId(newMessage.id);
      setComposeDraft(null);
      setFeedback({ type: "success", text: "Message sent." });
      return true;
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Could not send message." });
      return false;
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete() {
    if (!selectedMessage || !window.confirm("Delete this message?")) return;
    setIsDeleting(true);
    setFeedback(null);

    try {
      await deleteMessage(selectedMessage.id);
      const remaining = messages.filter((message) => message.id !== selectedMessage.id);
      if (activeFolder === "inbox") setInbox(remaining); else setSent(remaining);
      setSelectedId(remaining[0]?.id ?? null);
      setFeedback({ type: "success", text: "Message deleted." });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Could not delete message." });
    } finally {
      setIsDeleting(false);
    }
  }

  if (status === "loading") return <main className="page"><p className="page-message">Loading messages...</p></main>;
  if (status === "error") {
    return (
      <main className="page">
        <p className="page-message page-message--error" role="alert">{feedback?.text ?? "Could not load messages."}</p>
        <Button onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</Button>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Messaging</h1>
          {user.role === 'ADMIN' ? <p>Connect with other admins, organizers and users.</p>
            : user.role === 'ORGANIZER' ? <p>Connect with admins and users.</p>
              : <p>Connect with admins and organizers.</p>}
        </div>
        <Button onClick={() => { setComposeDraft({}); setFeedback(null); }}>New message</Button>
      </header>
      {feedback ? <p className={`page-message page-message--${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p> : null}

      <div className="messaging-layout">
        <aside className="messaging-sidebar" aria-label="Message folders">
          <div className="message-tabs">
            <button className={`tab${activeFolder === "inbox" ? " tab--active" : ""}`} type="button" onClick={() => selectFolder("inbox")}>Inbox{unreadCount ? ` (${unreadCount})` : ""}</button>
            <button className={`tab${activeFolder === "outbox" ? " tab--active" : ""}`} type="button" onClick={() => selectFolder("outbox")}>Outbox</button>
          </div>
          <MessageList folder={activeFolder} messages={messages} selectedId={selectedId} onSelect={(message) => { void selectMessage(message); }} />
        </aside>

        <section className="messaging-content" aria-label="Selected message">
          {composeDraft ? (
            <MessageForm
              key={`${composeDraft.isReply ? "reply" : "new"}-${composeDraft.receiverId ?? "none"}`}
              contacts={contacts}
              draft={composeDraft}
              isSending={isSending}
              onCancel={() => setComposeDraft(null)}
              onSend={handleSend}
            />
          ) : selectedMessage ? (
            <article>
              
              <h2>{selectedMessage.subject}</h2>
              <div className="message-meta">
                <span>{activeFolder === "inbox" ? "From" : "To"}: {activeFolder === "inbox" ? selectedMessage.senderName : selectedMessage.receiverName}</span>
                <time dateTime={selectedMessage.createdAt}>{formatDate(selectedMessage.createdAt)}</time>
              </div>
              <p className="message-body">{selectedMessage.body}</p>
              <div className="page-actions">
                {activeFolder === "inbox" ? <Button onClick={() => setComposeDraft({ receiverId: selectedMessage.senderId, subject: `Re: ${selectedMessage.subject.replace(/^Re:\s*/i, "")}`, isReply: true })}>Reply</Button> : null}
                <Button variant="danger" disabled={isDeleting} onClick={() => { void handleDelete(); }}>{isDeleting ? "Deleting..." : "Delete"}</Button>
              </div>
            </article>
          ) : <p className="muted">Select a message or create a new one.</p>}
        </section>
      </div>
    </main>
  );
}
