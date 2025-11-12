import { NextResponse } from "next/server";
import { headers } from "next/headers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      
      // Send confirmation email
      await sendConfirmationEmail({
        email: session.customer_email,
        planName: session.metadata.planName,
        amount: session.amount_total / 100,
        currency: session.currency.toUpperCase(),
      });
      
      console.log("Payment successful for:", session.customer_email);
      break;

    case "customer.subscription.created":
      const subscription = event.data.object;
      console.log("Subscription created:", subscription.id);
      break;

    case "customer.subscription.updated":
      const updatedSubscription = event.data.object;
      console.log("Subscription updated:", updatedSubscription.id);
      break;

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object;
      console.log("Subscription deleted:", deletedSubscription.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Email sending function
async function sendConfirmationEmail(data: {
  email: string;
  planName: string;
  amount: number;
  currency: string;
}) {
  // Using a simple email service - you can integrate with SendGrid, Resend, or any email service
  
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff7a00 0%, #ff9b3e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #ff7a00; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Successful! 🎉</h1>
        </div>
        <div class="content">
          <h2>Thank you for your subscription!</h2>
          <p>Your payment has been successfully processed.</p>
          
          <h3>Subscription Details:</h3>
          <ul>
            <li><strong>Plan:</strong> ${data.planName}</li>
            <li><strong>Amount:</strong> ${data.currency} ${data.amount}</li>
            <li><strong>Email:</strong> ${data.email}</li>
          </ul>
          
          <p>You now have full access to all features included in your plan.</p>
          
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Go to Dashboard</a>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            If you have any questions, please don't hesitate to contact our support team.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TestSprite. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Example using fetch to send email via an API
    // Replace this with your actual email service (SendGrid, Resend, etc.)
    
    // For now, just log it (you need to implement actual email sending)
    console.log("Sending email to:", data.email);
    console.log("Email content prepared");
    
    // TODO: Implement actual email sending
    // Example with SendGrid:
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: data.email }],
          subject: 'Payment Successful - Welcome to TestSprite!',
        }],
        from: { email: 'noreply@yourdomain.com', name: 'TestSprite' },
        content: [{ type: 'text/html', value: emailContent }],
      }),
    });
    */
    
    // For development, Stripe will send automatic receipts
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
