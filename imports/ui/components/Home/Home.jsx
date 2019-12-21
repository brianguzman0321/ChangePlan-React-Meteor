import React from 'react';
import TopNavBar from '/imports/ui/components/App/App'
import ProjectCard from '/imports/ui/components/Projects/Projects'
import config from "../../../utils/config";
import TemplatesPage from "../Templates/Templates";

export default function Home(props) {
  let {params} = props.match;
  let menus = config.menus;
  if (!params.projectId) {
    menus = []
  }
  return (
    <div>
      <TopNavBar menus={menus} {...props} />
      <ProjectCard {...props}/>
    </div>
  )
}
