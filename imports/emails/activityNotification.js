const activityNotification = ({
  targetName,
  fromEmail,
  username,
  changeDescription,
  activityPurpose,
  activityDueDate,
  activityName,
  activityDescription,
  activityHelpLink,
  audience
}) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html><head><title>Activity notification</title></head>
<body>
<!-- header_light -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="email_body email_start tc" style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; padding-top: 32px; background-color: rgb(219, 229, 234); font-size: 0pt ! important;"><!-- [if (mso)|(IE)]><table width="632" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:632px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="email_container" style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
<table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="blank_cell header_c pt pb" style="vertical-align: top; padding-top: 16px; padding-bottom: 16px; line-height: inherit;"><!-- col-6 -->
<div class="email_row" style="margin: 0pt auto; font-size: 0pt; display: block; width: 100%; vertical-align: top; text-align: center; clear: both; line-height: inherit; min-width: 0pt ! important; max-width: 600px ! important;"><!-- [if (mso)|(IE)]><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:600px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="col_6" style="font-size: 0pt; width: 100%; vertical-align: top; max-width: 600px; line-height: inherit; min-width: 0pt ! important;">
<table class="column" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="column_cell px pt_xs pb_0 logo_c tc" style="padding: 8px 16px 0pt; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 100%; color: rgb(97, 97, 97); text-align: center;"><a href="https://www.changeplan.co" style="text-decoration: none; line-height: inherit; color: rgb(55, 194, 239);" target="_blank"><img alt="Change Plan" src="https://www.changeplan.co/wp-content/uploads/images/changeplan-logo.png" style="border: 0px none ; clear: both; line-height: 100%; text-decoration: none;" height="35" width="200"></a></td>
</tr>
</tbody>
</table>
</div>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]--></div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]--></td>
</tr>
</tbody>
</table>
<!-- jumbotron_light_icon_info -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="email_body tc" style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; background-color: rgb(219, 229, 234); font-size: 0pt ! important;"><!-- [if (mso)|(IE)]><table width="632" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:632px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="email_container" style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
<table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="content_cell light_b brt" style="vertical-align: top; width: 100%; background-color: rgb(241, 246, 249); font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;"><!-- col-6 -->
<div class="email_row" style="margin: 0pt auto; font-size: 0pt; display: block; width: 100%; vertical-align: top; text-align: center; clear: both; line-height: inherit; min-width: 0pt ! important; max-width: 600px ! important;"><!-- [if (mso)|(IE)]><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:600px;Margin:0 auto 0 0;"><tbody><tr><td width="600" style="width:600px;line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="col_6" style="font-size: 0pt; width: 100%; vertical-align: top; max-width: 600px; line-height: inherit; min-width: 0pt ! important;">
<div style="text-align: center;"></div>
<table class="column" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="column_cell px pte tc" style="padding: 32px 16px 16px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(97, 97, 97); text-align: center;">
<div style="text-align: center;"></div>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: center;">Good
news.</p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;"></p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">${username} has assigned you an activity to support&nbsp;the ${activityPurpose} change ${changeDescription}.<br>
</p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">Due
date: ${activityDueDate}<br>
Activity: ${activityName}<br>
Activity purpose: ${activityPurpose}<br>
Audience: ${audience}<br>
Details: ${activityDescription}</p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 40px; margin-bottom: 30px; text-align: left;">If
you have any questions about this activity, please email ${username} at
${fromEmail}.</p>
<img alt="Change Plan Activity" src="https://changeplan.co/wp-content/uploads/images/Change-Plan-Activity.png" height="141" width="200">
</td>
</tr>
</tbody>
</table>
</div>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]--></div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]--></td>
</tr>
</tbody>
</table>
<!-- content_center -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="email_body tc" style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; background-color: rgb(219, 229, 234); font-size: 0pt ! important;"><!-- [if (mso)|(IE)]><table width="632" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:632px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="email_container" style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
<table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="content_cell" style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;"><!-- col-6 -->
<div class="email_row tl" style="margin: 0pt auto; font-size: 0pt; display: block; width: 100%; vertical-align: top; text-align: left; clear: both; line-height: inherit; min-width: 0pt ! important; max-width: 600px ! important;"><!-- [if (mso)|(IE)]><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:600px;Margin:0 auto 0 0;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="col_6" style="font-size: 0pt; width: 100%; vertical-align: top; max-width: 600px; line-height: inherit; min-width: 0pt ! important;">
<table class="column" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="column_cell px tc" style="padding: 16px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(97, 97, 97); text-align: center;">
<p class="mb_xxs" style="margin: 20px 0pt 4px; padding: 0pt; color: rgb(62, 72, 77); font-weight: bold; font-size: 18px; line-height: 42px;">Learn
more<br>
</p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 5px; text-align: center;">${activityName}</p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 5px; text-align: center;">${activityHelpLink}</p>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]--></td>
</tr>
</tbody>
</table>
<!-- spacer-lg -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="email_body tc" style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; background-color: rgb(219, 229, 234); font-size: 0pt ! important;"><!-- [if (mso)|(IE)]><table width="632" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:632px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="email_container" style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
<table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="content_cell" style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
<table class="hr_rl" style="background-color: transparent ! important; font-size: 0pt; height: 2px; line-height: 1px; min-height: 1px; overflow: hidden; width: 100%;" align="center" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="hr_ep pte" style="vertical-align: top; font-size: 0pt; line-height: inherit; min-height: 1px; overflow: hidden; height: 2px; padding-top: 32px; background-color: transparent ! important;">g</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]--></td>
</tr>
</tbody>
</table>
<!-- footer_blank -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="email_body email_end tc" style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; padding-bottom: 32px; background-color: rgb(219, 229, 234); font-size: 0pt ! important;"><!-- [if (mso)|(IE)]><table width="632" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:632px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="email_container" style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
<p class="mb_xxs" style="font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(167, 177, 182); display: block; margin-top: 30px; margin-bottom: 30px; text-align: center;">�2018
Change Plan</p>
<table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
</table>
</div>
<!-- [if (mso)|(IE)]></td><td width="200" style="width:200px;line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]-->
</body></html>
`;

export default activityNotification;
