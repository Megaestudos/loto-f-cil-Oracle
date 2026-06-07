'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  LogIn, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react'
import { 
  auth, 
  loginWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  saveUserProfile
} from '@/lib/firebase'
import { getRedirectResult } from 'firebase/auth'
import { cn } from '@/lib/utils'

export function Auth() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [signs, setSigns] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([])

  useEffect(() => {
    // Check for redirect result (in case popup was blocked)
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        await saveUserProfile(result.user)
      }
    }).catch((err) => {
      console.error("Redirect result error:", err)
    })

    const newSigns = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (25 - 10) + 10,
      duration: Math.random() * (12 - 7) + 7,
      delay: Math.random() * 5
    }))
    setSigns(newSigns)
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else if (mode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await saveUserProfile(result.user)
      } else {
        await sendPasswordResetEmail(auth, email)
        setSuccess('Link enviado!')
      }
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError('Acesso negado.')
      else setError('Erro no acesso.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await loginWithGoogle()
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/unauthorized-domain') {
        setError('Erro: Domínio não autorizado no Firebase Console.')
      } else {
        setError('Falha no login Google.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6edba6]/5 blur-[120px] rounded-full" />
        {signs.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, left: `${s.x}%`, top: '110%' }}
            animate={{ opacity: [0, 0.2, 0.2, 0], top: '-10%', rotate: [0, 360] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "linear" }}
            className="absolute font-black text-[#6edba6]"
            style={{ fontSize: s.size }}
          >
            $
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[340px] bg-[#141414]/90 backdrop-blur-3xl rounded-[32px] border border-white/5 p-6 md:p-7 relative z-10 shadow-2xl flex flex-col gap-5"
      >
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-10 h-10 bg-gradient-to-br from-[#6edba6] to-[#30a373] rounded-xl mx-auto flex items-center justify-center shadow-lg"
          >
            <LogIn className="w-5 h-5 text-[#003823]" />
          </motion.div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter">Acesse o Oráculo</h2>
            <p className="text-[#bdcac0]/40 text-[9px] uppercase tracking-widest font-black italic">Lotofácil Premium</p>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-2.5">
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bdcac0]/20 group-focus-within:text-[#6edba6]" />
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#6edba6]/30 text-xs"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#bdcac0]/20 group-focus-within:text-[#6edba6]" />
              <input 
                type={showPassword ? "text" : "password"} 
                required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full h-11 pl-10 pr-10 bg-white/5 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#6edba6]/30 text-xs"
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bdcac0]/20"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={cn("p-2.5 rounded-lg text-[9px] font-black border text-center", error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#6edba6]/10 border-[#6edba6]/20 text-[#6edba6]")}
              >
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" disabled={loading}
            className="w-full h-11 bg-gradient-to-br from-[#6edba6] to-[#30a373] text-[#003823] font-black rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all text-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{mode === 'login' ? 'ENTRAR' : 'PROSSEGUIR'} <ArrowRight className="w-3.5 h-3.5" /></>}
          </button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[7px] uppercase font-black tracking-widest"><span className="bg-[#141414] px-2 text-[#bdcac0]/10 italic">Google Sync</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin} disabled={loading}
            className="w-full h-11 bg-white/5 border border-white/5 rounded-xl text-white font-black text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 active:scale-[0.98] transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

          <div className="text-center pt-1 space-y-3">
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setSuccess(null); }}
              className="text-[9px] font-black text-[#bdcac0]/30 hover:text-[#6edba6] transition-all underline underline-offset-4 uppercase"
            >
              {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
            </button>
            <div className="flex flex-col gap-2">
              {mode === 'login' && (
                <button onClick={() => setMode('forgot')} className="text-[8px] font-black text-[#bdcac0]/20 hover:text-white uppercase tracking-widest">
                  Esqueci minha senha
                </button>
              )}
              {mode === 'forgot' && (
                <button onClick={() => setMode('login')} className="text-[8px] font-black text-[#bdcac0]/20 hover:text-white uppercase tracking-widest">
                  Voltar
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
