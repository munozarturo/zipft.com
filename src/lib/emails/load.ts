interface Email {
	html: string;
	text: string;
}

const templates: { [key: string]: Email } = {
	'reset-password': {
		html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
	<head>
		<link rel="preload" as="image" href="{%baseUrl%}/logo.svg" />
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
							alt="zipft"
							height="100"
							src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTcwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTcwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB4PSIxMS41IiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMUUxRTFFIi8+CjxyZWN0IHg9IjMxLjUiIHk9IjUwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIGZpbGw9IiMxRTFFMUUiLz4KPHJlY3QgeD0iMTEuNSIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzFFMUUxRSIvPgo8cmVjdCB4PSIzMS41IiB5PSIzMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMUUxRTFFIi8+CjxyZWN0IHg9IjExLjUiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIGZpbGw9IiMxRTFFMUUiLz4KPHJlY3QgeD0iMzEuNSIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzFFMUUxRSIvPgo8cGF0aCBkPSJNNzIuMjY4IDQ4Ljc5Nkg4Mi45MTZWNTVINjMuODY0VjQ5LjAxNkw3NC4wNzIgMzYuNjUySDYzLjk1MlYzMC40NDhIODIuNjk2VjM2LjQzMkw3Mi4yNjggNDguNzk2Wk05MC44NDAxIDI3Ljg5NkM4OS41MjAxIDI3Ljg5NiA4OC40MzQ4IDI3LjUxNDcgODcuNTg0MSAyNi43NTJDODYuNzYyOCAyNS45NiA4Ni4zNTIxIDI0Ljk5MiA4Ni4zNTIxIDIzLjg0OEM4Ni4zNTIxIDIyLjY3NDcgODYuNzYyOCAyMS43MDY3IDg3LjU4NDEgMjAuOTQ0Qzg4LjQzNDggMjAuMTUyIDg5LjUyMDEgMTkuNzU2IDkwLjg0MDEgMTkuNzU2QzkyLjEzMDggMTkuNzU2IDkzLjE4NjggMjAuMTUyIDk0LjAwODEgMjAuOTQ0Qzk0Ljg1ODggMjEuNzA2NyA5NS4yODQxIDIyLjY3NDcgOTUuMjg0MSAyMy44NDhDOTUuMjg0MSAyNC45OTIgOTQuODU4OCAyNS45NiA5NC4wMDgxIDI2Ljc1MkM5My4xODY4IDI3LjUxNDcgOTIuMTMwOCAyNy44OTYgOTAuODQwMSAyNy44OTZaTTk0LjU4MDEgMzAuNDQ4VjU1SDg3LjA1NjFWMzAuNDQ4SDk0LjU4MDFaTTEwNy41NTcgMzMuOTI0QzEwOC4yOSAzMi43OCAxMDkuMzAyIDMxLjg1NiAxMTAuNTkzIDMxLjE1MkMxMTEuODgzIDMwLjQ0OCAxMTMuMzk0IDMwLjA5NiAxMTUuMTI1IDMwLjA5NkMxMTcuMTQ5IDMwLjA5NiAxMTguOTgyIDMwLjYwOTMgMTIwLjYyNSAzMS42MzZDMTIyLjI2NyAzMi42NjI3IDEyMy41NTggMzQuMTI5MyAxMjQuNDk3IDM2LjAzNkMxMjUuNDY1IDM3Ljk0MjcgMTI1Ljk0OSA0MC4xNTczIDEyNS45NDkgNDIuNjhDMTI1Ljk0OSA0NS4yMDI3IDEyNS40NjUgNDcuNDMyIDEyNC40OTcgNDkuMzY4QzEyMy41NTggNTEuMjc0NyAxMjIuMjY3IDUyLjc1NiAxMjAuNjI1IDUzLjgxMkMxMTguOTgyIDU0LjgzODcgMTE3LjE0OSA1NS4zNTIgMTE1LjEyNSA1NS4zNTJDMTEzLjQyMyA1NS4zNTIgMTExLjkxMyA1NSAxMTAuNTkzIDU0LjI5NkMxMDkuMzAyIDUzLjU5MiAxMDguMjkgNTIuNjgyNyAxMDcuNTU3IDUxLjU2OFY2Ni43MDRIMTAwLjAzM1YzMC40NDhIMTA3LjU1N1YzMy45MjRaTTExOC4yOTMgNDIuNjhDMTE4LjI5MyA0MC44MDI3IDExNy43NjUgMzkuMzM2IDExNi43MDkgMzguMjhDMTE1LjY4MiAzNy4xOTQ3IDExNC40MDYgMzYuNjUyIDExMi44ODEgMzYuNjUyQzExMS4zODUgMzYuNjUyIDExMC4xMDkgMzcuMTk0NyAxMDkuMDUzIDM4LjI4QzEwOC4wMjYgMzkuMzY1MyAxMDcuNTEzIDQwLjg0NjcgMTA3LjUxMyA0Mi43MjRDMTA3LjUxMyA0NC42MDEzIDEwOC4wMjYgNDYuMDgyNyAxMDkuMDUzIDQ3LjE2OEMxMTAuMTA5IDQ4LjI1MzMgMTExLjM4NSA0OC43OTYgMTEyLjg4MSA0OC43OTZDMTE0LjM3NyA0OC43OTYgMTE1LjY1MyA0OC4yNTMzIDExNi43MDkgNDcuMTY4QzExNy43NjUgNDYuMDUzMyAxMTguMjkzIDQ0LjU1NzMgMTE4LjI5MyA0Mi42OFpNMTQyLjIxNiAzNi42OTZIMTM4LjE2OFY1NUgxMzAuNjQ0VjM2LjY5NkgxMjcuOTE2VjMwLjQ0OEgxMzAuNjQ0VjI5Ljc0NEMxMzAuNjQ0IDI2LjcyMjcgMTMxLjUwOSAyNC40MzQ3IDEzMy4yNCAyMi44OEMxMzQuOTcxIDIxLjI5NiAxMzcuNTA4IDIwLjUwNCAxNDAuODUyIDIwLjUwNEMxNDEuNDA5IDIwLjUwNCAxNDEuODIgMjAuNTE4NyAxNDIuMDg0IDIwLjU0OFYyNi45MjhDMTQwLjY0NyAyNi44NCAxMzkuNjM1IDI3LjA0NTMgMTM5LjA0OCAyNy41NDRDMTM4LjQ2MSAyOC4wNDI3IDEzOC4xNjggMjguOTM3MyAxMzguMTY4IDMwLjIyOFYzMC40NDhIMTQyLjIxNlYzNi42OTZaTTE1OS40MzUgNDguNjJWNTVIMTU1LjYwN0MxNTIuODc5IDU1IDE1MC43NTMgNTQuMzQgMTQ5LjIyNyA1My4wMkMxNDcuNzAyIDUxLjY3MDcgMTQ2LjkzOSA0OS40ODUzIDE0Ni45MzkgNDYuNDY0VjM2LjY5NkgxNDMuOTQ3VjMwLjQ0OEgxNDYuOTM5VjI0LjQ2NEgxNTQuNDYzVjMwLjQ0OEgxNTkuMzkxVjM2LjY5NkgxNTQuNDYzVjQ2LjU1MkMxNTQuNDYzIDQ3LjI4NTMgMTU0LjYzOSA0Ny44MTMzIDE1NC45OTEgNDguMTM2QzE1NS4zNDMgNDguNDU4NyAxNTUuOTMgNDguNjIgMTU2Ljc1MSA0OC42MkgxNTkuNDM1WiIgZmlsbD0iIzFFMUUxRSIvPgo8L3N2Zz4K"
							style="
								display: block;
								outline: none;
								border: none;
								text-decoration: none;
								margin: 0 auto;
							"
							width="170"
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
											href="{%resetUrl%}"
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
`,
		text: `Reset your zipft password.
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

Reset password {%resetUrl%}

If you don't want to change your password or didn't request this, just ignore and delete this message.

To keep your account secure, please don't forward this email to anyone.

Best,
The zipft team

--------------------------------------------------------------------------------

{%communication.id%}`
	},
	'verify-email': {
		html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
	<head>
		<link rel="preload" as="image" href="{%baseUrl%}/logo.svg" />
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
							alt="zipft"
							height="100"
							src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTcwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTcwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB4PSIxMS41IiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMUUxRTFFIi8+CjxyZWN0IHg9IjMxLjUiIHk9IjUwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIGZpbGw9IiMxRTFFMUUiLz4KPHJlY3QgeD0iMTEuNSIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzFFMUUxRSIvPgo8cmVjdCB4PSIzMS41IiB5PSIzMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMUUxRTFFIi8+CjxyZWN0IHg9IjExLjUiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIGZpbGw9IiMxRTFFMUUiLz4KPHJlY3QgeD0iMzEuNSIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzFFMUUxRSIvPgo8cGF0aCBkPSJNNzIuMjY4IDQ4Ljc5Nkg4Mi45MTZWNTVINjMuODY0VjQ5LjAxNkw3NC4wNzIgMzYuNjUySDYzLjk1MlYzMC40NDhIODIuNjk2VjM2LjQzMkw3Mi4yNjggNDguNzk2Wk05MC44NDAxIDI3Ljg5NkM4OS41MjAxIDI3Ljg5NiA4OC40MzQ4IDI3LjUxNDcgODcuNTg0MSAyNi43NTJDODYuNzYyOCAyNS45NiA4Ni4zNTIxIDI0Ljk5MiA4Ni4zNTIxIDIzLjg0OEM4Ni4zNTIxIDIyLjY3NDcgODYuNzYyOCAyMS43MDY3IDg3LjU4NDEgMjAuOTQ0Qzg4LjQzNDggMjAuMTUyIDg5LjUyMDEgMTkuNzU2IDkwLjg0MDEgMTkuNzU2QzkyLjEzMDggMTkuNzU2IDkzLjE4NjggMjAuMTUyIDk0LjAwODEgMjAuOTQ0Qzk0Ljg1ODggMjEuNzA2NyA5NS4yODQxIDIyLjY3NDcgOTUuMjg0MSAyMy44NDhDOTUuMjg0MSAyNC45OTIgOTQuODU4OCAyNS45NiA5NC4wMDgxIDI2Ljc1MkM5My4xODY4IDI3LjUxNDcgOTIuMTMwOCAyNy44OTYgOTAuODQwMSAyNy44OTZaTTk0LjU4MDEgMzAuNDQ4VjU1SDg3LjA1NjFWMzAuNDQ4SDk0LjU4MDFaTTEwNy41NTcgMzMuOTI0QzEwOC4yOSAzMi43OCAxMDkuMzAyIDMxLjg1NiAxMTAuNTkzIDMxLjE1MkMxMTEuODgzIDMwLjQ0OCAxMTMuMzk0IDMwLjA5NiAxMTUuMTI1IDMwLjA5NkMxMTcuMTQ5IDMwLjA5NiAxMTguOTgyIDMwLjYwOTMgMTIwLjYyNSAzMS42MzZDMTIyLjI2NyAzMi42NjI3IDEyMy41NTggMzQuMTI5MyAxMjQuNDk3IDM2LjAzNkMxMjUuNDY1IDM3Ljk0MjcgMTI1Ljk0OSA0MC4xNTczIDEyNS45NDkgNDIuNjhDMTI1Ljk0OSA0NS4yMDI3IDEyNS40NjUgNDcuNDMyIDEyNC40OTcgNDkuMzY4QzEyMy41NTggNTEuMjc0NyAxMjIuMjY3IDUyLjc1NiAxMjAuNjI1IDUzLjgxMkMxMTguOTgyIDU0LjgzODcgMTE3LjE0OSA1NS4zNTIgMTE1LjEyNSA1NS4zNTJDMTEzLjQyMyA1NS4zNTIgMTExLjkxMyA1NSAxMTAuNTkzIDU0LjI5NkMxMDkuMzAyIDUzLjU5MiAxMDguMjkgNTIuNjgyNyAxMDcuNTU3IDUxLjU2OFY2Ni43MDRIMTAwLjAzM1YzMC40NDhIMTA3LjU1N1YzMy45MjRaTTExOC4yOTMgNDIuNjhDMTE4LjI5MyA0MC44MDI3IDExNy43NjUgMzkuMzM2IDExNi43MDkgMzguMjhDMTE1LjY4MiAzNy4xOTQ3IDExNC40MDYgMzYuNjUyIDExMi44ODEgMzYuNjUyQzExMS4zODUgMzYuNjUyIDExMC4xMDkgMzcuMTk0NyAxMDkuMDUzIDM4LjI4QzEwOC4wMjYgMzkuMzY1MyAxMDcuNTEzIDQwLjg0NjcgMTA3LjUxMyA0Mi43MjRDMTA3LjUxMyA0NC42MDEzIDEwOC4wMjYgNDYuMDgyNyAxMDkuMDUzIDQ3LjE2OEMxMTAuMTA5IDQ4LjI1MzMgMTExLjM4NSA0OC43OTYgMTEyLjg4MSA0OC43OTZDMTE0LjM3NyA0OC43OTYgMTE1LjY1MyA0OC4yNTMzIDExNi43MDkgNDcuMTY4QzExNy43NjUgNDYuMDUzMyAxMTguMjkzIDQ0LjU1NzMgMTE4LjI5MyA0Mi42OFpNMTQyLjIxNiAzNi42OTZIMTM4LjE2OFY1NUgxMzAuNjQ0VjM2LjY5NkgxMjcuOTE2VjMwLjQ0OEgxMzAuNjQ0VjI5Ljc0NEMxMzAuNjQ0IDI2LjcyMjcgMTMxLjUwOSAyNC40MzQ3IDEzMy4yNCAyMi44OEMxMzQuOTcxIDIxLjI5NiAxMzcuNTA4IDIwLjUwNCAxNDAuODUyIDIwLjUwNEMxNDEuNDA5IDIwLjUwNCAxNDEuODIgMjAuNTE4NyAxNDIuMDg0IDIwLjU0OFYyNi45MjhDMTQwLjY0NyAyNi44NCAxMzkuNjM1IDI3LjA0NTMgMTM5LjA0OCAyNy41NDRDMTM4LjQ2MSAyOC4wNDI3IDEzOC4xNjggMjguOTM3MyAxMzguMTY4IDMwLjIyOFYzMC40NDhIMTQyLjIxNlYzNi42OTZaTTE1OS40MzUgNDguNjJWNTVIMTU1LjYwN0MxNTIuODc5IDU1IDE1MC43NTMgNTQuMzQgMTQ5LjIyNyA1My4wMkMxNDcuNzAyIDUxLjY3MDcgMTQ2LjkzOSA0OS40ODUzIDE0Ni45MzkgNDYuNDY0VjM2LjY5NkgxNDMuOTQ3VjMwLjQ0OEgxNDYuOTM5VjI0LjQ2NEgxNTQuNDYzVjMwLjQ0OEgxNTkuMzkxVjM2LjY5NkgxNTQuNDYzVjQ2LjU1MkMxNTQuNDYzIDQ3LjI4NTMgMTU0LjYzOSA0Ny44MTMzIDE1NC45OTEgNDguMTM2QzE1NS4zNDMgNDguNDU4NyAxNTUuOTMgNDguNjIgMTU2Ljc1MSA0OC42MkgxNTkuNDM1WiIgZmlsbD0iIzFFMUUxRSIvPgo8L3N2Zz4K"
							style="
								display: block;
								outline: none;
								border: none;
								text-decoration: none;
								margin: 0 auto;
							"
							width="170"
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
											href="{%verifyUrl%}"
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
`,
		text: `Verify your zipft account.
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

Verify account {%verifyUrl%}

Best,
The zipft team

--------------------------------------------------------------------------------

{%communication.id%}`
	}
};

export function generateEmail(template: string, props: { [key: string]: string }): Email {
	let { html, text } = templates[template];

	for (const key in props) {
		if (props.hasOwnProperty(key)) {
			const placeholder = `{%${key}%}`;
			html = html.replace(new RegExp(placeholder, 'g'), props[key]);
			text = text.replace(new RegExp(placeholder, 'g'), props[key]);
		}
	}

	return { html, text };
}
