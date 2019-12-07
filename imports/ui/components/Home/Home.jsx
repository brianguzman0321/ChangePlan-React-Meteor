import React from 'react';
import TopNavBar from '/imports/ui/components/App/App'
import ProjectCard from '/imports/ui/components/Projects/Projects'

export default function Home(props){
    let { params } = props.match;
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
            name: 'stakeHolders',
            count: 122
        },
        {
            name: 'reports',
            show: true
        }];
    if (!params.projectId){
        menus = []
    }
    return (
        <div>
            <TopNavBar menus={menus} {...props} />
            <ProjectCard {...props}/>
        </div>
    )
}
