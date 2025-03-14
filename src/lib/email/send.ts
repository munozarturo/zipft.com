import { ROOT_DOMAIN } from '$env/static/private';
import { sendEmail } from '$lib/server/aws/ses';

async function loadImageBuffer(url: string): Promise<Buffer> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
	}

	return Buffer.from(await response.arrayBuffer());
}

const replacePlaceholders = (
	obj: any,
	html: string,
	text: string,
	prefix = ''
): { html: string; text: string } => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const fullKey = prefix ? `${prefix}.${key}` : key;
			const value = obj[key];

			if (typeof value === 'object' && value !== null) {
				const result = replacePlaceholders(value, html, text, fullKey);
				html = result.html;
				text = result.text;
			} else {
				const placeholder = `{%${fullKey}%}`;
				html = html.replace(new RegExp(placeholder, 'g'), value);
				text = text.replace(new RegExp(placeholder, 'g'), value);
			}
		}
	}

	return { html, text };
};

type VerificationEmail = {
	user: {
		firstName: string;
	};
	verificationUrl: string;
	communication: {
		id: string;
	};
};
export async function sendVerificationEmail(
	email: string,
	props: VerificationEmail
): Promise<void> {
	let htmlTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
	<head>
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
		<meta name="x-apple-disable-message-reformatting" />
		<!--$-->
	</head>
	<body
		style="
			background-color: #fefefe;
			font-family:
				-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
				'Helvetica Neue', sans-serif;
		"
	>
		<div
			style="
				display: none;
				overflow: hidden;
				line-height: 1px;
				opacity: 0;
				max-height: 0;
				max-width: 0;
			"
		>
			Verify your zipft account.
			<div>
				 ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
			</div>
		</div>
		<table
			align="center"
			width="100%"
			border="0"
			cellpadding="0"
			cellspacing="0"
			role="presentation"
			style="max-width: 37.5em; margin: 0 auto; padding: 20px 0 48px"
		>
			<tbody>
				<tr style="width: 100%">
					<td>
						<img
							alt="zipft Logo"
							title="zipft Logo"
							width="170"
							height="80"
							src="https://www.zipft.com/logo-light.png"
							style="
								display: block;
								outline: none;
								border: none;
								text-decoration: none;
								margin: 0 auto;
							"
						/>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							Hi
							<!-- -->{%user.firstName%}<!-- -->,
						</p>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							Welcome to zipft, the fast file sharing service.
						</p>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							To finish setting up your account verify your identity by clicking on the link below:
						</p>
						<table
							align="center"
							width="100%"
							border="0"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
							style="text-align: center"
						>
							<tbody>
								<tr>
									<td>
										<a
											href="{%verificationUrl%}"
											style="
												line-height: 100%;
												text-decoration: none;
												display: block;
												max-width: 100%;
												mso-padding-alt: 0px;
												background-color: #1e1e1e;
												border-radius: 0px;
												color: #fefefe;
												font-size: 16px;
												text-align: center;
												padding: 12px 12px 12px 12px;
											"
											target="_blank"
											><span
												><!--[if mso
													]><i style="mso-font-width: 300%; mso-text-raise: 18" hidden
														>&#8202;&#8202;</i
													><!
												[endif]--></span
											><span
												style="
													max-width: 100%;
													display: inline-block;
													line-height: 120%;
													mso-padding-alt: 0px;
													mso-text-raise: 9px;
												"
												>Verify account</span
											><span
												><!--[if mso
													]><i style="mso-font-width: 300%" hidden>&#8202;&#8202;&#8203;</i><!
												[endif]--></span
											></a
										>
									</td>
								</tr>
							</tbody>
						</table>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							Best,<br />The zipft team
						</p>
						<hr
							style="
								width: 100%;
								border: none;
								border-top: 1px solid #eaeaea;
								border-color: #cccccc;
								margin: 20px 0;
							"
						/>
						<p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #8898aa">
							{%communication.id%}
						</p>
					</td>
				</tr>
			</tbody>
		</table>
		<!--/$-->
	</body>
</html>
`;
	let textTemplate = `Verify your zipft account.
 ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿

Hi {%user.firstName%},

Someone recently requested a password change for your zipft account. If this was you, you can set a new password here:

To finish setting up your account verify your identity by clicking on the link below:

Verify account {%verificationUrl%}

Best,
The zipft team

--------------------------------------------------------------------------------

{%communication.id%}`;

	const body = replacePlaceholders(props, htmlTemplate, textTemplate);
	const emailBody = {
		source: `"zipft" <auth@account.${ROOT_DOMAIN}>`,
		destination: { to: email },
		subject: 'Verify your zipft account',
		body
	};

	await sendEmail(emailBody);
}

type PasswordResetEmail = {
	user: {
		firstName: string;
	};
	passwordResetUrl: string;
	communication: {
		id: string;
	};
};
export async function sendPasswordResetEmail(
	email: string,
	props: PasswordResetEmail
): Promise<void> {
	let htmlTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
	<head>
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
		<meta name="x-apple-disable-message-reformatting" />
		<!--$-->
	</head>
	<body
		style="
			background-color: #fefefe;
			font-family:
				-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
				'Helvetica Neue', sans-serif;
		"
	>
		<div
			style="
				display: none;
				overflow: hidden;
				line-height: 1px;
				opacity: 0;
				max-height: 0;
				max-width: 0;
			"
		>
			Reset your zipft password.
			<div>
				 ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
			</div>
		</div>
		<table
			align="center"
			width="100%"
			border="0"
			cellpadding="0"
			cellspacing="0"
			role="presentation"
			style="max-width: 37.5em; margin: 0 auto; padding: 20px 0 48px"
		>
			<tbody>
				<tr style="width: 100%">
					<td>
						<img
							alt="zipft Logo"
							title="zipft Logo"
							width="170"
							height="80"
							src="https://www.zipft.com/logo-light.png"
							style="
								display: block;
								outline: none;
								border: none;
								text-decoration: none;
								margin: 0 auto;
							"
						/>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							Hi
							<!-- -->{%user.firstName%}<!-- -->,
						</p>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							Someone recently requested a password change for your zipft account. If this was you,
							you can set a new password here:
						</p>
						<table
							align="center"
							width="100%"
							border="0"
							cellpadding="0"
							cellspacing="0"
							role="presentation"
							style="text-align: center"
						>
							<tbody>
								<tr>
									<td>
										<a
											href="{%passwordResetUrl%}"
											style="
												line-height: 100%;
												text-decoration: none;
												display: block;
												max-width: 100%;
												mso-padding-alt: 0px;
												background-color: #1e1e1e;
												border-radius: 0px;
												color: #fefefe;
												font-size: 16px;
												text-align: center;
												padding: 12px 12px 12px 12px;
											"
											target="_blank"
											><span
												><!--[if mso
													]><i style="mso-font-width: 300%; mso-text-raise: 18" hidden
														>&#8202;&#8202;</i
													><!
												[endif]--></span
											><span
												style="
													max-width: 100%;
													display: inline-block;
													line-height: 120%;
													mso-padding-alt: 0px;
													mso-text-raise: 9px;
												"
												>Reset password</span
											><span
												><!--[if mso
													]><i style="mso-font-width: 300%" hidden>&#8202;&#8202;&#8203;</i><!
												[endif]--></span
											></a
										>
									</td>
								</tr>
							</tbody>
						</table>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							If you don't want to change your password or didn't request this, just ignore and
							delete this message.
						</p>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							To keep your account secure, please don't forward this email to anyone.
						</p>
						<p style="font-size: 16px; line-height: 26px; margin: 16px 0">
							Best,<br />The zipft team
						</p>
						<hr
							style="
								width: 100%;
								border: none;
								border-top: 1px solid #eaeaea;
								border-color: #cccccc;
								margin: 20px 0;
							"
						/>
						<p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #8898aa">
							{%communication.id%}
						</p>
					</td>
				</tr>
			</tbody>
		</table>
		<!--/$-->
	</body>
</html>
`;
	let textTemplate = `Reset your zipft password.
 ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌ ‍‎‏﻿ ‌
‍‎‏﻿ ‌ ‍‎‏﻿

Hi {%user.firstName%},

Welcome to zipft, the fast file sharing service.

Reset password {%passwordResetUrl%}

If you don't want to change your password or didn't request this, just ignore and delete this message.

To keep your account secure, please don't forward this email to anyone.

Best,
The zipft team

--------------------------------------------------------------------------------

{%communication.id%}`;

	const body = replacePlaceholders(props, htmlTemplate, textTemplate);
	const emailBody = {
		source: `"zipft" <auth@account.${ROOT_DOMAIN}>`,
		destination: { to: email },
		subject: 'Reset your zipft password',
		body
	};

	await sendEmail(emailBody);
}
