import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  ReactNode,
} from 'react';

export type FileWithId = File & { id: string };

type FileInputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'children' | 'value' | 'onChange'
> & {
  value?: FileWithId[];
  onChange?: (files: FileWithId[]) => void;
  children: (args: {
    open: () => void;
    files: FileWithId[];
    setFiles: (files: FileWithId[], cb?: (files: FileWithId[]) => void) => void;
  }) => ReactNode;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  style?: React.CSSProperties;
};

const FileInput = ({
  value = [],
  onChange,
  children,
  wrapperProps,
  style = {},
  ...rest
}: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFilesState] = useState<FileWithId[]>(value as FileWithId[]);

  useEffect(() => {
    setFilesState(value as FileWithId[]);
  }, [value]);

  const open = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as FileWithId[];
    selectedFiles.forEach(file => {
      file.id = file.name + '-' + Math.random().toString(36).substr(2, 5);
    });
    if (onChange) {
      onChange(selectedFiles);
      return;
    }
    setFilesState(selectedFiles);
  };

  const setFiles = (
    newFiles: FileWithId[],
    cb?: (files: FileWithId[]) => void,
  ) => {
    setFilesState(newFiles);
    if (onChange) {
      onChange(newFiles);
    }
    if (cb) {
      cb(newFiles);
    }
  };

  return (
    <div {...wrapperProps}>
      <input
        {...rest}
        key="input"
        type="file"
        ref={fileInputRef}
        style={{ display: 'none', ...style }}
        onChange={onChangeHandler}
      />
      {children({
        open,
        files,
        setFiles,
      })}
    </div>
  );
};

export default FileInput;
