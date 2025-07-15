import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { init } from 'pell';

const noop = (): void => {};
const defaultClasses: Record<string, string> = {};
const defaultActions: string[] = [
  'heading1',
  'heading2',
  'bold',
  'italic',
  'underline',
  'olist',
  'ulist',
  // 'link',
];

interface PellClasses {
  actionbar?: string;
  button?: string;
  content?: string;
  selected?: string;
  [key: string]: string | undefined;
}

interface PellProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  actions?: string[];
  onChange?: (html: string) => void;
  className?: string;
  classes?: PellClasses;
  defaultValue?: string;
  value?: string;
}

interface PellRef {
  change: (value: string) => void;
}

interface PellEditor {
  content: HTMLElement;
}

const Pell = forwardRef<PellRef, PellProps>(
  (
    {
      actions = defaultActions,
      onChange = noop,
      className,
      classes = defaultClasses,
      defaultValue = '',
      value = '',
      ...rest
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<PellEditor | null>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
      if (containerRef.current && !isInitialized.current) {
        isInitialized.current = true;
        editorRef.current = init({
          element: containerRef.current,
          onChange: (html: string) => {
            onChange(html);
          },
          defaultParagraphSeparator: 'div',
          styleWithCSS: false,
          actions,
          classes: {
            actionbar: 'pell-actionbar',
            button: 'pell-button',
            content: 'pell-content',
            selected: 'pell-button-selected',
            ...classes,
          },
        });
        editorRef.current!.content.innerHTML = defaultValue;
      }
    }, [actions, classes, defaultValue, onChange]);

    useEffect(() => {
      if (!value && editorRef.current) {
        editorRef.current.content.innerHTML = '';
      }
    }, [value]);

    useImperativeHandle(ref, () => ({
      change: (value: string) => {
        if (editorRef.current) {
          editorRef.current.content.innerHTML = value;
        }
      },
    }));

    return (
      <div
        ref={containerRef}
        className={`pell border-alto rounded-sm border border-solid ${className || ''}`}
        {...rest}
      />
    );
  },
);

Pell.displayName = 'Pell';

export default Pell;
