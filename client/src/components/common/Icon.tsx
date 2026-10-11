/**
 * Reusable SVG Icon component that references the /icons.svg sprite sheet.
 * Usage: <Icon name="scissors" size={20} color="#00685F" />
 */
import React from 'react';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = 'currentColor',
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', ...style }}
    aria-hidden="true"
  >
    <use href={`/icons.svg#icon-${name}`} style={{ color }} />
  </svg>
);
