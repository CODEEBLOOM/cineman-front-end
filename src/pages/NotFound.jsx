// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Compass,
  Search,
  MapPin,
  Home,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function NotFoundPage() {
  const float = {
    initial: { y: 0, opacity: 0.8 },
    animate: (i) => ({
      y: [0, -12, 0],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3 + i * 0.3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    show: (d = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: d, duration: 0.6 },
    }),
  };

  const particles = Array.from({ length: 18 });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"
        aria-hidden
      />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: ['0%', '-30%'],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        {/* 404 badge */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={fadeInUp.show(0)}
          className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/80 backdrop-blur"
        >
          <Sparkles className="h-4 w-4" /> Có vẻ bạn đã lạc đường
        </motion.div>

        {/* Big 404 with shimmer */}
        <div className="relative">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate={fadeInUp.show(0.05)}
            className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-8xl font-extrabold leading-none text-transparent drop-shadow-sm sm:text-9xl"
          >
            404
          </motion.h1>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            aria-hidden
          />
        </div>

        {/* Title & description */}
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate={fadeInUp.show(0.15)}
          className="mt-4 text-2xl font-semibold text-white sm:text-3xl"
        >
          Oops! Trang bạn tìm không tồn tại
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate={fadeInUp.show(0.25)}
          className="mt-3 max-w-xl text-balance text-white/70"
        >
          Đường dẫn có thể đã bị đổi tên, bị xoá hoặc bạn gõ sai. Thử quay về
          trang chủ hoặc tìm kiếm lại nhé.
        </motion.p>

        {/* Floating icons */}
        <div className="relative mt-10 h-28 w-full">
          <motion.div
            className="absolute left-6 top-2"
            variants={float}
            initial="initial"
            animate="animate"
            custom={0}
          >
            <Compass className="h-10 w-10 text-white/70" />
          </motion.div>
          <motion.div
            className="absolute left-1/3 top-10"
            variants={float}
            initial="initial"
            animate="animate"
            custom={1}
          >
            <Search className="h-8 w-8 text-white/70" />
          </motion.div>
          <motion.div
            className="absolute right-10 top-0"
            variants={float}
            initial="initial"
            animate="animate"
            custom={2}
          >
            <MapPin className="h-9 w-9 text-white/70" />
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={fadeInUp.show(0.35)}
          className="mt-4 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-medium text-white backdrop-blur transition hover:bg-white/20"
          >
            <Home className="h-5 w-5 transition group-hover:scale-110" /> Về
            trang chủ
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-transparent px-5 py-3 font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-0.5" />{' '}
            Quay lại trang trước
          </button>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(100%_60%_at_50%_110%,rgba(255,255,255,0.25),transparent)]" />
    </div>
  );
}
