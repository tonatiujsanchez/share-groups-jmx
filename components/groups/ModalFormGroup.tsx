import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react"
import Image from "next/image";
import { toast } from 'react-toastify'
import { useForm } from "react-hook-form";

import { IPage } from '../../interfaces/IPage';

import profilePic from '../../public/img/facebook-page.jpg'
import axios from 'axios';
import { IGroup } from "../../interfaces";
import { useData } from "../../hooks/useData";


const imageMimeType = /image\/(png|jpg|jpeg|gif|webp)/i;


interface Props {
    groupEdit?: IGroup
    categoryId: string
    setShowForm: Dispatch<SetStateAction<boolean>>

    processing?: boolean
}

export const ModalFormGroup: FC<Props> = ({ groupEdit, categoryId, setShowForm }) => {

    // file of images
    const [file, setFile] = useState(null)
    const [fileDataURL, setFileDataURL] = useState(null)
    const [loading, setLoading] = useState(false)

    const { addNewGroup } = useData()

    const fileInputRef = useRef<any>(null)

    const { register, handleSubmit, formState:{ errors }, reset, setValue, } = useForm<IGroup>({
        defaultValues: {
            name:'',
            url: '',
            img: '',
        }
    })

    useEffect(()=>{
        if(groupEdit){
            reset({
                name: groupEdit.name,
                url: groupEdit.url,
                img: groupEdit.img,
            })
        }
    },[groupEdit])
    
    


    const handleFileChange = (e:any) => {
        if( !e.target.files || e.target.files.length === 0 ){
            return
        }

        const fileSelected = e.target.files[0]

        if (!fileSelected.type.match(imageMimeType)) {
            toast.error('Formato no válido', {
                theme: "colored",
                autoClose: 1000
            })
            return
        }
        setFile(fileSelected)
    }


    useEffect(() => {
        let fileReader:any;
        let isCancel: boolean = false;

        if (file) {
            fileReader = new FileReader()
            fileReader.onload = (e:any) => {
                const { result } = e.target
                if (result && !isCancel) {
                    setFile(file)
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file)
        }

        return () => {
            isCancel = true
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort()
            }
        }
    }, [file])

    

    const deleteImage = async() => {
        setFile(null)
        setFileDataURL(null)
    }

    const updateImage = async(): Promise<string | undefined> => {
        if( !file ){ return }
        
        const formData = new FormData()
        formData.append('file', file)

        try {
            const { data } = await axios.post<{ message: string }>('/api/dashboard/images', formData)
            return data.message
       
        } catch (error) {
            setLoading(false)
            console.log('Hubo un error', error);
        }
    }

    const onCancel = async() => {
        setShowForm(false)
    }

    const onPageSubmit = async({ name, url }:IPage) => {
        setLoading(true)
        
        const newGroup:IGroup = {
            name,
            url,
            category: categoryId
        }

        if(file){
            const imgUrl = await updateImage()
            newGroup.img = imgUrl
        }

        if (groupEdit){

        } else {
            await addNewGroup(newGroup)
            onCancel()
        }
                
    }
    


    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <form
                        onSubmit={ handleSubmit(onPageSubmit) }
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:px-6 sm:pt-2 sm:pb-4">
                            <header className="flex justify-center py-3 border-b mb-8">
                                <h2 className="flex items-center text-2xl font-bold gap-1">
                                    <i className='bx bxl-facebook-circle text-3xl'></i>
                                    Nuevo grupo
                                </h2>
                            </header>
                            {
                                fileDataURL || groupEdit?.img
                                    ? (
                                        <div className="relative group mb-5 flex justify-center">
                                            <Image
                                                priority
                                                width={500}
                                                height={10}
                                                src={ fileDataURL || groupEdit?.img || profilePic}
                                                alt={'Nombre de pagina'}
                                                className='rounded' 
                                            />
                                            <button
                                                onClick={deleteImage} 
                                                className="absolute -top-3 -right-3 shadow text-white bg-red-500 rounded-full text-lg w-8 h-8 hover:bg-red-600 active:scale-95 hover:shadow-2xl hidden group-hover:block">
                                                <i className='bx bx-trash'></i>
                                            </button>
                                        </div>

                                    ):(
                                        <div
                                            onClick={()=> fileInputRef.current?.click()} 
                                            className="group mx-auto border-dashed border-2 py-10 flex justify-center mb-5 rounded hover:border-slate-800 hover:cursor-pointer">
                                            <i className='bx bxs-image-add text-4xl text-slate-800 opacity-50 group-hover:opacity-100'></i>
                                        </div>
                                    )
                            }
                            <div className="flex flex-col gap-1 mb-4 w-full">
                                <label htmlFor="name" className="font-semibold">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nombre del grupo"
                                    {...register('name', {
                                            required: 'El nombre es requerido',
                                    })}
                                    className={`bg-admin rounded-md flex-1 border p-3 hover:border-slate-800 ${ !!errors.name ? 'outline-red-500 border-red-500' :'' }`}
                                />
                                {
                                    !!errors.name &&
                                    <p className="text-sm text-red-600 ml-1">{errors.name.message}</p>
                                }
                            </div>
                            <div className="flex flex-col gap-1 mb-4 w-full">
                                <label htmlFor="url" className="font-semibold">URL</label>
                                <input
                                    type="text"
                                    id="url"
                                    placeholder="https://www.facebook.com/grupo"
                                    {...register('url', {
                                        required: 'El url es requerido',
                                        validate: ( value ) => !value.includes('https') ? 'La url no es válida' : undefined

                                    })}
                                    className={`bg-admin rounded-md flex-1 border p-3 hover:border-slate-800 ${ !!errors.url ? 'outline-red-500 border-red-500' :'' }`}
                                />
                                {
                                    !!errors.url &&
                                    <p className="text-sm text-red-600 mt-2">{errors.url.message}</p>
                                }
                            </div>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                ref={ fileInputRef }
                                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-28 sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed">
                                {
                                    loading
                                        ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                        )
                                        : 'Guardar'
                                }
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={onCancel}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                Cancelar
                            </button>
                        </div>
                                
                    </form>
                </div>
            </div>
        </div>
    )
}
