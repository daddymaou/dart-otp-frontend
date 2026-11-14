'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';

type StickerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'violet' | 'ghost' | 'danger';
  loading?: boolean;
};

export function StickerButton({
  children,
  className = '',
  loading = false,
  variant = 'primary',
  disabled,
  ...props
}: StickerButtonProps) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function StickerCard({
  children,
  className = '',
  accent,
  ...props
}: HTMLAttributes<HTMLElement> & { accent?: string; children: ReactNode }) {
  return (
    <article className={`sticker-card ${accent ? `card-accent-${accent}` : ''} ${className}`} {...props}>
      {children}
    </article>
  );
}

export function Badge({
  children,
  status = 'test',
}: {
  children: ReactNode;
  status?: 'verified' | 'pending' | 'failed' | 'expired' | 'test';
}) {
  return <span className={`status-badge status-${status}`}>{children}</span>;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  function Input({ className = '', error, id, ...props }, ref) {
    return (
      <span className="field-control">
        <input
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={`form-input ${className}`}
          id={id}
          ref={ref}
          {...props}
        />
        {error && <span className="field-error" id={id ? `${id}-error` : undefined} role="alert">{error}</span>}
      </span>
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  function Textarea({ className = '', error, id, ...props }, ref) {
    return (
      <span className="field-control">
        <textarea
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={`form-input form-textarea ${className}`}
          id={id}
          ref={ref}
          {...props}
        />
        {error && <span className="field-error" id={id ? `${id}-error` : undefined} role="alert">{error}</span>}
      </span>
    );
  },
);

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="check-label">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span className="custom-checkbox" aria-hidden="true">{checked ? '✓' : ''}</span>
      <span>{label}</span>
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`switch-control ${checked ? 'switch-on' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span />
    </button>
  );
}

export function PatternBg({ children, tone = 'ink', className = '' }: {
  children: ReactNode;
  tone?: 'ink' | 'white';
  className?: string;
}) {
  return <div className={`pattern-wrapper pattern-${tone} ${className}`}>{children}</div>;
}

export function BlobMask({ children, className = '', blob = 3 }: {
  children: ReactNode;
  className?: string;
  blob?: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <div
      className={`blob-mask blob-mask-${blob} ${className}`}
      style={{ WebkitMaskImage: `url('/assets/blobs/mask/blob-${blob}-mask.svg')`, maskImage: `url('/assets/blobs/mask/blob-${blob}-mask.svg')` }}
    >
      {children}
    </div>
  );
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`} ref={ref}>{children}</div>;
}

export function Dialog({
  children,
  title,
  description,
  onClose,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const initialFocus = dialogRef.current?.querySelector<HTMLElement>(
      '[autofocus], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]',
    );
    (initialFocus ?? dialogRef.current)?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab') return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!items?.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, []);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div
        aria-describedby={description ? 'dialog-description' : undefined}
        aria-labelledby="dialog-title"
        aria-modal="true"
        className="dialog-card"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <button aria-label="Close dialog" className="dialog-close" onClick={onClose} type="button">×</button>
        <h2 id="dialog-title">{title}</h2>
        {description && <p className="dialog-description" id="dialog-description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
