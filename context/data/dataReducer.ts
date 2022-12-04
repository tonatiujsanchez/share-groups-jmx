

import { DataState } from './';
import { ICategory, IGroup, IPage } from '../../interfaces';


type DataActionType =
    | { type: '[Data] - Load Categories', payload: ICategory[] }
    | { type: '[Data] - Add New Category', payload: ICategory }
    | { type: '[Data] - Update Category', payload: ICategory }
    | { type: '[Data] - Delete Category', payload: string }

    | { type: '[Data] - Load Pages', payload: IPage[] }
    | { type: '[Data] - Add New Page', payload: IPage }
    
    | { type: '[Data] - Load Groups', payload: IGroup[] }
    | { type: '[Data] - Add New Group', payload: IGroup }
    | { type: '[Data] - Delete Group', payload: string }

export const dataReducer = (state: DataState, action: DataActionType): DataState => {

    switch (action.type) {
        case '[Data] - Load Categories':
            return {
                ...state,
                categories: [...action.payload ]
            }

        case '[Data] - Add New Category':
            return {
                ...state,
                categories: [ ...state.categories, action.payload ]
            }

        case '[Data] - Update Category':
            return {
                ...state,
                categories: state.categories.map( category =>  category._id === action.payload._id ? action.payload : category )
            }

        case '[Data] - Delete Category':
            return {
                ...state,
                categories: state.categories.filter( category =>  category._id !== action.payload )
            }
            
        // Pages
        case '[Data] - Load Pages':
            return {
                ...state,
                pages: [...state.pages, ...action.payload ]
            }

        case '[Data] - Add New Page':
            return {
                ...state,
                pages: [ ...state.pages, action.payload ]
            }
        
        // Groups
        case '[Data] - Load Groups':
            return {
                ...state,
                groups: [ ...state.groups, ...action.payload ]
            }
                    
        case '[Data] - Add New Group':
            return {
                ...state,
                groups: [ ...state.groups, action.payload ]
            }
        case '[Data] - Delete Group':
            return {
                ...state,
                groups: state.groups.filter( group => group._id !== action.payload )
            }
                    
        default:
            return state
    }
}