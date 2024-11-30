import React from 'react'

type MainProps = React.PropsWithChildren<{}>;

export default function Main(props: MainProps) {
    const { children } = props
    return (
        <main className='flex-1 flex flex-col p-4 sm:p-8'>
            {children}
        </main>
    )
}
