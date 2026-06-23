import Link from "next/link";

type StudyAILogoProps = {
  href?: string;
  compact?: boolean;
};

export default function StudyAILogo({
  href = "/dashboard",
  compact = false,
}: StudyAILogoProps) {
  const iconSize = compact ? "h-10 w-10" : "h-14 w-14";
  const textSize = compact ? "text-lg" : "text-xl";
  const gapSize = compact ? "gap-2.5" : "gap-3";

  return (
    <Link href={href} className={`flex items-center ${gapSize}`}>
      <div
        className={`relative ${iconSize} flex items-center justify-center rounded-2xl bg-blue-600 shadow-[0_10px_25px_rgba(37,99,235,0.28)]`}
      >
        <svg
          viewBox="0 0 24 24"
          className={compact ? "h-5 w-5" : "h-7 w-7"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.75 5.5C5.50736 5.5 4.5 6.50736 4.5 7.75V17.25C4.5 18.4926 5.50736 19.5 6.75 19.5H17.25C18.4926 19.5 19.5 18.4926 19.5 17.25V7.75C19.5 6.50736 18.4926 5.5 17.25 5.5H6.75Z"
            fill="white"
            fillOpacity="0.16"
          />
          <path
            d="M8 7.75C8 7.33579 8.33579 7 8.75 7H12C13.6569 7 15 8.34315 15 10V17H9.75C8.7835 17 8 16.2165 8 15.25V7.75Z"
            fill="white"
          />
          <path
            d="M16 17V10C16 8.34315 17.3431 7 19 7H19.25C19.6642 7 20 7.33579 20 7.75V15.25C20 16.2165 19.2165 17 18.25 17H16Z"
            fill="white"
            fillOpacity="0.92"
          />
          <path
            d="M8.8 9.5H12.4"
            stroke="#2563EB"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M8.8 11.4H12.8"
            stroke="#2563EB"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M17.2 9.5H18.3"
            stroke="#2563EB"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M17.2 11.4H18.3"
            stroke="#2563EB"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span className={`${textSize} font-black tracking-tight text-slate-950`}>
        Study<span className="text-blue-600">AI</span>
      </span>
    </Link>
  );
}