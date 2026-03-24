import { ReactNode } from 'react';
import { Shield, Lock, ShieldCheck, Key, Eye, Globe, Smartphone, Users } from 'lucide-react';
import ParticleGrid from './ParticleGrid';

type IconVariant = 'security' | 'mobile' | 'family' | 'password';

const iconSets: Record<IconVariant, typeof Shield[]> = {
  security: [Shield, Lock, ShieldCheck, Key, Eye, Globe],
  mobile: [Smartphone, Shield, Lock, Eye, Globe, Key],
  family: [Users, Shield, Eye, Lock, Globe, ShieldCheck],
  password: [Key, Lock, ShieldCheck, Eye, Shield, Globe],
};

interface Props {
  children: ReactNode;
  variant?: IconVariant;
}

/**
 * Premium animated hero background for landing/pillar pages.
 * Wraps the hero content with particle grid + floating icons + gradient mesh.
 */
const LandingHeroBackground = ({ children, variant = 'security' }: Props) => {
  const icons = iconSets[variant];

  return (
    <section className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8">
      {/* Animated background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 gradient-mesh-animated opacity-60" />
        <ParticleGrid />
      </div>

      {/* Floating icons — desktop only */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden="true">
        {icons[0] && (() => { const I = icons[0]; return <I className="absolute top-[15%] right-[10%] w-7 h-7 text-primary/[0.07] float-slow" />; })()}
        {icons[1] && (() => { const I = icons[1]; return <I className="absolute top-[35%] right-[6%] w-5 h-5 text-primary/[0.05] float-medium" style={{ animationDelay: '1s' }} />; })()}
        {icons[2] && (() => { const I = icons[2]; return <I className="absolute top-[20%] right-[25%] w-9 h-9 text-primary/[0.06] float-fast" style={{ animationDelay: '2s' }} />; })()}
        {icons[3] && (() => { const I = icons[3]; return <I className="absolute top-[55%] right-[12%] w-4 h-4 text-primary/[0.04] float-slow" style={{ animationDelay: '0.5s' }} />; })()}
        {icons[4] && (() => { const I = icons[4]; return <I className="absolute top-[45%] right-[28%] w-6 h-6 text-primary/[0.05] float-medium" style={{ animationDelay: '3s' }} />; })()}
        {icons[5] && (() => { const I = icons[5]; return <I className="absolute top-[65%] right-[18%] w-5 h-5 text-primary/[0.04] float-fast" style={{ animationDelay: '1.5s' }} />; })()}
      </div>

      {/* Content */}
      <div className="relative py-6 md:py-10">
        {children}
      </div>
    </section>
  );
};

export default LandingHeroBackground;
