import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'
import config from '/imports/utils/config';

export default function Reports(props){
    let menus = config.menus;
    return (
        <div>
            <TopNavBar menus={menus} {...props} />
            <ReportsCard />
        </div>
    )
}

function ReportsCard(props) {
    const useStyles1 = makeStyles(theme => ({
        title: {
            fontWeight: 1000,
            fontSize: 16
        }
    }));
    return <h1>ReportsCard</h1>
}