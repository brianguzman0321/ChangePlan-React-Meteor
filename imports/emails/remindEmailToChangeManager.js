const remindEmailToChangeManager = ({firstName, activityDeliverer, activityName, projectName, surveyLink}) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head><title>Survey Stakeholders</title></head>
<body>
<p>Hi ${firstName},</p>
<p>${activityDeliverer} has not yet reported that the activity ${activityName} of project "${projectName}" has been completed</p>
<p>Was the activity complete?</p>
<p><a href=\`${surveyLink}/1\`>YES ACTIVITY COMPLETED</a></p>
</body>
</html>
`;

export default remindEmailToChangeManager;