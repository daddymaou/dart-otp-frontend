# Dart-OTP

### One-time codes, minus the SMS bill.

Dart-OTP helps apps verify users with one-time passcodes delivered through Telegram instead of SMS. It gives product teams a straightforward way to send and verify codes, while providing a workspace to manage credentials and keep an eye on OTP activity.

## Why Dart-OTP

- **A different delivery channel:** Deliver verification codes through Telegram rather than relying on SMS.
- **A clear integration path:** Use a small API surface to request, verify, and resend one-time codes.
- **A workspace for operations:** Manage API keys, message templates, delivery logs, and webhooks in one place.
- **Useful visibility:** Review OTP activity and usage from a single dashboard.

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

The API includes endpoints for sending, verifying, and resending codes, along with account and workspace operations. The `/docs` page in this project is still a placeholder; complete public API documentation and confirmed production limits should be published before general availability.

## Product status

This repository contains the customer-facing website and workspace interface. Features shown in the interface depend on the companion Dart-OTP API being available and configured. Pricing shown in the product interface is not a final offer, and legal pages must be reviewed before launch.

## License

Dart-OTP is proprietary software. See [LICENSE](./LICENSE) for the applicable terms.
