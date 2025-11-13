<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmation extends Notification
{
    private $order;

    /**
     * Create a new notification instance.
     */
    public function __construct($order)
    {
        $this->order = $order;
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
        $mailMessage = (new MailMessage)
            ->subject('Order Confirmation - ' . $this->order->order_number)
            ->greeting('Hello ' . $this->order->customer_name . '!')
            ->line('Thank you for your order at Brewhub!')
            ->line('Your order has been confirmed and is being prepared.')
            ->line('')
            ->line('**Order Number:** ' . $this->order->order_number)
            ->line('**Total Amount:** $' . number_format($this->order->total_price, 2))
            ->line('')
            ->line('**Order Summary:**');

        // Add order items
        foreach ($this->order->items as $item) {
            $itemTotal = $item['price'] * $item['quantity'];
            $mailMessage->line('• ' . $item['quantity'] . 'x ' . ($item['product_name'] ?? 'Item') . ' - $' . number_format($itemTotal, 2));
        }

        $mailMessage
            ->line('')
            ->line('**Contact Information:**')
            ->line('Email: ' . $this->order->customer_email)
            ->line('Phone: ' . $this->order->customer_phone)
            ->line('')
            ->line('This is a pickup order. We will notify you when your order is ready for pickup.')
            ->line('If you have any questions, please contact us at ' . config('mail.from.address'))
            ->salutation('Thank you for choosing Brewhub!');

        return $mailMessage;
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

