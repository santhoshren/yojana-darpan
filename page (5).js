import Link from 'next/link';
import AdSlot from '@/components/AdSlot';

export const metadata = {
  title: 'Government Scheme News & Updates - YojanaDarpan',
  description: 'Latest news on Indian government schemes, new launches, eligibility updates, and application deadlines.',
};

// In production these would come from Supabase or Sanity CMS
const BLOG_POSTS = [
  {
    slug: 'pm-kisan-18th-installment-2024',
    title: 'PM Kisan 18th Installment: Check Date, Amount and How to Verify',
    excerpt: 'The 18th installment of PM Kisan Samman Nidhi is expected soon. Here is everything you need to know about eligibility, payment date, and how to check your status.',
    category: 'Agriculture',
    date: '2024-12-01',
    readTime: '3 min',
  },
  {
    slug: 'new-schemes-launched-2024',
    title: '10 New Government Schemes Launched in 2024 You Must Know About',
    excerpt: 'From PM Vishwakarma to Lakhpati Didi, 2024 saw several powerful new schemes. Here is your complete guide.',
    category: 'General',
    date: '2024-11-20',
    readTime: '6 min',
  },
  {
    slug: 'ayushman-bharat-coverage-2025',
    title: 'Ayushman Bharat Now Covers Senior Citizens Above 70 - How to Apply',
    excerpt: 'The government has expanded Ayushman Bharat PMJAY coverage to include all senior citizens aged 70 and above. Here is how to get your card.',
    category: 'Healthcare',
    date: '2024-11-10',
    readTime: '4 min',
  },
  {
    slug: 'mudra-loan-apply-guide',
    title: 'Complete Guide: How to Get PM Mudra Loan in 2024 (Step by Step)',
    excerpt: 'PM Mudra Yojana offers up to ₹10 lakh without collateral. This step-by-step guide helps you apply successfully.',
    category: 'Business',
    date: '2024-10-25',
    readTime: '8 min',
  },
  {
    slug: 'scholarship-deadlines-2024',
    title: 'NSP Scholarship 2024-25: Last Date, Eligibility & Application Process',
    excerpt: 'National Scholarship Portal deadline is approaching. Here is everything SC/ST/OBC students need to apply before the deadline.',
    category: 'Education',
    date: '2024-10-15',
    readTime: '5 min',
  },
  {
    slug: 'pm-awas-yojana-2024-status',
    title: 'PM Awas Yojana 2024: New Beneficiary List Released - Check Your Name',
    excerpt: 'The new PM Awas Yojana beneficiary list has been released. Here is how to check if your name is on the list and what to do next.',
    category: 'Housing',
    date: '2024-10-05',
    readTime: '4 min',
  },
];

const CATEGORY_COLORS = {
  Agriculture: 'bg-green-50 text-green-700',
  Healthcare: 'bg-red-50 text-red-700',
  Education: 'bg-blue-50 text-blue-700',
  Business: 'bg-purple-50 text-purple-700',
  Housing: 'bg-orange-50 text-orange-700',
  General: 'bg-gray-50 text-gray-700',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Scheme News & Updates</h1>
          <p className="text-gray-500">Stay updated on new schemes, deadlines, and policy changes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AdSlot type="LEADERBOARD" className="mb-8" />

        <div className="grid md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <>
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-saffron-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-50 text-gray-600'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.readTime} read</span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-saffron-600 leading-snug mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </Link>
              {(i + 1) % 4 === 0 && (
                <div key={`ad-${i}`} className="md:col-span-2">
                  <AdSlot type="LEADERBOARD" />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
