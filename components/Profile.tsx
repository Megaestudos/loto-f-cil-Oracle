'use client'

import { useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/components/FirebaseProvider";
import { Loader2, User as UserIcon, Mail, Calendar, Save, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";

export function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfileData(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setDisplayName(data.displayName || "");
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess(false);

    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        displayName: displayName,
        updatedAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-[#bdcac0]/20">
          <UserIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#e5e2e1]">Acesse sua conta</h2>
        <p className="text-[#bdcac0] max-w-xs">Faça login para gerenciar seu perfil e suas preferências.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#6edba6]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-[#6edba6] font-bold tracking-widest text-xs uppercase">Configurações</span>
        <h1 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight font-headline">Meu Perfil</h1>
        <p className="text-[#bdcac0]">Gerencie suas informações pessoais e como você aparece no sistema.</p>
      </div>

      <div className="bg-[#1c1b1b] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {profileData?.photoURL ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden relative border-2 border-[#6edba6]/20">
                  <Image 
                    src={profileData.photoURL} 
                    alt={profileData.displayName || "Avatar"} 
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#2a2a2a] flex items-center justify-center text-[#bdcac0]">
                  <UserIcon className="w-10 h-10" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#6edba6] rounded-lg flex items-center justify-center text-[#003823] shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#e5e2e1]">{profileData?.displayName || "Usuário Oracle"}</h3>
              <p className="text-sm text-[#bdcac0] flex items-center gap-2 mt-1">
                <Mail className="w-3 h-3" />
                {profileData?.email}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Form Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#bdcac0] uppercase tracking-wider">Nome de Exibição</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0]" />
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[#e5e2e1] focus:outline-none focus:border-[#6edba6] transition-all"
                  placeholder="Seu nome..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#bdcac0] uppercase tracking-wider">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0]/40" />
                  <input 
                    type="email" 
                    value={profileData?.email}
                    disabled
                    className="w-full bg-[#0e0e0e]/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[#bdcac0]/50 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#bdcac0] uppercase tracking-wider">Membro desde</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0]/40" />
                  <input 
                    type="text" 
                    value={profileData?.createdAt?.toDate ? format(profileData.createdAt.toDate(), "MMMM 'de' yyyy", { locale: ptBR }) : "---"}
                    disabled
                    className="w-full bg-[#0e0e0e]/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[#bdcac0]/50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <p className="text-[10px] text-[#bdcac0]/60 italic">
              * Suas informações são protegidas por criptografia de ponta a ponta.
            </p>
            <button 
              onClick={updateProfile}
              disabled={saving}
              className="px-8 py-3 bg-[#6edba6] text-[#003823] rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {success ? "SALVO!" : "SALVAR ALTERAÇÕES"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
