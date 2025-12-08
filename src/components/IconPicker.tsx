import { useState } from "react";
import { ChevronDown, Package } from "lucide-react";
import { AVAILABLE_ICONS, ICON_MAP } from "../utils/iconList";

interface IntegratedIconPickerProps {
  selectedIcon?: string | null;
  onIconSelect: (iconName: string) => void;
  className?: string;
}

interface IIconHelperProps {
  name: keyof typeof ICON_MAP; 
  className: string;
}

export function IconHelper({ name, className }: IIconHelperProps) {
  const Component = ICON_MAP[name];
  if (!Component) {
    return <Package className={className} />;
  }
  return <Component className={className} />;
}

export function IconPicker({
  selectedIcon,
  onIconSelect,
  className,
}: IntegratedIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className || ""}`}>
      {/* Icon Display with Caret */}
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          <IconHelper
            name={selectedIcon ?? "Package"}
            className="size-14 text-primary"
          />
        </div>

        {/* Small caret in bottom-right corner */}
        <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border border-base-300 bg-base-100 shadow-sm transition-colors group-hover:bg-base-200">
          <ChevronDown className="size-3 text-base-content/60" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />{" "}
          {/* Icon Grid */}
          <div className="absolute top-0 left-20 z-20 w-96 rounded-box border bg-base-100 p-3 shadow-lg">
            <div className="mb-2 text-sm font-medium text-base-content/70">
              Choose Icon
            </div>
            <div className="grid max-h-80 grid-cols-6 gap-2 overflow-y-auto">
              {AVAILABLE_ICONS.map((iconData) => {
                const IconComp = iconData.icon;
                const isSelected = selectedIcon === iconData.name;

                return (
                  <button
                    key={iconData.name}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-colors hover:bg-base-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-base-300 text-base-content/70 hover:text-base-content"
                    }`}
                    onClick={() => {
                      onIconSelect(iconData.name);
                      setIsOpen(false);
                    }}
                    title={iconData.name}
                  >
                    <IconComp className="size-8" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
