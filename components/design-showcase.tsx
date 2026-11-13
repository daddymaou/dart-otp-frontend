'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Badge, Checkbox, Dialog, Input, StickerButton, StickerCard, Switch, Textarea } from '@/components/ui';
import { CopyButton, WaveDivider } from '@/components/site';

const stickers = [
  'sticker-bolt-yellow', 'sticker-star-pink', 'sticker-bubble-paper', 'sticker-check-mint',
  'sticker-lock-sky', 'sticker-plane-pink', 'sticker-sparkle-yellow', 'sticker-arrow-violet',
];

export function DesignShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <main className="design-page">
      <header className="design-header"><span className="eyebrow"><i /> INTERNAL DESIGN REVIEW</span><h1>Dart-OTP, in pieces.</h1><p>Tokens, reusable controls, supplied assets, and the shapes that hold them together.</p></header>
      <section className="design-section"><h2>Buttons</h2><div className="design-row">
        <StickerButton>Primary</StickerButton><StickerButton variant="violet">Violet</StickerButton><StickerButton variant="ghost">Ghost</StickerButton><StickerButton variant="danger">Danger</StickerButton><StickerButton loading>Loading</StickerButton>
      </div></section>
      <section className="design-section"><h2>Cards and status</h2><div className="design-row design-cards">
        <StickerCard><h3>StickerCard</h3><p>Paper, an ink outline, and a hard shadow.</p></StickerCard>
        <StickerCard accent="mint"><h3>With an accent</h3><p>Optional accent strip, same chunky shape.</p></StickerCard>
        <div className="design-badges"><Badge status="verified">verified</Badge><Badge status="pending">pending</Badge><Badge status="failed">failed</Badge><Badge status="expired">expired</Badge><Badge status="test">test</Badge></div>
      </div></section>
      <section className="design-section"><h2>Form controls</h2><div className="design-form-grid">
        <label className="form-field" htmlFor="design-input"><span>Input</span><Input id="design-input" placeholder="A phone number" /></label>
        <label className="form-field" htmlFor="design-invalid"><span>Error state</span><Input error="Enter an international phone number." id="design-invalid" value="555" readOnly /></label>
        <label className="form-field" htmlFor="design-textarea"><span>Textarea</span><Textarea id="design-textarea" placeholder="Your message" rows={3} /></label>
        <div className="design-controls"><Checkbox checked={checked} label="Checkbox" onChange={setChecked} /><Switch checked={switchOn} label="Live delivery" onChange={setSwitchOn} /></div>
      </div></section>
      <section className="design-section"><h2>Dialog and copy</h2><div className="design-row"><button className="button button-primary" onClick={() => setDialogOpen(true)} type="button">Open dialog</button><CopyButton value="DART-OTP-EXAMPLE" label="Copy sample" /></div></section>
      <section className="design-section"><h2>Stickers and blobs</h2><div className="design-asset-grid">
        {stickers.map((file) => <div className="design-asset" key={file}><Image alt="" aria-hidden="true" height={56} src={`/assets/stickers/${file}.svg`} width={56} /><small>{file.replace('sticker-', '')}</small></div>)}
      </div><div className="design-blob-grid">
        {[1, 2, 3, 4, 5].map((blob) => <div className={`design-blob design-blob-${blob}`} key={blob}><span>blob {blob}</span></div>)}
      </div></section>
      <section className="design-section"><h2>Wave dividers and ribbon</h2><div className="design-wave-row"><WaveDivider color="paper" shape="a" height={64} /><WaveDivider color="lilac" shape="b" height={64} /><WaveDivider color="yellow" shape="c" height={64} /><WaveDivider color="violet" edge shape="d" height={64} /></div><div className="design-ribbon"><img alt="" aria-hidden="true" src="/assets/waves/ribbons/ribbon-yellow-sky-lilac.svg" /></div></section>
      {dialogOpen && <Dialog title="A sticker-sized dialog" description="Focus stays in the dialog until you close it." onClose={() => setDialogOpen(false)}><p className="dialog-demo-copy">This is the shared dialog surface.</p><button className="button button-violet" onClick={() => setDialogOpen(false)} type="button">Got it</button></Dialog>}
    </main>
  );
}
