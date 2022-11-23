import { createContext, Dispatch, SetStateAction } from 'react';
import { ICategory, IPage } from "../../interfaces";


interface ContextProps {
    categories: ICategory[]
    pages     : IPage[]
    updating  : boolean


    // Methods
    addNewCategory: (name: string) => Promise<{hasError:boolean; message: string }>
    updateCategory: (category: ICategory) => Promise<{ hasError: boolean; message: string; }>
    setUpdating: Dispatch<SetStateAction<boolean>>
    deleteCategory: (categoryId: string) => Promise<{ hasError: boolean; message: string;}>

    addNewPage: ( page: IPage ) => Promise<{ hasError: boolean, message: string }>
}


export const DataContext = createContext({} as ContextProps)

