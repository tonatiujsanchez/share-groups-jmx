import Head from "next/head"
import { FC, ReactNode } from "react"
import { SiderBar } from '../ui';
import { useAuth } from '../../hooks/useAuth';


interface Props {
    children: ReactNode
}

export const LayoutApp: FC<Props> = ({ children }) => {

    const { isLoggedIn } = useAuth()

    if( !isLoggedIn ){
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <svg 
                    className="animate-spin h-16 w-16 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4">
                    </circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>JMX - Share Groups</title>
                <meta name="description" content="Aplicación para la asignación de grupos a páginas" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex">
                
                <SiderBar />
                <div className="px-5 pt-10 flex-1 flex flex-col">
                    {children}
                    {/* <footer>
                        <p>Footer</p>
                    </footer> */}
                </div>

            </div>

        </>
    )
}
