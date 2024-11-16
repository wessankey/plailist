import { motion } from "framer-motion";

type LoaderProps = {
  text: string;
  emoji?: string;
};

export function Loader({ text, emoji }: LoaderProps) {
  return (
    <div className="w-80 h-40">
      <Line index={0} color="#0c750f" />
      <Line index={1} color="#6553bf" />
      <Line index={2} color="#fbbf24" />

      <p className="text-center mt-4 text-2xl font-semibold">{text}</p>
      {emoji && <p className="text-center mt-4 text-5xl">{emoji}</p>}
    </div>
  );
}

function Line({ index, color }: { index: number; color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 10">
      <motion.line
        initial={{ x2: 10 }}
        animate={{
          x2: 100,
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.05,
          },
        }}
        x1="10"
        y1="5"
        y2="5"
        strokeLinecap="round"
        stroke={color}
        strokeWidth="5"
      />
    </svg>
  );
}
