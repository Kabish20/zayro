import React, { useState } from 'react';
import { 
  Briefcase, CheckCircle2, Calculator, MessageSquare, Phone 
} from 'lucide-react';
import { franchiseStats, franchiseModels, franchiseSupportPillars } from '../data/franchiseData';

export default function FranchiseView({ openFranchiseModal }) {
  // Interactive ROI Calculator State
  const [salonFormat, setSalonFormat] = useState('flagship'); // 'studio', 'flagship', 'luxe'
  const [dailyClients, setDailyClients] = useState(24);
  const [avgTicket, setAvgTicket] = useState(1400);

  const calculateROI = () => {
    const monthlyClients = dailyClients * 30;
    const monthlyGrossRevenue = monthlyClients * avgTicket;
    // Standard industry salon cost model:
    // Staff commissions/salaries: 32%
    // Consumables & products: 12%
    // Rent & utilities: 16%
    // Royalty: 10%
    // Marketing & misc: 5%
    // Net EBITDA margin: ~25%
    const monthlyEBITDA = monthlyGrossRevenue * 0.25;
    const annualEBITDA = monthlyEBITDA * 12;

    const baseInvestments = {
      studio: 3200000,
      flagship: 4800000,
      luxe: 7800000
    };
    const capEx = baseInvestments[salonFormat] || 4800000;
    const roiPercentage = ((annualEBITDA / capEx) * 100).toFixed(1);
    const paybackMonths = ((capEx / monthlyEBITDA)).toFixed(1);

    return {
      monthlyGrossRevenue: Math.round(monthlyGrossRevenue).toLocaleString('en-IN'),
      monthlyEBITDA: Math.round(monthlyEBITDA).toLocaleString('en-IN'),
      annualEBITDA: Math.round(annualEBITDA).toLocaleString('en-IN'),
      roiPercentage,
      paybackMonths
    };
  };

  const metrics = calculateROI();

  return (
    <div className="space-y-16 py-12">
      
      {/* 1. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A2719] rounded-3xl p-8 sm:p-14 text-white border border-[#E6B25C]/30 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#30452F] text-[#E6B25C] text-xs font-bold uppercase tracking-wider border border-[#E6B25C]/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Premier Men's Grooming Franchise Opportunity</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Build a High-Margin Grooming Business with <br />
                <span className="gold-gradient-text">ZAYRO Men's Grooming Lounge</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#9BB899] leading-relaxed max-w-xl">
                Enter the booming ₹35,000+ Crore men's grooming and wellness industry. Partner with ZAYRO to launch a turnkey luxury men's grooming lounge backed by 100% corporate operational management, certified barber academy, and proven 38% annual ROI.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={openFranchiseModal}
                  className="bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#30452F] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Submit Franchise Expression of Interest</span>
                </button>
                <a
                  href="https://wa.me/919150022115?text=Hello%20ZAYRO%20Team%2C%20I%20am%20interested%20in%20a%20ZAYRO%20Salon%20Franchise%20Opportunity."
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Franchise Director</span>
                </a>
              </div>
            </div>

            {/* Franchise Team / Flagship Visual */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#E6B25C]/30 shadow-2xl relative">
                <img
                  src="/images/franchise/indian_flagship.jpg"
                  alt="ZAYRO Flagship Salon Operations Board"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                  <span className="font-serif text-sm font-bold text-[#E6B25C] block">
                    Flagship Operations Board
                  </span>
                  <p className="text-[11px] text-[#9BB899]">
                    Full-stack operational support from site leasing to daily customer footfall
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY STATS METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {franchiseStats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E8DCB8] shadow-sm hover:border-[#E6B25C] transition-all text-center space-y-1"
            >
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F]">
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#30452F]">
                {stat.label}
              </p>
              <p className="text-[11px] text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FRANCHISE BUSINESS MODELS (FOCO vs FOFO vs LUXE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
            Flexible Partnership Structures
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F]">
            Choose Your Franchise Model
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Whether you seek passive quarterly dividends or active entrepreneurial ownership, ZAYRO has a tailored framework.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {franchiseModels.map((model) => (
            <div
              key={model.id}
              className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between border ${
                model.id === 'foco'
                  ? 'bg-[#30452F] text-white border-[#E6B25C] shadow-luxury ring-1 ring-[#E6B25C]'
                  : 'bg-white text-[#30452F] border-[#E8DCB8] shadow-sm hover:border-[#30452F]'
              }`}
            >
              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    model.id === 'foco'
                      ? 'bg-[#E6B25C] text-[#30452F]'
                      : 'bg-[#E8EFE8] text-[#30452F]'
                  }`}>
                    {model.badge}
                  </span>
                  <span className={`text-[11px] font-medium ${
                    model.id === 'foco' ? 'text-[#9BB899]' : 'text-gray-400'
                  }`}>
                    {model.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold">
                    {model.name}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    model.id === 'foco' ? 'text-[#9BB899]' : 'text-gray-500'
                  }`}>
                    {model.fullName}
                  </p>
                </div>

                {/* Investment & Metrics */}
                <div className={`p-4 rounded-xl space-y-2 text-xs ${
                  model.id === 'foco' ? 'bg-[#1A2719] border border-[#476346]' : 'bg-[#F5ECDE] border border-gray-100'
                }`}>
                  <div className="flex justify-between">
                    <span className={model.id === 'foco' ? 'text-[#9BB899]' : 'text-gray-500'}>Required Space:</span>
                    <span className="font-semibold">{model.spaceRequired}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={model.id === 'foco' ? 'text-[#9BB899]' : 'text-gray-500'}>Total Setup Capital:</span>
                    <span className="font-bold text-[#E6B25C]">{model.investment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={model.id === 'foco' ? 'text-[#9BB899]' : 'text-gray-500'}>Royalty:</span>
                    <span className="font-semibold">{model.royalty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={model.id === 'foco' ? 'text-[#9BB899]' : 'text-gray-500'}>Projected Payback:</span>
                    <span className="font-semibold">{model.projectedPayback}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    model.id === 'foco' ? 'text-[#E6B25C]' : 'text-[#30452F]'
                  }`}>
                    Included Corporate Deliverables:
                  </p>
                  <ul className="space-y-2">
                    {model.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          model.id === 'foco' ? 'text-[#E6B25C]' : 'text-[#30452F]'
                        }`} />
                        <span className={model.id === 'foco' ? 'text-[#F5ECDE]/90' : 'text-gray-700'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-8">
                <button
                  onClick={openFranchiseModal}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center shadow-md ${
                    model.id === 'foco'
                      ? 'bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#30452F]'
                      : 'bg-[#30452F] hover:bg-[#30452F] text-[#E6B25C] hover:text-white'
                  }`}
                >
                  Apply for {model.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE ROI & REVENUE ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DCB8] shadow-luxury">
          <div className="max-w-xl mb-8 space-y-2">
            <div className="flex items-center gap-2 text-[#30452F]">
              <Calculator className="w-5 h-5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Financial Projections</span>
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#30452F]">
              ZAYRO Franchise ROI Simulator
            </h3>
            <p className="text-xs text-gray-600">
              Adjust footfall and ticket size to project monthly cash flow and estimated capital recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Salon Format Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#30452F] mb-2">
                  Select Salon Scale
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSalonFormat('studio')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      salonFormat === 'studio'
                        ? 'bg-[#30452F] text-[#E6B25C] border-[#30452F]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Studio (1,000 sq ft)
                  </button>
                  <button
                    onClick={() => setSalonFormat('flagship')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      salonFormat === 'flagship'
                        ? 'bg-[#30452F] text-[#E6B25C] border-[#30452F]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Flagship (1,600 sq ft)
                  </button>
                  <button
                    onClick={() => setSalonFormat('luxe')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      salonFormat === 'luxe'
                        ? 'bg-[#30452F] text-[#E6B25C] border-[#30452F]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Luxe Lounge (2,500 sq ft)
                  </button>
                </div>
              </div>

              {/* Slider 1: Daily Clients */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-gray-700">Average Daily Clients</span>
                  <span className="font-serif font-bold text-lg text-[#30452F]">{dailyClients} Guests / Day</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="50"
                  step="2"
                  value={dailyClients}
                  onChange={(e) => setDailyClients(Number(e.target.value))}
                  className="w-full accent-[#30452F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>12 (Weekdays)</span>
                  <span>30 (Standard)</span>
                  <span>50 (Peak Metro)</span>
                </div>
              </div>

              {/* Slider 2: Average Ticket Value */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-gray-700">Average Spend Per Client</span>
                  <span className="font-serif font-bold text-lg text-[#30452F]">₹{avgTicket.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="3500"
                  step="100"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-[#30452F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>₹800 (Quick Grooming)</span>
                  <span>₹1,500 (Couture Cut + Cleanse)</span>
                  <span>₹3,500 (Royal Groom Suite / Spa)</span>
                </div>
              </div>
            </div>

            {/* Results Output Box */}
            <div className="lg:col-span-5 bg-[#1A2719] text-white p-6 sm:p-8 rounded-2xl border border-[#E6B25C]/40 space-y-4 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6B25C] block">
                Estimated Performance Summary
              </span>

              <div className="space-y-3 border-b border-[#476346] pb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9BB899]">Monthly Gross Revenue:</span>
                  <span className="font-serif font-bold text-base text-white">₹{metrics.monthlyGrossRevenue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9BB899]">Estimated Monthly EBITDA (25%):</span>
                  <span className="font-serif font-bold text-base text-[#E6B25C]">₹{metrics.monthlyEBITDA}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9BB899]">Annual Net Cashflow:</span>
                  <span className="font-serif font-bold text-base text-white">₹{metrics.annualEBITDA}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-[#30452F] p-3 rounded-xl border border-[#476346]">
                  <span className="text-[10px] text-[#9BB899] uppercase block font-semibold">Estimated ROI</span>
                  <span className="font-serif text-2xl font-bold text-[#E6B25C]">{metrics.roiPercentage}%</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Annualized Return</span>
                </div>
                <div className="bg-[#30452F] p-3 rounded-xl border border-[#476346]">
                  <span className="text-[10px] text-[#9BB899] uppercase block font-semibold">Est. Payback</span>
                  <span className="font-serif text-2xl font-bold text-white">{metrics.paybackMonths} Mo.</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Capital Recovery</span>
                </div>
              </div>

              <button
                onClick={openFranchiseModal}
                className="w-full mt-4 bg-gradient-to-r from-[#E6B25C] to-[#C9943B] hover:from-[#F3CF8A] hover:to-[#E6B25C] text-[#30452F] font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all text-center"
              >
                Request Confidential Financial Model
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 6 PILLARS OF CORPORATE SUPPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
            End-to-End Success Formula
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#30452F]">
            How ZAYRO Powers Your Salon
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            You are never alone. Our central leadership team oversees architecture, talent, supply chain, and footfall acquisition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {franchiseSupportPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E8DCB8] hover:border-[#E6B25C] shadow-sm hover:shadow-luxury transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE8] text-[#30452F] flex items-center justify-center font-serif font-bold text-base">
                0{idx + 1}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#30452F]">
                {pillar.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FRANCHISE APPLICATION CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="bg-[#F5ECDE] p-8 sm:p-12 rounded-3xl border border-[#E6B25C]/30 shadow-md space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#30452F] block">
            Confidential Inquiry
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#30452F]">
            Ready to Begin Your ZAYRO Journey?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Territories are allocated on a strictly first-come, catchment-protected basis. Connect with our corporate expansion team today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openFranchiseModal}
              className="w-full sm:w-auto bg-[#30452F] hover:bg-[#30452F] text-[#E6B25C] hover:text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all"
            >
              Open Franchise Application Form
            </button>
            <a
              href="tel:+919150022115"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 text-xs font-bold text-[#30452F] hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#30452F]" />
              <span>Contact Number: +91 91500 22115</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
