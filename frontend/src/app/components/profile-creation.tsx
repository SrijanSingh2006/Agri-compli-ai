import React, { useState } from 'react';
import { Save, Edit2, CheckCircle2, Building2, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileCreation() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    businessName: 'Srijan Tech Ventures',
    businessType: 'Private Limited',
    businessSize: 'Small (10-50 employees)',
    location: 'Bangalore, India',
    industry: 'Software Development',
    registrationDate: '2023-05-12'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-blue-600 h-32 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center">
            <Building2 size={40} className="text-blue-600" />
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile.businessName}</h2>
              <p className="text-slate-500">Business Profile & Verification</p>
            </div>
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Save size={18} /> Save Changes
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
              >
                <Edit2 size={18} /> Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1.5 block">Business Type</label>
                {isEditing ? (
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={profile.businessType}
                    onChange={(e) => setProfile({...profile, businessType: e.target.value})}
                  >
                    <option>Proprietorship</option>
                    <option>Partnership</option>
                    <option>Private Limited</option>
                    <option>LLP</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <ShieldCheck size={18} className="text-blue-500" />
                    {profile.businessType}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 mb-1.5 block">Business Size</label>
                {isEditing ? (
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={profile.businessSize}
                    onChange={(e) => setProfile({...profile, businessSize: e.target.value})}
                  >
                    <option>Micro (0-10 employees)</option>
                    <option>Small (10-50 employees)</option>
                    <option>Medium (50-250 employees)</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Users size={18} className="text-blue-500" />
                    {profile.businessSize}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1.5 block">Location</label>
                {isEditing ? (
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <MapPin size={18} className="text-blue-500" />
                    {profile.location}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 mb-1.5 block">Industry</label>
                {isEditing ? (
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={profile.industry}
                    onChange={(e) => setProfile({...profile, industry: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Building2 size={18} className="text-blue-500" />
                    {profile.industry}
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="mt-10 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={24} />
              <div>
                <p className="text-emerald-800 font-semibold">Verification Complete</p>
                <p className="text-emerald-600 text-sm">Your MSME status has been verified based on official records.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ShieldCheck = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
