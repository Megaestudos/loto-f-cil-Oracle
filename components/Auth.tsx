'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Chrome, 
  LogIn, 
  KeyRound,
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
      if (err.code === 'auth/user-not-found') setError('E-mail não cadastrado.')
      else if (err.code === 'auth/wrong-password') setError('Senha incorreta.')
      else if (err.code === 'auth/email-already-in-use') setError('E-mail já está em uso.')
      else if (err.code === 'auth/invalid-credential') setError('Credenciais inválidas.')
      else setError('Erro na autenticação. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError('Erro ao entrar com Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0a] overflow-y-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6edba6]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e9c349]/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-[#1c1b1b] rounded-[40px] border border-white/5 p-8 md:p-10 relative z-10 shadow-2xl my-8"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-gradient-to-br from-[#6edba6] to-[#30a373] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-[#6edba6]/30 border border-white/10"
          >
            <LogIn className="w-10 h-10 text-[#003823]" />
          </motion.div>
          <h2 className="text-4xl font-black text-white font-headline tracking-tighter leading-tight px-2">
            {mode === 'login' ? 'Acesse o Oráculo' : mode === 'register' ? 'Entre para o Time' : 'Recupere sua Senha'}
          </h2>
          <p className="text-[#bdcac0] mt-3 text-sm px-4">
            {mode === 'login' ? 'Domine os padrões e aumente suas chances' : mode === 'register' ? 'Crie sua conta gratuita em segundos' : 'Informe seu e-mail para receber o link'}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-[#6edba6] ml-1 tracking-[0.2em]">E-mail de Acesso</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#bdcac0]/40 group-focus-within:text-[#6edba6] transition-all" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                className="w-full h-16 pl-14 pr-5 bg-[#2a2a2a] border border-white/5 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#6edba6]/40 focus:ring-4 focus:ring-[#6edba6]/5 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase font-black text-[#6edba6] tracking-[0.2em]">Senha de Segurança</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] uppercase font-black text-[#bdcac0]/50 hover:text-[#e9c349] transition-colors"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#bdcac0]/40 group-focus-within:text-[#6edba6] transition-all" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full h-16 pl-14 pr-14 bg-[#2a2a2a] border border-white/5 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#6edba6]/40 focus:ring-4 focus:ring-[#6edba6]/5 transition-all text-sm font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#bdcac0]/40 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold shadow-xl shadow-red-500/5"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-[#6edba6]/10 border border-[#6edba6]/20 rounded-2xl text-[#6edba6] text-xs font-bold shadow-xl shadow-[#6edba6]/5"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-gradient-to-br from-[#6edba6] to-[#30a373] text-[#003823] font-black rounded-2xl shadow-2xl shadow-[#6edba6]/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 text-base"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Conectar ao Oráculo' : mode === 'register' ? 'Confirmar Cadastro' : 'Enviar Link'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] px-4">
            <span className="bg-[#1c1b1b] text-[#bdcac0]/30 italic">Smart Login</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full h-16 bg-[#2a2a2a] border border-white/5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-4 hover:bg-white/5 transition-all active:scale-95 group shadow-xl"
        >
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center transition-all group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>
          Entrar com Google
        </button>

        <div className="mt-10 pt-8 border-t border-white/5 text-center space-y-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#bdcac0]/60 text-xs">
              {mode === 'login' ? 'Ainda não é um mestre?' : 'Já possui credenciais?'}
            </span>
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError(null)
                setSuccess(null)
              }}
              className="text-[#6edba6] font-black text-sm hover:underline tracking-tight"
            >
              {mode === 'login' ? 'Criar Conta Gratuita' : 'Acessar meu Painel'}
            </button>
          </div>
          
          {mode === 'forgot' && (
            <button 
              onClick={() => {
                setMode('login')
                setError(null)
                setSuccess(null)
              }}
              className="text-[#bdcac0]/40 text-xs font-black hover:text-[#bdcac0] transition-colors uppercase tracking-widest"
            >
              Voltar ao Início
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
