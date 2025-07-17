import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { init } from 'pell';
import { BsPaperclip } from 'react-icons/bs';
import { cn } from '../../utils';
import FileInput, { FileWithId } from './file-input';
import { filesize } from '../../utils/size';
import { FiX } from 'react-icons/fi';

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
  error?: string;
  className?: string;
  label?: string;
  helperText?: string;
  classes?: PellClasses;
  defaultValue?: string;
  value?: string;
  withAttachments?: boolean;
  attachmentProps?: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'value' | 'onChange'
  > & {
    value?: FileWithId[];
    onChange?: (files: FileWithId[]) => void;
    error?: string;
  };
}

export interface PellRef {
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
      withAttachments,
      attachmentProps,
      error,
      label,
      helperText,
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
      <>
        {label || helperText ? (
          <div className="mb-2">
            {label && (
              <label className="text-foreground text-md block font-normal">
                Describe your project
              </label>
            )}
            {helperText && (
              <small className="text-muted-foreground">
                What the project is about, how the team currently is, what the
                tech stack is, etc.
              </small>
            )}
          </div>
        ) : null}
        <div
          ref={containerRef}
          className={cn(
            'pell border-alto min-h-[200px] rounded-sm border border-solid',
            className,
            withAttachments && 'relative',
          )}
          {...rest}
        >
          {withAttachments ? (
            <FileInput
              multiple
              {...attachmentProps}
              value={attachmentProps?.value as FileWithId[]}
              onChange={attachmentProps?.onChange || noop}
              className="hidden"
            >
              {({ open: openFileInput }): React.ReactNode =>
                (
                  <button
                    type="button"
                    id="enclosed-button"
                    tabIndex={-1}
                    className="absolute top-0 right-0 inline-flex h-10 cursor-pointer items-center justify-center px-3 opacity-50 hover:opacity-100 focus:outline-none"
                    onClick={openFileInput}
                    aria-label="Enclose files"
                  >
                    <BsPaperclip className="text-foreground h-5 w-5" />
                  </button>
                ) as React.ReactNode
              }
            </FileInput>
          ) : null}
        </div>
        {withAttachments && attachmentProps?.value?.length ? (
          <ul>
            {attachmentProps.value.map(file => (
              <li
                key={file.id}
                className="bg-alabaster mb-2 flex items-center justify-between py-1 pr-2 pl-4"
              >
                <span className="min-w-0 truncate font-normal">
                  {file.name}
                </span>
                <div className="flex pl-4">
                  <small className="font-normal">
                    {String(filesize(file.size, { round: 0 }))}
                  </small>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="ml-2"
                    onClick={() =>
                      attachmentProps.onChange!(
                        attachmentProps.value!.filter(f => f.id !== file.id),
                      )
                    }
                  >
                    <FiX className="text-error block h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {[error, attachmentProps?.error].filter(Boolean).map((err, idx) => (
          <p key={idx} className="text-error flex items-center gap-1 text-lg">
            {err}
          </p>
        ))}
      </>
    );
  },
);

Pell.displayName = 'Pell';

export default Pell;
