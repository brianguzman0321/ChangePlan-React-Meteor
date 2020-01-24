const surveyStakeholders = ({firstName, activityType, phaseName, projectName, surveyLink}) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head><title>Survey Stakeholders</title></head>
<body>
<p>Hi ${firstName},</p>
<p>We'd love your feedback!</p>
<p>Today's "${activityType}" boosted my ${phaseName} toward the project "${projectName}".</p>
<p><a href=\`${surveyLink}/1\`>Strongly disagree</a></p>
<p><a href=\`${surveyLink}/2\`>Disagree</a></p>
<p><a href=\`${surveyLink}/3\`>Neither agree or disagree</a></p>
<p><a href=\`${surveyLink}/4\`>Agree</a></p>
<p><a href=\`${surveyLink}/5\`>Strongly agree</a></p>
</body>
</html>
`;

export default surveyStakeholders;
