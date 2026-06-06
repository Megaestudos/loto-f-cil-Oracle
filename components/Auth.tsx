'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  UserPlus, 
  LogIn, 
  KeyRound,
  AlertCircle,
  Loader2,
  CheckCircle2
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
        setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.')
      }
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/user-not-found') setError('Usuário não encontrado.')
      else if (err.code === 'auth/wrong-password') setError('Senha incorreta.')
      else if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está em uso.')
      else if (err.code === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.')
      else setError('Ocorreu um erro. Tente novamente.')
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0a]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6edba6]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e9c349]/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-[#1c1b1b] rounded-[32px] border border-white/5 p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-[#6edba6] to-[#30a373] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#6edba6]/20"
          >
            <LogIn className="w-8 h-8 text-[#003823]" />
          </motion.div>
          <h2 className="text-3xl font-black text-white font-headline tracking-tight">
            {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Criar sua conta' : 'Recuperar senha'}
          </h2>
          <p className="text-[#bdcac0] mt-2 text-sm">
            {mode === 'login' ? 'Acesse o Oráculo e domine a Lotofácil' : mode === 'register' ? 'Comece sua jornada ao sucesso hoje' : 'Enviaremos um link de recuperação'}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[#bdcac0] ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0] group-focus-within:text-[#6edba6] transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-14 pl-12 pr-4 bg-[#2a2a2a] border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#6edba6]/50 focus:ring-4 focus:ring-[#6edba6]/5 transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#bdcac0] ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdcac0] group-focus-within:text-[#6edba6] transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-4 bg-[#2a2a2a] border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#6edba6]/50 focus:ring-4 focus:ring-[#6edba6]/5 transition-all"
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 bg-[#6edba6]/10 border border-[#6edba6]/20 rounded-xl text-[#6edba6] text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-br from-[#6edba6] to-[#30a373] text-[#003823] font-black rounded-2xl shadow-lg shadow-[#6edba6]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Acessar Conta' : mode === 'register' ? 'Criar Conta' : 'Enviar Link'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest px-4">
            <span className="bg-[#1c1b1b] text-[#bdcac0]/40">Ou continue com</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <Chrome className="w-3 h-3 text-[#1c1b1b]" />
          </div>
          Entrar com Google
        </button>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#bdcac0]">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já possui uma conta?'}
            </span>
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError(null)
                setSuccess(null)
              }}
              className="text-[#6edba6] font-bold hover:underline"
            >
              {mode === 'login' ? 'Criar uma conta' : 'Acessar conta'}
            </button>
          </div>
          
          {mode !== 'forgot' && (
            <button 
              onClick={() => {
                setMode('forgot')
                setError(null)
                setSuccess(null)
              }}
              className="text-white/40 text-xs font-semibold hover:text-white/80 transition-colors flex items-center gap-2"
            >
              <KeyRound className="w-3 h-3" />
              Esqueceu sua senha?
            </button>
          )}

          {mode === 'forgot' && (
            <button 
              onClick={() => {
                setMode('login')
                setError(null)
                setSuccess(null)
              }}
              className="text-white/40 text-xs font-semibold hover:text-white/80 transition-colors"
            >
              Voltar ao login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
