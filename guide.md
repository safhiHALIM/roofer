# Roofer Univers — SMTP & JWT Quick Setup Guide

Use this to get email verification working and keep JWTs secure in each environment.

## 1) Environment variables (backend/.env)

Required keys:
```
JWT_SECRET=                           # 32+ random chars, keep secret
JWT_EXPIRES_IN=7d                    # token lifetime (e.g., 15m, 7d)

SMTP_HOST=                           # smtp host or "console" for local
SMTP_PORT=                           # 465 (SSL) or 587 (STARTTLS) or 1025 for MailHog
SMTP_USER=                           # SMTP username
SMTP_PASS=                           # SMTP password
EMAIL_FROM=                          # From email, e.g. noreply@roofer-univers.com

FRONTEND_URL=                        # e.g. http://localhost:3000
BACKEND_URL=                         # e.g. http://localhost:4000
```

## 2) Generate a strong JWT secret
PowerShell:
```
[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')
```
or Node:
```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Paste into `JWT_SECRET` (>=32 chars).

## 3) SMTP options

### Local development (no real emails)
```
SMTP_HOST=console
SMTP_PORT=0
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@roofer-univers.test
```
Behavior: emails are logged to the backend console with the verification link. No network calls.

### MailHog (local catcher)
Start MailHog:
```
docker run -d --name mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog
```
Env:
```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@roofer-univers.test
```
Check inbox at http://localhost:8025.

### Production (real SMTP)
Typical values:
```
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587            # or 465 if SSL
SMTP_USER=apikey_or_user
SMTP_PASS=supersecret
EMAIL_FROM=noreply@your-domain.com
```
Notes:
- Use a domain you control; set SPF/DKIM/DMARC to improve deliverability.
- If using 465, set `secure: true` in transport. Current code uses `secure: false`; switching to SSL is fine because most providers support STARTTLS on 587. If you must use 465, update the transporter accordingly.

## 4) Verify env is loaded
Backend uses Zod validation at startup. If a key is missing/short, the app will exit with a clear error. Restart backend after edits:
```
cd backend
npm run start:dev
```

## 5) Test the flow
1. Start backend + frontend.
2. Register on `/register`.
3. For `console` mode: copy verification link from backend logs.
4. For MailHog: open http://localhost:8025 and click the link.
5. Then log in; only verified users receive JWTs.

## 6) Common issues
- “String must contain at least 32 characters” → `JWT_SECRET` too short.
- SMTP auth errors → wrong `SMTP_USER`/`SMTP_PASS` or port.
- No email received → using `console` mode (normal), or SMTP blocked by firewall, or missing DNS records (SPF/DKIM/DMARC) in prod.

Keep secrets out of version control. For production, store them in your VPS secrets manager or `.env` with restricted permissions.
