# Dart-OTP

### One-time codes, minus the SMS bill.

Dart-OTP helps apps verify users with one-time passcodes delivered through Telegram instead of SMS. It gives product teams a straightforward way to send and verify codes, while providing a workspace to manage credentials and keep an eye on OTP activity.

- **API:** [https://dart-otp.onrender.com](https://dart-otp.onrender.com)
- **Telegram bot:** [@dartotp_bot](https://t.me/dartotp_bot)

## Why Dart-OTP

- **A different delivery channel:** Deliver verification codes through Telegram rather than relying on SMS.
- **A clear integration path:** Use a small API surface to request, verify, and resend one-time codes.
- **A workspace for operations:** Manage API keys, message templates, delivery logs, and webhooks in one place.
- **Useful visibility:** Review OTP activity and usage from a single dashboard.

## Plans

| Plan | Monthly live OTP sends | Price per month |
| --- | ---: | ---: |
| Free | 100 | ₦0 |
| Starter | 1,000 | ₦2,500 |
| Growth | 5,000 | ₦7,500 |
| Pro | 10,000 | ₦15,000 |
| Business | 50,000 | ₦50,000 |

Test sends do not count toward live-send quotas. Paid plans are requested through [support](mailto:maou4rl@gmail.com); online checkout is not currently offered.

## How it works

1. Your application requests an OTP from Dart-OTP using a server-side API key.
2. Dart-OTP sends the code to the user through Telegram. Users may need to link their phone number with the Dart-OTP Telegram bot first.
3. Your application submits the code for verification and continues its sign-in or confirmation flow.

Keep API keys on your server. Never include a secret API key in browser code or a mobile app.

## Your Dart-OTP workspace

The workspace is designed to give each account control over its OTP setup:

- **Overview:** See send, verification, failure, and recent activity.
- **API keys:** Create and revoke credentials, including separate test keys.
- **Templates:** Manage the messages used for one-time codes.
- **Logs:** Review OTP events and filter recent activity.
- **Webhooks:** Configure event notifications for your own systems.
- **Settings:** View account and plan information.

## Built for developers

Dart-OTP is intended for websites and applications that need to confirm a phone number or protect an account action without making SMS the only delivery option. The service handles OTP delivery and verification; your application remains responsible for its own users, sessions, and authorization.

The [developer quickstart](/docs) covers test mode, sending, verifying, and resending OTPs, API responses, errors, and dashboard endpoints.

## Service information

The API is hosted at [https://dart-otp.onrender.com](https://dart-otp.onrender.com), with health information at [/health](https://dart-otp.onrender.com/health). End users receive codes through [@dartotp_bot](https://t.me/dartotp_bot) and must have a Telegram account to receive live OTPs.

For assistance or paid-plan requests, email [maou4rl@gmail.com](mailto:maou4rl@gmail.com). Read the [Terms of Service](/terms) and [Privacy Notice](/privacy) before using the service.

## License

Dart-OTP is proprietary software. See [LICENSE](./LICENSE) for the applicable terms.
