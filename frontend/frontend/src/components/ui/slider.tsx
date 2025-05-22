// @ts-ignore
import React from 'react';
// Placeholder for Slider component
export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
}
// @ts-ignore
export const Slider = (props: any) => <input type="range" {...props} />; 