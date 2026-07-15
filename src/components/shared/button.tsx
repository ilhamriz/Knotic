import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  intent?: "primary" | "secondary" | "outline" | "tertiary" | "disabled";
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
        "bg-bg-base border border-border-default text-text-primary hover:bg-bg-surface hover:border-border-strong",
      outline: "border border-border-default",
      tertiary: "",
      disabled: "text-text-muted",
    },
    size: {
      medium:
        "min-w-25 h-10 md:h-9 text-sm font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer flex justify-center items-center gap-2",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

// Internal button content component to avoid duplication
const ButtonContent = ({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled: boolean;
}) => (
  <>
    {disabled && <div className="absolute inset-0 bg-black/40" />}
    {children}
  </>
);

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
      intent,
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
        <ButtonContent disabled={disabled}>{children}</ButtonContent>
      </Link>
    );
  }

  // Render as button otherwise
  return (
    <button {...commonProps} disabled={disabled} type={type}>
      <ButtonContent disabled={disabled}>{children}</ButtonContent>
    </button>
  );
};

export default Buttons;
