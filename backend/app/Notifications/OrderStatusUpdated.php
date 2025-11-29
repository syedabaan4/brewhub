<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusUpdated extends Notification
{
    private Order $order;
    private string $previousStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, string $previousStatus)
    {
        $this->order = $order;
        $this->previousStatus = $previousStatus;
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
        $statusMessage = $this->getStatusMessage();
        $emoji = $this->getStatusEmoji();

        $mailMessage = (new MailMessage)
            ->subject($emoji . ' Order Update - ' . $this->order->order_number)
            ->greeting('Hello ' . $this->order->customer_name . '!')
            ->line('Your order status has been updated.')
            ->line('')
            ->line('**Order Number:** ' . $this->order->order_number)
            ->line('**New Status:** ' . $this->order->status_display)
            ->line('')
            ->line($statusMessage);

        // Add ETA if available and order is not completed/cancelled
        if ($this->order->estimated_completion_time && 
            !in_array($this->order->status, [Order::STATUS_COMPLETED, Order::STATUS_CANCELLED])) {
            $eta = $this->order->estimated_completion_time->format('g:i A');
            $mailMessage->line('**Estimated Ready Time:** ' . $eta);
        }

        $mailMessage
            ->line('')
            ->line('Thank you for choosing Brewhub!')
            ->salutation('The Brewhub Team');

        return $mailMessage;
    }

    /**
     * Get status-specific message.
     */
    private function getStatusMessage(): string
    {
        return match($this->order->status) {
            Order::STATUS_RECEIVED => 'We have received your order and it will be prepared shortly.',
            Order::STATUS_PREPARING => 'Our baristas are now preparing your order with care.',
            Order::STATUS_READY_FOR_PICKUP => 'Great news! Your order is ready for pickup. Please come to the counter.',
            Order::STATUS_COMPLETED => 'Your order has been completed. We hope you enjoyed it!',
            Order::STATUS_CANCELLED => 'Your order has been cancelled. If you have questions, please contact us.',
            default => 'Your order status has been updated.',
        };
    }

    /**
     * Get status-specific emoji.
     */
    private function getStatusEmoji(): string
    {
        return match($this->order->status) {
            Order::STATUS_RECEIVED => '📋',
            Order::STATUS_PREPARING => '☕',
            Order::STATUS_READY_FOR_PICKUP => '🔔',
            Order::STATUS_COMPLETED => '✅',
            Order::STATUS_CANCELLED => '❌',
            default => '📢',
        };
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->_id,
            'order_number' => $this->order->order_number,
            'status' => $this->order->status,
            'previous_status' => $this->previousStatus,
        ];
    }
}

