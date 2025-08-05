"use client";

import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  icon?: React.ReactNode;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, icon }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="color-picker" className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-14">
            <Input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="absolute h-full w-full cursor-pointer p-0 m-0 border-none opacity-0"
            />
            <div
              className="h-full w-full rounded-md border"
              style={{ backgroundColor: color }}
            ></div>
        </div>
        <Input
          id="color-picker"
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
