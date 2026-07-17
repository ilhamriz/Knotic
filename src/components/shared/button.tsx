import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  intent?: "primary" | "secondary" | "outline" | "danger" | "disabled";
  size?: "medium";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  href?: string;
  prefetch?: boolean;
  "aria-label"?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export const buttonTemplate = cva("button", {
  variants: {
    intent: {
      primary:
        "bg-primary-muted hover:bg-primary border border-primary text-text-primary",
      secondary:
        "bg-bg-elevated border border-border-default text-text-primary hover:bg-border-default hover:border-border-strong",
      outline: "",
      danger: "bg-danger hover:bg-danger-hover",
      disabled: "text-text-muted border border-border-default",
    },
    size: {
      medium:
        "relative min-w-25 w-full h-10 md:h-9 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 cursor-pointer flex justify-center items-center gap-2",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

const Buttons = ({
  intent = "primary",
  size = "medium",
  type = "button" as const,
  children,
  className = "",
  disabled = false,
  href,
  prefetch,
  "aria-label": ariaLabel,
  onClick,
  ...props
}: ButtonProps) => {
  const buttonClassName = cn(
    buttonTemplate({
      intent: disabled ? "disabled" : intent,
      size,
    }),
    className,
    disabled && "cursor-not-allowed",
  );

  const commonProps = {
    className: buttonClassName,
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(onClick && { onClick: onClick }),
    ...props,
  };

  const isExternalLink = typeof href === "string" && /^https?:\/\//i.test(href);

  // Render as Link when href is provided
  if (href) {
    return (
      <Link
        {...commonProps}
        href={href}
        prefetch={prefetch ?? false}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  // Render as button otherwise
  return (
    <button {...commonProps} disabled={disabled} type={type}>
      {children}
    </button>
  );
};

export default Buttons;
