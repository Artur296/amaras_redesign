import { BedIcon, GuideIcon, TicketIcon, VanIcon } from "@/components/icons";
import type { Dict } from "@/lib/i18n";

// What every multi-day package covers. Shared by the package card, the
// packages listing and the package page so the promise reads the same way
// everywhere.
export function packageIncludes(dict: Dict) {
  return [
    { icon: BedIcon, label: dict.pkg.includes.hotel },
    { icon: VanIcon, label: dict.pkg.includes.transfers },
    { icon: GuideIcon, label: dict.pkg.includes.guide },
    { icon: TicketIcon, label: dict.pkg.includes.tickets },
  ];
}

export default function PackageIncludes({
  dict,
  className = "",
}: {
  dict: Dict;
  className?: string;
}) {
  return (
    <ul className={className}>
      {packageIncludes(dict).map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold leading-snug">{label}</span>
        </li>
      ))}
    </ul>
  );
}
