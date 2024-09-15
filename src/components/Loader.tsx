import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="w-80 h-40">
      <Line index={0} color="#15803d" />
      <Line index={1} color="#dc2626" />
      <Line index={2} color="#fbbf24" />

      <p className="text-center mt-4">
        Adding this playlist to your Spotify account
      </p>
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
            delay: index * 0.15,
          },
        }}
        x1="10"
        y1="5"
        y2="5"
        stroke-linecap="round"
        stroke={color}
        stroke-width="5"
      />
    </svg>
  );
}
