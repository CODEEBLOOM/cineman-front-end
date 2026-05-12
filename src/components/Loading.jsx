// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Loading = ({
  content,
  minHeight = '220px',
  size = 44,
  className = '',
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-4 ${className}`.trim()}
      style={{ minHeight }}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full border border-primary/20"
          style={{
            width: size + 18,
            height: size + 18,
          }}
          animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.95, ease: 'linear' }}
        >
          <div
            className="rounded-full border-[4px] border-primary/25 border-t-primary"
            style={{ width: size, height: size }}
          />
        </motion.div>
      </div>

      {content ? (
        <p className="text-sm font-medium tracking-[0.02em] text-slate-500">
          {content}
        </p>
      ) : null}
    </div>
  );
};

export default Loading;
