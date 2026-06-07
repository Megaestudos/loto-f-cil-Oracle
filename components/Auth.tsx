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
    const newSigns = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (30 - 12) + 12,
      duration: Math.random() * (10 - 5) + 5,
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
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError('Credenciais inválidas.')
      else if (err.code === 'auth/email-already-in-use') setError('E-mail já cadastrado.')
      else setError('Erro inesperado.')
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
      setError(`Erro: ${err.message || 'Verifique se o domínio está autorizado no Firebase.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-y-auto px-4 py-6 scrollbar-hide">
      {/* Background with floating dollar signs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-[#6edba6]/5 to-transparent" />
        {signs.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, left: `${s.x}%`, top: '110%' }}
            animate={{ opacity: [0, 0.15, 0.15, 0], top: '-10%', rotate: [0, 360] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "linear" }}
            className="absolute font-black text-[#6edba6] select-none"
            style={{ fontSize: s.size }}
          >
            $
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[360px] bg-[#1c1b1b]/95 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 md:p-8 relative z-10 shadow-2xl flex flex-col gap-6"
      >
        <div className="text-center space-y-3">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-12 h-12 bg-gradient-to-br from-[#6edba6] to-[#30a373] rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-[#6edba6]/20"
          >
            <LogIn className="w-6 h-6 text-[#003823]" />
          </motion.div>
          <div className="space-y-0.5">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">O Oráculo Acessa</h2>
            <p className="text-[#bdcac0]/50 text-[10px] font-medium italic">Aumente suas chances agora</p>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div className="space-y-1">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0]/30 group-focus-within:text-[#6edba6]" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#6edba6]/40 text-sm"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0]/30 group-focus-within:text-[#6edba6]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full h-12 pl-12 pr-12 bg-white/5 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#6edba6]/40 text-sm"
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bdcac0]/30"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className={cn("p-3 rounded-xl text-[10px] font-bold border", error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#6edba6]/10 border-[#6edba6]/20 text-[#6edba6]")}
              >
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" disabled={loading}
            className="w-full h-12 bg-gradient-to-br from-[#6edba6] to-[#30a373] text-[#003823] font-black rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{mode === 'login' ? 'Conectar' : 'Confirmar'} <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[7px] uppercase font-black tracking-widest"><span className="bg-[#1c1b1b] px-2 text-[#bdcac0]/20">Express</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin} disabled={loading}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[11px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
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
              className="text-[10px] font-bold text-[#bdcac0]/40 hover:text-[#6edba6] transition-all underline underline-offset-4"
            >
              {mode === 'login' ? 'Não tem conta? Clique aqui' : 'Já tem conta? Faça login'}
            </button>
            {mode === 'login' && (
              <button onClick={() => setMode('forgot')} className="block w-full text-[9px] font-black text-[#bdcac0]/10 hover:text-white uppercase tracking-widest">
                Esqueci minha senha
              </button>
            )}
            {mode === 'forgot' && (
              <button onClick={() => setMode('login')} className="block w-full text-[9px] font-black text-[#bdcac0]/10 hover:text-white uppercase tracking-widest">
                Voltar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
