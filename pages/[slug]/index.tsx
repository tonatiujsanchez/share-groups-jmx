import { useRouter } from 'next/router';
import { LayoutApp, LayoutCategory } from '../../components/layouts';
import { NavBar } from '../../components/ui';
import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { ICategory } from '../../interfaces';




const CategoryPage = () => {

    const [category, setCategory] = useState<ICategory | null>(null)

    const router = useRouter()
    const { query } = router
    
    const { categories } =  useData()

    useEffect(()=> {

        if(categories.length === 0 || !query.slug){ return }

        const categoryTemp = categories.find( cat => ( cat.slug === query.slug ) )

        if(!categoryTemp){
            router.replace('/')
        }else {
            setCategory(categoryTemp)
        }
        
    },[query, categories])


    useEffect(()=>{
        // TODO: Load pages
    },[category])
    
    return (
        <LayoutApp>
            {
                !category
                ? <div>cargando...</div>
                : (
                    <LayoutCategory category={category}>
                        <p>content...</p>
                    </LayoutCategory>
                )
            }
        </LayoutApp>
    )
}

export default CategoryPage
