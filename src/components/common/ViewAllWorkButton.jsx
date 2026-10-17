import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const EASE = [0.76, 0, 0.24, 1];
const DURATION = 0.45;

const ViewAllWorkButton = () => {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="inline-block"
    >
      <Link
        to="/projects"
        className="
          group relative flex items-center gap-4
          overflow-hidden
          border-b border-[color:var(--color-ink)]
          pb-2
          pr-1
        "
      >

        {/* Text */}
        <span className="relative block h-7 overflow-hidden md:h-8">
          <motion.span
            variants={{
              rest: { y: "0%" },
              hover: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: EASE,
            }}
            className="
              block whitespace-nowrap
              text-base font-medium
              leading-7 md:text-lg md:leading-8
              text-[color:var(--color-ink)]
            "
          >
            View All Work
          </motion.span>

          <motion.span
            aria-hidden="true"
            variants={{
              rest: { y: "100%" },
              hover: { y: "0%" },
            }}
            transition={{
              duration: DURATION,
              ease: EASE,
            }}
            className="
              absolute inset-0
              block whitespace-nowrap
              text-base font-medium
              leading-7 md:text-lg md:leading-8
              text-[color:var(--color-accent)]
            "
          >
            View All Work
          </motion.span>
        </span>

        {/* Arrow */}
        <span className="relative h-6 w-6 overflow-hidden">
          <motion.span
            variants={{
              rest: {
                x: "0%",
                y: "0%",
              },
              hover: {
                x: "110%",
                y: "-110%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: EASE,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FiArrowUpRight className="h-5 w-5" />
          </motion.span>

          <motion.span
            aria-hidden="true"
            variants={{
              rest: {
                x: "-110%",
                y: "110%",
              },
              hover: {
                x: "0%",
                y: "0%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: EASE,
            }}
            className="
              absolute inset-0
              flex items-center justify-center
              text-[color:var(--color-accent)]
            "
          >
            <FiArrowUpRight className="h-5 w-5" />
          </motion.span>
        </span>
      </Link>
    </motion.div>
  );
};

export default ViewAllWorkButton;