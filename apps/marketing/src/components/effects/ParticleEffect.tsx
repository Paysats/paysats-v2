import { motion } from 'framer-motion';
import { useParticles } from '@shared/hooks/useAnimations';
import { prefersReducedMotion } from '@shared/config/animationConfig';

interface ParticleEffectProps {
    count?: number;
    color?: string;
    className?: string;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
    count = 20,
    color = 'rgba(255, 165, 0, 0.6)',
    className = '',
}) => {
    const particles = useParticles(count);

    if (prefersReducedMotion()) return null;

    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: color,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};
