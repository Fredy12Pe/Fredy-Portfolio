# EmailJS Setup Guide

## Overview
The contact form now uses EmailJS to send emails directly from the website without opening the user's email client.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template content:

**Subject:** Portfolio Contact from {{from_name}}

**Content:**
```
Hi Fredy,

You have a new message from your portfolio website:

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

Best regards,
{{from_name}}
```

4. Save the template and note down your **Template ID**

### 4. Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### 5. Update the Code
Replace the placeholder values in `src/components/sections/ContactSection.tsx`:

```typescript
const result = await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your actual service ID
  'YOUR_TEMPLATE_ID', // Replace with your actual template ID
  templateParams,
  'YOUR_PUBLIC_KEY' // Replace with your actual public key
);
```

### 6. Test the Form
1. Start your development server
2. Fill out the contact form
3. Check your email for the message

## Features
- ✅ Direct email sending from website
- ✅ Loading states and user feedback
- ✅ Success/error messages
- ✅ Form validation
- ✅ Professional email formatting
- ✅ Free tier: 200 emails/month

## Troubleshooting
- Make sure all IDs are correct
- Check browser console for errors
- Verify email service is properly configured
- Test with different email addresses

## Security Note
The public key is safe to use in frontend code. EmailJS handles the actual email sending securely on their servers.
