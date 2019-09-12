const reportNotification = ({
  targetName,
  username,
  plan,
  changeID,
  fromEmail,
  url
}) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html><head><title>Change Management Report</title>

</head>
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
<table class="column" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="column_cell px pte tc" style="padding: 32px 16px 16px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(97, 97, 97); text-align: center;">
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; display: block; margin-top: 0pt; margin-bottom: 16px;">Great
news.&nbsp;</p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; display: block; margin-top: 0pt; margin-bottom: 16px;">${username} has shared a change management report with you to support
project: ${plan.name}.&nbsp;</p>
<img alt="Change Plan Report" src="https://changeplan.co/wp-content/uploads/images/Change-Plan-Report-350.png" height="142" width="250">
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
<td class="hr_ep pte" style="vertical-align: top; font-size: 0pt; line-height: inherit; min-height: 1px; overflow: hidden; height: 2px; padding-top: 32px; background-color: transparent ! important;">&nbsp;</td>
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
<!-- button_default -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="email_body tc" style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; background-color: rgb(219, 229, 234); font-size: 0pt ! important;"><!-- [if (mso)|(IE)]><table width="632" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:632px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="email_container" style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
<table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="content_cell tc" style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
<table class="column" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="column_cell px pt_0 pb_xs tc" style="padding: 0pt 16px 8px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(97, 97, 97); text-align: center;">
<table class="ebtn" style="display: table; margin-left: auto; margin-right: auto;" align="center" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="default_b" style="padding: 13px 22px; vertical-align: top; background-color: rgb(71, 83, 89); line-height: 20px; font-family: Helvetica,Arial,sans-serif; text-align: center; font-weight: bold; font-size: 17px;"><a href="${url}" style="text-decoration: none; line-height: inherit; color: rgb(255, 255, 255);"><span style="color: rgb(255, 255, 255); line-height: inherit; text-decoration: none;">View
report</span></a></td>
</tr>
</tbody>
</table>
</td>
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
<!-- spacer-lg -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="email_body tc" style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; background-color: rgb(219, 229, 234); font-size: 0pt ! important;"><!-- [if (mso)|(IE)]><table width="632" border="0" cellspacing="0" cellpadding="0" align="center" style="vertical-align:top;width:632px;Margin:0 auto;"><tbody><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div class="email_container" style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
<table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td class="content_cell" style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">&nbsp;</td>
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
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; display: block; margin-top: 15pt; margin-bottom: 20px;">Note:
If you haven't used Change Plan before, you'll shortly receive a
second email&nbsp;'Welcome to Change Plan' inviting you to
activate your free account.</p>
<p class="lead" style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; display: block; margin-top: 0pt; margin-bottom: 16px;">If
you have any questions about this change management plan, please email
${username}  at ${fromEmail}.</p>
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
<td class="hr_ep pte" style="vertical-align: top; font-size: 0pt; line-height: inherit; min-height: 1px; overflow: hidden; height: 2px; padding-top: 32px; background-color: transparent ! important;">&nbsp;</td>
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

export default reportNotification;
