"use client";
import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ThreatsPage() {
  const [selectedCity, setSelectedCity] = useState("Karachi");

  const getSeasonalAlert = () => {
    const month = new Date().getMonth();
    
    // Ramadan (March-April area)
    if (month >= 2 && month <= 3) {
      return {
        title: "Ramadan Alert 🌙",
        urdu: "Ramadan Mein Khabardar",
        threats: [
          "Fake Zakat collection scams",
          "Fake Eid prize/reward calls",
          "Fake charity organization voice notes",
          "Emotional manipulation using religion"
        ],
        risk: "HIGH"
      };
    }
    
    // Tax season June-July
    if (month >= 5 && month <= 6) {
      return {
        title: "Tax Season Alert 💼",
        urdu: "Tax Season Mein Khabardar",
        threats: [
          "Fake FBR tax refund calls",
          "FBR officer impersonation",
          "Fake tax clearance demands",
          "Threatening legal action voice notes"
        ],
        risk: "HIGH"
      };
    }
    
    // Back to school August
    if (month === 7) {
      return {
        title: "School Season Alert 🎓",
        urdu: "School Season Mein Khabardar",
        threats: [
          "Fake scholarship voice notes",
          "Fake university admission calls",
          "Fake fee waiver scams",
          "Education loan fraud calls"
        ],
        risk: "MODERATE"
      };
    }
    
    // October - current month
    if (month === 9) {
      return {
        title: "October Alert ⚠️",
        urdu: "Is Maheene Khabardar",
        threats: [
          "Courier delivery scams spiking",
          "Fake prize announcement calls",
          "Bank verification scam calls",
          "WhatsApp account takeover attempts"
        ],
        risk: "HIGH"
      };
    }
    
    // Default
    return {
      title: "Active Threats This Month",
      urdu: "Is Maheene Ke Khatray",
      threats: [
        "OTP sharing scam calls",
        "Government impersonation scams",
        "Fake delivery notification scams",
        "Health misinformation voice notes"
      ],
      risk: "MODERATE"
    };
  };

  const seasonalAlert = getSeasonalAlert();

  const cityData: Record<string, any> = {
    "Karachi": {
      activeScams: 3,
      topThreat: "Bank OTP Scam",
      reportsThisWeek: 234,
      riskLevel: "HIGH",
      urduAlert: "Karachi mein is hafte bank OTP scam bohot zyada hai"
    },
    "Lahore": {
      activeScams: 2,
      topThreat: "Courier Delivery Scam", 
      reportsThisWeek: 189,
      riskLevel: "HIGH",
      urduAlert: "Lahore mein courier scam ke cases barh rahe hain"
    },
    "Islamabad": {
      activeScams: 2,
      topThreat: "Government Impersonation",
      reportsThisWeek: 98,
      riskLevel: "MODERATE",
      urduAlert: "Islamabad mein government officer ban ke fraud ho raha hai"
    },
    "Rawalpindi": {
      activeScams: 2,
      topThreat: "Prize/Lottery Scam",
      reportsThisWeek: 87,
      riskLevel: "MODERATE",
      urduAlert: "Rawalpindi mein fake prize calls aa rahe hain"
    },
    "Faisalabad": {
      activeScams: 1,
      topThreat: "Health Misinformation",
      reportsThisWeek: 67,
      riskLevel: "MODERATE",
      urduAlert: "Faisalabad mein health fake khabren phail rahi hain"
    },
    "Multan": {
      activeScams: 1,
      topThreat: "Fake Scholarship Scam",
      reportsThisWeek: 45,
      riskLevel: "LOW",
      urduAlert: "Multan mein scholarship ke naam pe fraud ho raha hai"
    },
    "Peshawar": {
      activeScams: 2,
      topThreat: "WhatsApp Account Scam",
      reportsThisWeek: 56,
      riskLevel: "MODERATE",
      urduAlert: "Peshawar mein WhatsApp account hijack ho rahe hain"
    }
  };

  const cities = Object.keys(cityData);
  const currentCityData = cityData[selectedCity];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pakistan Threat Intelligence</h1>
          <p className="text-sm text-slate-400">Real-time scam & misinformation monitoring across Pakistan.</p>
        </div>
      </div>

      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-6">
        <h2 className="text-xl font-bold text-white">Mausami Khatray <span className="text-sm font-normal text-slate-400 ml-2">(Seasonal Threats)</span></h2>
        
        <div className={`p-6 rounded-2xl border ${seasonalAlert.risk === 'HIGH' ? 'bg-gradient-to-br from-red-900/40 to-orange-900/20 border-red-500/30' : 'bg-gradient-to-br from-yellow-900/40 to-amber-900/20 border-yellow-500/30'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{seasonalAlert.title}</h3>
              <p className={`text-sm font-medium ${seasonalAlert.risk === 'HIGH' ? 'text-red-400' : 'text-yellow-400'}`}>{seasonalAlert.urdu}</p>
            </div>
            <div className={`px-3 py-1 text-xs font-bold rounded-full border ${seasonalAlert.risk === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
              {seasonalAlert.risk} RISK
            </div>
          </div>
          
          <ul className="space-y-2 mb-6">
            {seasonalAlert.threats.map((threat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                <AlertTriangle size={14} className={seasonalAlert.risk === 'HIGH' ? 'text-red-400' : 'text-yellow-400'} /> {threat}
              </li>
            ))}
          </ul>
          
          <Link href="/investigate" className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${seasonalAlert.risk === 'HIGH' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}>
            Is mahine SONA se check karein <ArrowRight size={14}/>
          </Link>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="space-y-6">
        <h2 className="text-xl font-bold text-white">Apne Shehar Ka Haal <span className="text-sm font-normal text-slate-400 ml-2">(Your City's Situation)</span></h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {cities.map(city => (
            <button 
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCity === city ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="glass-panel p-6 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">{selectedCity} 🇵🇰</h3>
            <div className={`px-3 py-1 text-xs font-bold rounded-full border ${currentCityData.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' : currentCityData.riskLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
              {currentCityData.riskLevel} RISK
            </div>
          </div>
          
          <p className="text-lg font-medium text-white/90 mb-6 bg-white/5 p-4 rounded-lg border border-white/5 relative z-10">
            "{currentCityData.urduAlert}"
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Active Scams</p>
              <p className="text-xl font-bold text-white">{currentCityData.activeScams} this week</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Top Threat</p>
              <p className="text-sm font-bold text-white">{currentCityData.topThreat}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Reports</p>
              <p className="text-xl font-bold text-white">{currentCityData.reportsThisWeek}</p>
            </div>
          </div>
          
          <div className="relative z-10">
            <Link href="/investigate" className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 rounded-lg text-sm font-bold bg-primary hover:bg-primary-light text-white transition-colors">
              Apne shehar ka audio check karein <ArrowRight size={16}/>
            </Link>
          </div>

          <div className="absolute -bottom-10 -right-10 text-9xl opacity-5 pointer-events-none">
            🇵🇰
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 justify-center">
          <Info size={14} />
          <span>⚠️ Ye demo data hai. Real deployment mein actual investigation data use hoga.</span>
        </div>
      </motion.div>
    </div>
  );
}
