'use client';

interface ColorPaletteDisplayProps {
  name: string;
  colors: string[];
}

export function ColorPaletteDisplay({ name, colors }: ColorPaletteDisplayProps) {
  return (
    <div className="color-palette">
      <h3 className="text-lg font-medium mb-2">{name}</h3>
      
      <div className="palette-display h-16 rounded-md overflow-hidden flex">
        {colors.map((color: string, index: number) => (
          <div
            key={`${color}-${index}`}
            className="flex-1 relative group cursor-pointer"
            style={{ backgroundColor: color }}
            title={color}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black bg-opacity-30 transition-opacity">
              <span className="text-white text-xs font-mono">{color}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="color-codes mt-2 flex flex-wrap gap-1">
        {colors.map((color: string, index: number) => (
          <div
            key={`code-${color}-${index}`}
            className="color-code px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${color}20`,
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            {color}
          </div>
        ))}
      </div>
    </div>
  );
}
