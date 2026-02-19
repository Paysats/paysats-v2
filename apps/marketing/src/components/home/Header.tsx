import { MotionHeader } from "@shared/ui/MotionComponents"
import { slideDownVariants } from "@/config/animationConfig"
import { Logo } from "@shared/ui/Logo"

export const Header = () => {
    return (
        <MotionHeader
            className="flex justify-center items-center py-8"
            variants={slideDownVariants}
            initial="initial"
            animate="animate"
        >
            <Logo withTitle />
        </MotionHeader>
    )
}