import { motion, MotionConfig } from "framer-motion";

export const Gradient = ({isHover}) => {
    return (
        <MotionConfig>
            <motion.div transition={{
                type: "spring",
                duration: 2,
                bounce: 0.2
            }}
                variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1 },
                }}
                animate={isHover ? "hover" : "rest"}
                className='gradient'></motion.div>
        </MotionConfig>
    )
}