const projectNotification = ({
                               name,
                               projectName,
                               projectHelpLink,
                             }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head><title>Activity notification</title></head>
<body>
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
    <tbody>
    <tr>
        <td class="email_body tc"
            style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; font-size: 0pt ! important;">
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                    <tbody>
                    <tr>
                        <td class="content_cell light_b brt"
                            style="vertical-align: top; width: 100%; font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
                            <div class="email_row"
                                 style="margin: 0pt auto; font-size: 0pt; display: block; width: 100%; vertical-align: top; text-align: center; clear: both; line-height: inherit; min-width: 0pt ! important; max-width: 600px ! important;">
                                <div class="col_6"
                                     style="font-size: 0pt; width: 100%; vertical-align: top; max-width: 600px; line-height: inherit; min-width: 0pt ! important;">
                                    <div style="text-align: center;"></div>
                                    <table class="column" style="min-width: 100%; width: 100%;" border="0"
                                           cellpadding="0" cellspacing="0">
                                        <tbody>
                                        <tr>
                                            <td class="column_cell px pte tc"
                                                style="padding: 32px 16px 16px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; text-align: center;">
                                                <div style="text-align: center;"></div>
                                                <p class="lead"
                                                   style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: center;">
                                                    Hi ${name},
                                                </p>
                                                <p class="lead"
                                                   style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;"></p>
                                                <p class="lead"
                                                   style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">
                                                    Great news! You've been assigned Change Manager for the project
                                                    "${projectName}".
                                                    <br>
                                                </p>
                                                 <a class="lead" href=${projectHelpLink}
                                                   style="font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px; color: rgb(75, 75, 75); display: block; margin-top: 0px; margin-bottom: 16px; text-align: left;">
                                                    "Open ChangePlan" link</a>
                                               <ul class="visions"
                                                    style="text-align: left; font-family: Helvetica,Arial,sans-serif; font-size: 19px; line-height: 27px;  margin-top: 5px; color: rgb(75, 75, 75);">
                                                    <li>Add project information: project vision, objectives, impacts & risks</li>
                                                    <li>Add stakeholder details</li>
                                                    <li>Plan & delegate change management activities: communications, training & more</li>
                                                    <li>Invite managers to have view-only access</li>
                                                </ul>
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
        </td>
    </tr>
    </tbody>
</table>
<!-- content_center -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
    <tbody>
    <tr>
        <td class="email_body tc"
            style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px;  font-size: 0pt ! important;">
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                    <tbody>
                    <tr>
                        <td class="content_cell"
                            style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
                            <div class="email_row tl"
                                 style="margin: 0pt auto; font-size: 0pt; display: block; width: 100%; vertical-align: top; text-align: left; clear: both; line-height: inherit; min-width: 0pt ! important; max-width: 600px ! important;">
                                <div class="col_6"
                                     style="font-size: 0pt; width: 100%; vertical-align: top; max-width: 600px; line-height: inherit; min-width: 0pt ! important;">
                                    <table class="column" style="min-width: 100%; width: 100%;" border="0"
                                           cellpadding="0" cellspacing="0">
                                        <tbody>
                                        <tr>
                                            <td class="column_cell px tc"
                                                style="padding: 16px; vertical-align: top; width: 100%; min-width: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(97, 97, 97); text-align: center;">
                                                <p style="font-family:Helvetica,Arial,sans-serif;font-size: 18px;line-height:27px;color:rgb(75,75,75);display:block;margin-top:10px;margin-bottom:10px;text-align: center;">
                                                    ChangePlan is the single-source-of-truth for enterprise change
                                                    management.
                                                </p>
                                                <p style="font-family:Helvetica,Arial,sans-serif;font-size: 16px;line-height:27px;color:rgb(75,75,75);display:block;margin-top:0;margin-bottom:0;text-align: center;">
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
         </td>
    </tr>
    </tbody>
</table>
<!-- spacer-lg -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
    <tbody>
    <tr>
        <td class="email_body tc"
            style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; font-size: 0pt ! important;">
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                    <tbody>
                    <tr>
                        <td class="content_cell"
                            style="vertical-align: top; width: 100%; background-color: rgb(255, 255, 255); font-size: 0pt; text-align: center; padding-left: 16px; padding-right: 16px; line-height: inherit; min-width: 0pt ! important;">
                            <table class="hr_rl"
                                   style="background-color: transparent ! important; font-size: 0pt; height: 2px; line-height: 1px; min-height: 1px; overflow: hidden; width: 100%;"
                                   align="center" border="0" cellpadding="0" cellspacing="0">
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
        </td>
    </tr>
    </tbody>
</table>
<!-- footer_blank -->
<table class="email_table" style="min-width: 100%; width: 100%;" border="0" cellpadding="0" cellspacing="0">
    <tbody>
    <tr>
        <td class="email_body email_end tc"
            style="vertical-align: top; line-height: 100%; text-align: center; padding-left: 16px; padding-right: 16px; padding-bottom: 32px; font-size: 0pt ! important;">
            <div class="email_container"
                 style="margin: 0pt auto; font-size: 0pt; width: 100%; vertical-align: top; max-width: 632px; text-align: center; line-height: inherit; min-width: 0pt ! important;">
                <p class="mb_xxs"
                   style="font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 23px; color: rgb(167, 177, 182); display: block; margin-top: 30px; margin-bottom: 30px; text-align: center;">
                    �2019
                    Change Plan</p>
                <table class="content_section" style="min-width: 100%; width: 100%;" border="0" cellpadding="0"
                       cellspacing="0">
                </table>
            </div>
        </td>
    </tr>
    </tbody>
</table>
</body>
</html>

`;

export default projectNotification;
