<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeEmail extends Notification
{
    // Removed ShouldQueue to send emails immediately instead of queuing them

    private $userName;

    /**
     * Create a new notification instance.
     */
    public function __construct($userName)
    {
        $this->userName = $userName;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Welcome to Brewhub!')
                    ->greeting('Hello ' . $this->userName . '!')
                    ->line('Thank you for registering with Brewhub.')
                    ->line('Your account has been successfully created.')
                    ->line('You can now browse our delicious coffee selection and place orders.')
                    ->action('Start Ordering', url(env('FRONTEND_URL', 'http://localhost:3000') . '/menu'))
                    ->line('Thank you for choosing Brewhub!')
                    ->salutation('Cheers, The Brewhub Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

