import React from 'react'

type ButtonProps = {
    text: string; 
    dark?: boolean; 
    full?: boolean;
    clickHandler?: () => Promise<void>;
  };

export default function Button(props: ButtonProps) {
  const {text, dark, full, clickHandler } = props
  return (
    <button onClick={clickHandler} className={' rounded-full overflow-hidden duration-200 hover:opacity-60 border-2 border-solid border-cyan-600 ' 
    + (dark ? ' text-white bg-cyan-600' : ' text-cyan-600 ') + (full ? ' grid-place-items-center w-full' : ' ')}>
        <p className={`' px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 '`}>{text}</p>
    </button>
  )
}
