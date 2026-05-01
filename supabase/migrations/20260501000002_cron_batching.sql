-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Setup the cron job to call the Edge Function every hour to batch orders
-- In production, the URL will be the actual Supabase project Edge Function URL.
SELECT cron.schedule(
    'process-delivery-batches',
    '0 * * * *', -- Run at minute 0 past every hour
    $$
    SELECT net.http_post(
        url:='https://your-project-ref.supabase.co/functions/v1/schedule-batching',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
    $$
);
