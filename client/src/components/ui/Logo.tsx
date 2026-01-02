import logo from "../../assets/images/paysats-logo.png";

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  withTitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'medium', withTitle }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
    xxlarge: 'w-20 h-20',
  };
  className = className ? `${sizeClasses[size]} ${className}` : sizeClasses[size];
  return (
    <div className="flex items-center">
      <img src={logo} alt="paysats logo" className={`${className}`} />
      {withTitle && <h3 className="font-bold text-xl text-foreground tracking-tight">PaySats</h3>}
    </div>
  );
};
