-- Insert demo market listings with various types and conditions
-- Commented out: Requires users to exist first. Uncomment and run after creating test users.
/*
INSERT INTO public.market_listings (
  user_id,
  listing_type,
  linked_item_id,
  title,
  description,
  price,
  condition,
  location,
  shipping_available,
  images,
  status
) VALUES
-- Wheel listings
(
  (SELECT id FROM auth.users LIMIT 1),
  'wheel',
  1,
  'BBS CH-R 19" Wheels - Mint Condition',
  'Selling my pristine BBS CH-R wheels. Used for only 3,000 miles, no curb rash or damage. Comes with original boxes and certificates.',
  3500.00,
  'like-new',
  'Los Angeles, CA',
  true,
  ARRAY['https://images.unsplash.com/photo-1651788877171-5ee4b43d7e25?w=800'],
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'wheel',
  2,
  'Volk TE37 Bronze Edition - Set of 4',
  'Authentic Volk Racing TE37 in limited bronze colorway. 18x9.5 +38 offset. Perfect for track enthusiasts.',
  4200.00,
  'good',
  'San Francisco, CA',
  true,
  ARRAY['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'],
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'wheel',
  3,
  'Work Meister S1 3P - Custom Specs',
  'Custom ordered Work Meister S1 3-piece wheels. Can be rebuilt to your specs. Rare discontinued model.',
  5800.00,
  'new',
  'Miami, FL',
  false,
  ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293100?w=800'],
  'active'
),

-- Vehicle listings
(
  (SELECT id FROM auth.users LIMIT 1),
  'vehicle',
  1,
  '2020 BMW M3 Competition - Low Miles',
  'Immaculate M3 Competition with only 8,500 miles. Full PPF, ceramic coating, and all service records.',
  89500.00,
  'like-new',
  'Phoenix, AZ',
  false,
  ARRAY['https://images.unsplash.com/photo-1555215858-9dc80cd8e679?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'vehicle',
  2,
  '1995 Nissan Skyline GT-R V-Spec',
  'JDM legend freshly imported. 67,000 km, stock engine, light modifications. All import paperwork included.',
  125000.00,
  'good',
  'Seattle, WA',
  false,
  ARRAY['https://images.unsplash.com/photo-1584060622420-0673aad46076?w=800'],
  'active'
),

-- Parts listings
(
  (SELECT id FROM auth.users LIMIT 1),
  'parts',
  0,
  'Brembo GT Big Brake Kit - 6 Piston',
  'Brand new Brembo GT kit with 380mm rotors. Fits most BMW F80/F82 models. Never installed.',
  4500.00,
  'new',
  'Dallas, TX',
  true,
  ARRAY['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800'],
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'parts',
  0,
  'KW V3 Coilovers - Used 1 Season',
  'KW Variant 3 coilovers, used for one track season. Recently rebuilt by KW. Excellent condition.',
  2200.00,
  'good',
  'Atlanta, GA',
  true,
  ARRAY['https://images.unsplash.com/photo-1609784341225-4fdab5c46164?w=800'],
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'parts',
  0,
  'Recaro Sportster CS Seats - Pair',
  'Genuine Recaro Sportster CS in black leather with red stitching. No tears or excessive wear.',
  3200.00,
  'good',
  'Chicago, IL',
  false,
  NULL,
  'active'
),

-- More wheel listings with varying conditions
(
  (SELECT id FROM auth.users LIMIT 1),
  'wheel',
  4,
  'Enkei RPF1 - Track Day Special',
  'Set of 4 Enkei RPF1s, some cosmetic wear from track use but structurally perfect. Priced to sell quickly.',
  1200.00,
  'fair',
  'Las Vegas, NV',
  true,
  NULL,
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'wheel',
  5,
  'HRE P101 Forged Wheels - Show Quality',
  'Custom HRE P101 in brushed titanium. Show quality, never tracked. Includes custom center caps.',
  8500.00,
  'new',
  'New York, NY',
  false,
  ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'],
  'active'
);
*/