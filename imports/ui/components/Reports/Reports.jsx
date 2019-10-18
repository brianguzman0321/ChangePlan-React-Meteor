import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import TopNavBar from '/imports/ui/components/App/App'

export default function Reports(props){
    let menus = [
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