const activityNotification = ({
                                name,
                                projectName,
                                activityType,
                                activityDueDate,
                                time,
                                activityName,
                                description,
                                stakeholders,
                                activityHelpLink,
                                vision, objectives,
                                currentChangeManagers
                              }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head><title>Activity notification</title></head>
<body>
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
    <tbody>
    <tr>
        <td class="email_body tc"
            style="vertical-align: top; line-height: 100%; text-align: left; padding-left: 16px; padding-right: 16px; font-size: 0pt ! important;">
            <!-- [if (mso)|(IE)]>
            <table width="632" border="0" cellspacing="0" cellpadding="0" align="center"
                   style="vertical-align:top;width:632px;Margin:0 auto;">
                <tbody>
                <tr>
                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: left; line-height: inherit; min-width: 0pt ! important;">
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                    <tbody>
                    <tr>
                        <td class="content_cell light_b brt"
                            style="vertical-align: top; width: 100%; font-size: 0pt; text-align: left; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
                            <!-- col-6 -->
                            <div class="email_row"
                                 style="margin: 0pt auto; font-size: 0pt; display: block; width: 100%; vertical-align: top; text-align: left; clear: both; line-height: inherit; min-width: 0pt ! important; max-width: 600px ! important;">
                                <!-- [if (mso)|(IE)]>
                                <table width="600" border="0" cellspacing="0" cellpadding="0" align="center"
                                       style="vertical-align:top;width:600px;Margin:0 auto 0 0;">
                                    <tbody>
                                    <tr>
                                        <td width="600"
                                            style="width:600px;line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                <![endif]-->
                                <div class="col_6"
                                     style="font-size: 0pt; width: 100%; vertical-align: top; max-width: 600px; line-height: inherit; min-width: 0pt ! important;">
                                    <div style="text-align: left;"></div>
                                    <table class="column" style="min-width: 100%; width: 100%;" border="0"
                                           cellpadding="0" cellspacing="0">
                                        <tbody>
                                        <tr>
                                            <td class="column_cell px pte tc"
                                                style="padding: 32px 16px 16px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; text-align: left;">
                                                <div style="text-align: left;"></div>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">
                                                    Hi ${name},
                                                </p>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;"></p>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">
                                                    You've been assigned a change management activity for the project
                                                    "${projectName}".
                                                    <br>
                                                </p>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">

                                                    Activity type: ${activityType}<br>
                                                    Due date: ${activityDueDate}<br>
                                                    Duration (time away from BAU): ${time}<br>
                                                    Activity: ${activityName}<br>
                                                    Description: ${description}<br>
                                                    Stakeholders targeted: ${stakeholders}</p>
                                                <a class="lead" href=${activityHelpLink}
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">
                                                    "View activity details in ChangePlan"</a>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">
                                                    This activity supports the project ${projectName}.
                                                </p>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 1px; text-align: left;">
                                                    Project vision:
                                                </p>
                                                <ul class="visions"
                                                    style="line-height: 27px;  margin-top: 5px; color: rgb(75, 75, 75);">
                                                    ${vision !==[] ? vision.map(item => `
                                                    <li>${item}</li>
                                                    `).join('') : 'have no visions yet'}
                                                </ul>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 1px; text-align: left;">
                                                    Project objectives:
                                                </p>
                                                <ul class="objectives"
                                                    style="text-align: left; margin-top: 5px; color: rgb(75, 75, 75);">
                                                    ${objectives ? objectives.map(item => `
                                                    <li>${item}</li>
                                                    `).join('') : 'have no objectives yet'}
                                                </ul>
                                                <p class="lead"
                                                   style="color: rgb(75, 75, 75); display: block; margin-top: 40px; margin-bottom: 30px; text-align: left;">
                                                    For more information please contact the project’s change
                                                    manager/s${currentChangeManagers ? currentChangeManagers.map(item =>
  ` ${item.profile.firstName} ${item.profile.lastName}
                                                    (${item.emails[0].address})`) : '.'}.
                                                </p>
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
        <td class="email_body tc"
            style="vertical-align: top; line-height: 100%; text-align: left; padding-left: 16px; padding-right: 16px;  font-size: 0pt ! important;">
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: left; line-height: inherit; min-width: 0pt ! important;">
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                    <tbody>
                    <tr>
                        <td class="content_cell"
                            style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: left; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
                            <!-- col-6 -->
                            <div class="email_row tl"
                                 style="margin: 0pt auto; font-size: 0pt; display: block; width: 100%; vertical-align: top; text-align: left; clear: both; line-height: inherit; min-width: 0pt ! important; max-width: 600px ! important;">
                                <!-- [if (mso)|(IE)]>
                                <table width="600" border="0" cellspacing="0" cellpadding="0" align="left"
                                       style="vertical-align:top;width:600px;Margin:0 auto 0 0;">
                                    <tbody>
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                <![endif]-->
                                <div class="col_6"
                                     style="font-size: 0pt; width: 100%; vertical-align: top; max-width: 600px; line-height: inherit; min-width: 0pt ! important;">
                                    <table class="column" style="min-width: 100%; width: 100%;" border="0"
                                           cellpadding="0" cellspacing="0">
                                        <tbody>
                                        <tr>
                                            <td class="column_cell px tc"
                                                style="padding: 16px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(97, 97, 97); text-align: left;">
                                                <p style="color:rgb(75,75,75);display:block;margin-top:10px;margin-bottom:10px;text-align: left;">
                                                    ChangePlan is the single-source-of-truth for enterprise change
                                                    management.
                                                </p>
                                                <p style="color:rgb(75,75,75);display:block;margin-top:0;margin-bottom:0;text-align: left;">
                                                    <a href="http://www.changeplan.co">www.changeplan.co</a>
                                                </p>
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
        <td class="email_body tc"
            style="vertical-align: top; line-height: 100%; text-align: left; padding-left: 16px; padding-right: 16px; font-size: 0pt ! important;">
            <!-- [if (mso)|(IE)]>
            <table width="632" border="0" cellspacing="0" cellpadding="0" align="left"
                   style="vertical-align:top;width:632px;Margin:0 auto;">
                <tbody>
                <tr>
                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: left; line-height: inherit; min-width: 0pt ! important;">
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                    <tbody>
                    <tr>
                        <td class="content_cell"
                            style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: left; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
                            <table class="hr_rl"
                                   style="background-color: transparent ! important; font-size: 0pt; height: 2px; line-height: 1px; min-height: 1px; overflow: hidden; width: 100%;"
                                   align="left" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                <tr>
                                    <td class="hr_ep pte"
                                        style="vertical-align: top; font-size: 0pt; line-height: inherit; min-height: 1px; overflow: hidden; height: 2px; padding-top: 32px; background-color: transparent ! important;">
                                        g
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
<!-- footer_blank -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
    <tbody>
    <tr>
        <td class="email_body email_end tc"
            style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; padding-bottom: 32px; font-size: 0pt ! important;">
            <!-- [if (mso)|(IE)]>
            <table width="632" border="0" cellspacing="0" cellpadding="0" align="left"
                   style="vertical-align:top;width:632px;Margin:0 auto;">
                <tbody>
                <tr>
                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: left; line-height: inherit; min-width: 0pt ! important;">
                <p class="mb_xxs"
                   style="font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(167, 177, 182); display: block; margin-top: 30px; margin-bottom: 30px; text-align: center;">
                    ©2019
                    Change Plan</p>
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                </table>
            </div>
            <!-- [if (mso)|(IE)]></td>
        <td width="200" style="width:200px;line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]-->
        </td>
    </tr>
    </tbody>
</table>
<!-- [if (mso)|(IE)]></td></tr></tbody></table><![endif]-->
</body>
</html>

`;

export default activityNotification;
