# Email Configuration Guide for Brewhub

This guide explains how to set up email functionality for the registration confirmation emails in Brewhub.

## Configuration Overview

The registration system sends a welcome/confirmation email to users when they create an account. The email system is configured in the `.env` file.

## Environment Variables

Add these variables to your `backend/.env` file:

### Option 1: Development Mode (Log Only)

For local development, emails are written to `storage/logs/laravel.log`:

```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@brewhub.com"
MAIL_FROM_NAME="Brewhub"
MAIL_LOG_CHANNEL=stack
FRONTEND_URL=http://localhost:3000
```

### Option 2: Testing with Mailtrap

[Mailtrap](https://mailtrap.io) is great for testing emails in development:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@brewhub.com"
MAIL_FROM_NAME="Brewhub"
FRONTEND_URL=http://localhost:3000
```

### Option 3: Production with Gmail

For production with Gmail (requires app password):

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="Brewhub"
FRONTEND_URL=https://your-production-domain.com
```

**Note:** You need to enable 2-factor authentication and generate an app password in your Google account.

### Option 4: Production with SendGrid

For production with SendGrid:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@brewhub.com"
MAIL_FROM_NAME="Brewhub"
FRONTEND_URL=https://your-production-domain.com
```

## Setup Steps

### 1. Choose Your Email Service

Select one of the options above based on your environment:
- **Development**: Use `log` driver or Mailtrap
- **Production**: Use Gmail, SendGrid, or another SMTP service

### 2. Update .env File

Add the appropriate configuration variables to your `backend/.env` file.

### 3. Configure Queue (Optional but Recommended)

For better performance, emails are sent via queues. Configure your queue:

```env
QUEUE_CONNECTION=database
```

Then run the queue worker:

```bash
php artisan queue:work
```

If you don't want to use queues, update `WelcomeEmail.php` to remove `implements ShouldQueue`.

### 4. Test Email Sending

Create a test route to verify email configuration:

```php
// In routes/web.php or test it via registration
Route::get('/test-email', function () {
    $user = App\Models\User::first();
    $user->notify(new App\Notifications\WelcomeEmail($user->name));
    return 'Email sent!';
});
```

Visit `http://localhost:8000/test-email` to test.

## Email Content

The welcome email includes:
- Personalized greeting with user's name
- Confirmation that account was created successfully
- Link to the menu page to start ordering
- Professional branding

## Troubleshooting

### Emails not being sent

1. **Check logs**: Look in `storage/logs/laravel.log` for error messages
2. **Verify SMTP credentials**: Ensure username/password are correct
3. **Check firewall**: Port 587 or 465 must be open
4. **Queue worker**: Make sure `php artisan queue:work` is running if using queues

### Gmail "Less secure app" errors

Gmail no longer supports "less secure apps". You must:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `MAIL_PASSWORD`

### Mailtrap not receiving emails

1. Verify your Mailtrap credentials
2. Check you're logged into the correct Mailtrap inbox
3. Ensure `MAIL_HOST` is `smtp.mailtrap.io`

## Production Considerations

For production deployments:

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Set up SPF and DKIM records** for your domain
3. **Monitor email delivery rates**
4. **Use queue workers** to send emails asynchronously
5. **Set appropriate `FRONTEND_URL`** for correct links in emails

## Security Notes

- Never commit `.env` file to version control
- Use app passwords instead of main passwords
- Rotate SMTP credentials regularly
- Monitor for unauthorized email sends

## File Locations

- Email notification: `backend/app/Notifications/WelcomeEmail.php`
- Registration controller: `backend/app/Http/Controllers/AuthController.php`
- Mail config: `backend/config/mail.php`

## Testing the Full Flow

1. Start the Laravel server: `php artisan serve`
2. Start the frontend: `cd frontend && npm run dev`
3. Register a new account at `http://localhost:3000/register`
4. Check `storage/logs/laravel.log` (if using log driver) or your email service

The registration will:
- Validate email uniqueness ✓
- Reject weak passwords ✓
- Send confirmation email ✓

