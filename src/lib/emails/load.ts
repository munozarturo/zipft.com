import fs from 'fs';
import path from 'path';

interface Email {
	html: string;
	text: string;
}

export function generateEmail(template: string, props: { [key: string]: string }): Email {
	const templatePath = path.resolve(`./${template}.html`);
	const plainTextPath = path.resolve(`./${template}.txt`);

	let html = fs.readFileSync(templatePath, 'utf8');
	let text = fs.readFileSync(plainTextPath, 'utf8');

	for (const key in props) {
		if (props.hasOwnProperty(key)) {
			const placeholder = `{%${key}%}`;
			html = html.replace(new RegExp(placeholder, 'g'), props[key]);
			text = text.replace(new RegExp(placeholder, 'g'), props[key]);
		}
	}

	return { html, text };
}
