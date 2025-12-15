-- Add seller_profile JSONB column to market_listings
ALTER TABLE market_listings 
ADD COLUMN seller_profile JSONB;

-- Backfill existing listings with profile data
UPDATE market_listings ml
SET seller_profile = jsonb_build_object(
  'username', p.username,
  'display_name', p.display_name,
  'avatar_url', p.avatar_url,
  'verification_status', p.verification_status
)
FROM profiles p
WHERE ml.user_id = p.id;

-- Add comment for documentation
COMMENT ON COLUMN market_listings.seller_profile IS 'Denormalized profile data snapshot at time of listing creation';