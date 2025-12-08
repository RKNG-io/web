# Environment Variables

Required environment variables for the Reckoning project.

---

## Currently Active

### Database
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

### Authentication
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth.js sessions |
| `NEXTAUTH_URL` | Yes | Base URL for auth callbacks |

### AI Generation
| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for content generation |

### Email (Resend)
| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | No | Resend API key (dev mode logs if missing) |
| `RESEND_FROM_EMAIL` | No | Sender address (default: `Reckoning <hello@rkng.com>`) |
| `ADMIN_EMAIL` | No | Admin notification address (default: `hello@rkng.com`) |

### Payments (Stripe)
| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes* | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes* | Stripe publishable key (client-side) |
| `STRIPE_WEBHOOK_SECRET` | Yes* | Webhook signing secret |

*Required for checkout to work

### App Config
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | No | Base URL (default: `http://localhost:3000`) |

---

## Planned (Website Builder - NOT YET IMPLEMENTED)

### AWS S3 (for client logo/image uploads in Website Builder)
| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_ACCESS_KEY_ID` | Yes | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | AWS secret key |
| `AWS_REGION` | No | AWS region (default: `eu-west-2`) |
| `S3_BUCKET_NAME` | Yes | Bucket for asset uploads |

### Vercel (for deploying generated client websites)
| Variable | Required | Description |
|----------|----------|-------------|
| `VERCEL_TOKEN` | Yes | Vercel API token |
| `VERCEL_TEAM_ID` | No | Team ID (if using team account) |

---

## Local Development

```env
# Minimal .env.local for development
DATABASE_URL=postgresql://liz:localdev@localhost:5432/dev
NEXTAUTH_SECRET=dev-secret-change-in-prod
NEXTAUTH_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-...

# Optional - will use dev mode fallbacks if missing
# RESEND_API_KEY=
# STRIPE_SECRET_KEY=
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## Notes

- Missing optional vars trigger dev-friendly fallbacks (logging instead of sending)
- Never commit `.env` files
- Production values in Vercel/deployment platform
