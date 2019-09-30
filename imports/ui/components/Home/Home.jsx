import React from 'react';
import TopNavBar from '/imports/ui/components/App/App'

export default function Home(props){
    let menus = {
        activities: {
            show: false
        },
        stakeHolders: {
            show: false
        },
        reports: {
            show: false
        }
    }
    return (
        <>
            <TopNavBar menus={menus} {...props} />
            <h1>Projects Component Render Here</h1>
        </>
    )
}
