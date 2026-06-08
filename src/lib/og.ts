import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

// Per-page Open Graph card: the designer template (headline + logo + pattern, no
// subtitle) with the page title composited in as the grey subtitle line.
// Spec measured from public reference OG-card-custom.png ("Glossary"):
//   left x=67, baseline≈382, cap-height≈53px → 56px Inter SemiBold, colour #89898F.

const root = process.cwd();
const templatePath = path.join(root, 'src/assets/og/og-card-template.png');
const fontPath = path.join(root, 'node_modules/@fontsource/inter/files/inter-latin-600-normal.woff');

const template = fs.readFileSync(templatePath);
const interSemiBold = fs.readFileSync(fontPath);

export async function renderOgCard(title: string): Promise<Buffer> {
	const svg = await satori(
		{
			type: 'div',
			props: {
				style: { position: 'relative', width: '1200px', height: '630px', display: 'flex' },
				children: {
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							// Figma: subtitle left 67px, top tuned so cap-top lands at y≈329
							left: '67px',
							top: '318px',
							width: '600px', // keep clear of the diamond pattern on the right
							fontFamily: 'Inter',
							fontWeight: 600,
							fontSize: '56px',
							lineHeight: 1.1,
							color: '#89898F', // measured grey rgb(137,137,143)
							// Long SEO titles clamp to 3 lines with an ellipsis so they
							// never collide with the "pubky.org" footer.
							display: 'block',
							lineClamp: 3,
						},
						children: title,
					},
				},
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [{ name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' }],
		},
	);

	const overlay = await sharp(Buffer.from(svg)).png().toBuffer();
	return sharp(template).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
}
