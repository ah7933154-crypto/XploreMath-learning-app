import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { ChevronLeft, Send, User, Mail, MessageSquare } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submittedDescriptions, setSubmittedDescriptions] = useState([]);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "https://xplore-math-learning-app-backend.vercel.app";
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email.');
      return;
    }

    setError('');
    setIsSending(true);

    const templateParams = {
      user_name: name,
      user_email: email,
      message: description,
      reply_to: email
    };

    emailjs.send(
      'service_7nyrxhn',      // your service id
      'template_6r9av38',     // your template id (or create new contact template)
      templateParams,
      'EBrMQR2CAzYp0QR4V'     // your public key
    )
      .then(() => {
        setSubmittedDescriptions([
          { id: Date.now(), name, email, description },
          ...submittedDescriptions
        ]);

        setName('');
        setEmail('');
        setDescription('');
        setIsSending(false);
        alert('Message sent successfully!');
      })
      .catch((err) => {
        setError('Send failed: ' + err.text);
        setIsSending(false);
      });
    fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: description })
    })
      .then(res => res.json())
      .then(data => {
        alert('Message saved to database!');
      })
      .catch(err => console.error(err));

  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">

        <header className="contact-header">
          <button className="back-link" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Back
          </button>
          <h1>Get in <span className="highlight">Touch</span></h1>
        </header>

        <div className="contact-grid">
          <aside className="contact-info-pane">
            <div className="info-card">
              <h3>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '2px', marginTop: '8px' }}>
                <Mail size={20} style={{ marginTop: '2px', marginRight: '8px', marginBottom: '8px' }} />
                <p><span style={{ fontWeight: '600', color: '#2dd528' }}>Email: </span></p>
              </div>
              <p style={{ marginLeft: '30px' }}>xplore.math.8@gmail.com</p>
            </div>
          </aside>

          {/* RIGHT FORM */}
          <main className="contact-form-pane">
            <div className="form-card">
              <form onSubmit={handleSubmit}>

                <div className="input-group">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group align-start">
                  <MessageSquare size={18} />
                  <textarea
                    rows={6}
                    placeholder="How can we help?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {error && <p className="error-hint">{error}</p>}

                <button
                  type="submit"
                  disabled={isSending}
                  className={`btn-submit ${isSending ? 'sending' : ''}`}
                >
                  {isSending ? 'Sending...' : 'Send Message'} <Send size={18} />
                </button>

              </form>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Contact;
