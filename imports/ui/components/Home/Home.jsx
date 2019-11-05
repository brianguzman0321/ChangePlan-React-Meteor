import React from 'react';
import TopNavBar from '/imports/ui/components/App/App'
import ProjectCard from '/imports/ui/components/Projects/Project'

export default function Home(props){
    let menus = [
        {
            show: true,
            name: 'dashboard',
            count: 14
        },
        {
            show: true,
            name: 'activities',
            count: 14
        },
        {
            show: true,
            name: 'stake Holders',
            count: 122
        },
        {
            name: 'reports',
            show: true
    }];
    return (
        <div>
            <TopNavBar menus={menus} {...props} />
            <ProjectCard {...props}/>
        </div>
    )
}
