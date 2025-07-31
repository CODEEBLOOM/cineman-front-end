// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
const Loading = ({ content = 'Loading ...' }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent" />
      </motion.div>
      <p className="mt-3">{content}</p>
    </div>
  );
};
export default Loading;
