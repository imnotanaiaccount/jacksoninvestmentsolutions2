# jacksoninvestmentsolutions
Date: June 22, 2025 Client: Jackson Investment Solutions

# Automated Form Submission & CRM Integration

## How it Works

1. **User submits a form** on the website (contact, seller guide, or buyer guide).
2. **AJAX sends the data** to the Netlify Function at `/.netlify/functions/submit-to-n8n`.
3. **Netlify Function** forwards the data to your n8n webhook, including a `form-name` field to identify the form.
4. **n8n workflow** processes the data and sends it to Brevo CRM (and optionally sends emails, etc.).

## Environment Variables (Netlify)

Set the following in your Netlify site settings:
- `N8N_WEBHOOK_URL` = `https://YOUR_N8N_DOMAIN/webhook/your-workflow`

## n8n Workflow

- Import the workflow in `n8n/workflow-form-handler.json` into your n8n instance.
- Set up your Brevo API credentials in n8n.
- Adjust download links and email templates as needed.

## Adding/Updating Workflows

- Only keep the latest workflow JSON in `n8n/` to avoid confusion.
- Delete any old or unused workflow JSON files.

## Troubleshooting

- Ensure your n8n instance is accessible from Netlify (publicly or via secure tunnel).
- Check Netlify logs for function errors.
- Check n8n execution logs for workflow issues.
