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
    // Generate signs on client side only to avoid hydration mismatch
    const newSigns = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (35 - 15) + 15,
      duration: Math.random() * (12 - 6) + 6,
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
        setSuccess('Link de recuperação enviado com sucesso!')
      }
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError('E-mail ou senha inválidos.')
      else if (err.code === 'auth/wrong-password') setError('Senha incorreta.')
      else if (err.code === 'auth/email-already-in-use') setError('E-mail já está em uso.')
      else setError('Erro na autenticação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await loginWithGoogle()
    } catch (err) {
      console.error(err)
      setError('Erro ao entrar com Google. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-start justify-center overflow-y-auto px-4 py-12 scrollbar-hide">
      {/* Background with floating dollar signs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#6edba6]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#e9c349]/5 blur-[120px] rounded-full animate-pulse" />
        
        {signs.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, left: `${s.x}%`, top: '110%' }}
            animate={{ 
              opacity: [0, 0.15, 0.15, 0],
              top: '-10%',
              rotate: [0, 360]
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: "linear"
            }}
            className="absolute font-black text-[#6edba6] pointer-events-none drop-shadow-[0_0_8px_rgba(110,219,166,0.3)] select-none"
            style={{ fontSize: s.size }}
          >
            $
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-[#1c1b1b]/80 backdrop-blur-2xl rounded-[40px] border border-white/5 p-8 md:p-10 relative z-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] flex flex-col gap-8 my-auto"
      >
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#6edba6] to-[#30a373] rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-[#6edba6]/20 border border-white/10"
          >
            <LogIn className="w-8 h-8 md:w-10 md:h-10 text-[#003823]" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-white font-headline tracking-tight">
              {mode === 'login' ? 'Acesse o Oráculo' : mode === 'register' ? 'Entre para o Time' : 'Recupere sua Senha'}
            </h2>
            <p className="text-[#bdcac0]/60 text-xs md:text-sm font-medium">
              {mode === 'login' ? 'Domine os sorteios com inteligência' : mode === 'register' ? 'Faça parte da elite da Lotofácil' : 'Informe seu e-mail de acesso'}
            </p>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-[#6edba6] ml-1 tracking-widest">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0]/30 group-focus-within:text-[#6edba6] transition-all" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder:text-white/5 focus:outline-none focus:border-[#6edba6]/40 transition-all text-sm"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase font-black text-[#6edba6] tracking-widest">Senha</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] font-black text-[#bdcac0]/30 hover:text-[#e9c349] uppercase tracking-tighter"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0]/30 group-focus-within:text-[#6edba6] transition-all" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full h-14 pl-12 pr-12 bg-white/5 border border-white/5 rounded-2xl text-white placeholder:text-white/5 focus:outline-none focus:border-[#6edba6]/40 transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bdcac0]/30 p-1 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {(error || success) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl text-xs font-bold border",
                  error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#6edba6]/10 border-[#6edba6]/20 text-[#6edba6]"
                )}
              >
                {error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                {error || success}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-br from-[#6edba6] to-[#30a373] text-[#003823] font-black rounded-2xl shadow-xl shadow-[#6edba6]/10 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {mode === 'login' ? 'Conectar' : mode === 'register' ? 'Criar Conta' : 'Recuperar'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.4em]">
              <span className="bg-[#1c1b1b] px-3 text-[#bdcac0]/20">Acesso Rápido</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-4 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-white/5 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>
            Entrar com Google
          </button>

          <div className="text-center pt-2">
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError(null)
                setSuccess(null)
              }}
              className="text-xs font-bold text-[#bdcac0]/40 hover:text-[#6edba6] transition-all underline underline-offset-4"
            >
              {mode === 'login' ? 'Novo por aqui? Crie sua conta' : 'Já tem conta? Faça login'}
            </button>
            {mode === 'forgot' && (
              <button 
                onClick={() => setMode('login')}
                className="block w-full mt-4 text-[10px] font-black text-[#bdcac0]/20 hover:text-white uppercase tracking-widest"
              >
                Voltar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
