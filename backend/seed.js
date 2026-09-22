import { supabase } from './supabaseClient.js';

const mockSubmissions = [
  {
    domain: 'booking.com',
    target_url: 'https://booking.com/hotel-example',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    pattern_type: 'false_urgency',
    severity: 4,
    confidence: 0.95,
    explanation: 'Prominently displays "Only 1 room left at this price!" alongside a fake high-pressure real-time views counter to rush user booking decisions.',
    upvotes: 14,
    downvotes: 1,
  },
  {
    domain: 'amazon.com',
    target_url: 'https://amazon.com/checkout',
    image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    pattern_type: 'prechecked_boxes',
    severity: 3,
    confidence: 0.92,
    explanation: 'Automatically pre-selects a recurring monthly Prime membership option at checkout without explicit user selection.',
    upvotes: 22,
    downvotes: 2,
  },
  {
    domain: 'nytimes.com',
    target_url: 'https://nytimes.com/subscription',
    image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    pattern_type: 'roach_motel',
    severity: 5,
    confidence: 0.98,
    explanation: 'Allows 1-click online subscription sign-up, but forces subscribers to call a phone hotline during strict business hours to cancel.',
    upvotes: 35,
    downvotes: 0,
  },
  {
    domain: 'ryanair.com',
    target_url: 'https://ryanair.com/flights',
    image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    pattern_type: 'drip_pricing',
    severity: 4,
    confidence: 0.89,
    explanation: 'Displays a cheap base flight fare initially, then continuously inflates the total cost with mandatory seat selection and carry-on luggage fees at later checkout stages.',
    upvotes: 19,
    downvotes: 1,
  },
  {
    domain: 'linkedin.com',
    target_url: 'https://linkedin.com/premium',
    image_url: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800',
    pattern_type: 'confirmshaming',
    severity: 2,
    confidence: 0.91,
    explanation: 'Opt-out button is labeled "No thanks, I do not want to grow my career" to guilt users into trying a Premium subscription.',
    upvotes: 11,
    downvotes: 3,
  },
  {
    domain: 'adobe.com',
    target_url: 'https://adobe.com/plans',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    pattern_type: 'forced_continuity',
    severity: 5,
    confidence: 0.96,
    explanation: 'Buries an expensive early termination fee in fine print for annual plans billed monthly when users attempt to cancel.',
    upvotes: 28,
    downvotes: 0,
  },
  {
    domain: 'godaddy.com',
    target_url: 'https://godaddy.com/cart',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    pattern_type: 'subtle_upsell',
    severity: 3,
    confidence: 0.88,
    explanation: 'Automatically adds domain privacy protection and email hosting add-ons directly to the shopping cart without user consent.',
    upvotes: 16,
    downvotes: 2,
  },
  {
    domain: 'wish.com',
    target_url: 'https://wish.com/product',
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    pattern_type: 'visual_interference',
    severity: 3,
    confidence: 0.87,
    explanation: 'Makes the option to reject marketing tracking cookies practically invisible using low-contrast light grey text on a white background.',
    upvotes: 8,
    downvotes: 1,
  },
];

async function seedDatabase() {
  console.log('🌱 Seeding database with dark pattern examples...');

  const { data, error } = await supabase.from('submissions').insert(mockSubmissions).select();

  if (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${data.length} submissions!`);
  process.exit(0);
}

seedDatabase();