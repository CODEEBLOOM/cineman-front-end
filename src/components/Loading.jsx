import { motion } from 'framer-motion';
const Loading = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent" />
      </motion.div>
    </div>
  );
};
export default Loading;
