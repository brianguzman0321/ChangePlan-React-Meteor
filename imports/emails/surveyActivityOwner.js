const surveyActivityOwner = ({firstName, activityType, projectName, surveyLink}) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head><title>Survey Activity Owner</title></head>
<body>
<p>Hi ${firstName},</p>
<p>You were owner of the activity ${activityType} today in support of project "${projectName}".</p>
<p>Was the activity complete?</p>
<p><a href=\`${surveyLink}/1\`>YES ACTIVITY COMPLETED</a></p>
<p><a href=\`${surveyLink}/2\`>ACTIVITY NOT COMPLETED</a></p>
</body>
</html>
`;

export default surveyActivityOwner;