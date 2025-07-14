import {
  FiCode,
  FiSmartphone,
  FiEdit3,
  FiShield,
  FiZap,
  FiUsers,
  FiServer,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiExternalLink,
  FiSun,
  FiMoon,
  FiGithub,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiArrowDownRight,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';
import { FaBehance, FaDiscord, FaTelegramPlane } from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';
import { FaXTwitter } from 'react-icons/fa6';

import { cn } from '../../utils';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const iconMap = {
  code: FiCode,
  mobile: FiSmartphone,
  mail: FiMail,
  design: FiEdit3,
  security: FiShield,
  performance: FiZap,
  team: FiUsers,
  server: FiServer,
  menu: FiMenu,
  close: FiX,
  chevronDown: FiChevronDown,
  chevronRight: FiChevronRight,
  externalLink: FiExternalLink,
  arrowLeft: FiArrowLeft,
  arrowRight: FiArrowRight,
  arrowDownRight: FiArrowDownRight,
  sun: FiSun,
  moon: FiMoon,
  github: FiGithub,
  twitter: FiTwitter,
  x: FaXTwitter,
  facebook: FiFacebook,
  telegram: FaTelegramPlane,
  discord: FaDiscord,
  behance: FaBehance,
  dribbble: AiOutlineGlobal,
  instagram: FiInstagram,
  linkedin: FiLinkedin,
};

interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function getIconName(name: string): string {
  const iconComponent = iconMap[name as keyof typeof iconMap];
  if (!iconComponent) {
    const normalizedName = name
      .toLowerCase()
      .replace('icon-', '')
      .replace('i-', '')
      .replace('-icon', '')
      .replace(/-/g, '');
    return normalizedName;
  }
  return name;
}

export default function Icon({ name, size = 'md', className = '' }: IconProps) {
  const normalizedName = getIconName(name);
  const IconComponent = iconMap[normalizedName as keyof typeof iconMap];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={cn(sizes[size], className)} />;
}
