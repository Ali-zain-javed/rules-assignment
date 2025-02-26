import React, { ComponentType } from 'react';

interface IconProps {
  icon: ComponentType<{ size?: number; color?: string }>;
  size?: number;
  color?: string;
}

const IconComponent: React.FC<IconProps> = ({ icon: Icon, size = 24, color = 'black' }) => {
  return <Icon size={size} color={color} />;
};

export default IconComponent;
