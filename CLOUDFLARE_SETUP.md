# Cloudflare Production Setup

To deploy Totelink to production, ensure the following resources are configured in your Cloudflare account.

## D1 Database
1.  **Create Database**:
    ```bash
    npx wrangler d1 create totelink-db
    ```
    This will output a `database_id`.

2.  **Update `wrangler.jsonc`**:
    Ensure the `database_id` in your `wrangler.jsonc` matches the production database ID if it differs from your preview/dev ID.

3.  **Apply Schema**:
    ```bash
    npx wrangler d1 execute totelink-db --remote --file=./schema.sql
    ```

## R2 Bucket
1.  **Create Bucket**:
    ```bash
    npx wrangler r2 bucket create totelink-images
    ```

2.  **Verify Binding**:
    Ensure `wrangler.jsonc` contains the correct binding:
    ```jsonc
    // ...
    "r2_buckets": [
      {
        "binding": "IMAGES",
        "bucket_name": "totelink-images"
      }
    ]
    ```

## Environment Variables
If your application uses specific environment variables (e.g., for authentication salts or other secrets), verify they are set in the Cloudflare Dashboard under **Settings > Variables and Secrets** or using wrangler:
```bash
npx wrangler secret put SECRET_NAME
```

## Deployment
To deploy manually:
```bash
npm run deploy
```
Which runs `tsc -b && vite build && wrangler deploy`.
