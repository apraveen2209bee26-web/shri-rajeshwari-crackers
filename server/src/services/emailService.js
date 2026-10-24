import nodemailer from 'nodemailer';

let transporter;

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM,
  );

const getTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
};

const formatCurrency = (value = 0, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const formatPaymentProvider = (provider) => {
  if (provider === 'cod') {
    return 'Cash on Delivery';
  }

  if (provider === 'razorpay') {
    return 'Razorpay';
  }

  return provider || '--';
};

const formatLabel = (value) =>
  value
    ? value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : '--';

const buildAddressLines = (shippingAddress = {}) =>
  [
    shippingAddress.fullName,
    shippingAddress.phone,
    shippingAddress.line1,
    shippingAddress.line2,
    [shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(', '),
    shippingAddress.country,
    shippingAddress.landmark ? `Landmark: ${shippingAddress.landmark}` : null,
  ].filter(Boolean);

const buildOrderItemsHtml = (order) =>
  order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #f1dcc5;">${item.name}</td>
          <td style="padding:12px;border-bottom:1px solid #f1dcc5;text-align:center;">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #f1dcc5;text-align:right;">${formatCurrency(
            item.price,
            order.pricing.currency,
          )}</td>
          <td style="padding:12px;border-bottom:1px solid #f1dcc5;text-align:right;">${formatCurrency(
            item.subtotal,
            order.pricing.currency,
          )}</td>
        </tr>
      `,
    )
    .join('');

const buildOrderItemsText = (order) =>
  order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: ${formatCurrency(
          item.price,
          order.pricing.currency,
        )} | Subtotal: ${formatCurrency(item.subtotal, order.pricing.currency)}`,
    )
    .join('\n');

const buildOrderConfirmationEmail = ({ order, user }) => {
  const currency = order.pricing?.currency || 'INR';
  const supportName = process.env.STORE_SUPPORT_NAME || 'Cracker Shop Support';
  const supportEmail = process.env.STORE_SUPPORT_EMAIL || process.env.EMAIL_FROM;
  const supportPhone = process.env.STORE_SUPPORT_PHONE || 'Not provided';
  const shippingLines = buildAddressLines(order.shippingAddress);

  const subject = `Order Confirmation - ${order.orderNumber}`;

  const html = `
    <div style="margin:0;padding:24px;background:#fff8ef;font-family:Arial,sans-serif;color:#1d1d23;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #f7d6b5;border-radius:20px;overflow:hidden;">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#ffedd5 0%,#fff7ed 100%);border-bottom:1px solid #f7d6b5;">
          <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#c2410c;">Order Confirmation</p>
          <h1 style="margin:0;font-size:30px;line-height:1.2;">Thanks for your order, ${user.name}.</h1>
          <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#4b5563;">
            Your order has been received. Below is your bill, ordered items, and support contact details.
          </p>
        </div>

        <div style="padding:28px 32px;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
            <div style="padding:18px;border:1px solid #f3dfca;border-radius:16px;background:#fffaf5;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9a3412;">Order Info</p>
              <p style="margin:0 0 6px;"><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p style="margin:0 0 6px;"><strong>Order ID:</strong> ${order._id}</p>
              <p style="margin:0 0 6px;"><strong>Status:</strong> ${formatLabel(order.status)}</p>
              <p style="margin:0;"><strong>Payment:</strong> ${formatPaymentProvider(order.payment?.provider)} (${formatLabel(
                order.payment?.status,
              )})</p>
            </div>

            <div style="padding:18px;border:1px solid #f3dfca;border-radius:16px;background:#fffaf5;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9a3412;">Delivery Contact</p>
              ${shippingLines.map((line) => `<p style="margin:0 0 6px;">${line}</p>`).join('')}
            </div>
          </div>

          <div style="margin-top:24px;border:1px solid #f3dfca;border-radius:16px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;">
              <thead style="background:#fff4e6;">
                <tr>
                  <th style="padding:14px 12px;text-align:left;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7c2d12;">Item</th>
                  <th style="padding:14px 12px;text-align:center;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7c2d12;">Qty</th>
                  <th style="padding:14px 12px;text-align:right;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7c2d12;">Price</th>
                  <th style="padding:14px 12px;text-align:right;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#7c2d12;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${buildOrderItemsHtml(order)}
              </tbody>
            </table>
          </div>

          <div style="margin-top:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
            <div style="padding:18px;border:1px solid #f3dfca;border-radius:16px;background:#fffaf5;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9a3412;">Bill Summary</p>
              <p style="margin:0 0 6px;"><strong>Subtotal:</strong> ${formatCurrency(order.pricing.subtotal, currency)}</p>
              <p style="margin:0 0 6px;"><strong>Shipping:</strong> ${formatCurrency(order.pricing.shippingFee, currency)}</p>
              <p style="margin:0 0 6px;"><strong>Tax:</strong> ${formatCurrency(order.pricing.tax, currency)}</p>
              <p style="margin:12px 0 0;font-size:18px;"><strong>Total:</strong> ${formatCurrency(order.pricing.total, currency)}</p>
            </div>

            <div style="padding:18px;border:1px solid #f3dfca;border-radius:16px;background:#fffaf5;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9a3412;">Need Help?</p>
              <p style="margin:0 0 6px;"><strong>Contact:</strong> ${supportName}</p>
              <p style="margin:0 0 6px;"><strong>Email:</strong> ${supportEmail}</p>
              <p style="margin:0 0 6px;"><strong>Phone:</strong> ${supportPhone}</p>
              <p style="margin:12px 0 0;font-size:14px;color:#4b5563;">Keep your order number handy when contacting support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const text = `
Order Confirmation

Hello ${user.name},

Your order has been received successfully.

Order Number: ${order.orderNumber}
Order ID: ${order._id}
Order Status: ${formatLabel(order.status)}
Payment Method: ${formatPaymentProvider(order.payment?.provider)}
Payment Status: ${formatLabel(order.payment?.status)}

Ordered Items:
${buildOrderItemsText(order)}

Bill Summary:
Subtotal: ${formatCurrency(order.pricing.subtotal, currency)}
Shipping: ${formatCurrency(order.pricing.shippingFee, currency)}
Tax: ${formatCurrency(order.pricing.tax, currency)}
Total: ${formatCurrency(order.pricing.total, currency)}

Delivery Contact:
${shippingLines.join('\n')}

Support Contact:
${supportName}
Email: ${supportEmail}
Phone: ${supportPhone}
`.trim();

  return {
    subject,
    html,
    text,
  };
};

const sendOrderConfirmationEmail = async ({ order, user }) => {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    console.warn('Order email skipped because SMTP credentials are not configured');
    return {
      skipped: true,
      reason: 'email_not_configured',
    };
  }

  const { subject, html, text } = buildOrderConfirmationEmail({ order, user });

  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject,
    html,
    text,
  });

  return {
    skipped: false,
  };
};

export { isEmailConfigured, sendOrderConfirmationEmail };
