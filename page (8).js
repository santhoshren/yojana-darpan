'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, IndianRupee, Download } from 'lucide-react';
import SchemeCard from '@/components/SchemeCard';
import AdSlot from '@/components/AdSlot';
import { STATES, OCCUPATIONS } from '@/data/schemes';
import { matchSchemes, calculateTotalBenefit, groupByCategory } from '@/lib/eligibility';

const TOTAL_STEPS = 4;

const DEFAULT_PROFILE = {
  age: '',
  gender: '',
  state: '',
  occupation: '',
  annualIncome: '',
  category: '',
  hasBPL: false,
  hasLand: false,
  landAcres: 0,
  noOwnHouse: false,
  hasDisability: false,
  isMinority: false,
  hasChildren: false,
};

export default function FindPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [results, setResults] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  function update(key, value) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function handleNext() {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else findSchemes();
  }

  function findSchemes() {
    const matched = matchSchemes(profile);
    setResults(matched);
    setStep(5); // Show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    setProfile(DEFAULT_PROFILE);
    setStep(1);
    setResults(null);
  }

  // ── Progress bar
  const progress = step <= TOTAL_STEPS ? ((step - 1) / TOTAL_STEPS) * 100 : 100;

  // ── Filter results by category
  const categories = results
    ? ['All', ...new Set(results.map((s) => s.category))]
    : [];

  const filteredResults = results?.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  const totalBenefit = results ? calculateTotalBenefit(results) : 0;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Progress */}
      {step <= TOTAL_STEPS && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step {step} of {TOTAL_STEPS}</span>
              <span className="text-sm text-saffron-500 font-medium">{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-saffron-500 rounded-full progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* ── STEP 1: Personal Info */}
        {step === 1 && (
          <FormStep
            title="Tell us about yourself"
            subtitle="Basic personal information — no documents needed"
            onNext={handleNext}
            isValid={profile.age && profile.gender && profile.state}
          >
            <div className="grid gap-5">
              <FormField label="Your Age">
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => update('age', e.target.value)}
                  placeholder="e.g. 32"
                  min="1" max="100"
                  className="form-input"
                />
              </FormField>

              <FormField label="Gender">
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => update('gender', g)}
                      className={`py-2.5 rounded-lg border text-sm font-medium capitalize transition-all ${
                        profile.gender === g
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-saffron-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label="State / UT">
                <select
                  value={profile.state}
                  onChange={(e) => update('state', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select your state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </FormStep>
        )}

        {/* ── STEP 2: Economic Profile */}
        {step === 2 && (
          <FormStep
            title="Your economic profile"
            subtitle="This helps us find financial assistance schemes"
            onNext={handleNext}
            onBack={() => setStep(1)}
            isValid={profile.annualIncome !== ''}
          >
            <div className="grid gap-5">
              <FormField label={`Annual Family Income: ₹${Number(profile.annualIncome || 0).toLocaleString('en-IN')}`}>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="10000"
                  value={profile.annualIncome || 0}
                  onChange={(e) => update('annualIncome', e.target.value)}
                  className="w-full accent-saffron-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹0</span>
                  <span>₹5L</span>
                  <span>₹10L</span>
                  <span>₹20L+</span>
                </div>
              </FormField>

              <FormField label="Do you have a BPL (Below Poverty Line) Card?">
                <div className="grid grid-cols-2 gap-3">
                  {[['Yes', true], ['No', false]].map(([label, val]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => update('hasBPL', val)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        profile.hasBPL === val
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-saffron-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label="Do you own agricultural land?">
                <div className="grid grid-cols-2 gap-3">
                  {[['Yes', true], ['No', false]].map(([label, val]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => update('hasLand', val)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        profile.hasLand === val
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-saffron-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormField>

              {profile.hasLand && (
                <FormField label="Land area (in acres)">
                  <input
                    type="number"
                    value={profile.landAcres}
                    onChange={(e) => update('landAcres', e.target.value)}
                    placeholder="e.g. 2"
                    min="0"
                    step="0.5"
                    className="form-input"
                  />
                </FormField>
              )}

              <FormField label="Do you own a pucca house?">
                <div className="grid grid-cols-2 gap-3">
                  {[['No (I need housing)', true], ['Yes', false]].map(([label, val]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => update('noOwnHouse', val)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        profile.noOwnHouse === val
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-saffron-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
          </FormStep>
        )}

        {/* ── STEP 3: Occupation & Category */}
        {step === 3 && (
          <FormStep
            title="Occupation & community"
            subtitle="Determines which sector schemes apply to you"
            onNext={handleNext}
            onBack={() => setStep(2)}
            isValid={profile.occupation && profile.category}
          >
            <div className="grid gap-5">
              <FormField label="Your Occupation">
                <select
                  value={profile.occupation}
                  onChange={(e) => update('occupation', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select occupation</option>
                  {OCCUPATIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Social Category">
                <div className="grid grid-cols-4 gap-2">
                  {['GEN', 'OBC', 'SC', 'ST'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => update('category', c)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        profile.category === c
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-saffron-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </FormField>

              <FormField label="Minority Religion?">
                <div className="grid grid-cols-2 gap-3">
                  {[['Yes', true], ['No', false]].map(([label, val]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => update('isMinority', val)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        profile.isMinority === val
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-saffron-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
          </FormStep>
        )}

        {/* ── STEP 4: Special Situations */}
        {step === 4 && (
          <FormStep
            title="Any special situations?"
            subtitle="These unlock additional schemes"
            onNext={findSchemes}
            onBack={() => setStep(3)}
            nextLabel="Find My Schemes →"
            isValid={true}
          >
            <div className="grid gap-3">
              {[
                { key: 'hasChildren', label: '🎒 Have school-going children' },
                { key: 'hasDisability', label: '♿ Person with disability in family' },
                { key: 'isMinority', label: '🕌 Belong to minority religion' },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    profile[item.key]
                      ? 'bg-saffron-50 border-saffron-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={profile[item.key] || false}
                    onChange={(e) => update(item.key, e.target.checked)}
                    className="accent-saffron-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-800">{item.label}</span>
                </label>
              ))}
            </div>
          </FormStep>
        )}

        {/* ── RESULTS */}
        {step === 5 && results && (
          <div>
            {/* Summary */}
            <div className="bg-forest-500 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Eligibility check complete!</span>
              </div>
              <h2 className="text-3xl font-bold mb-1">
                You qualify for {results.length} schemes
              </h2>
              <p className="text-green-100 text-sm">
                Combined benefit potential: ₹{(totalBenefit / 100000).toFixed(1)} Lakh+
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={restart}
                  className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
                >
                  Start Over
                </button>
                <Link
                  href="/find"
                  className="text-sm bg-saffron-500 hover:bg-saffron-600 px-4 py-2 rounded-lg"
                >
                  Share Results
                </Link>
              </div>
            </div>

            {/* Ad */}
            <AdSlot type="LEADERBOARD" className="mb-6" />

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'bg-saffron-500 text-white border-saffron-500'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-saffron-300'
                  }`}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-1 text-xs opacity-70">
                      ({results.filter((s) => s.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Scheme grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {filteredResults.map((scheme, i) => (
                <>
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    matchReasons={scheme.matchReasons}
                  />
                  {(i + 1) % 4 === 0 && (
                    <div key={`ad-${i}`} className="sm:col-span-2">
                      <AdSlot type="RECTANGLE" />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable step wrapper ────────────────────────────────────
function FormStep({ title, subtitle, children, onNext, onBack, isValid, nextLabel = 'Continue →' }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      <p className="text-gray-500 mb-8 text-sm">{subtitle}</p>
      <div className="mb-8">{children}</div>
      <div className="flex gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-600 bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl transition-colors"
        >
          {nextLabel} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Form field wrapper ───────────────────────────────────────
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
